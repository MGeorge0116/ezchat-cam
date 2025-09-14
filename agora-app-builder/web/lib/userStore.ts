import type { Prisma, User } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/** Normalize helpers */
const normEmail = (e: string) => e.trim().toLowerCase();
const normUsername = (u: string) => u.trim().toLowerCase();

/**
 * Your Prisma schema requires `passwordHash` on create.
 * Make it mandatory here so the object conforms to `Prisma.UserCreateInput`.
 */
export type CreateUserInput = {
  username: string;
  email: string;
  passwordHash: string;
};

/** Public, non-sensitive user shape */
export type PublicUser = {
  username: string;
  // include non-sensitive fields you want to expose
  email?: string;
  [k: string]: unknown;
};

export function toPublicUser(u: User): PublicUser {
  return {
    username: u.username,
    email: u.email,
  };
}

/**
 * Create a user (passwordHash is required by the schema).
 */
export async function createUser(input: CreateUserInput): Promise<User> {
  const data: Prisma.UserCreateInput = {
    username: normUsername(input.username),
    email: normEmail(input.email),
    passwordHash: input.passwordHash,
  };

  return prisma.user.create({ data });
}

/**
 * Upsert by email — since create requires a passwordHash in your schema,
 * this also requires passwordHash to satisfy `UserCreateInput`.
 */
export async function upsertUserByEmail(input: CreateUserInput): Promise<User> {
  const email = normEmail(input.email);
  const username = normUsername(input.username);

  const createData: Prisma.UserCreateInput = {
    username,
    email,
    passwordHash: input.passwordHash,
  };

  const updateData: Prisma.UserUpdateInput = {
    username,
    // If you want to allow updating password optionally, set it explicitly
    passwordHash: input.passwordHash,
  };

  return prisma.user.upsert({
    where: { email },
    create: createData,
    update: updateData,
  });
}

/** Update only the password hash */
export async function setPasswordHash(userId: string, passwordHash: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });
}

/** Lookups */
export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email: normEmail(email) } });
}

export async function getUserByUsername(username: string) {
  return prisma.user.findUnique({ where: { username: normUsername(username) } });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}
