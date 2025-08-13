'use server';

/**
 * @fileOverview Summarizes recent service logs, highlighting potential issues and anomalies.
 *
 * - summarizeLogs - A function that summarizes the logs.
 * - SummarizeLogsInput - The input type for the summarizeLogs function.
 * - SummarizeLogsOutput - The return type for the summarizeLogs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeLogsInputSchema = z.object({
  logs: z
    .string()
    .describe('The recent logs of the service.'),
});
export type SummarizeLogsInput = z.infer<typeof SummarizeLogsInputSchema>;

const SummarizeLogsOutputSchema = z.object({
  summary: z.string().describe('A summary of the recent service logs, highlighting potential issues and anomalies.'),
});
export type SummarizeLogsOutput = z.infer<typeof SummarizeLogsOutputSchema>;

export async function summarizeLogs(input: SummarizeLogsInput): Promise<SummarizeLogsOutput> {
  return summarizeLogsFlow(input);
}

const summarizeLogsPrompt = ai.definePrompt({
  name: 'summarizeLogsPrompt',
  input: {schema: SummarizeLogsInputSchema},
  output: {schema: SummarizeLogsOutputSchema},
  prompt: `You are an expert system administrator.  Please summarize the following logs, highlighting potential issues and anomalies.\n\nLogs: {{{logs}}} `,
});

const summarizeLogsFlow = ai.defineFlow(
  {
    name: 'summarizeLogsFlow',
    inputSchema: SummarizeLogsInputSchema,
    outputSchema: SummarizeLogsOutputSchema,
  },
  async input => {
    const {output} = await summarizeLogsPrompt(input);
    return output!;
  }
);
