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
  Card,
  CardContent,
  Grid,
  Button,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  LocationOn as LocationIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  DirectionsBus as BusIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { toast } from 'react-toastify';
import MapView from '../MapView';

const drawerWidth = 240;

// Sample routes data
const sampleRoutes = [
  {
    id: 1,
    name: "Downtown Express",
    description: "Fast service between downtown and business district",
    stops: ["Central Station", "Business Park", "City Center"],
    status: "Active"
  },
  {
    id: 2,
    name: "University Line",
    description: "Connects main campus with student housing",
    stops: ["Main Campus", "Student Village", "Library"],
    status: "Active"
  },
  {
    id: 3,
    name: "Airport Shuttle",
    description: "Direct service to and from the airport",
    stops: ["City Center", "Airport Terminal 1", "Airport Terminal 2"],
    status: "Active"
  },
  {
    id: 4,
    name: "Shopping Mall Route",
    description: "Connects major shopping centers",
    stops: ["West Mall", "East Mall", "Central Market"],
    status: "Active"
  },
  {
    id: 5,
    name: "Hospital Line",
    description: "Service to major medical centers",
    stops: ["General Hospital", "Medical Center", "Clinic"],
    status: "Active"
  },
  {
    id: 6,
    name: "Your Route Name",
    description: "Your route description",
    stops: ["Stop 1", "Stop 2", "Stop 3"],
    status: "Active"
  }
];

const Dashboard = ({ darkMode, setDarkMode }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedRoute, setSelectedRoute] = useState(null);

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
    if (view !== 'tracking') {
      setSelectedRoute(null);
    }
  };

  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
    setActiveView('tracking');
    toast.success(`Now tracking: ${route.name}`);
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
          <Paper elevation={3} sx={{ p: 3, height: 'calc(100vh - 100px)', overflow: 'auto' }}>
            <Typography variant="h5" gutterBottom>Available Routes</Typography>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {sampleRoutes.map((route) => (
                <Grid item xs={12} sm={6} md={4} key={route.id}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[8],
                        cursor: 'pointer',
                      },
                    }}
                    onClick={() => handleRouteSelect(route)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <BusIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                        <Typography variant="h6" component="div">
                          {route.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {route.description}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Stops:</strong> {route.stops.join(' → ')}
                      </Typography>
                      <Box sx={{ 
                        mt: 2, 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: theme.palette.success.main,
                            fontWeight: 'bold'
                          }}
                        >
                          {route.status}
                        </Typography>
                        <Button 
                          variant="outlined" 
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRouteSelect(route);
                          }}
                        >
                          Track Route
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        );
      case 'tracking':
        return (
          <Box sx={{ height: 'calc(100vh - 100px)' }}>
            {selectedRoute && (
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 2, 
                  mb: 2, 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Box>
                  <Typography variant="h6">
                    Currently Tracking: {selectedRoute.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedRoute.description}
                  </Typography>
                </Box>
                <Button 
                  variant="outlined" 
                  onClick={() => setActiveView('dashboard')}
                >
                  Back to Routes
                </Button>
              </Paper>
            )}
            <MapView />
          </Box>
        );
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