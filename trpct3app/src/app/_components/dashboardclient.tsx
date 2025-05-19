
"use client";

import { api } from "~/trpc/react";

export default function DashboardClient() {
  const { data: suggestion, isLoading: loadingSuggestion } = api.suggestion.getDaily.useQuery();
  const { data: favorites, refetch } = api.favorite.mine.useQuery();
  const addFavorite = api.favorite.add.useMutation({ onSuccess: () => refetch() });
  const updateStatus = api.favorite.updatestatus.useMutation({ onSuccess: () => refetch() });
  const removeFavorite = api.favorite.remove.useMutation({ onSuccess: () => refetch() });

  if (loadingSuggestion) return <div>Loading...</div>;
  if (!suggestion) return <div>No suggestions yet.</div>;

  return (
    <main className="p-4 space-y-6 text-black">
      <section className="rounded bg-gray-100 p-4">
        <h2 className="text-xl font-bold">Today's Suggestion</h2>
        <p className="font-semibold">{suggestion.title}</p>
        <p>{suggestion.description}</p>
        <button
          onClick={() => addFavorite.mutate({ suggestionId: suggestion.id })}
          className="mt-2 rounded bg-blue-500 px-3 py-1 text-white"
        >
          Save to Favorites
        </button>
      </section>

      <section>
        <h2 className="text-xl font-bold">My Favorites</h2>
        <ul className="space-y-2">
          {favorites?.map((fav) => (
            <li key={fav.id} className="rounded bg-gray-50 p-3 shadow">
              <div className="font-semibold">{fav.suggestion.title}</div>
              <div className="text-sm">{fav.status}</div>
              <select
                className="mt-1"
                value={fav.status}
                onChange={(e) =>
                  updateStatus.mutate({ id: fav.id, status: e.target.value as "progress" | "done" })
                }
              >
                <option value="progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <button
                onClick={() => removeFavorite.mutate({ id: fav.id })}
                className="ml-2 text-red-500"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
