import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const RESET_SECRET = process.env.RESET_SECRET || 'reset-secret-key-change-in-production';
const SALT_ROUNDS = 10;

export interface JWTPayload {
  userId: string;
  email: string;
}

export interface ResetTokenPayload {
  email: string;
  purpose: 'password_reset';
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export function getUserFromRequest(request: Request): JWTPayload | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  return verifyToken(token);
}

export function generateResetToken(email: string): string {
  return jwt.sign({ email, purpose: 'password_reset' } as ResetTokenPayload, RESET_SECRET, {
    expiresIn: '1h',
  });
}

export function verifyResetToken(token: string): ResetTokenPayload | null {
  try {
    const payload = jwt.verify(token, RESET_SECRET) as ResetTokenPayload;
    if (payload.purpose !== 'password_reset') return null;
    return payload;
  } catch {
    return null;
  }
}
