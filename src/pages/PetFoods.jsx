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

function PetFoods() {
  const [petFoods, setPetFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ id: null, name: "", sortOrder: 0 });
  const [saving, setSaving] = useState(false);
  const [notif, setNotif] = useState({ open: false, msg: "", type: "success" });

  useEffect(() => {
    fetchPetFoods();
  }, [search]);

  const fetchPetFoods = async () => {
    setLoading(true);
    try {
      const res = await api.get(`${ADMIN_API}/pet-foods`, {
        params: search ? { search } : {}
      });
      setPetFoods(res.data);
    } catch (err) {
      console.error("Error fetching pet foods", err);
    }
    setLoading(false);
  };

  const handleOpen = (item = { id: null, name: "", sortOrder: 0 }) => {
    setForm(item);
    setOpen(true);
  };

  const handleClose = () => {
    if (saving) return;
    setOpen(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        sortOrder: parseInt(form.sortOrder || 0),
      };

      if (form.id) {
        await api.put(`${ADMIN_API}/pet-foods/${form.id}`, { ...form, ...payload });
        setNotif({ open: true, msg: "Pet food updated.", type: "success" });
      } else {
        // If sortOrder is 0 → let backend auto-increment
        await api.post(`${ADMIN_API}/pet-foods`, payload);
        setNotif({ open: true, msg: "Pet food created.", type: "success" });
      }

      setOpen(false);
      fetchPetFoods();
    } catch (err) {
      setNotif({ open: true, msg: err?.response?.data || "Error!", type: "error" });
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this pet food?")) return;
    try {
      const res = await api.delete(`${ADMIN_API}/pet-foods/${id}`);
      setNotif({ open: true, msg: res.data || "Pet food deleted.", type: "success" });
      fetchPetFoods();
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
        <h2 style={{ color: brown, fontWeight: 700, letterSpacing: 1 }}>Pet Foods</h2>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{ bgcolor: gold, color: "#fff", fontWeight: 600, borderRadius: 2, "&:hover": { bgcolor: brown } }}
          onClick={() => handleOpen()}
        >
          Add Pet Food
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
                <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Name</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Sort Order</TableCell>
                <TableCell align="right" sx={{ color: "#fff", fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {petFoods.map(row => (
                <TableRow key={row.id}>
                  <TableCell sx={{ fontWeight: 600, color: brown }}>{row.name}</TableCell>
                  <TableCell>{row.sortOrder}</TableCell>
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
              {petFoods.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ color: brown }}>No pet foods found.</TableCell>
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
        disableEscapeKeyDown={saving} fullWidth maxWidth="xs"
      >
        <DialogTitle sx={{ color: gold, fontWeight: 700 }}>
          {form.id ? "Edit Pet Food" : "Add Pet Food"}
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Box sx={{ mt: 1 }}>
            <TextField
              label="Pet Food Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              fullWidth sx={{ mb: 2 }}
              autoFocus
            />
          </Box>
          <TextField
            label="Sort Order (optional)"
            type="number"
            value={form.sortOrder}
            placeholder="Set 0 for default"
            onChange={e => setForm({ ...form, sortOrder: e.target.value })}
            fullWidth sx={{ mb: 2 }}
          />
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

export default PetFoods;

