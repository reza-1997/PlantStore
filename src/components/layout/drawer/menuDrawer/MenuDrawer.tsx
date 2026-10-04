import Drawer from '@mui/material/Drawer';
import { useEffect, useState } from 'react';
import HeaderDrawer from './HeaderMenu';
import SubMenu from './SubMenu';
import MainMenu from './MainMenu';
import { useParams } from 'react-router-dom';



type Prop = {
    openDrawer: boolean,
    toggleDrawer: (open: boolean) => () => void
}
export interface SelectedMenu {
    id: string,
    name: string,
}

const MenuDrawer = ({ toggleDrawer, openDrawer }: Prop) => {

    const [selectedMenu, setSelectedMenu] = useState<SelectedMenu | null>(null)
    const { lang } = useParams<{ lang: string }>();


    useEffect(() => {
        if (!openDrawer) {
            setSelectedMenu(null)
        }
    }, [openDrawer])


    return (
        <div>

            <Drawer open={openDrawer} onClose={toggleDrawer(false)}
                anchor={lang === "fa" ? 'left' : "left"}
                dir={lang === 'fa' ? 'rtl' : 'ltr'}
                slotProps={{
                    paper: {
                        sx: {
                            width: { xs: "100%", sm: 450 },
                            borderRadius: "0 16px 16px 0",
                        },
                    },
                }}
                sx={{ display: { xs: "flex", md: "none" } }}
            >
                <HeaderDrawer toggleDrawer={toggleDrawer} />

                {selectedMenu === null ?
                    <MainMenu setSelectedMenu={setSelectedMenu} />
                    :
                    <SubMenu selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} toggleDrawer={toggleDrawer} />
                }


            </Drawer>
        </div>
    );
}

export default MenuDrawer