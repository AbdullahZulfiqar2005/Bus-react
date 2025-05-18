import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  useTheme,
  IconButton,
  Paper,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  LocationOn as LocationIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { toast } from 'react-toastify';
import MapView from '../MapView';

const drawerWidth = 240;

const Dashboard = ({ darkMode, setDarkMode }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, view: 'dashboard' },
    { text: 'Live Tracking', icon: <LocationIcon />, view: 'tracking' },
    { text: 'Settings', icon: <SettingsIcon />, view: 'settings' },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <Paper elevation={3} sx={{ p: 3, height: 'calc(100vh - 100px)' }}>
            <Typography variant="h5" gutterBottom>Dashboard Overview</Typography>
            <Typography variant="body1">
              Welcome to the Bus Tracking System Dashboard. Here you can monitor all bus activities.
            </Typography>
          </Paper>
        );
      case 'tracking':
        return <MapView />;
      case 'settings':
        return (
          <Paper elevation={3} sx={{ p: 3, height: 'calc(100vh - 100px)' }}>
            <Typography variant="h5" gutterBottom>Settings</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                  icon={<LightModeIcon />}
                  checkedIcon={<DarkModeIcon />}
                />
              }
              label={darkMode ? "Dark Mode" : "Light Mode"}
            />
          </Paper>
        );
      default:
        return <MapView />;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap component="div">
            Bus Tracking System
          </Typography>
          <IconButton color="inherit" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', p: 2 }}>
          {user && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={user.photoURL}
                alt={user.displayName}
                sx={{ width: 64, height: 64, mb: 1 }}
              />
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {user.displayName || user.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
          )}
          <Divider sx={{ my: 2 }} />
          <List>
            {menuItems.map((item) => (
              <ListItem 
                button 
                key={item.text}
                onClick={() => handleViewChange(item.view)}
                selected={activeView === item.view}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.08)' 
                      : 'rgba(0, 0, 0, 0.04)',
                    '& .MuiListItemIcon-root': {
                      color: theme.palette.primary.main,
                    },
                    '& .MuiListItemText-primary': {
                      color: theme.palette.primary.main,
                    },
                  },
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.12)'
                      : 'rgba(0, 0, 0, 0.08)',
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.16)'
                        : 'rgba(0, 0, 0, 0.12)',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ 
                  color: activeView === item.view ? theme.palette.primary.main : 'inherit',
                  transition: 'color 0.2s',
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{
                    color: activeView === item.view ? theme.palette.primary.main : 'inherit',
                    transition: 'color 0.2s',
                  }}
                />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          <List>
            <ListItem 
              button 
              onClick={handleLogout}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.08)' 
                    : 'rgba(0, 0, 0, 0.04)',
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.error.main,
                  },
                  '& .MuiListItemText-primary': {
                    color: theme.palette.error.main,
                  },
                },
              }}
            >
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
};

export default Dashboard; 