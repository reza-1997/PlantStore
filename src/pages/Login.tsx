import { useState } from "react";
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";


import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";


import { signInWithEmail } from "../services/authService";
import { useAppDispatch } from "../hooks/redux";
import { showNotification } from "../api/uiSlice";
import { getLoginSchema, type LoginFormData } from "../utils/loginSchema";
import { CheckCircleOutlined } from "@mui/icons-material";
import { handleAuthError } from "../utils/authErrorHandler";


const Login = () => {
  const theme = useTheme();
  const { lang = "fa" } = useParams<{ lang: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  //  دریافت آدرسی که کاربر قصد ورود به آن را داشته است
  const from = location.state?.from?.pathname || `/${lang}/account/overview`;

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
      // 👈 ترجمه متمرکز خطا بدون نیاز به try...catch یا کدهای تکراری
      const translatedError = handleAuthError(error.message, t);
      dispatch(showNotification({ message: translatedError, type: "error" }));
    } else {
      dispatch(showNotification({ message: t("login.success"), type: "success" }));
      navigate(from, { replace: true });
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        py: { xs: 4, md: 8 },
        px: { xs: 2, sm: 4 },
        width: "100%",
        display: "flex",
        justifyContent: "center",
        minHeight: "75vh",
      }}
    >
      <Box sx={{ width: { xs: "100%", sm: "95%", md: "90%", lg: "80%" } }}>
        <Grid container spacing={{ xs: 4, md: 8 }}>

          {/* ستون سمت چپ: فرم ورود */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
              {t("login.title")}
            </Typography>

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>

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

          {/* ستون سمت راست: بخش مشتری جدید */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ pl: { md: 4 } }}>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
                {t("login.newCustomerTitle")}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {t("login.newCustomerSubtitle")}
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                  <CheckCircleOutlined color="success" sx={{ mt: 0.2 }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {t("login.benefit1")}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                  <CheckCircleOutlined color="success" sx={{ mt: 0.2 }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {t("login.benefit2")}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                  <CheckCircleOutlined color="success" sx={{ mt: 0.2 }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {t("login.benefit3")}
                  </Typography>
                </Box>
              </Box>

              {/* دکمه ایجاد حساب */}
              <Button
                component={Link}
                to={`/${lang}/register`}
                variant="outlined"
                size="large"
                sx={{
                  height: 48,
                  borderRadius: 8,
                  px: 4,
                  fontWeight: 700,
                  borderColor: theme.palette.text.primary,
                  color: theme.palette.text.primary,
                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                {t("login.createAccountButton")}
              </Button>
            </Box>
          </Grid>

        </Grid>
      </Box>
    </Box>
  );
};

export default Login;