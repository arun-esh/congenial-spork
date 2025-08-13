import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Service } from "@/types";
import ServiceStatusBadge from "./service-status-badge";
import ServiceActions from "./service-actions";
import { Badge } from "./ui/badge";

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card className="flex h-full transform-gpu flex-col transition-all duration-300 hover:shadow-xl">
      <Link href={`/services/${service.id}`} className="flex flex-1 flex-col">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-xl">{service.name}</CardTitle>
            <ServiceStatusBadge status={service.status} />
          </div>
          <CardDescription>{service.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex flex-wrap gap-2">
            {service.tags.map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
        </CardContent>
      </Link>
      <CardFooter className="flex justify-between">
         <div className="text-sm text-muted-foreground">Port: {service.port || 'N/A'}</div>
        <ServiceActions serviceId={service.id} status={service.status} />
      </CardFooter>
    </Card>
  );
}
