import { useState } from "react";
import {
    Box,
    Button,
    Divider,
    Grid,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { CheckCircleOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import { Controller, useForm } from "react-hook-form";
import { getLoginSchema, type LoginFormData } from "../utils/loginSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { signInWithEmail } from "../services/authService";
import { useAppDispatch } from "../hooks/redux";
import { showNotification } from "../api/uiSlice";
import { handleAuthError } from "../utils/authErrorHandler";

type GuestAuthStepProps = {
    lang: string;
    onBackToCart: () => void;
};

const GuestAuthStep = ({ lang, onBackToCart }: GuestAuthStepProps) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const isRtl = lang === 'fa';
    const dispatch = useAppDispatch();

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: yupResolver(getLoginSchema(t)),
        defaultValues: {
            email: "",
            password: "",
        },
    });


    const onSubmit = async (data: LoginFormData) => {
        setLoading(true);
        const { error } = await signInWithEmail(data.email, data.password);
        setLoading(false);

        if (error) {
            const translatedError = handleAuthError(error.message, t);
            dispatch(showNotification({ message: translatedError, type: "error" }));
        } else {
            dispatch(showNotification({ message: t("login.success"), type: "success" }));
            onBackToCart()
        }
    };

    return (
        <Box sx={{ width: "100%", pr: { md: 2 } }}>
            <Grid container spacing={4}>
                {/* فرم لاگین کاربر قدیمی */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                        {t("auth.returningCustomer")}
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {/* Email */}
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label={t("login.email")}
                                    type="email"
                                    fullWidth
                                    variant="outlined"
                                    error={Boolean(errors.email)}
                                    helperText={errors.email?.message}
                                />
                            )}
                        />

                        {/* Password */}
                        <Box>
                            <Controller
                                name="password"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label={t("login.password")}
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

                            {/* فراموشی رمز عبور */}
                            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                                <Typography
                                    component={Link}
                                    to={`/${lang}/forgot-password`}
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        textDecoration: "underline",
                                        fontWeight: 500,
                                        "&:hover": { color: "primary.main" },
                                    }}
                                >
                                    {t("login.forgotPassword")}
                                </Typography>
                            </Box>
                        </Box>

                        {/* دکمه ورود */}
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={loading}
                            sx={{
                                mt: 1,
                                height: 50,
                                borderRadius: 8,
                                fontWeight: 700,
                                fontSize: "1rem",
                                backgroundColor: theme.palette.primary.main,
                                "&:hover": {
                                    backgroundColor: theme.palette.primary.dark,
                                },
                            }}
                        >
                            {loading ? t("common.loading") : t("login.submitButton")}
                        </Button>

                    </Box>
                </Grid>

                {/* مزایای ساخت حساب کاربری */}
                <Grid size={{ xs: 12, sm: 6 }} sx={{ borderLeft: { sm: `1px solid ${theme.palette.divider}` }, pl: { sm: 3 } }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                        {t("auth.createNewAccount")}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {t("auth.benefitsTitle")}
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckCircleOutlined color="success" fontSize="small" />
                            {t("auth.benefit1")}
                        </Typography>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckCircleOutlined color="success" fontSize="small" />
                            {t("auth.benefit2",)}
                        </Typography>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckCircleOutlined color="success" fontSize="small" />
                            {t("auth.benefit3")}
                        </Typography>
                    </Box>

                    <Button
                        component={Link}
                        to={`/${lang}/register`}
                        variant="outlined"
                        fullWidth
                        sx={{ borderRadius: 2, height: 45, fontWeight: 700 }}
                    >
                        {t("auth.register")}
                    </Button>
                </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* خرید به عنوان مهمان */}
            <Box sx={{ textAlign: 'center', py: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                    {t("auth.guestTitle")}
                </Typography>
                <Button
                    variant="outlined"
                    color="secondary"
                    sx={{ borderRadius: 2, px: 4, height: 45, fontWeight: 700, mt: 1 }}
                >
                    {t("auth.guestCheckout")}
                </Button>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* دکمه بازگشت */}
            <Button
                onClick={onBackToCart}
                startIcon={isRtl ? <ArrowForwardIcon /> : <ArrowBackIcon />}
                sx={{ fontWeight: 700 }}
            >
                {t("cart.backToCart")}
            </Button>
        </Box>
    );
};

export default GuestAuthStep;