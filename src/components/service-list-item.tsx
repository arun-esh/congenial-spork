import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { Service } from "@/types";
import ServiceStatusBadge from "./service-status-badge";
import ServiceActions from "./service-actions";
import { Badge } from "./ui/badge";

interface ServiceListItemProps {
  service: Service;
}

export default function ServiceListItem({ service }: ServiceListItemProps) {
  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between p-4">
        <Link href={`/services/${service.id}`} className="flex-1">
          <div className="flex items-center gap-4">
            <div className="w-1/3">
              <h3 className="font-semibold">{service.name}</h3>
              <p className="text-sm text-muted-foreground truncate">{service.description}</p>
            </div>
            <div className="w-1/4">
               <ServiceStatusBadge status={service.status} />
            </div>
             <div className="w-1/4">
                <div className="flex flex-wrap gap-1">
                    {service.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                </div>
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">Port: {service.port || 'N/A'}</div>
            <ServiceActions serviceId={service.id} status={service.status} />
        </div>
      </div>
    </Card>
  );
}
