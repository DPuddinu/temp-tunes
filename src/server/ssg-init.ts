import { createServerSideHelpers } from '@trpc/react-query/server';
import { type Session } from 'next-auth';
import SuperJSON from 'superjson';
import { appRouter, type AppRouter } from './api/root';
import { createInnerTRPCContext } from './api/trpc';

export async function ssgInit(
  session: Session | null,
) {

  const ssg = createServerSideHelpers<AppRouter>({
    router: appRouter,
    ctx: await createInnerTRPCContext({session}),
    transformer: SuperJSON,
  });

  return ssg;
}