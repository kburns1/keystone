import { cookies } from "next/headers";
import type { Role } from "./types";

// Deliberate auth stub for the prototype: identity is a cookie set by the
// user switcher in the nav. Server actions still enforce role checks, so the
// RBAC surface is real even though identity is not. Production answer:
// WorkOS/Auth.js against the company IdP — see README.
export interface SessionUser {
  id: string;
  name: string;
  role: Role;
}

export const USERS: SessionUser[] = [
  { id: "u-admin", name: "Ada Admin", role: "admin" },
  { id: "u-rev", name: "Ray Reviewer", role: "reviewer" },
  { id: "u-view", name: "Vic Viewer", role: "viewer" },
];

export const CREATE_ROLES: Role[] = ["admin", "reviewer"];

export function canCreate(role: Role): boolean {
  return CREATE_ROLES.includes(role);
}

const COOKIE = "keystone_user";

export async function currentUser(): Promise<SessionUser> {
  const store = await cookies();
  const id = store.get(COOKIE)?.value;
  return USERS.find((u) => u.id === id) ?? USERS[0];
}
