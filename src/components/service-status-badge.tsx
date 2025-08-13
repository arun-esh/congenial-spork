import type { ServiceStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

interface ServiceStatusBadgeProps {
  status: ServiceStatus;
}

const statusConfig = {
  running: {
    label: "Running",
    icon: CheckCircle2,
    className: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-700",
  },
  stopped: {
    label: "Stopped",
    icon: XCircle,
    className: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600",
  },
  failed: {
    label: "Failed",
    icon: AlertTriangle,
    className: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-700",
  },
};

export default function ServiceStatusBadge({ status }: ServiceStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.stopped;
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={cn("gap-1.5 whitespace-nowrap px-2 py-1 text-xs font-medium", config.className)}>
      <Icon className="h-3.5 w-3.5" />
      <span>{config.label}</span>
    </Badge>
  );
}
