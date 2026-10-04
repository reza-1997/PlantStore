
import { useEffect, useState } from 'react';
import { supabase } from '../config/supabaseClient';
import type { User } from '@supabase/supabase-js';


export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // ۱. دریافت وضعیت کاربر در اولین رندر
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
            setLoading(false);
        });

        // ۲. شنود تغییرات آنلاین (Login / Logout / Refresh Token)
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // ۳. لغو Listener هنگام Unmount شدن کامپوننت
        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    return { user, loading };
};