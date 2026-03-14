'use server';
/**
 * @fileOverview An AI agent that scans database schema and data patterns for redundancies
 * and provides actionable recommendations for optimization.
 *
 * - scanDatabaseForRedundancy - A function that initiates the redundancy scanning process.
 * - AiRedundancyScannerInput - The input type for the scanDatabaseForRedundancy function.
 * - AiRedundancyScannerOutput - The return type for the scanDatabaseForRedundancy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiRedundancyScannerInputSchema = z.object({
  databaseSchema: z
    .string()
    .describe(
      'The full database schema as DDL statements or a structured JSON representation.'
    ),
  sampleDataPatterns: z
    .string()
    .optional()
    .describe(
      'Optional: Descriptions of observed data patterns that might indicate redundancy, such as common values across different tables or columns.'
    ),
});
export type AiRedundancyScannerInput = z.infer<
  typeof AiRedundancyScannerInputSchema
>;

const AiRedundancyScannerOutputSchema = z.object({
  redundanciesFound: z
    .boolean()
    .describe('True if any redundancies were identified, false otherwise.'),
  redundantItems: z
    .array(
      z.object({
        type: z
          .enum(['table', 'column', 'data_pattern'])
          .describe('The type of redundant item.'),
        name: z
          .string()
          .optional()
          .describe('The name of the redundant table or column, if applicable.'),
        description: z
          .string()
          .describe('A detailed explanation of the identified redundancy.'),
        recommendations: z
          .array(z.string())
          .describe('Actionable steps to optimize or remove the redundancy.'),
      })
    )
    .describe('A list of all identified redundant items.'),
  summary: z
    .string()
    .describe(
      'A comprehensive summary of the findings and overall recommendations for database optimization.'
    ),
});
export type AiRedundancyScannerOutput = z.infer<
  typeof AiRedundancyScannerOutputSchema
>;

export async function scanDatabaseForRedundancy(
  input: AiRedundancyScannerInput
): Promise<AiRedundancyScannerOutput> {
  return aiRedundancyScannerFlow(input);
}

const aiRedundancyScannerPrompt = ai.definePrompt({
  name: 'aiRedundancyScannerPrompt',
  input: {schema: AiRedundancyScannerInputSchema},
  output: {schema: AiRedundancyScannerOutputSchema},
  prompt: `You are an expert database administrator tasked with identifying and resolving database redundancies.

Your goal is to analyze the provided database schema and any observed data patterns to find redundant tables, columns, or data. Then, provide clear, actionable recommendations for optimization.

Database Schema:
{{{databaseSchema}}}

{{#if sampleDataPatterns}}
Observed Data Patterns:
{{{sampleDataPatterns}}}
{{/if}}

Identify any redundancies and provide specific, actionable recommendations to improve database efficiency and reduce storage costs. If no redundancies are found, set 'redundanciesFound' to false and provide a summary stating that no issues were found.
`,
});

const aiRedundancyScannerFlow = ai.defineFlow(
  {
    name: 'aiRedundancyScannerFlow',
    inputSchema: AiRedundancyScannerInputSchema,
    outputSchema: AiRedundancyScannerOutputSchema,
  },
  async input => {
    const {output} = await aiRedundancyScannerPrompt(input);
    return output!;
  }
);
