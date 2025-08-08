import React, { useEffect, useState } from "react";
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableBody, TableCell, TableHead, TableRow,
  IconButton, TextField, CircularProgress, Tooltip, Snackbar, Alert
} from "@mui/material";
import { Edit, Delete, Add, Search } from "@mui/icons-material";
import { api } from "../api";

const ADMIN_API = "/api/admin";
const gold = "#ae8625";
const brown = "#7a5c27";
const offWhite = "#fffbe6";

function UserTypes() {
  const [userTypes, setUserTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ id: null, name: "", description: "", imagePath: "", imageFile: null });
  const [saving, setSaving] = useState(false);
  const [notif, setNotif] = useState({ open: false, msg: "", type: "success" });

  useEffect(() => {
    fetchUserTypes();
  }, [search]);

  const fetchUserTypes = async () => {
    setLoading(true);
    try {
      const res = await api.get(`${ADMIN_API}/user-types`, {
        params: search ? { search } : {}
      });
      setUserTypes(res.data);
    } catch (err) {
      console.error("Error fetching user types", err);
    }
    setLoading(false);
  };

  const handleOpen = (item = { id: null, name: "", description: "", imagePath: "" }) => {
    setForm({ ...item, imageFile: null });
    setOpen(true);
  };

  const handleClose = () => {
    if (saving) return;
    setOpen(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name.trim());
      if (form.description.trim()) fd.append("description", form.description.trim());
      if (form.imageFile) fd.append("image", form.imageFile);

      if (form.id) {
        await api.put(`${ADMIN_API}/user-types/${form.id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        setNotif({ open: true, msg: "User type updated.", type: "success" });
      } else {
        await api.post(`${ADMIN_API}/user-types`, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        setNotif({ open: true, msg: "User type created.", type: "success" });
      }

      setOpen(false);
      fetchUserTypes();
    } catch (err) {
      setNotif({ open: true, msg: err?.response?.data || "Error!", type: "error" });
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user type?")) return;
    try {
      const res = await api.delete(`${ADMIN_API}/user-types/${id}`);
      setNotif({ open: true, msg: res.data || "User type deleted.", type: "success" });
      fetchUserTypes();
    } catch (err) {
      setNotif({
        open: true,
        msg: err?.response?.data || "Delete failed!",
        type: "error"
      });
    }
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 3 }, bgcolor: offWhite, minHeight: "100vh" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <h2 style={{ color: brown, fontWeight: 700, letterSpacing: 1 }}>User Types</h2>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{ bgcolor: gold, color: "#fff", fontWeight: 600, borderRadius: 2, "&:hover": { bgcolor: brown } }}
          onClick={() => handleOpen()}
        >
          Add User Type
        </Button>
      </Box>

      <TextField
        placeholder="Search by name"
        value={search}
        onChange={e => setSearch(e.target.value)}
        InputProps={{ endAdornment: <Search /> }}
        sx={{ mb: 2, width: 300 }}
      />

      {loading ? (
        <CircularProgress sx={{ m: 4 }} />
      ) : (
        <Box sx={{
          overflowX: "auto",
          background: "#fff",
          borderRadius: 3,
          boxShadow: "0 4px 24px #0001",
          border: `1.5px solid ${gold}`,
          mx: "auto"
        }}>
          <Table>
            <TableHead sx={{ bgcolor: gold }}>
              <TableRow>
                <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Image</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Name</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Description</TableCell>
                <TableCell align="right" sx={{ color: "#fff", fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userTypes.map(row => (
                <TableRow key={row.id}>
                  <TableCell>
                    <img
                      src={row.imagePath}
                      alt={row.name}
                      style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: brown }}>{row.name}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleOpen(row)} sx={{ color: gold }}><Edit /></IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleDelete(row.id)} sx={{ color: "#d13f25" }}><Delete /></IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {userTypes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ color: brown }}>No user types found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      )}

      {/* Add/Edit Dialog */}
      <Dialog
        open={open}
        onClose={(e, reason) => {
          if (saving) return;
          if (reason !== "backdropClick" && reason !== "escapeKeyDown") handleClose();
        }}
        disableEscapeKeyDown={saving}
      >
        <DialogTitle sx={{ color: gold, fontWeight: 700 }}>
          {form.id ? "Edit User Type" : "Add User Type"}
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Box sx={{ mt: 1 }}>
            <TextField
              label="User Type Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              fullWidth
              sx={{ mb: 2 }}
              autoFocus
            />
          </Box>
          <TextField
            label="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            fullWidth
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />
          <Box sx={{ mb: 2 }}>
            {(form.imageFile || form.imagePath) && (
              <img
                src={form.imageFile ? URL.createObjectURL(form.imageFile) : form.imagePath}
                alt="preview"
                style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4, marginBottom: 8 }}
              />
            )}
            <Button variant="outlined" component="label">
              {form.imageFile || form.imagePath ? "Change Image" : "Upload Image"}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={e => setForm({ ...form, imageFile: e.target.files?.[0] || null })}
              />
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={saving}>Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={saving || !form.name.trim()}
            sx={{ bgcolor: gold, color: "#fff", fontWeight: 700, "&:hover": { bgcolor: brown } }}
          >
            {saving ? <CircularProgress size={24} /> : form.id ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notif.open}
        autoHideDuration={2200}
        onClose={() => setNotif({ ...notif, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setNotif({ ...notif, open: false })} severity={notif.type} sx={{ width: '100%' }}>
          {notif.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default UserTypes;
