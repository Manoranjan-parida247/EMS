import React from 'react';
import { Box, Grid, Skeleton } from '@mui/material';

const EmployeeDetailsShimmer = () => {
  return (
    <Box sx={{ p: 2 }}>
      {/* Back button shimmer */}
      <Skeleton 
        variant="rectangular" 
        width={200} 
        height={40} 
        sx={{ mb: 2, borderRadius: 1 }} 
      />
      
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          
          {/* Profile header shimmer */}
          <Grid size={{ xs: 12, md: 12 }} sx={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px", p: 2 }}>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row", md: "row" }, alignItems: "center", gap: 2 }}>
              <Box>
                <Skeleton variant="circular" width={100} height={100} />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
                  <Skeleton variant="text" width={250} height={48} />
                  <Skeleton variant="rounded" width={80} height={32} sx={{ borderRadius: 4 }} />
                  <Skeleton variant="rounded" width={70} height={32} sx={{ borderRadius: 4 }} />
                </Box>
                <Box>
                  <Skeleton variant="text" width={300} height={32} />
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 1 }} />
                  <Skeleton variant="rectangular" width={150} height={40} sx={{ borderRadius: 1 }} />
                  <Skeleton variant="rectangular" width={130} height={40} sx={{ borderRadius: 1 }} />
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Employee Information shimmer */}
          <Grid size={{ md: 8 }} sx={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px", p: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="text" width={250} height={40} />
            </Box>
            <Grid container spacing={2}>
              {/* Create 8 information fields to match your original layout */}
              {Array.from({ length: 8 }, (_, index) => (
                <Grid size={{ xs: 6, md: 6 }} key={index}>
                  <Box sx={{ pb: 3 }}>
                    <Skeleton variant="text" width={100} height={20} sx={{ mb: 1 }} />
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Skeleton variant="circular" width={20} height={20} />
                      <Skeleton variant="text" width={180} height={28} />
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Emergency Contact shimmer */}
          <Grid size={{ xs: 12, md: 4 }} sx={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px", p: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="text" width={200} height={40} />
            </Box>
            <Grid container spacing={2}>
              {Array.from({ length: 3 }, (_, index) => (
                <Grid size={{ xs: 6, md: 12 }} key={index}>
                  <Box sx={{ mb: 2 }}>
                    <Skeleton variant="text" width={80} height={20} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width={150} height={28} />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Skills  shimmer */}
          <Grid size={{ xs: 12, md: 12 }} sx={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px", p: 2 }}>
            <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {Array.from({ length: 8 }, (_, index) => (
                <Skeleton 
                  key={index}
                  variant="rounded" 
                  width={Math.floor(Math.random() * 80) + 60} // Random width between 60-140px
                  height={32}
                  sx={{ borderRadius: '16px' }}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default EmployeeDetailsShimmer;