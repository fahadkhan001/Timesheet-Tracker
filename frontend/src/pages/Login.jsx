import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Button,
  CssBaseline,
  TextField,
  Link,
  Box,
  Typography,
  Container,
  Paper,
  CircularProgress,
  InputAdornment,
  IconButton,
  Alert,
  Fade,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import EmailIcon from "@mui/icons-material/Email";
import KeyIcon from "@mui/icons-material/Key";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { fetchApi } from "../utils/fetchApi";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FFC107",
      dark: "#FFB300",
      contrastText: "#1e1e1e",
    },
    secondary: {
      main: "#414141",
    },
    background: {
      default: "#0f172a",
      paper: "#ffffff",
    },
    text: {
      primary: "#1e293b",
      secondary: "#64748b",
    },
  },
  shape: {
    borderRadius: 5,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 700,
      letterSpacing: "-0.5px",
    },
    button: {
      fontWeight: 600,
      textTransform: "none",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#f8fafc",
            "& fieldset": { borderColor: "#e2e8f0" },
            "&:hover fieldset": { borderColor: "#cbd5e1" },
            "&.Mui-focused fieldset": { borderColor: "#FFC107" },
          },
        },
      },
    },
  },
});

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
    }
    
    if (error) setError("");
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const validateForm = () => {
    let isValid = true;
    const errors = { email: "", password: "" };

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!emailPattern.test(formData.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return; 
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetchApi("auth/login", formData, "POST");

      localStorage.setItem("user", JSON.stringify(response));
      if (response.token) {
        localStorage.setItem("token", response.token);
      }

      const role = response.role?.toLowerCase();

      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "employee") {
        navigate("/employee/timesheet");
      } else {
        setError("Login successful, but no role assigned. Contact Admin.");
      }
    } catch (err) {
      if (err.message && err.message.includes("Unexpected token")) {
        setError(
          "Server Error: The API URL seems incorrect (received HTML instead of JSON). Check your BASE_URL port."
        );
      } else {
        setError(err.message || "Invalid credentials. Please try again.");
      }
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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          padding: 2,
        }}
      >
        <Container component="main" maxWidth="xs">
          <Fade in={true} timeout={800}>
            <Paper
              elevation={24}
              sx={{
                padding: { xs: 3, sm: 5 },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "rgba(255, 255, 255, 0.98)",
                backdropFilter: "blur(20px)",
                borderRadius: 4,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box 
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '6px',
                  background: 'linear-gradient(90deg, #FFC107 0%, #FF8F00 100%)'
                }}
              />

              <Typography component="h1" variant="h5" sx={{ mt: 1 }}>
                Welcome Back
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Enter your credentials to continue
              </Typography>

              {error && (
                <Alert severity="error" sx={{ width: "100%", mb: 2, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ width: "100%" }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  error={!!fieldErrors.email}
                  helperText={fieldErrors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color={fieldErrors.email ? "error" : "action"} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  error={!!fieldErrors.password}
                  helperText={fieldErrors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <KeyIcon color={fieldErrors.password ? "error" : "action"} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    mt: 4,
                    mb: 2,
                    py: 1.8,
                    fontSize: "1rem",
                    borderRadius: 2,
                    background: "linear-gradient(45deg, #FFC107 30%, #FFB300 90%)",
                    boxShadow: "0 4px 14px 0 rgba(255, 193, 7, 0.39)",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      background: "linear-gradient(45deg, #FFB300 30%, #FFA000 90%)",
                      boxShadow: "0 6px 20px rgba(255, 193, 7, 0.23)",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={26} color="inherit" />
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <Box sx={{ textAlign: "center", mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Don't have an account?{" "}
                    <Link
                      component={RouterLink}
                      to="/register"
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: "primary.dark",
                        textDecoration: "none",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      Sign up now
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Fade>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Login;