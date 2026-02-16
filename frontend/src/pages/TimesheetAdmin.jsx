import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Fade,
  Stack,
  Avatar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingIcon from "@mui/icons-material/Pending";
import RefreshIcon from "@mui/icons-material/Refresh";
import { fetchApi } from "../utils/fetchApi";

const TimesheetAdmin = () => {
  const [timesheets, setTimesheets] = useState([]);
  const [filteredTimesheets, setFilteredTimesheets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchName, setSearchName] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const loadTimesheets = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setLoading(true);
      setError("");
      const data = await fetchApi("timesheets", null, "GET", token);
      const list = Array.isArray(data) ? data : data.timesheets || [];
      const sortedList = list.sort(
        (a, b) => new Date(b.date) - new Date(a.date),
      );

      setTimesheets(sortedList);
      setFilteredTimesheets(sortedList);
    } catch (err) {
      setError(err.message || "Failed to fetch timesheets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTimesheets();
  }, []);

  useEffect(() => {
    let result = timesheets;

    if (searchName) {
      result = result.filter((t) =>
        t.user?.name?.toLowerCase().includes(searchName.toLowerCase()),
      );
    }

    if (filterDate) {
      result = result.filter((t) => t.date.startsWith(filterDate));
    }

    setFilteredTimesheets(result);
  }, [searchName, filterDate, timesheets]);

  const handleStatusChange = async (id, newStatus) => {
    const token = localStorage.getItem("token");

    const oldTimesheets = [...timesheets];
    const updatedList = timesheets.map((t) =>
      t._id === id ? { ...t, status: newStatus } : t,
    );
    setTimesheets(updatedList);

    try {
      await fetchApi(`timesheets/${id}`, { status: newStatus }, "PUT", token);
    } catch (err) {
      setTimesheets(oldTimesheets);
      setError("Failed to update status");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleClearFilters = () => {
    setSearchName("");
    setFilterDate("");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "#10b981";
      case "rejected":
        return "#ef4444";
      default:
        return "#f59e0b";
    }
  };

  const selectStyle = (status) => ({
    color: "#fff",
    backgroundColor: getStatusColor(status),
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "0.85rem",
    height: "32px",
    "& .MuiSvgIcon-root": { color: "#fff" },
    "& fieldset": { border: "none" },
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
  });

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" sx={{ color: "white", fontWeight: 700 }}>
          Timesheet Reviews
        </Typography>
        <Tooltip title="Refresh Data">
          <IconButton
            onClick={loadTimesheets}
            sx={{ color: "rgba(255,255,255,0.7)" }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {error && (
        <Fade in={true}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        </Fade>
      )}

      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          borderRadius: 3,
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <TextField
          placeholder="Search Employee..."
          variant="outlined"
          size="small"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          sx={{ flexGrow: 1, minWidth: "200px" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          type="date"
          size="small"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          sx={{ minWidth: "150px" }}
        />

        {(searchName || filterDate) && (
          <Tooltip title="Clear Filters">
            <IconButton
              onClick={handleClearFilters}
              size="small"
              sx={{ color: "#ef4444", bgcolor: "rgba(239,68,68,0.1)" }}
            >
              <FilterAltOffIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Paper>

      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: "transparent",
          boxShadow: "none",
          maxHeight: "600px",
        }}
      >
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <Table
            stickyHeader
            sx={{ borderCollapse: "separate", borderSpacing: "0 8px" }}
          >
            <TableHead>
              <TableRow>
                {["Employee", "Date", "Task Details", "Hours", "Status"].map(
                  (head) => (
                    <TableCell
                      key={head}
                      sx={{
                        backgroundColor: "rgba(15, 23, 42, 0.8)",
                        color: "text.secondary",
                        fontWeight: 700,
                        borderBottom: "none",
                        backdropFilter: "blur(5px)",
                      }}
                    >
                      {head}
                    </TableCell>
                  ),
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTimesheets.length > 0 ? (
                filteredTimesheets.map((row) => (
                  <TableRow
                    key={row._id}
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.03)",
                      transition: "0.2s",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                      },
                    }}
                  >
                    <TableCell sx={{ borderBottom: "none", color: "white" }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: "primary.main",
                            color: "#000",
                            fontSize: "0.9rem",
                            fontWeight: "bold",
                          }}
                        >
                          {row.user?.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {row.user?.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {row.user?.email}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    <TableCell
                      sx={{ borderBottom: "none", color: "text.secondary" }}
                    >
                      <Stack direction="row" alignItems="center" gap={1}>
                        <CalendarMonthIcon fontSize="small" />
                        {new Date(row.date).toLocaleDateString()}
                      </Stack>
                    </TableCell>

                    <TableCell
                      sx={{
                        borderBottom: "none",
                        color: "white",
                        maxWidth: "250px",
                      }}
                    >
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        color="primary.main"
                      >
                        {row.taskName}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                          display: "block",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {row.description || "No description"}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ borderBottom: "none", color: "white" }}>
                      <Chip
                        label={`${row.hours}h`}
                        size="small"
                        sx={{
                          bgcolor: "rgba(255,255,255,0.1)",
                          color: "white",
                          fontWeight: "bold",
                        }}
                      />
                    </TableCell>

                    <TableCell sx={{ borderBottom: "none" }}>
                      <Select
                        value={row.status || "pending"}
                        onChange={(e) =>
                          handleStatusChange(row._id, e.target.value)
                        }
                        size="small"
                        sx={selectStyle(row.status || "pending")}
                      >
                        <MenuItem value="pending">
                          <Stack direction="row" gap={1} alignItems="center">
                            <PendingIcon fontSize="small" /> Pending
                          </Stack>
                        </MenuItem>
                        <MenuItem value="approved">
                          <Stack direction="row" gap={1} alignItems="center">
                            <CheckCircleIcon fontSize="small" /> Approved
                          </Stack>
                        </MenuItem>
                        <MenuItem value="rejected">
                          <Stack direction="row" gap={1} alignItems="center">
                            <CancelIcon fontSize="small" /> Rejected
                          </Stack>
                        </MenuItem>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{
                      color: "text.secondary",
                      py: 5,
                      borderBottom: "none",
                    }}
                  >
                    <Typography variant="h6">No records found</Typography>
                    <Typography variant="body2">
                      Try adjusting the filters
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Box>
  );
};

export default TimesheetAdmin;
