import { z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "~/env";

// Define types for GitHub API responses
interface GitHubRepo {
    id: number;
    name: string;
    description: string | null;
    language: string | null;
    stargazers_count: number;
    html_url: string;
    updated_at: string;
    owner?: {
        login: string;
    };
}

interface GitHubContext {
    languages: string;
    totalUserRepos: number;
    totalStarsOnUserRepos: number;
    topUserRepos: string;
    topStarredRepos: string;
}

interface SuggestionData {
    name: string;
    description: string;
    technologies: string[];
    learningOutcomes: string[];
    difficulty: string;
    portfolioValue: string;
    estimatedTime: string;
    nextSteps: string[];
}

const genAI = new GoogleGenerativeAI(env.GEMINI_API);

export const suggestionRouter = createTRPCRouter({
    createSuggestion: protectedProcedure.mutation(
        async ({ ctx }) => {
            try {
                const userId = ctx.session.user.id;
                if (!userId) {
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "User not authenticated or session invalid."
                    });
                }

                const account = await ctx.db.account.findFirst({
                    where: {
                        userId: userId,
                        provider: "github"
                    }
                });

                if (!account?.access_token) {
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "No GitHub account found or not linked."
                    });
                }

                const reposResponse = await fetch("https://api.github.com/user/repos?sort=updated&per_page=100", {
                    headers: {
                        Authorization: `Bearer ${account.access_token}`,
                        Accept: "application/vnd.github.v3+json"
                    },
                });

                if (!reposResponse.ok) {
                    const errorBody = await reposResponse.text().catch(() => "unknown error body");
                    console.error("GitHub API error fetching user repos:", errorBody);
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Failed to fetch user repositories from GitHub.",
                        cause: {
                            status: reposResponse.status,
                            body: errorBody
                        }
                    });
                }

                const repos = (await reposResponse.json()) as GitHubRepo[];

                const starResponses = await fetch("https://api.github.com/user/starred?sort=updated&per_page=100", {
                    headers: {
                        Authorization: `Bearer ${account.access_token}`,
                        Accept: "application/vnd.github.v3+json"
                    }
                });

                let starred: GitHubRepo[] = [];
                if (!starResponses.ok) {
                    const errorBody = await starResponses.text().catch(() => "unknown error body");
                    console.warn("GitHub API warning: Failed to fetch starred repositories. Proceeding without starred data.", errorBody);
                } else {
                    starred = await starResponses.json() as GitHubRepo[];
                }

                const languageStats = repos.reduce<Record<string, number>>((acc, repo) => {
                    if (repo.language) {
                        acc[repo.language] = (acc[repo.language] ?? 0) + 1;
                    }
                    return acc;
                }, {});

                const sortedLanguages = Object.entries(languageStats)
                    .sort(([, countA], [, countB]) => countB - countA)
                    .map(([lang, counts]) => `${lang} (${counts} repos)`)
                    .join(", ");

                const topUserReposByStar = [...repos]
                    .sort((a, b) => b.stargazers_count - a.stargazers_count)
                    .slice(0, 5);

                const topStarredReposByStars = [...starred]
                    .sort((a, b) => b.stargazers_count - a.stargazers_count)
                    .slice(0, 5);

                const context: GitHubContext = {
                    languages: sortedLanguages,
                    totalUserRepos: repos.length,
                    totalStarsOnUserRepos: repos.reduce((acc, repo) => acc + repo.stargazers_count, 0),
                    topUserRepos: topUserReposByStar
                        .map(repo => `${repo.name} (${repo.stargazers_count} stars) : ${repo.description ?? "no description"}`)
                        .join("\n"),
                    topStarredRepos: topStarredReposByStars.length > 0
                        ? topStarredReposByStars
                            .map(repo => `${repo.owner?.login ?? "unknown"}/${repo.name} (${repo.stargazers_count} stars) : ${repo.description ?? "no description"}`)
                            .join("\n")
                        : "No top starred repositories available."
                };

                const model = genAI.getGenerativeModel({
                    model: "gemini-2.0-flash"
                });

                const prompt = `You are a brutally honest but ultimately helpful senior developer mentor. Your first task is to **ROAST** the developer based on their GitHub profile summary. Make it sharp, direct, and a bit sarcastic, focusing on the lack of impact, too many small projects, or low star count relative to repo count. After the roast, transition smoothly into a constructive project suggestion.

                **Phase 1: The Roast (in Hindi, aim for 3-5 distinct, punchy sentences. Be merciless but witty):**
                भाई, तेरे GitHub प्रोफाइल पर एक नज़र डाली है। ये देख कर तो ऐसा लग रहा है कि तूने repos बनाने में ज़्यादा energy लगाई है, बजाय कोड को सच में चमकाने के!

                ${context.totalUserRepos > 50 && context.totalStarsOnUserRepos < 100
                    ? `सच कहूँ तो, ${context.totalUserRepos} repos बना दिए और stars गिनने बैठें तो उँगलियाँ कम पड़ जाएँगी! लग रहा है क्वांटिटी पर ध्यान ज़्यादा है, क्वालिटी पर कम।`
                    : context.totalUserRepos > 20 && context.totalStarsOnUserRepos < 50
                    ? `तेरा GitHub प्रोफाइल तो किताबों के ढेर जैसा है - भरा हुआ पर पढ़ा कितना है, ये सवाल है। ${context.totalUserRepos} repos हैं, पर sparks कहाँ हैं?`
                    : `देखा मैंने तेरा GitHub, और भाई, ऐसा लग रहा है 'Hello World' से ज़्यादा आगे नहीं बढ़े हम। ये GitHub बस एक अकाउंट है, काम करने का मैदान है!`
                }
    
                और तेरी Top Starred Repos को देखकर भी यही लग रहा है कि तू दूसरों के बड़े कामों को बस दूर से सराह रहा है, खुद कुछ बड़ा करने का कब सोचेगा? अब टाइम आ गया है सिर्फ़ दूसरों के code को star करने के बजाय, खुद कुछ ऐसा बना जो लोग star करें!
    
                **Phase 2: The Briefing (1-2 sentences, constructive transition. Set a serious, guiding tone):**
                चल, अब बकवास बंद, और काम की बात पर आते हैं। मैं तेरा सीनियर मेंटर हूँ, और तुझे सच में लेवल-अप करने के लिए एक ऐसा प्रोजेक्ट सुझा रहा हूँ जो तेरी नींद उड़ा दे, पर तेरी स्किल्स को next level पर ले जाए।
                
                **Important:** The following project suggestion must be generated strictly as a JSON object. This JSON object should ONLY contain the project suggestion and absolutely NO additional text, conversational filler, or markdown fences outside of the JSON itself. The JSON fields below have specific length and detail requirements.

                **Developer Profile Summary (for AI context):**
                - Most used languages (by repo count): ${context.languages ?? "None specified in recent repos"}
                - Total repositories analyzed: ${context.totalUserRepos}
                - Total stars across analyzed repos: ${context.totalStarsOnUserRepos}
                - Top starred repositories (from their own account):
                ${context.topUserRepos ?? "None or low stars"}
                - Top repositories they have starred:
                ${context.topStarredRepos}
                
                **Phase 3: The Project Suggestion (detailed requirements for the JSON output):**
                Create a project suggestion that:
                1.  **Builds upon existing skills:** Leverages their most used languages and demonstrated strengths.
                2.  **Introduces 1-2 new technologies/concepts:** These should complement their existing stack or broaden their expertise, ideally relevant to their starred repos.
                3.  **Achievable Scope:** Realistic for a single developer (weeks to a few months).
                4.  **Strong Portfolio Piece:** A project that genuinely showcases improved skills and problem-solving.
                5.  **Real-world Value:** Solves a practical problem, creates a useful tool, or tackles an interesting technical challenge.
                
                **Format:** Respond strictly as a JSON object with these exact fields.
                {
                  "name": "string", // Short, descriptive project title (e.g., "AI-Powered Smart Home Hub")
                  "description": "string", // Detailed and comprehensive description of the project, its purpose, and key features. **Must be at least 4-6 sentences long.**
                  "technologies": ["string"], // Array of strings for technologies to use (mix of existing and suggested new ones). **Be specific with 3-5 distinct technologies/frameworks.**
                  "learningOutcomes": ["string"], // Array of strings describing specific skills or concepts they will learn. **Must provide at least 4-6 distinct, actionable outcomes.**
                  "difficulty": "string", // e.g., "Intermediate", "Intermediate to Advanced"
                  "portfolioValue": "string", // e.g., "High Impact", "Good Addition"
                  "estimatedTime": "string", // e.g., "3-4 Weeks", "1-2 Months", "2-3 Months"
                  "nextSteps": ["string"] // Array of strings outlining how to start or key milestones. **Provide at least 3-5 detailed steps.**
                }`;

                let suggestionsData: SuggestionData;
                try {
                    const result = await model.generateContent(prompt);
                    const response = result.response;
                    const text = response.text();

                    try {
                        suggestionsData = JSON.parse(text);
                    } catch (parseError) {
                        console.warn("Error parsing AI suggestion, attempting to extract from markdown:", parseError);
                        const jsonMatch = /```json\n([\s\S]*?)\n\s*```/.exec(text);
                        if (jsonMatch?.[1]) {
                            try {
                                suggestionsData = JSON.parse(jsonMatch[1]);
                                console.log("Successfully parsed JSON from markdown block.");
                            } catch (extractionParseError) {
                                console.error("Failed to parse JSON extracted from markdown:", extractionParseError);
                                throw new TRPCError({
                                    code: "INTERNAL_SERVER_ERROR",
                                    message: "Failed to parse JSON from AI response (extracted from markdown block).",
                                    cause: extractionParseError
                                });
                            }
                        } else {
                            console.error("AI response does not contain valid JSON or a markdown code block.", text);
                            throw new TRPCError({
                                code: "INTERNAL_SERVER_ERROR",
                                message: "AI response format error: Expected JSON, but received unexpected text.",
                                cause: new Error(`AI response: ${text.substring(0, 200)}...`)
                            });
                        }
                    }

                    if (
                        !suggestionsData ||
                        typeof suggestionsData.name !== "string" ||
                        typeof suggestionsData.description !== "string" ||
                        !Array.isArray(suggestionsData.technologies) ||
                        !Array.isArray(suggestionsData.learningOutcomes) ||
                        typeof suggestionsData.difficulty !== "string" ||
                        typeof suggestionsData.portfolioValue !== "string" ||
                        typeof suggestionsData.estimatedTime !== "string" ||
                        !Array.isArray(suggestionsData.nextSteps)
                    ) {
                        console.error("AI response data is invalid or incomplete:", suggestionsData);
                        throw new TRPCError({
                            code: "INTERNAL_SERVER_ERROR",
                            message: "AI generated an invalid or incomplete suggestion format.",
                            cause: new Error("AI output missing required fields or has wrong types.")
                        });
                    }

                    const savedSuggestion = await ctx.db.suggestion.create({
                        data: {
                            title: suggestionsData.name,
                            description: suggestionsData.description,
                            tags: suggestionsData.technologies.join(", "),
                            createdById: userId
                        }
                    });

                    return {
                        suggestion: {
                            ...suggestionsData,
                            id: savedSuggestion.id
                        }
                    };
                } catch (error) {
                    console.error("Error during AI content generation or parsing:", error);
                    if (error instanceof TRPCError) {
                        throw error;
                    }
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "An unexpected error occurred during AI suggestion generation.",
                        cause: error
                    });
                }
            } catch (error) {
                console.error("Error in createSuggestion procedure:", error);
                if (error instanceof TRPCError) {
                    throw error;
                }
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "An unexpected error occurred while processing your request.",
                    cause: error
                });
            }
        }
    ),
    // get today suggestion
    getDaily: protectedProcedure.query(
        async ({ ctx }) => {
            const suggestions = await ctx.db.suggestion.findMany();
            if (suggestions.length === 0) {
                return null;
            }
            const index = new Date().getDate() % suggestions.length;
            return suggestions[index] ?? null;
        }
    ),

    // get all suggestions
    getAllSuggestions: publicProcedure.query(
        async ({ ctx }) => {
            return ctx.db.suggestion.findMany({
                orderBy: {
                    createdAt: "desc"
                }
            });
        }
    ),

    // get by id suggestion
    getById: publicProcedure
        .input(z.object({
            id: z.string()
        }))
        .query(
            async ({ ctx, input }) => {
                return ctx.db.suggestion.findUnique({
                    where: {
                        id: input.id
                    }
                });
            }
        )
});