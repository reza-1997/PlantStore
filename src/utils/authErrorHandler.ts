import type { TFunction } from "i18next";


export const handleAuthError = (errorMessage: string, t: TFunction): string => {
    // ۱. بررسی وضعیت آفلاین بودن مرورگر
    if (!navigator.onLine) {
        return t("errors.networkOffline");
    }

    // ۲. خطاهای اتصال به شبکه و fetch
    if (
        errorMessage.includes("Failed to fetch") ||
        errorMessage.includes("FetchError") ||
        errorMessage.includes("NETWORK_ERROR") ||
        errorMessage.includes("TypeError: NetworkError")
    ) {
        return t("errors.networkError");
    }

    // ۳. خطاهای اختصاصی Supabase برای ورود و ثبت‌نام
    if (errorMessage.includes("Invalid login credentials")) {
        return t("login.invalidCredentials");
    }
    if (errorMessage.includes("Email not confirmed")) {
        return t("login.emailNotConfirmed");
    }
    if (errorMessage.includes("User already registered")) {
        return t("register.userAlreadyRegistered") || "کاربری با این ایمیل قبلاً ثبت‌نام کرده است.";
    }
    if (errorMessage.includes("Password should be at least")) {
        return t("register.passwordTooShort") || "رمز عبور باید حداقل ۶ کاراکتر باشد.";
    }

    // پیام پیش‌فرض برای سایر خطاها
    return errorMessage || t("errors.default");
};