import { createSessionHelpers, type Session } from "@/lib/session";

export type { Session };

const helpers = createSessionHelpers("ideastorm_session");

export const createSession = helpers.create;
export const getSession = helpers.get;
export const destroySession = helpers.destroy;
