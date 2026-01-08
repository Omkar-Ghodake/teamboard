import { z } from 'zod';

const envSchema = z.object({
  MONGODB_URI: z.string().url().min(1, "MONGODB_URI is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const processEnv = {
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV,
};

// Validate environment variables
const parsed = envSchema.safeParse(processEnv);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  // In a real app we might want to throw here, but for build time safety we can be stricter.
  // We'll throw only if we are in runtime or if specific critical vars are missing.
  // For now, fail fast.
  if (process.env.NODE_ENV !== 'test') { // Don't crash in tests if not needed immediately
      throw new Error('Invalid environment variables');
  }
}

export const env = parsed.data || processEnv; // Fallback for type safety if throw is suppressed
