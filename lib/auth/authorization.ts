import { getAuthUser, type AuthUser } from './auth';
import { redirect } from 'next/navigation';

/**
 * Authorization error for server actions
 * Includes status code for proper HTTP responses
 */
export class AuthorizationError extends Error {
  constructor(
    message: string,
    public status: number = 403
  ) {
    super(message);
    this.name = 'AuthorizationError';
  }
}

/**
 * Require user to be authenticated
 * Throws AuthorizationError if not authenticated
 * @returns Authenticated user
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getAuthUser();

  if (!user) {
    throw new AuthorizationError('Unauthorized: Please log in', 401);
  }

  return user;
}

/**
 * Require user to be an admin
 * Throws AuthorizationError if not authenticated or not an admin
 * @returns Authenticated admin user
 */
export async function requireAdmin(): Promise<AuthUser> {
  const user = await requireAuth();

  if (user.role !== 'admin') {
    throw new AuthorizationError('Forbidden: Admin access required', 403);
  }

  return user;
}

/**
 * Check if current user is admin
 * Returns boolean without throwing
 * @returns True if user is admin, false otherwise
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getAuthUser();
  return user?.role === 'admin';
}

/**
 * Require admin access for pages
 * Redirects to login if not authenticated or not admin
 * Use in Server Components
 */
export async function requireAdminPage(): Promise<AuthUser> {
  try {
    return await requireAdmin();
  } catch (error) {
    // For pages, redirect instead of throwing
    if (error instanceof AuthorizationError) {
      if (error.status === 401) {
        redirect('/login');
      } else {
        redirect('/'); // Redirect non-admins to home
      }
    }
    throw error;
  }
}
