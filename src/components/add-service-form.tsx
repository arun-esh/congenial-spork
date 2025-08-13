"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { addService } from "@/app/actions";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  description: z.string().min(5, "Description must be at least 5 characters."),
  scriptPath: z.string().startsWith("/", "Path must be an absolute path."),
  port: z.coerce.number().int().positive().optional(),
  tags: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Add Service
        </Button>
    )
}

export default function AddServiceForm() {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      scriptPath: "",
    },
  });

  const handleAction = async (formData: FormData) => {
    const result = await addService(formData);
    if (result.success) {
      toast({
        title: "Service Added",
        description: `Service "${result.service?.name}" has been added successfully.`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Add a New Service</CardTitle>
        <CardDescription>
          Fill in the details below to configure a new service for AppPilot to manage.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form action={handleAction} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., My Web App" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="A brief description of what this service does." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="scriptPath"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Script Path</FormLabel>
                  <FormControl>
                    <Input placeholder="/path/to/start/script.sh" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                 <FormField
                    control={form.control}
                    name="port"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Port</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="e.g., 8080" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                 />
                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Tags (comma-separated)</FormLabel>
                        <FormControl>
                            <Input placeholder="web, api, production" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <SubmitButton />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
