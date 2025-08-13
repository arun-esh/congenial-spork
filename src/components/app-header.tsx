import Link from "next/link";
import { PlusCircle, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <nav className="flex w-full items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Rocket className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold tracking-tight">AppPilot</h1>
        </Link>
        <Button asChild>
          <Link href="/add-service">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Service
          </Link>
        </Button>
      </nav>
    </header>
  );
}
