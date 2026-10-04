import { Box, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Skeleton, Typography } from "@mui/material"
import { RiArrowLeftLongLine, RiArrowRightLongLine } from "react-icons/ri"
import { useGetCategoriesQuery } from "../../../../api/PlantApi"
import type { SelectedMenu } from "./MenuDrawer"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"

type prop = {
    setSelectedMenu: React.Dispatch<React.SetStateAction<SelectedMenu | null>>
}

const MainMenu = ({ setSelectedMenu }: prop) => {
    const { t } = useTranslation()
    const { lang } = useParams<{ lang: 'fa' | 'en' }>();

    const { data: categories, isError, isLoading, isSuccess } = useGetCategoriesQuery();

    let content;
    if (isError) {
        content =
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }} >
                <Typography variant="h5" color="error">
                    {t("common.errorLabel")}
                </Typography>
            </Box>
    } else if (isLoading) {
        content =
            <Box sx={{ p: 2 }}>

                {[...Array(6)].map((_, index) => (
                    <Box key={index} sx={{ my: 2 }}>
                        <Skeleton animation="wave" variant="rounded" width="100%" height={48} />
                    </Box>
                ))}
            </Box>
    } else if (isSuccess) {

        content =
            <Box role="presentation" >

                <List sx={{
                    "& .MuiListItem-root": {
                        p: 0,
                        height: '7vh'
                    },
                }}  >{categories.map((item) => (

                    <ListItem
                        sx={{
                            width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'start',

                        }}
                        key={item.id} >
                        <ListItemButton sx={{ width: '100%', height: '100%' }}
                            onClick={() => {
                                setSelectedMenu({ id: item.id, name: item.name[lang || 'fa'] })
                            }}
                        >
                            <ListItemText sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center', height: '100%' }}
                                primary={item.name[lang || 'fa']} />
                            <ListItemIcon>
                                {lang === "fa" ? <RiArrowLeftLongLine /> : <RiArrowRightLongLine size={20} />}
                            </ListItemIcon>
                        </ListItemButton>
                        <Divider sx={{ width: '100%', p: 0, m: 0 }} />

                    </ListItem>


                ))}
                </List>
            </Box>

    }


    return (
        content

    )
}
export default MainMenu