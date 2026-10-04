import { supabase } from "../config/supabaseClient";

// دریافت لیست آیدی‌های محصولات موردعلاقه کاربر
export const fetchUserWishlist = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from("wishlists")
        .select("product_id")
        .eq("user_id", user.id);

    if (error) throw error;
    return data.map((item) => String(item.product_id));
};

// افزودن محصول به علاقه‌مندی‌ها
export const addToWishlistApi = async (productId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("UNAUTHORIZED");

    const { error } = await supabase
        .from("wishlists")
        .insert([{ user_id: user.id, product_id: productId }]);

    if (error) throw error;
};

// حذف محصول از علاقه‌مندی‌ها
export const removeFromWishlistApi = async (productId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("UNAUTHORIZED");

    const { error } = await supabase
        .from("wishlists")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);

    if (error) throw error;
};