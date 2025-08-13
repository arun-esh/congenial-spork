import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Play, Square, RotateCcw, Loader2 } from 'lucide-react';
import { Service, ServiceAction } from '@/types';

interface ServiceCardProps {
  service: Service;
  onToggleFavorite: (serviceName: string, isFavorite: boolean) => void;
  onServiceAction: (action: ServiceAction) => Promise<void>;
}

export default function ServiceCard({ service, onToggleFavorite, onServiceAction }: ServiceCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [lastAction, setLastAction] = useState<string>('');

  const handleServiceAction = async (action: 'start' | 'stop' | 'restart') => {
    setIsLoading(true);
    try {
      await onServiceAction({ action, serviceName: service.name });
      setLastAction(`${action}ed at ${new Date().toLocaleTimeString()}`);
    } catch (error) {
      console.error(`Failed to ${action} service:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500 hover:bg-green-600';
      case 'inactive':
        return 'bg-gray-500 hover:bg-gray-600';
      case 'failed':
        return 'bg-red-500 hover:bg-red-600';
      case 'activating':
      case 'deactivating':
        return 'bg-yellow-500 hover:bg-yellow-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <span className="truncate">{service.name}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onToggleFavorite(service.name, service.is_favorite)}
            className="ml-2"
          >
            <Star className={`h-4 w-4 ${service.is_favorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
          </Button>
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <span>Port: {service.port}</span>
          {service.isUserService && (
            <Badge variant="secondary" className="text-xs">User Service</Badge>
          )}
          {lastAction && (
            <span className="text-xs text-blue-600">• {lastAction}</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge className={getStatusColor(service.status)}>
            {getStatusText(service.status)}
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleServiceAction('start')}
            disabled={isLoading || service.status === 'active'}
            className="flex-1"
          >
            {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />}
            Start
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleServiceAction('stop')}
            disabled={isLoading || service.status === 'inactive'}
            className="flex-1"
          >
            {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Square className="h-3 w-3" />}
            Stop
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleServiceAction('restart')}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <RotateCcw className="h-3 w-3" />}
            Restart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
