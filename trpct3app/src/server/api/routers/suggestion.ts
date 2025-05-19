import {z} from "zod"
import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
  } from "~/server/api/trpc";



export const suggestionRouter=createTRPCRouter({
    //lets create suggestions 
     create:protectedProcedure.input(
        z.object(
            {
                title:z.string().min(1),
                description:z.string().min(10),
                tags:z.array(z.string().optional())

            }
        )
     ).mutation(
        async ({ctx,input}) =>{
            return ctx.db.suggestion.create({
                data:{
                    title:input.title,
                    description:input.description,
                    tags:input.tags?.join(",") ?? "",
                    createdById:ctx.session.user.id
                    
                }
            })
        }
     ),

    // get today suggestion 
     getDaily:protectedProcedure.query(
        async({ctx})=>{
            const suggestion=await ctx.db.suggestion.findMany()
            const index=new Date().getDate() % suggestion.length ;
            return suggestion[index] ?? null 
        }
     )

,
//get all suggestions 
     getAllSuggestions:publicProcedure.query(
        async({ctx})=>{
            return ctx.db.suggestion.findMany(
                {
                    orderBy:{
                        createdAt:"desc"
                    }
                }
            )
        }
     ),

    //get by id suggestion  
     getById:publicProcedure
     .input(z.object({ 
        id:z.string()
     })).query(
        async({ctx,input})=>{
            return ctx.db.suggestion.findUnique({
                where:{
                    id:input.id
                }
            })
        }
     )
})