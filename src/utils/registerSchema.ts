import type { TFunction } from "i18next";
import * as yup from "yup";


export const getRegisterSchema = (t: TFunction) => {
    return yup.object().shape({
        firstName: yup.string().required(t("register.requiredField")),
        lastName: yup.string().required(t("register.requiredField")),
        email: yup
            .string()
            .required(t("register.requiredField"))
            .email(t("register.invalidEmail")),
        password: yup
            .string()
            .required(t("register.requiredField"))
            .min(8, t("register.minPassword")),
        confirmPassword: yup
            .string()
            .required(t("register.requiredField"))
            .min(8, t("register.minPassword"))
            .oneOf([yup.ref("password")], t("register.passwordMismatch")),
        birthdate: yup.string().optional(),
        subscribeNewsletter: yup.boolean(),
        acceptTerms: yup
            .boolean()
            .oneOf([true], t("register.acceptTermsRequired")),
    });
};

// دریافت تایپ‌های فرم بر اساس اسکیما
export type RegisterFormData = yup.InferType<ReturnType<typeof getRegisterSchema>>;