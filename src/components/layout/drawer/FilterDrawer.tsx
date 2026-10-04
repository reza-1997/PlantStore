import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, IconButton, InputLabel, MenuItem, Select, Typography, type SelectChangeEvent } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState, type ChangeEvent } from 'react';
import { RiCloseLargeFill } from 'react-icons/ri';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import type { FilterState } from '../../../types';
import { filtering } from '../../../utils/productFilters';

type Prop = {
    openDrawer: boolean,
    toggleDrawer: (open: boolean) => () => void,
    sortBy: string,
    handleChangeSorting: (event: SelectChangeEvent) => void,
    filter: FilterState,
    deleteFilter: () => void,
    handleChangeFiltering: (event: ChangeEvent<HTMLInputElement>, category: keyof FilterState) => void
}

const FilterDrawer = ({ toggleDrawer, openDrawer, sortBy, handleChangeSorting, filter, handleChangeFiltering, deleteFilter }: Prop) => {

    const { t } = useTranslation()
    const { lang } = useParams<{ lang: 'fa' | 'en' }>();

    // handle accordion
    const [expanded, setExpanded] = useState<string[]>([])
    const handleExpansion = (id: string) => {
        setExpanded(prev => prev.includes(id) ? prev.filter((pre) => pre !== id) : [...prev, id]);
    };

    return (
        <Drawer
            open={openDrawer}
            onClose={toggleDrawer(false)}
            anchor={lang === "fa" ? 'left' : "left"}
            dir={lang === 'fa' ? 'rtl' : 'ltr'}
            slotProps={{
                paper: {
                    sx: {
                        width: { xs: "100%", sm: 450 },
                        borderRadius: { xs: 0, sm: "0 16px 16px 0" },
                        height: "100%",
                        display: "flex",
                        flexDirection: "column"
                    },
                },
            }}
            sx={{ display: { xs: "flex", md: "none" } }}
        >
            <Box sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                px: 3,
                py: 2,
                boxSizing: 'border-box'
            }}>

                {/* header */}
                <Box
                    sx={{
                        width: '100%',
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 4
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 800,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        {t("filter.label")}
                    </Typography>
                    <IconButton onClick={toggleDrawer(false)}>
                        <RiCloseLargeFill size={22} />
                    </IconButton>
                </Box>

                {/* sort & filter */}
                <Box sx={{
                    flex: 1,
                    overflowY: 'auto',
                    pr: 0.5,
                    '&::-webkit-scrollbar': { width: '4px' },
                    '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '4px' }
                }}>

                    {/* sort by */}
                    <Box sx={{ width: '100%', my: 3 }}>
                        <FormControl fullWidth>
                            <InputLabel> {t("sort.label")} </InputLabel>
                            <Select
                                value={sortBy}
                                onChange={handleChangeSorting}
                                label={t("sort.label")}
                            >
                                <MenuItem value="popular">{t('sort.popular')}</MenuItem>
                                <MenuItem value="inStock">{t('sort.inStock')}</MenuItem>
                                <MenuItem value="inexpensive">{t('sort.inexpensive')}</MenuItem>
                                <MenuItem value="expensive">{t('sort.expensive')}</MenuItem>
                                <MenuItem value="newest" disabled>{t('sort.newest')}</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    {/* filter accordions */}
                    <Box
                        sx={{
                            width: '100%',
                            pb: 4,
                            '& .MuiPaper-root': {
                                backgroundColor: 'unset',
                                backgroundImage: 'none',
                                boxShadow: 'none'
                            }
                        }}
                    >
                        {filtering.map((item) => (
                            <Accordion
                                expanded={expanded.includes(item.key)}
                                onChange={() => handleExpansion(item.key)}
                                key={item.key}
                            >
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography sx={{ my: 0.5 }} component="span">{item.name[lang || 'fa']}</Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ pt: 0 }}>
                                    {item.options.map((option, index) => (
                                        <FormGroup key={index}>
                                            <FormControlLabel
                                                control={<Checkbox
                                                    value={option.value}
                                                    checked={filter[item.key].includes(option.value)}
                                                    onChange={(e) => handleChangeFiltering(e, item.key)}
                                                />}
                                                label={option.name[lang || 'fa']}
                                            />
                                        </FormGroup>
                                    ))}
                                </AccordionDetails>
                            </Accordion>
                        ))}

                        <Button
                            variant="outlined"
                            onClick={() => { deleteFilter(); setExpanded([]) }}
                            sx={{ mt: 3, p: 1.5, fontWeight: 700 }}
                            fullWidth
                        >
                            {t("filter.resetFilter")}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Drawer>
    );
}

export default FilterDrawer;