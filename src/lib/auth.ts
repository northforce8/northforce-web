import { supabase } from './supabase';

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'partner';
  name?: string;
}

export type UserRole = 'admin' | 'partner';

export const signIn = async (email: string, password: string): Promise<AdminUser | null> => {
  try {
    if (!supabase) {
      console.warn('Supabase not configured. Authentication not available.');
      return null;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Sign in error:', error);
      return null;
    }

    if (data.user) {
      const userRole = data.user.app_metadata?.role || data.user.user_metadata?.role;
      const adminEmails = ['ps@northforce.io', 'admin@northforce.io'];
      const isAdminEmail = adminEmails.includes(data.user.email?.toLowerCase() || '');

      const finalRole = isAdminEmail ? 'admin' : (userRole || 'admin');

      if (finalRole !== 'admin' && finalRole !== 'partner') {
        console.warn('User does not have valid role');
        await supabase.auth.signOut();
        return null;
      }

      try {
        await supabase
          .from('admin_users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', data.user.id);
      } catch (e) {
        console.warn('Failed to update last_login, continuing anyway');
      }

      let userName = data.user.email?.split('@')[0];
      try {
        const { data: userData } = await supabase
          .from('admin_users')
          .select('name')
          .eq('id', data.user.id)
          .maybeSingle();
        if (userData?.name) userName = userData.name;
      } catch (e) {
        console.warn('Failed to fetch user name, using email prefix');
      }

      return {
        id: data.user.id,
        email: data.user.email || '',
        role: finalRole as UserRole,
        name: userName
      };
    }

    return null;
  } catch (error) {
    console.error('Auth service error:', error);
    return null;
  }
};

export const signInAdmin = signIn;

export const signOut = async (): Promise<boolean> => {
  try {
    if (!supabase) {
      console.warn('Supabase not configured. Sign out not available.');
      return false;
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Auth service error:', error);
    return false;
  }
};

export const signOutAdmin = signOut;

export const getCurrentUser = async (): Promise<AdminUser | null> => {
  try {
    if (!supabase) {
      console.warn('Supabase not configured. Authentication not available.');
      return null;
    }

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Get current user error:', error);
      return null;
    }

    if (user) {
      const userRole = user.app_metadata?.role || user.user_metadata?.role;
      const adminEmails = ['ps@northforce.io', 'admin@northforce.io'];
      const isAdminEmail = adminEmails.includes(user.email?.toLowerCase() || '');

      const finalRole = isAdminEmail ? 'admin' : (userRole || 'admin');

      if (finalRole !== 'admin' && finalRole !== 'partner') {
        console.warn('User does not have valid role');
        return null;
      }

      let userName = user.email?.split('@')[0];
      try {
        const { data: userData } = await supabase
          .from('admin_users')
          .select('name')
          .eq('id', user.id)
          .maybeSingle();
        if (userData?.name) userName = userData.name;
      } catch (e) {
        console.warn('Failed to fetch user name, using email prefix');
      }

      return {
        id: user.id,
        email: user.email || '',
        role: finalRole as UserRole,
        name: userName
      };
    }

    return null;
  } catch (error) {
    console.error('Auth service error:', error);
    return null;
  }
};

export const getCurrentAdmin = getCurrentUser;
export const getCurrentAdminUser = getCurrentUser;

export const isAuthenticated = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return user !== null;
};

export const isAdminAuthenticated = isAuthenticated;

export const isAdmin = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return user?.role === 'admin';
};

export const isPartner = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return user?.role === 'partner';
};

export const hasRole = async (role: UserRole): Promise<boolean> => {
  const user = await getCurrentUser();
  return user?.role === role;
};