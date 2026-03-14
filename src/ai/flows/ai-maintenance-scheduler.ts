'use server';
/**
 * @fileOverview An AI agent for recommending optimal database maintenance schedules.
 *
 * - scheduleMaintenance - A function that handles the maintenance scheduling process.
 * - MaintenanceSchedulerInput - The input type for the scheduleMaintenance function.
 * - MaintenanceSchedulerOutput - The return type for the scheduleMaintenance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MaintenanceSchedulerInputSchema = z.object({
  databaseUsageDescription: z
    .string()
    .describe(
      'A detailed description of the database\'s typical usage patterns, including peak hours, off-peak hours, and any specific events affecting traffic.'
    ),
  maintenanceTasks: z
    .array(z.string())
    .describe(
      'A list of maintenance tasks for which optimal scheduling is required (e.g., "full backup", "transaction log backup", "archive old data", "reindex tables").'
    ),
});
export type MaintenanceSchedulerInput = z.infer<
  typeof MaintenanceSchedulerInputSchema
>;

const MaintenanceSchedulerOutputSchema = z.object({
  scheduleRecommendations: z
    .array(
      z.object({
        task: z.string().describe('The maintenance task.'),
        optimalTimeWindow: z
          .string()
          .describe(
            'The recommended optimal time window for the task (e.g., "Daily between 2 AM and 4 AM UTC", "Weekly on Sunday between 1 AM and 5 AM UTC").'
          ),
        reason: z
          .string()
          .describe(
            'The reason for the recommendation, based on the database usage patterns.'
          ),
      })
    )
    .describe('An array of recommended schedules for each maintenance task.'),
});
export type MaintenanceSchedulerOutput = z.infer<
  typeof MaintenanceSchedulerOutputSchema
>;

export async function scheduleMaintenance(
  input: MaintenanceSchedulerInput
): Promise<MaintenanceSchedulerOutput> {
  return aiMaintenanceSchedulerFlow(input);
}

const maintenanceSchedulerPrompt = ai.definePrompt({
  name: 'maintenanceSchedulerPrompt',
  input: {schema: MaintenanceSchedulerInputSchema},
  output: {schema: MaintenanceSchedulerOutputSchema},
  prompt: `You are an expert database administrator and a scheduling assistant. Your goal is to analyze database usage patterns and recommend optimal time windows for various maintenance tasks to minimize impact on performance and user experience.

Analyze the following database usage description and provide optimal scheduling recommendations for each specified maintenance task.

Database Usage Description: {{{databaseUsageDescription}}}

Maintenance Tasks to Schedule:
{{#each maintenanceTasks}}
- {{{this}}}
{{/each}}

For each task, provide a specific optimal time window (e.g., 'Daily between 2 AM and 4 AM UTC' or 'Weekly on Sunday between 1 AM and 5 AM UTC') and a clear reason for your recommendation based on the usage patterns. Ensure the recommendations aim for minimal operational impact.`,
});

const aiMaintenanceSchedulerFlow = ai.defineFlow(
  {
    name: 'aiMaintenanceSchedulerFlow',
    inputSchema: MaintenanceSchedulerInputSchema,
    outputSchema: MaintenanceSchedulerOutputSchema,
  },
  async input => {
    const {output} = await maintenanceSchedulerPrompt(input);
    return output!;
  }
);
