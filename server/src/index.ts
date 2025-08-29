import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { createVoteInputSchema, createOptionInputSchema } from './schema';
import { getOptions } from './handlers/get_options';
import { createVote } from './handlers/create_vote';
import { createOption } from './handlers/create_option';
import { getVotingResults } from './handlers/get_voting_results';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),
  
  // Get all voting options with current vote counts
  getOptions: publicProcedure
    .query(() => getOptions()),
  
  // Cast a vote for a specific option
  createVote: publicProcedure
    .input(createVoteInputSchema)
    .mutation(({ input }) => createVote(input)),
  
  // Create a new voting option (admin functionality)
  createOption: publicProcedure
    .input(createOptionInputSchema)
    .mutation(({ input }) => createOption(input)),
  
  // Get comprehensive voting results including totals
  getVotingResults: publicProcedure
    .query(() => getVotingResults()),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();