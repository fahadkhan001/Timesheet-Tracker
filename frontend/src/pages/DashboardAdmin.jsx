import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Fade,
  Grow,
  IconButton,
  CssBaseline,
  Tooltip,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LogoutIcon from "@mui/icons-material/Logout";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TimesheetAdmin from "./TimesheetAdmin";
import UsersList from "./UsersList";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#FFC107",
      dark: "#FFB300",
      contrastText: "#000",
    },
    background: {
      default: "#0f172a",
      paper: "rgba(30, 41, 59, 0.7)",
    },
    text: {
      primary: "#f1f5f9",
      secondary: "#94a3b8",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600, letterSpacing: "0.5px" },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
      },
    },
  },
});

const DashboardAdmin = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState("menu");
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const renderContent = () => {
    switch (currentView) {
      case "employees":
        return <UsersList />;
      case "timesheets":
        return <TimesheetAdmin />;
      default:
        return null;
    }
  };

  const getTitle = () => {
    if (currentView === "employees") return "Employee Management";
    if (currentView === "timesheets") return "Timesheet Reviews";
    return "Admin Dashboard";
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#0f172a",
          py: 4,
          position: "relative",
          overflow: "hidden",
          backgroundImage: `
            radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), 
            radial-gradient(at 50% 0%, hsla(225,39%,20%,1) 0, transparent 50%), 
            radial-gradient(at 100% 0%, hsla(339,49%,20%,1) 0, transparent 50%)
          `,
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Box
            sx={{
              mb: 5,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {currentView !== "menu" && (
                <IconButton
                  onClick={() => setCurrentView("menu")}
                  sx={{
                    color: "white",
                    backgroundColor: "rgba(255,255,255,0.1)",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>
              )}
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    background: "linear-gradient(45deg, #fff, #94a3b8)",
                    backgroundClip: "text",
                    textFillColor: "transparent",
                  }}
                >
                  {getTitle()}
                </Typography>
                <Typography variant="body1" sx={{ color: "text.secondary" }}>
                  {currentView === "menu"
                    ? "Welcome back, Administrator"
                    : "Manage system records"}
                </Typography>
              </Box>
            </Box>

            <Tooltip title="Logout">
              <Button
                variant="outlined"
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
                sx={{
                  borderColor: "rgba(239, 68, 68, 0.5)",
                  color: "#ef4444",
                  borderRadius: "12px",
                  "&:hover": {
                    borderColor: "#ef4444",
                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                  },
                }}
              >
                Logout
              </Button>
            </Tooltip>
          </Box>

          {currentView === "menu" && (
            <Fade in={true} timeout={600}>
              <Grid
                container
                spacing={4}
                sx={{ mt: 2 }}
                justifyContent="center"
                alignItems="center"
              >
                <Grid item xs={12} md={6}>
                  <Grow in={true} timeout={800}>
                    <Paper
                      onClick={() => setCurrentView("employees")}
                      elevation={0}
                      sx={{
                        p: 5,
                        height: "250px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 4,
                        cursor: "pointer",
                        background: "rgba(30, 41, 59, 0.6)",
                        backdropFilter: "blur(12px)",
                        border: "1px solid rgba(255, 255, 255, 0.05)",
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          transform: "translateY(-8px)",
                          background: "rgba(30, 41, 59, 0.8)",
                          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                          borderColor: "#3b82f6",
                        },
                      }}
                    >
                      <PeopleAltIcon
                        sx={{ fontSize: 80, color: "#3b82f6", mb: 2 }}
                      />
                      <Typography variant="h5" color="white" gutterBottom>
                        Employees
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        View users and manage access
                      </Typography>
                    </Paper>
                  </Grow>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Grow in={true} timeout={1200}>
                    <Paper
                      onClick={() => setCurrentView("timesheets")}
                      elevation={0}
                      sx={{
                        p: 5,
                        height: "250px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 4,
                        cursor: "pointer",
                        background: "rgba(30, 41, 59, 0.6)",
                        backdropFilter: "blur(12px)",
                        border: "1px solid rgba(255, 255, 255, 0.05)",
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          transform: "translateY(-8px)",
                          background: "rgba(30, 41, 59, 0.8)",
                          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                          borderColor: "#FFC107",
                        },
                      }}
                    >
                      <AssignmentIcon
                        sx={{ fontSize: 80, color: "#FFC107", mb: 2 }}
                      />
                      <Typography variant="h5" color="white" gutterBottom>
                        Timesheets
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Review and approve work logs
                      </Typography>
                    </Paper>
                  </Grow>
                </Grid>
              </Grid>
            </Fade>
          )}

          {currentView !== "menu" && (
            <Fade in={true} timeout={500}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  minHeight: "60vh",
                  borderRadius: 4,
                  background: "rgba(30, 41, 59, 0.6)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                }}
              >
                {renderContent()}
              </Paper>
            </Fade>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default DashboardAdmin;
