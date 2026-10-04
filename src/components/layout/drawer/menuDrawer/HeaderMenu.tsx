import { IconButton} from "@mui/material"
import { Box } from "@mui/system"
import { Link, useParams } from "react-router-dom"
import { RiCloseLargeFill } from "react-icons/ri"
import { getImageUrl } from "../../../../utils/imageUrl"

export type prop = {
    toggleDrawer: (open: boolean) => () => void
}

const HeaderDrawer = ({ toggleDrawer }: prop) => {

    const { lang } = useParams<{ lang: string }>()


    return (

        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                pr: 1,
                pl: 0,
                pt: 1.5,
                mb: 1
            }}
        >
            <Box
                component={Link}
                to={`/${lang}`}
                sx={{
                    textDecoration: "none",
                }}
                onClick={toggleDrawer(false)}
            >
                <img src={getImageUrl("logo2.png")}
                    alt="logo"
                    height={100}
                    width={270}
                    style={{ objectFit: 'cover' }}

                />
                {/* <Typography component="span" variant="h6" sx={{ fontWeight: 800 }} >
                    {t("navbar.title")}
                </Typography> */}
            </Box>
            <IconButton onClick={toggleDrawer(false)}>
                <RiCloseLargeFill size={25} />
            </IconButton>
        </Box>
    )
}
export default HeaderDrawer