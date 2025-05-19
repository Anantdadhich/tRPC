
import { auth } from "~/server/auth";
import DashboardClient from "../_components/dashboardclient";


export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center text-white">
          <div
      className="fixed inset-0 bg-cover bg-center z-0"
      style={{
        backgroundImage:
          "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/github-rJ1M26aWZ1YVK7QRbm60rVYeqAruED.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    ></div>
        <p>You must be signed in to view the dashboard.</p>
      </main>
    );
  }

  return <DashboardClient />;
}
