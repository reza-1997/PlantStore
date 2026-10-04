import type { TFunction } from "i18next";
import * as yup from "yup";


export const getLoginSchema = (t: TFunction) => {
    return yup.object().shape({
        email: yup
            .string()
            .required(t("login.requiredField"))
            .email(t("login.invalidEmail")),
        password: yup
            .string()
            .required(t("login.requiredField"))
            .min(8, t("login.minPassword")),
    });
};

export type LoginFormData = yup.InferType<ReturnType<typeof getLoginSchema>>;