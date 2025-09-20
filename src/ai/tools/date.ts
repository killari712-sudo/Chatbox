'use server';
/**
 * @fileoverview Defines a tool for retrieving the current date.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

export const getCurrentDate = ai.defineTool(
  {
    name: 'getCurrentDate',
    description: 'Returns the current date.',
    outputSchema: z.string(),
  },
  async () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
);
