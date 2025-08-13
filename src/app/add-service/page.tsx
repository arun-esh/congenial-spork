import AppHeader from "@/components/app-header";
import AddServiceForm from "@/components/add-service-form";

export default function AddServicePage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader />
      <main className="flex flex-1 flex-col items-center justify-start p-4 pt-12 md:p-8">
        <AddServiceForm />
      </main>
    </div>
  );
}
