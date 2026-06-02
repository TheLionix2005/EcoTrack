import { supabase } from "@/integrations/supabase/client";

export const AuthController = {
  async signInWithEmail(email: string, password: string) {
    return supabase.auth.signInWithPassword({ email, password });
  },

  async signUpWithEmail(email: string, password: string, fullName: string) {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { full_name: fullName },
      },
    });
  },

  async signInWithGoogle() {
    return supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  },

  async signOut() {
    return supabase.auth.signOut();
  },

  async getCurrentUserId(): Promise<string | null> {
    const { data } = await supabase.auth.getUser();
    return data.user?.id ?? null;
  },

  async getCurrentSession() {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  onAuthChange(callback: (signedIn: boolean) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(!!session);
    });
  },
};