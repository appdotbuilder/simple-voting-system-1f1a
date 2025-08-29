import { z } from 'zod';

// Option schema for voting options
export const optionSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  vote_count: z.number().int().nonnegative(),
  created_at: z.coerce.date()
});

export type Option = z.infer<typeof optionSchema>;

// Vote schema for individual votes
export const voteSchema = z.object({
  id: z.number(),
  option_id: z.number(),
  created_at: z.coerce.date()
});

export type Vote = z.infer<typeof voteSchema>;

// Input schema for creating a vote
export const createVoteInputSchema = z.object({
  option_id: z.number().int().positive()
});

export type CreateVoteInput = z.infer<typeof createVoteInputSchema>;

// Input schema for creating options (admin functionality)
export const createOptionInputSchema = z.object({
  title: z.string().min(1),
  description: z.string().nullable()
});

export type CreateOptionInput = z.infer<typeof createOptionInputSchema>;

// Response schema for voting results
export const votingResultsSchema = z.object({
  options: z.array(optionSchema),
  total_votes: z.number().int().nonnegative()
});

export type VotingResults = z.infer<typeof votingResultsSchema>;