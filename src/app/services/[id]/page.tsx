import { notFound } from "next/navigation";
import { getServiceById } from "@/lib/data";
import AppHeader from "@/components/app-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ServiceStatusBadge from "@/components/service-status-badge";
import LogViewer from "@/components/log-viewer";
import { Clock, Cpu, HardDrive } from "lucide-react";

export default async function ServiceDetailPage({ params }: { params: { id: string } }) {
  const service = await getServiceById(params.id);

  if (!service) {
    notFound();
  }

  const statusMetrics = [
    { title: "Uptime", value: service.uptime, icon: Clock },
    { title: "CPU Usage", value: service.cpuUsage, icon: Cpu },
    { title: "Memory Usage", value: service.memoryUsage, icon: HardDrive },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader />
      <main className="flex-1 p-4 md:p-8">
        <div className="space-y-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{service.name}</h1>
              <p className="text-muted-foreground">{service.description}</p>
            </div>
            <ServiceStatusBadge status={service.status} />
          </div>

          <Tabs defaultValue="status" className="w-full">
            <TabsList>
              <TabsTrigger value="status">Status</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
            </TabsList>
            <TabsContent value="status" className="pt-4">
              <div className="grid gap-6 md:grid-cols-3">
                {statusMetrics.map(({ title, value, icon: Icon }) => (
                  <Card key={title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{title}</CardTitle>
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{value}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="logs" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Logs</CardTitle>
                </CardHeader>
                <CardContent>
                  <LogViewer logs={service.logs} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
