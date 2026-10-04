import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { getCurrentUser } from "../../services/authService";

const ProtectedRoute = () => {
    const { lang = "fa" } = useParams<{ lang: string }>();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            const user = await getCurrentUser();
            setIsAuthenticated(Boolean(user));
        };
        checkAuth();
    }, []);

    // در زمان بررسی وضعیت احراز هویت، یک Loder نشان دهید
    if (isAuthenticated === null) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
                <CircularProgress color="primary" />
            </Box>
        );
    }

    // اگر کاربر لاگین نبود، به صفحه لاگین ریدایرکت شود
    if (!isAuthenticated) {
        return <Navigate to={`/${lang}/login`} state={{ from: location }} replace />;
    }

    // اگر لاگین بود، محتوای صفحه (مثل AccountOverview) نمایش داده شود
    return <Outlet />;
};

export default ProtectedRoute;