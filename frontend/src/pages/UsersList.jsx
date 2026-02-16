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
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  Fade,
  Stack,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useTheme,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import BadgeIcon from "@mui/icons-material/Badge";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import WarningIcon from "@mui/icons-material/Warning";
import { fetchApi } from "../utils/fetchApi";

const UsersList = () => {
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const loadUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setLoading(true);
      setError("");
      const data = await fetchApi("users", null, "GET", token);
      const list = Array.isArray(data) ? data : data.users || [];
      setUsers(list);
    } catch (err) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (id, newRole) => {
    const token = localStorage.getItem("token");
    const oldUsers = [...users];
    const updatedList = users.map((u) =>
      u._id === id ? { ...u, role: newRole } : u,
    );
    setUsers(updatedList);

    try {
      await fetchApi(`users/${id}`, { role: newRole }, "PUT", token);
    } catch (err) {
      setUsers(oldUsers);
      setError("Failed to update role");
    }
  };

  const confirmDelete = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteExecute = async () => {
    if (!userToDelete) return;

    const token = localStorage.getItem("token");
    const oldUsers = [...users];

    setUsers(users.filter((u) => u._id !== userToDelete._id));
    setDeleteDialogOpen(false);

    try {
      await fetchApi(`users/${userToDelete._id}`, {}, "DELETE", token);
    } catch (err) {
      setUsers(oldUsers);
      setError("Failed to delete user");
    }
  };

  const UserTable = ({ data, isEditable, title, icon }) => (
    <Paper
      elevation={0}
      sx={{
        mb: 4,
        p: 0,
        backgroundColor: "rgba(30, 41, 59, 0.4)",
        border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 1,
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {icon}
        <Typography
          variant="h6"
          sx={{ color: "white", fontWeight: 700, fontSize: "1rem" }}
        >
          {title}
        </Typography>
        <Chip
          label={data.length}
          size="small"
          sx={{
            ml: 1,
            bgcolor: "rgba(255,255,255,0.1)",
            color: "text.secondary",
            fontWeight: "bold",
          }}
        />
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {[
                "User Profile",
                "Email",
                "Role",
                isEditable ? "Actions" : "",
              ].map(
                (head) =>
                  head && (
                    <TableCell
                      key={head}
                      sx={{
                        backgroundColor: "rgba(15, 23, 42, 0.4)",
                        color: "text.secondary",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: 1,
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      {head}
                    </TableCell>
                  ),
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length > 0 ? (
              data.map((row) => (
                <TableRow
                  key={row._id}
                  sx={{
                    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.04)" },
                    borderBottom: "1px solid rgba(255,255,255,0.02)",
                  }}
                >
                  <TableCell sx={{ borderBottom: "none", color: "white" }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        sx={{
                          bgcolor: isEditable
                            ? "primary.main"
                            : "secondary.main",
                          color: "#000",
                          fontWeight: "bold",
                          width: 35,
                          height: 35,
                        }}
                      >
                        {row.name?.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {row.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {row._id.slice(-6)}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>

                  <TableCell
                    sx={{ borderBottom: "none", color: "text.secondary" }}
                  >
                    {row.email}
                  </TableCell>

                  <TableCell sx={{ borderBottom: "none" }}>
                    {isEditable ? (
                      <Select
                        value={row.role}
                        onChange={(e) =>
                          handleRoleChange(row._id, e.target.value)
                        }
                        size="small"
                        sx={{
                          color: "#fff",
                          backgroundColor: "rgba(255,255,255,0.05)",
                          borderRadius: "8px",
                          height: "32px",
                          fontSize: "0.85rem",
                          minWidth: "120px",
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                          "& .MuiSvgIcon-root": { color: "#fff" },
                        }}
                      >
                        <MenuItem value="employee">Employee</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                      </Select>
                    ) : (
                      <Chip
                        icon={
                          <AdminPanelSettingsIcon
                            sx={{ fontSize: "16px !important" }}
                          />
                        }
                        label="ADMIN"
                        color="error"
                        variant="outlined"
                        size="small"
                        sx={{
                          fontWeight: "900",
                          borderRadius: 1,
                          letterSpacing: 1,
                        }}
                      />
                    )}
                  </TableCell>

                  {isEditable && (
                    <TableCell sx={{ borderBottom: "none" }}>
                      <Tooltip title="Delete User">
                        <IconButton
                          onClick={() => confirmDelete(row)}
                          size="small"
                          sx={{
                            color: "#ef4444",
                            bgcolor: "rgba(239, 68, 68, 0.1)",
                            "&:hover": { bgcolor: "#ef4444", color: "white" },
                          }}
                        >
                          <DeleteForeverIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  align="center"
                  sx={{ color: "text.secondary", py: 4 }}
                >
                  No users found in this category.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );

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
          User Registry
        </Typography>
        <Tooltip title="Refresh List">
          <IconButton
            onClick={loadUsers}
            sx={{
              color: "rgba(255,255,255,0.7)",
              "&:hover": { color: "white" },
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {error && (
        <Fade in={true}>
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        </Fade>
      )}

      {loading && users.length === 0 ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <Fade in={true} timeout={500}>
          <Box>
            <UserTable
              data={users.filter((u) => u.role === "employee")}
              isEditable={true}
              title="Employees"
              icon={<BadgeIcon color="primary" />}
            />

            <UserTable
              data={users.filter((u) => u.role === "admin")}
              isEditable={false}
              title="Administrators"
              icon={<AdminPanelSettingsIcon color="error" />}
            />
          </Box>
        </Fade>
      )}

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          style: {
            backgroundColor: "#1e293b",
            color: "white",
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.1)",
            minWidth: "320px",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "#ef4444",
          }}
        >
          <WarningIcon /> Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ color: "text.secondary", mb: 1 }}>
            Are you sure you want to delete this user?
          </Typography>
          {userToDelete && (
            <Box
              sx={{ p: 2, bgcolor: "rgba(0,0,0,0.2)", borderRadius: 2, mt: 1 }}
            >
              <Typography variant="subtitle1" fontWeight="bold" color="white">
                {userToDelete.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {userToDelete.email}
              </Typography>
            </Box>
          )}
          <Typography
            variant="caption"
            sx={{ color: "#ef4444", mt: 2, display: "block" }}
          >
            * This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ color: "text.secondary" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteExecute}
            variant="contained"
            color="error"
            startIcon={<DeleteForeverIcon />}
            sx={{ borderRadius: 2 }}
          >
            Delete User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersList;
