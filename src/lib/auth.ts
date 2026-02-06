import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import { NextRequest } from "next/server";
import { User } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export interface AuthTokenPayload extends JwtPayload {
  userId: string;
  role: string;
}

export function signToken(payload: { userId: string; role: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): AuthTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function getBearerToken(req: NextRequest): string | null {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;
  const [type, token] = authHeader.split(" ");
  if (type !== "Bearer" || !token) return null;
  return token;
}

export async function isTokenRevoked(token: string): Promise<boolean> {
  const revoked = await prisma.revokedToken.findUnique({ where: { token } });
  return Boolean(revoked);
}

export async function revokeToken(token: string): Promise<void> {
  const decoded = jwt.decode(token) as JwtPayload | null;
  const expiresAt = decoded?.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await prisma.revokedToken.create({
    data: { token, expiresAt },
  });
}

export async function getUserFromRequest(req: NextRequest): Promise<User | null> {
  const token = getBearerToken(req);
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload) return null;
  const revoked = await isTokenRevoked(token);
  if (revoked) return null;
  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  return user;
}

export function hasRole(user: User, roles: Array<"customer" | "staff" | "admin">): boolean {
  return roles.includes(user.role as "customer" | "staff" | "admin");
}
