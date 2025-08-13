"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import * as data from "@/lib/data";
import { summarizeLogs } from "@/ai/flows/summarize-logs";

const addServiceSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  description: z.string().min(5, "Description must be at least 5 characters."),
  scriptPath: z.string().startsWith("/", "Path must be an absolute path."),
  port: z.coerce.number().int().positive().optional(),
  tags: z.string().optional(),
});

export async function addService(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const parseResult = addServiceSchema.safeParse(rawData);

  if (!parseResult.success) {
    return { success: false, error: parseResult.error.errors[0].message };
  }

  const { name, description, scriptPath, port, tags } = parseResult.data;

  const newServiceData = {
    name,
    description,
    scriptPath,
    port: port || 0,
    tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
  };

  const newService = await data.addService(newServiceData);

  revalidatePath("/");
  redirect("/");
  return { success: true, service: newService };
}

async function updateStatus(formData: FormData, status: "running" | "stopped" | "failed") {
  const id = formData.get("id") as string;
  if (id) {
    if (status === "failed") { // special case for restart -> failed
        await data.updateServiceStatus(id, "failed");
    } else {
        await data.updateServiceStatus(id, status);
    }
    revalidatePath("/");
    revalidatePath(`/services/${id}`);
  }
}

export async function startService(formData: FormData) {
  await updateStatus(formData, "running");
}

export async function stopService(formData: FormData) {
  await updateStatus(formData, "stopped");
}

export async function restartService(formData: FormData) {
  const id = formData.get("id") as string;
  // Simulate restart: stop -> start
  await updateStatus(formData, "stopped");
  await new Promise(resolve => setTimeout(resolve, 500)); // wait 500ms
  await updateStatus(formData, "running");
}


export async function handleSummarizeLogs(logs: string) {
    if (!logs || logs.trim().length === 0) {
        return { summary: null, error: "No logs provided to summarize." };
    }
    try {
        const result = await summarizeLogs({ logs });
        return { summary: result.summary, error: null };
    } catch(e) {
        console.error("Error summarizing logs:", e);
        return { summary: null, error: "Failed to connect to the AI service." };
    }
}
