import { getSupabaseClient, isSupabaseConfigured } from './supabase';

export interface AdminUser {
  id: string;
  email: string;
  isDemo?: boolean;
}

const LOCAL_ADMIN_SESSION_KEY = 'freelancer_adnan_admin_session';

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data: { session } } = await client.auth.getSession();
      if (session?.user?.email) {
        return {
          id: session.user.id,
          email: session.user.email,
          isDemo: false
        };
      }
    } catch (e) {
      console.warn('Supabase auth getSession check failed:', e);
    }
  }

  // Check local demo admin session
  try {
    const local = localStorage.getItem(LOCAL_ADMIN_SESSION_KEY);
    if (local) {
      return JSON.parse(local);
    }
  } catch (e) {
    console.error('Error reading local session:', e);
  }

  return null;
}

export async function adminSignIn(email: string, password: string): Promise<{ success: boolean; error?: string; user?: AdminUser }> {
  const client = getSupabaseClient();

  if (client) {
    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        return {
          success: true,
          user: {
            id: data.user.id,
            email: data.user.email || email,
            isDemo: false
          }
        };
      }
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Login failed' };
    }
  }

  // If Supabase is not configured yet, provide clear instruction or allow first setup
  if (!isSupabaseConfigured()) {
    // When no Supabase project connected, allow initial access to configure or test
    const user: AdminUser = {
      id: 'demo-admin-adnan',
      email: email || 'adnan708620@gmail.com',
      isDemo: true
    };
    localStorage.setItem(LOCAL_ADMIN_SESSION_KEY, JSON.stringify(user));
    return { success: true, user };
  }

  return { success: false, error: 'Could not connect to authentication service.' };
}

export async function adminSignUp(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: 'Supabase credentials not yet configured. Please configure your project first.' };
  }

  try {
    const { data, error } = await client.auth.signUp({
      email: email.trim(),
      password: password
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data.user && !data.session) {
      return {
        success: true,
        error: 'Account created! Please check your email to confirm the address, or disable email confirmation in Supabase Auth Settings.'
      };
    }

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Registration failed' };
  }
}

export async function adminSignOut(): Promise<void> {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.auth.signOut();
    } catch (e) {
      console.warn('Supabase signOut error:', e);
    }
  }
  localStorage.removeItem(LOCAL_ADMIN_SESSION_KEY);
}
