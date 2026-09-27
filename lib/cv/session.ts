import { createSessionHelpers, type Session } from "@/lib/session";

export type { Session };

// Cookie distinct de celui d'IdeaStorm : les deux démos ne partagent
// ni comptes ni sessions.
const helpers = createSessionHelpers("cv_session");

export const createSession = helpers.create;
export const getSession = helpers.get;
export const destroySession = helpers.destroy;
