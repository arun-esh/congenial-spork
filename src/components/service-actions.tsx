"use client";

import { useFormStatus } from "react-dom";
import { Play, StopCircle, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { startService, stopService, restartService } from "@/app/actions";
import type { ServiceStatus } from "@/types";
import { cn } from "@/lib/utils";

interface ActionButtonProps {
  action: (formData: FormData) => void;
  serviceId: string;
  status: ServiceStatus;
  variant: "start" | "stop" | "restart";
}

function ActionButton({ action, serviceId, status, variant }: ActionButtonProps) {
  const { pending } = useFormStatus();

  const config = {
    start: {
      label: "Start",
      Icon: Play,
      disabled: status === "running",
      tooltip: "Start service",
    },
    stop: {
      label: "Stop",
      Icon: StopCircle,
      disabled: status === "stopped",
      tooltip: "Stop service",
    },
    restart: {
      label: "Restart",
      Icon: RefreshCw,
      disabled: status === "stopped",
      tooltip: "Restart service",
    },
  };

  const current = config[variant];
  const Icon = pending ? Loader2 : current.Icon;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <form action={action}>
            <input type="hidden" name="id" value={serviceId} />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              disabled={current.disabled || pending}
              aria-label={current.tooltip}
            >
              <Icon className={cn("h-4 w-4", pending && "animate-spin")} />
            </Button>
          </form>
        </TooltipTrigger>
        <TooltipContent>
          <p>{current.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default function ServiceActions({ serviceId, status }: { serviceId: string; status: ServiceStatus }) {
  return (
    <div className="flex items-center gap-1">
      <ActionButton action={startService} serviceId={serviceId} status={status} variant="start" />
      <ActionButton action={stopService} serviceId={serviceId} status={status} variant="stop" />
      <ActionButton action={restartService} serviceId={serviceId} status={status} variant="restart" />
    </div>
  );
}
