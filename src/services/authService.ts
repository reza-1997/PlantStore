import { supabase } from "../config/supabaseClient";

// Wrapper استاندارد برای مدیریت خطاهای شبکه و Catch تمام اکشن‌های Auth
const safeAuthCall = async (
  authFn: () => Promise<{ data?: any; error: any }>
) => {
  if (!navigator.onLine) {
    return { data: null, error: { message: "NETWORK_OFFLINE" } };
  }

  try {
    const { data, error } = await authFn();

    if (error) {
      if (
        error.message?.includes("Failed to fetch") ||
        error.message?.includes("FetchError")
      ) {
        return { data: null, error: { message: "NETWORK_ERROR" } };
      }
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: { message: "NETWORK_ERROR" } };
  }
};

// ۱. ثبت‌نام کاربر جدید
export const signUpWithEmail = async (
  email: string,
  password: string,
  options?: { firstName?: string; lastName?: string; birthdate?: string }
) => {
  return safeAuthCall(() =>
    supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: options?.firstName,
          last_name: options?.lastName,
          birthdate: options?.birthdate,
        },
      },
    })
  );
};

// ۲. ورود کاربر با ایمیل
export const signInWithEmail = async (email: string, password: string) => {
  return safeAuthCall(() =>
    supabase.auth.signInWithPassword({
      email,
      password,
    })
  );
};

// ۳. خروج از حساب کاربری
export const signOut = async () => {
  return safeAuthCall(() => supabase.auth.signOut());
  
};

// ۴. دریافت اطلاعات کاربر جاری
export const getCurrentUser = async () => {
  try {
    if (!navigator.onLine) return null;
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) return null;
    return user;
  } catch {
    return null;
  }
};

// ۵. ورود با اکانت گوگل
export const signInWithGoogle = async () => {
  return safeAuthCall(() =>
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    })
  );
};