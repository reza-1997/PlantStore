import { useState } from "react";
import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { signUpWithEmail } from "../services/authService";
import { useAppDispatch } from "../hooks/redux";
import { showNotification } from "../api/uiSlice";
import { CheckCircleOutlined } from "@mui/icons-material";
import { getRegisterSchema, type RegisterFormData } from "../utils/registerSchema";
import RegisterSuccessModal from "../components/common/RegisterSuccessModal";
import { handleAuthError } from "../utils/authErrorHandler";

const Register = () => {
    const theme = useTheme();
    const { lang = "fa" } = useParams<{ lang: string }>();
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [registeredFirstName, setRegisteredFirstName] = useState("");


    // import Schema
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: yupResolver(getRegisterSchema(t)),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            birthdate: "",
            subscribeNewsletter: false,
            acceptTerms: false,
        },
    });

    const onSubmit = async (data: RegisterFormData) => {
        setLoading(true);
        const { error } = await signUpWithEmail(data.email, data.password, {
            firstName: data.firstName,
            lastName: data.lastName,
            birthdate: data.birthdate,
        }); setLoading(false);

        if (error) {
            const translatedError = handleAuthError(error.message, t);
            dispatch(showNotification({ message: translatedError, type: "error" }));
        } else {
            dispatch(showNotification({ message: t("register.success"), type: "success" }));
            setRegisteredFirstName(data.firstName);
            setIsSuccessModalOpen(true);
        }
    };

    return (
        <>
            <Box
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    py: { xs: 4, md: 8 },
                    px: { xs: 2, sm: 4 },
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    minHeight: "80vh",
                }}
            >
                <Box sx={{ width: { xs: "100%", sm: "95%", md: "90%", lg: "80%" } }}>
                    <Grid container spacing={{ xs: 4, md: 8 }}>

                        {/* ستون فرم ثبت‌نام */}
                        <Grid size={{ xs: 12, md: 7 }}>
                            <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
                                {t("register.title")}
                            </Typography>

                            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>

                                {/* First Name */}
                                <Controller
                                    name="firstName"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label={t("register.firstName")}
                                            fullWidth
                                            variant="outlined"
                                            error={Boolean(errors.firstName)}
                                            helperText={errors.firstName?.message}
                                        />
                                    )}
                                />

                                {/* Last Name */}
                                <Controller
                                    name="lastName"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label={t("register.lastName")}
                                            fullWidth
                                            variant="outlined"
                                            error={Boolean(errors.lastName)}
                                            helperText={errors.lastName?.message}
                                        />
                                    )}
                                />

                                {/* Email */}
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label={t("register.email")}
                                            type="email"
                                            fullWidth
                                            variant="outlined"
                                            error={Boolean(errors.email)}
                                            helperText={errors.email?.message}
                                        />
                                    )}
                                />

                                {/* Password */}
                                <Controller
                                    name="password"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label={t("register.password")}
                                            type={showPassword ? "text" : "password"}
                                            fullWidth
                                            variant="outlined"
                                            error={Boolean(errors.password)}
                                            helperText={errors.password?.message}
                                            slotProps={{
                                                input: {
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                },
                                            }}
                                        />
                                    )}
                                />

                                {/* Confirm Password */}
                                <Controller
                                    name="confirmPassword"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label={t("register.confirmPassword")}
                                            type={showConfirmPassword ? "text" : "password"}
                                            fullWidth
                                            variant="outlined"
                                            error={Boolean(errors.confirmPassword)}
                                            helperText={errors.confirmPassword?.message}
                                            slotProps={{
                                                input: {
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                },
                                            }}
                                        />
                                    )}
                                />

                                {/* Birthdate */}
                                <Controller
                                    name="birthdate"
                                    control={control}
                                    render={({ field }) => (
                                        <Box>
                                            <TextField
                                                {...field}
                                                label={t("register.birthdate")}
                                                type="date"
                                                fullWidth
                                                variant="outlined"
                                                slotProps={{
                                                    inputLabel: { shrink: true },
                                                }}
                                            />
                                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                                                {t("register.birthdateHint")}
                                            </Typography>
                                        </Box>
                                    )}
                                />

                                {/* Subscribe Newsletter */}
                                <Controller
                                    name="subscribeNewsletter"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControlLabel
                                            control={<Checkbox {...field} checked={field.value} color="primary" />}
                                            label={t("register.subscribeNewsletter")}
                                        />
                                    )}
                                />

                                {/* Accept Terms  */}
                                <Controller
                                    name="acceptTerms"
                                    control={control}
                                    render={({ field }) => (
                                        <Box>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        {...field}
                                                        checked={field.value}
                                                        sx={{
                                                            color: errors.acceptTerms ? theme.palette.error.main : undefined,
                                                            "&.Mui-checked": {
                                                                color: theme.palette.primary.main,
                                                            },
                                                        }}
                                                    />
                                                }
                                                label={
                                                    <Typography variant="body2" color={errors.acceptTerms ? "error" : "textPrimary"}>
                                                        {t("register.acceptTermsPrefix")}{" "}
                                                        <Typography component={Link} to={`/${lang}/terms`} color="primary" sx={{ fontWeight: 700, textDecoration: "underline" }}>
                                                            {t("register.termsOfService")}
                                                        </Typography>{" "}
                                                        {t("register.and")}{" "}
                                                        <Typography component={Link} to={`/${lang}/privacy`} color="primary" sx={{ fontWeight: 700, textDecoration: "underline" }}>
                                                            {t("register.privacyPolicy")}
                                                        </Typography>
                                                    </Typography>
                                                }
                                            />
                                            {errors.acceptTerms && (
                                                <FormHelperText error>{errors.acceptTerms.message}</FormHelperText>
                                            )}
                                        </Box>
                                    )}
                                />

                                {/* Submit */}
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    disabled={loading}
                                    sx={{
                                        mt: 2,
                                        height: 50,
                                        borderRadius: 2,
                                        fontWeight: 700,
                                        fontSize: "1rem",
                                    }}
                                >
                                    {loading ? t("common.loading") : t("register.submitButton")}
                                </Button>

                                <Typography variant="body2" sx={{ textAlign: "center", mt: 1 }}>
                                    {t("register.alreadyHaveAccount")}{" "}
                                    <Typography
                                        component={Link}
                                        to={`/${lang}/login`}
                                        color="primary"
                                        sx={{ fontWeight: 800, textDecoration: "none" }}
                                    >
                                        {t("register.loginHere")}
                                    </Typography>
                                </Typography>
                            </Box>
                        </Grid>

                        {/* ستون راست: چرا حساب کاربری */}
                        <Grid size={{ xs: 12, md: 5 }}>
                            <Box
                                sx={{
                                    p: { xs: 3, md: 4 },
                                    borderRadius: 3,
                                    backgroundColor: theme.palette.background.default,
                                    border: `1px solid ${theme.palette.divider}`,
                                }}
                            >
                                <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
                                    {t("register.whyAccountTitle")}
                                </Typography>

                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    {t("register.whyAccountSubtitle")}
                                </Typography>

                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                                        <CheckCircleOutlined color="success" sx={{ mt: 0.2 }} />
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                            {t("register.benefit1")}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                                        <CheckCircleOutlined color="success" sx={{ mt: 0.2 }} />
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                            {t("register.benefit2")}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                                        <CheckCircleOutlined color="success" sx={{ mt: 0.2 }} />
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                            {t("register.benefit3")}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>

                    </Grid>
                </Box>
            </Box>

            {/* مودال پیام موفقیت */}
            <RegisterSuccessModal
                open={isSuccessModalOpen}
                firstName={registeredFirstName}
                onClose={() => setIsSuccessModalOpen(false)}
            />
        </>

    );
};

export default Register;