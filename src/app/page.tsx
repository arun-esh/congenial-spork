import { getServices } from "@/lib/data";
import AppHeader from "@/components/app-header";
import DashboardClient from "@/components/dashboard-client";

export default async function Home() {
  const services = await getServices();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader />
      <main className="flex-1 p-4 md:p-8">
        <DashboardClient initialServices={services} />
      </main>
    </div>
  );
}
