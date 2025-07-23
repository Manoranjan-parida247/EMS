import React, { useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Box } from '@mui/material';
import { useLayoutContext } from '../../context/useLayoutContext';
import { useMediaQuery, useTheme } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
const drawerWidthOpen = 240;
const drawerWidthClosed = 64;

const navigation = [
  // { name: 'Dashboard', href: '/dashboard', icon: <Home /> },
  { name: 'Employees', href: '/employees', icon: <GroupIcon /> },
  { name: 'Add Employee', href: '/employees/new', icon: <PersonAddIcon /> },
  // { name: 'Settings', href: '/settings', icon: <Settings /> },
];

const Sidebar = () => {
  const { sidebarOpen, setSidebarOpen } = useLayoutContext();
  const theme = useTheme();
  const isSidebarAvailable = useMediaQuery(theme.breakpoints.down('xl'));
  const navigate = useNavigate();
  useEffect(() => {
    if (isSidebarAvailable && sidebarOpen) {
      setSidebarOpen(false);
    }
  }, [isSidebarAvailable, sidebarOpen]); 


  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      open={sidebarOpen}
      sx={{
        width: sidebarOpen ? drawerWidthOpen : drawerWidthClosed,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: sidebarOpen ? drawerWidthOpen : drawerWidthClosed,
          boxSizing: 'border-box',
          transition: 'width 0.3s',
          overflowX: 'hidden',
          borderRight: '1px solid #e0e0e0',
          bgcolor: 'background.paper',
        },
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: sidebarOpen ? 'flex-start' : 'center',
          alignItems: 'center',
          height: '64px',
          px: 2,
          borderBottom: '1px solid #e0e0e0',
          // bgcolor:"red"
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            sx={{
              height: 32,
              width: 32,
              bgcolor: 'primary.main',
              borderRadius: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor:"pointer"
            }}
            
          >
            <GroupIcon onClick={()=> navigate('/employees')} size={16} color='#fff' />
          </Box>
          {sidebarOpen && (
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              EMS
            </Typography>
          )}
        </Box>
      </Toolbar>

      <List sx={{ mt: 1  }}>
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;

          return (
            <ListItem key={item.name} disablePadding sx={{ display: 'block' }}>
              <NavLink to={item.href} style={{ textDecoration: 'none' }}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: sidebarOpen ? 'initial' : 'center',
                    px: 2.5,
                    backgroundColor: isActive ? 'action.selected' : 'inherit',
                    color: isActive ? 'primary.main' : 'text.secondary',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: sidebarOpen ? 2 : 'auto',
                      justifyContent: 'center',
                      color: isActive ? 'primary.main' : 'inherit',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {sidebarOpen && <ListItemText sx={{fontWeight:"bold"}} primary={item.name} />}
                </ListItemButton>
              </NavLink>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;
