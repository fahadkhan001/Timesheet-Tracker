import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Fade,
  InputAdornment,
  Tooltip,
  Stack,
  CssBaseline,
  Grow,
  IconButton
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import DescriptionIcon from "@mui/icons-material/Description";
import WorkIcon from "@mui/icons-material/Work";
import LogoutIcon from "@mui/icons-material/Logout";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { fetchApi } from "../utils/fetchApi";

const theme = createTheme({
  palette: {
    mode: 'dark', 
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
    success: { main: "#10b981" },
    error: { main: "#ef4444" },
    warning: { main: "#f59e0b" },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600, letterSpacing: '0.5px' },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: "#6b7280 #1e293b",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: "transparent",
            width: "8px",
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: "#6b7280",
            minHeight: 24,
            border: "2px solid #1e293b",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderRadius: "12px",
            transition: "all 0.3s ease",
            "& fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
            "&:hover": { 
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" } 
            },
            "&.Mui-focused": { 
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                "& fieldset": { borderColor: "#FFC107", borderWidth: "1px" },
                boxShadow: "0 0 0 4px rgba(255, 193, 7, 0.1)"
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        }
      }
    }
  },
});

const TimesheetEmployee = () => {
  const navigate = useNavigate();
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", content: "" });
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    taskName: "",
    hours: "",
    description: "",
  });

  const getTodayDate = () => new Date().toISOString().split("T")[0];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "success";
      case "rejected":
        return "error";
      default:
        return "warning";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const loadTimesheets = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMsg({ type: "error", content: "Not Authorized. Please login." });
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    try {
      setLoading(true);
      const data = await fetchApi("timesheets", null, "GET", token);
      const list = Array.isArray(data) ? data : data.timesheets || [];
      setTimesheets(list.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (error) {
      if (
        error.message.includes("401") ||
        error.message.includes("Authorized")
      ) {
        handleLogout();
      }
      setMsg({
        type: "error",
        content: error.message || "Failed to load timesheets.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTimesheets();
  }, []);

  useEffect(() => {
    if (msg.content) {
      const timer = setTimeout(() => {
        setMsg({ type: "", content: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [msg]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: "", content: "" });

    const token = localStorage.getItem("token");
    if (!token) {
      handleLogout();
      return;
    }

    if (!formData.taskName || !formData.hours || !formData.date) {
      setMsg({ type: "error", content: "Please fill in all required fields." });
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        hours: Number(formData.hours),
      };

      await fetchApi("timesheets", payload, "POST", token);
      setMsg({ type: "success", content: "Timesheet submitted successfully!" });

      setFormData({
        date: getTodayDate(),
        taskName: "",
        hours: "",
        description: "",
      });

      loadTimesheets();
    } catch (error) {
      setMsg({ type: "error", content: error.message || "Operation failed." });
    } finally {
      setLoading(false);
    }
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
          "&::before": {
            content: '""',
            position: "absolute",
            top: "-10%",
            left: "-10%",
            width: "40%",
            height: "40%",
            background: "radial-gradient(circle, rgba(255,193,7,0.15) 0%, rgba(0,0,0,0) 70%)",
            filter: "blur(60px)",
            zIndex: 0,
          }
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
            <Box>
              <Typography 
                variant="h4" 
                sx={{ 
                    fontWeight: 800, 
                    background: "linear-gradient(45deg, #fff, #94a3b8)",
                    backgroundClip: "text",
                    textFillColor: "transparent",
                    mb: 0.5
                }}
              >
                My Timesheet
              </Typography>
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                Track and manage your daily efforts
              </Typography>
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
                  textTransform: 'none',
                  "&:hover": {
                    borderColor: "#ef4444",
                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                    boxShadow: "0 0 15px rgba(239, 68, 68, 0.3)"
                  },
                }}
              >
                Logout
              </Button>
            </Tooltip>
          </Box>

          {msg.content && (
            <Fade in={true} timeout={500}>
              <Alert 
                severity={msg.type} 
                variant="filled"
                sx={{ 
                    mb: 3, 
                    borderRadius: 3, 
                    boxShadow: '0 8px 20px rgba(0,0,0,0.2)' 
                }}
              >
                {msg.content}
              </Alert>
            </Fade>
          )}

          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 6,
              borderRadius: 4,
              border: "1px solid rgba(255, 255, 255, 0.1)",
              background: "rgba(30, 41, 59, 0.6)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            }}
          >
            <Box component="form" onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1 }}>
                <Typography variant="h6" color="text.primary">
                  New Entry
                </Typography>
              </Box>

              <Grid container spacing={3} alignItems="flex-start">
                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Date"
                    name="date"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ max: getTodayDate() }}
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Task Name"
                    name="taskName"
                    value={formData.taskName}
                    onChange={handleChange}
                    required
                    placeholder="e.g. API Development"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <WorkIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    label="Hours"
                    name="hours"
                    type="number"
                    inputProps={{ min: 0, step: 0.5 }}
                    value={formData.hours}
                    onChange={handleChange}
                    required
                    placeholder="0.0"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                            <Typography variant="caption" color="text.secondary">hr</Typography>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Brief details..."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DescriptionIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    type="submit"
                    disabled={loading}
                    sx={{ 
                        height: '56px',
                        borderRadius: "12px",
                        fontWeight: 700,
                        fontSize: '1rem',
                        boxShadow: '0 4px 14px rgba(255, 193, 7, 0.4)',
                        "&:hover": {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px rgba(255, 193, 7, 0.6)',
                        },
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Log Time"}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>

          <Box sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1 }}>
                <Typography
                variant="h5"
                sx={{ color: "white", fontWeight: 700, letterSpacing: 0.5 }}
                >
                Recent Activity
                </Typography>
                <Chip 
                    label={timesheets.length} 
                    size="small" 
                    sx={{ 
                        backgroundColor: 'rgba(255,255,255,0.1)', 
                        color: 'text.secondary', 
                        fontWeight: 700 
                    }} 
                />
            </Box>

            {loading && timesheets.length === 0 ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress size={60} thickness={4} sx={{ color: "primary.main" }} />
              </Box>
            ) : (
              <Stack spacing={2}>
                {timesheets.map((item, index) => (
                  <Grow 
                    in={true} 
                    key={item._id} 
                    timeout={(index + 1) * 200}
                    style={{ transformOrigin: 'center top' }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        borderRadius: 3,
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                        flexWrap: "wrap",
                        background: "rgba(30, 41, 59, 0.4)",
                        border: "1px solid rgba(255, 255, 255, 0.05)",
                        transition: "all 0.3s ease",
                        position: 'relative',
                        overflow: 'hidden',
                        "&:hover": {
                          background: "rgba(30, 41, 59, 0.8)",
                          transform: "translateY(-4px)",
                          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                          borderColor: "rgba(255, 255, 255, 0.1)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: "6px",
                          backgroundColor: 
                            item.status?.toLowerCase() === "approved" ? "#10b981" : 
                            item.status?.toLowerCase() === "rejected" ? "#ef4444" : 
                            "#f59e0b",
                        }}
                      />

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 120 }}>
                        <CalendarMonthIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                            {new Date(item.date).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            })}
                        </Typography>
                      </Box>

                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 700, minWidth: 160, color: '#fff' }}
                      >
                        {item.taskName}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          flex: 1,
                          color: "text.secondary",
                          minWidth: 200,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {item.description || "No description provided"}
                      </Typography>

                      <Chip 
                        icon={<AccessTimeFilledIcon sx={{ fontSize: "16px !important" }} />}
                        label={`${item.hours}h`}
                        sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            color: 'text.primary',
                            fontWeight: 900,
                            fontSize: "1rem",
                            border: '1px solid rgba(255,255,255,0.1)',
                            minWidth: 80
                        }}
                      />

                      <Chip
                        label={item.status?.toUpperCase()}
                        color={getStatusColor(item.status)}
                        variant={item.status?.toLowerCase() === 'pending' ? 'outlined' : 'filled'}
                        sx={{
                          fontWeight: 800,
                          minWidth: 100,
                          borderRadius: "8px",
                          fontSize: "1rem",
                          letterSpacing: 0.5,
                          height: 28
                        }}
                      />
                    </Paper>
                  </Grow>
                ))}
              </Stack>
            )}
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default TimesheetEmployee;