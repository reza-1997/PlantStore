import { IconButton, type SxProps, type Theme } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useWishlist } from "../../hooks/useWishlist";
import AuthModal from "./AuthModal";
import type { Plant, Accessory } from "../../types";

interface WishlistButtonProps {
    item: Plant | Accessory;
    sx?: SxProps<Theme>;
    iconSize?: number;
}

const WishlistButton = ({ item, sx, iconSize = 30 }: WishlistButtonProps) => {
    const { isFavorite, handleWishlistClick, authModalOpen, setAuthModalOpen } =
        useWishlist(item);

    return (
        <>
            <IconButton
                onClick={handleWishlistClick}
                sx={{
                    color: "#01011dff",
                    "&:hover ": {
                        backgroundColor: 'unset',
                        color: "error.main"
                    },
                    ...sx,
                }}
            >
                {!isFavorite ? (
                    <FavoriteBorderIcon sx={{ fontSize: iconSize }} />
                ) : (
                    <FavoriteIcon sx={{ fontSize: iconSize, color: "error.main" }} />
                )}
            </IconButton>

            {/*open modal login*/}
            <AuthModal
                open={authModalOpen}
                onClose={() => setAuthModalOpen(false)}
            />
        </>
    );
};

export default WishlistButton;