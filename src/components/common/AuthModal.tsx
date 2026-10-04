import { useState } from "react";
import {
    Dialog,
    DialogContent,
    Box,
    Typography,
    IconButton,
    TextField,
    Button,
    InputAdornment,
    useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { signInWithEmail } from "../../services/authService";
import { handleAuthError } from "../../utils/authErrorHandler";
import { getLoginSchema, type LoginFormData } from "../../utils/loginSchema";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { showNotification } from "../../api/uiSlice";
import { loadWishlist, toggleWishlist, setPendingWishlistProductId } from "../../api/wishlistSlice";

interface WishlistAuthModalProps {
    open: boolean;
    onClose: () => void;
}

const AuthModal = ({ open, onClose }: WishlistAuthModalProps) => {
    const theme = useTheme();
    const { lang = "fa" } = useParams<{ lang: string }>();
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const pendingWishlistProductId = useAppSelector(
        (state) => state.wishlist.pendingWishlistProductId
    );

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: yupResolver(getLoginSchema(t)),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onLoginSubmit = async (data: LoginFormData) => {
        setLoading(true);
        const { error } = await signInWithEmail(data.email, data.password);
        setLoading(false);

        if (error) {
            const message = handleAuthError(error.message, t);
            dispatch(showNotification({ message, type: "error" }));
        } else {
            reset();
            onClose();

            // ۱. همگام‌سازی لیست علاقه‌مندی‌های کاربر از Supabase
            await dispatch(loadWishlist()).unwrap();

            // ۲. لایک خودکار محصولی که کاربر قصد اضافه کردن آن را داشت
            if (pendingWishlistProductId) {
                try {
                    await dispatch(
                        toggleWishlist(pendingWishlistProductId)
                    ).unwrap();

                    dispatch(
                        showNotification({
                            message: t("wishlist.addedSuccess"),
                            type: "success",
                        })
                    );
                } catch (err) {
                    console.error("Auto wishlist error:", err);
                } finally {
                    dispatch(setPendingWishlistProductId(null));
                }
            } else {
                dispatch(showNotification({ message: t("login.success"), type: "success" }));
            }
        }
    };

    const handleClose = () => {
        dispatch(setPendingWishlistProductId(null));
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            onClick={(e) => e.stopPropagation()}
            maxWidth="xs"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: "12px",
                        p: 1,
                        backgroundColor: theme.palette.background.paper,
                        boxShadow: theme.shadows[10],
                    },
                }

            }}
        >
            <DialogContent sx={{ position: "relative", pt: 3, pb: 3, px: 3 }}>
                {/* دکمه بستن در بالای مودال */}
                <IconButton
                    onClick={handleClose}
                    size="small"
                    sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        color: theme.palette.text.secondary,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: "50%",
                        p: "3px",
                    }}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>

                {/* عنوان مودال */}
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 800,
                        color: theme.palette.primary.main,
                        fontFamily: theme.typography.fontFamily,
                        mb: 1,
                    }}
                >
                    {t("common.hi")}
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        color: theme.palette.text.secondary,
                        mb: 3,
                        fontWeight: 500,
                    }}
                >
                    {t("wishlist.loginRequiredModal")}
                </Typography>

                {/* فرم لاگین */}
                <Box
                    component="form"
                    onSubmit={handleSubmit(onLoginSubmit)}
                    noValidate
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
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
                                size="small"
                                error={Boolean(errors.email)}
                                helperText={errors.email?.message}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        backgroundColor: theme.palette.action.hover,
                                    },
                                }}
                            />
                        )}
                    />

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
                                    size="small"
                                    error={Boolean(errors.password)}
                                    helperText={errors.password?.message}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            backgroundColor: theme.palette.action.hover,
                                        },
                                    }}
                                    slotProps={{
                                        input: {
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <Button
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        size="small"
                                                        sx={{
                                                            minWidth: "auto",
                                                            p: 0,
                                                            textTransform: "none",
                                                            color: theme.palette.text.secondary,
                                                            fontSize: "0.8rem",
                                                        }}
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </Button>
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                />
                            )}
                        />

                        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                            <Typography
                                component={Link}
                                to={`/${lang}/forgot-password`}
                                onClick={handleClose}
                                variant="caption"
                                sx={{
                                    color: theme.palette.text.secondary,
                                    textDecoration: "underline",
                                    fontWeight: 600,
                                    "&:hover": { color: theme.palette.primary.main },
                                }}
                            >
                                {t("login.forgotPassword")}
                            </Typography>
                        </Box>
                    </Box>

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        disabled={loading}
                        sx={{
                            mt: 1,
                            height: 44,
                            borderRadius: "22px",
                            fontWeight: 700,
                            textTransform: "none",
                            backgroundColor: theme.palette.primary.main,
                            "&:hover": { backgroundColor: theme.palette.primary.dark },
                        }}
                    >
                        {loading ? t("common.loading") : t("login.submitButton")}
                    </Button>
                </Box>

                {/* ثبت‌نام */}
                <Box sx={{ mt: 2.5, textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                        {t("login.noAccount")}{" "}
                        <Typography
                            component={Link}
                            to={`/${lang}/register`}
                            onClick={handleClose}
                            variant="body2"
                            sx={{
                                color: theme.palette.primary.main,
                                fontWeight: 800,
                                textDecoration: "underline",
                            }}
                        >
                            {t("login.createOneHere")}
                        </Typography>
                    </Typography>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default AuthModal;