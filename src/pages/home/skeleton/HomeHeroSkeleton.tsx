import { Box, Grid, Skeleton, useTheme } from "@mui/material";

const HomeHeroSkeleton = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        minHeight: { xs: 'auto', md: '80vh' },
        flexDirection: { xs: "column", md: 'row' },
        width: '100%',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        px: { xs: 2, md: 4 },
        py: { xs: 4, md: 0 },
      }}
    >
      {/* بخش متون اسکلتون (سمت چپ/بالا) */}
      <Grid
        sx={{
          justifyContent: 'center',
          alignItems: { xs: 'center', md: 'flex-start' },
          display: 'flex',
          flexDirection: 'column',
          width: { xs: '100%', md: '35%' },
        }}
      >
        {/* اسکلتون مربوط به تایتل  */}
        <Box sx={{ width: '100%', maxWidth: '400px', mb: 2 }}>
          <Skeleton 
            animation="wave" 
            variant="text" 
            sx={{ fontSize: '3rem', width: '85%', bgcolor: 'rgba(0,0,0,0.08)' }} 
          />
        </Box>

        {/* اسکلتون مربوط به ساب‌تایتل */}
        <Box sx={{ width: '100%', maxWidth: '450px', mb: 4 }}>
          <Skeleton 
            animation="wave" 
            variant="text" 
            sx={{ fontSize: '1.2rem', width: '100%', bgcolor: 'rgba(0,0,0,0.06)' }} 
          />
        </Box>

        {/* اسکلتون دکمه  */}
        <Skeleton 
          animation="wave" 
          variant="rounded" 
          width={180} 
          height={48} 
          sx={{ borderRadius: 10, bgcolor: 'rgba(0,0,0,0.08)' }} 
        />
      </Grid>

      {/* بخش اسلایدر اسکلتون (سمت راست/پایین) */}
      <Grid
        sx={{
          width: { xs: "100%", md: "55%" },
          height: { xs: '40vh', md: '55vh' },
          my: { xs: 4, md: 'auto' },
        }}
      >
        <Skeleton
          animation="wave"
          variant="rounded"
          width="100%"
          height="100%"
          sx={{
            borderRadius: '20px',
            transform: 'none',
            bgcolor: 'rgba(0,0,0,0.08)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)',
          }}
        />
      </Grid>
    </Box>
  );
};

export default HomeHeroSkeleton;