import  { useState, type MouseEvent } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
    Button,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const LanguageSwitcher = () => {
    const { lang } = useParams<{ lang: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLanguageChange = (newLang: "fa" | "en") => {
        handleClose();
        if (newLang === lang) return;

        const currentPath = location.pathname;
        const newPath = currentPath.replace(`/${lang}`, `/${newLang}`);

        navigate(newPath);
    };

    return (
        <>
            <Button
                id="language-button"
                onClick={handleClick}
                startIcon={<LanguageIcon />}
                endIcon={<KeyboardArrowDownIcon />}
                color="inherit"
                variant="outlined"
                sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 700,
                    borderColor: "divider",
                    display:'flex',
                    alignItems:'center',
                    mr:1
                }}
            >
                {lang === "en" ? "English" : "فارسی"}
            </Button>

            <Menu
                id="language-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: lang === "fa" ? "right" : "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: lang === "fa" ? "right" : "left",
                }}
            >
                <MenuItem
                    selected={lang === "fa"}
                    onClick={() => handleLanguageChange("fa")}
                    sx={{ minWidth: 100 }}
                >
                    <ListItemIcon sx={{ fontSize: "1.2rem", fontWeight: 700 }}>
                        🇮🇷
                    </ListItemIcon>
                    <ListItemText primary="فارسی" />
                </MenuItem>

                <MenuItem
                    selected={lang === "en"}
                    onClick={() => handleLanguageChange("en")}
                    sx={{ minWidth: 100 }}
                >
                    <ListItemIcon sx={{ fontSize: "1.2rem", fontWeight: 700 }}>
                        🇬🇧
                    </ListItemIcon>
                    <ListItemText primary="English" />
                </MenuItem>
            </Menu >
        </>
    );
};

export default LanguageSwitcher;