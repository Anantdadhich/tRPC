
import { auth } from "~/server/auth";
import DashboardClient from "../_components/dashboardclient";


export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center text-white">
        <p>You must be signed in to view the dashboard.</p>
      </main>
    );
  }

  return <DashboardClient />;
}
