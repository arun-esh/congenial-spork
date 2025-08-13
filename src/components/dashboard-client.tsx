"use client";

import { useState, useMemo } from "react";
import type { Service } from "@/types";
import { Input } from "@/components/ui/input";
import ServiceCard from "./service-card";
import ServiceListItem from "./service-list-item";
import ViewToggle from "./view-toggle";
import { Search } from "lucide-react";

interface DashboardClientProps {
  initialServices: Service[];
}

export default function DashboardClient({ initialServices }: DashboardClientProps) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredServices = useMemo(() => {
    return services.filter(
      (service) =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [services, searchTerm]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
            />
        </div>
        <ViewToggle view={view} setView={setView} />
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredServices.map((service) => (
            <ServiceListItem key={service.id} service={service} />
          ))}
        </div>
      )}
       {filteredServices.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
              <p>No services found matching your search.</p>
          </div>
      )}
    </div>
  );
}
