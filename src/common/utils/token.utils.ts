import jwt, { type JwtPayload } from 'jsonwebtoken';
import type { Types } from 'mongoose';

export type UserPayload = { id?: Types.ObjectId; mobile?: string };

export function signToken(payload: { [key: string]: unknown }, secret: string): string {
  return jwt.sign(payload, secret, { expiresIn: '1d' });
}

export function verifyToken(token: string, secret: string): JwtPayload | string {
  return jwt.verify(token, secret);
}
