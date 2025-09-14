export interface SessionUser {
  id: string;
  email: string | null;
  username: string;
}
export interface Session {
  user: SessionUser | null;
}

export const SESSION_COOKIE = "ez.sid";

export async function getSession(): Promise<Session> {
  return { user: null };
}

// Extremely small stub; replace with your real verifier later.
export async function verifyToken(_token: string): Promise<{ userId: string } | null> {
  return null;
}
