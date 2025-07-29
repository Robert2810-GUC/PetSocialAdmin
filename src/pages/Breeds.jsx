import React, { useEffect, useState } from "react";
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableBody, TableCell, TableHead, TableRow,
  IconButton, TextField, CircularProgress, Tooltip, Snackbar, Alert,
  MenuItem, Select, InputLabel, FormControl
} from "@mui/material";
import { Edit, Delete, Add, Search } from "@mui/icons-material";
import { api } from "../api";

const ADMIN_API = "/api/admin";
const gold = "#ae8625";
const brown = "#7a5c27";
const offWhite = "#fffbe6";

function Breeds() {
  const [breeds, setBreeds] = useState([]);
  const [petTypes, setPetTypes] = useState([]);
  const [selectedPetTypeId, setSelectedPetTypeId] = useState("");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ id: null, name: "", sortOrder: "", petTypeID: "" });
  const [saving, setSaving] = useState(false);
  const [notif, setNotif] = useState({ open: false, msg: "", type: "success" });

  useEffect(() => { fetchPetTypes(); }, []);

  useEffect(() => {
    if (petTypes.length > 0) fetchBreeds();
  }, [selectedPetTypeId, searchText]);

  async function fetchPetTypes() {
    const res = await api.get(`${ADMIN_API}/pet-types`);
    setPetTypes(res.data);
    fetchBreeds();
  }

  async function fetchBreeds() {
    setLoading(true);
    const res = await api.get(`${ADMIN_API}/breeds`, {
      params: {
        petTypeId: selectedPetTypeId || undefined,
        search: searchText || undefined
      }
    });
    setBreeds(res.data);
    setLoading(false);
  }

  const handleOpen = (item = { id: null, name: "", sortOrder: "", petTypeID: "" }) => {
    setForm(item);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        id: form.id,
        name: form.name.trim(),
        petTypeID: parseInt(form.petTypeID),
        sortOrder: parseInt(form.sortOrder || 0)
      };

      if (form.id) {
        await api.put(`${ADMIN_API}/breeds/${form.id}`, payload);
        setNotif({ open: true, msg: "Breed updated.", type: "success" });
      } else {
        await api.post(`${ADMIN_API}/breeds`, payload);
        setNotif({ open: true, msg: "Breed created.", type: "success" });
      }

      setOpen(false);
      fetchBreeds();
    } catch (err) {
      setNotif({ open: true, msg: err?.response?.data || "Error occurred", type: "error" });
    }
    setSaving(false);
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this breed?")) return;
    await api.delete(`${ADMIN_API}/breeds/${id}`);
    fetchBreeds();
    setNotif({ open: true, msg: "Breed deleted.", type: "success" });
  }

  return (
<Box sx={{ pt: 1, px: { xs: 1, sm: 3 }, bgcolor: offWhite, minHeight: "100vh" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <h2 style={{ color: brown, fontWeight: 700 }}>Breeds</h2>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{ bgcolor: gold, color: "#fff", fontWeight: 600, borderRadius: 2, "&:hover": { bgcolor: brown } }}
          onClick={() => handleOpen()}
        >
          Add Breed
        </Button>
      </Box>

      <Box display="flex" gap={2} mb={2} flexWrap="wrap">
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="petTypeFilterLabel">Filter by Pet Type</InputLabel>
          <Select
            labelId="petTypeFilterLabel"
            value={selectedPetTypeId}
            label="Filter by Pet Type"
            onChange={(e) => setSelectedPetTypeId(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {petTypes.map(pt => (
              <MenuItem key={pt.id} value={pt.id}>{pt.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Search by Name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{ endAdornment: <Search /> }}
        />
      </Box>

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
                <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Pet Type</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Sort Order</TableCell>
                <TableCell align="right" sx={{ color: "#fff", fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {breeds.map(row => (
                <TableRow key={row.id}>
                  <TableCell sx={{ fontWeight: 600, color: brown }}>{row.name}</TableCell>
                  <TableCell>{row.petTypeName}</TableCell>
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
              {breeds.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ color: brown }}>No breeds found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle sx={{ color: gold, fontWeight: 700 }}>
          {form.id ? "Edit Breed" : "Add Breed"}
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
           <Box sx={{ mt: 1 }}>
          <TextField
            label="Breed Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            fullWidth sx={{ mb: 2 }}
            autoFocus
          /></Box>
          <TextField
            label="Sort Order"
            type="number"
            placeholder="Set 0 for default"
            value={form.sortOrder}
            onChange={e => setForm({ ...form, sortOrder: e.target.value })}
            fullWidth sx={{ mb: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel id="petTypeSelectLabel">Pet Type</InputLabel>
            <Select
              labelId="petTypeSelectLabel"
              value={form.petTypeID}
              label="Pet Type"
              onChange={(e) => setForm({ ...form, petTypeID: e.target.value })}
            >
              {petTypes.map(pt => (
                <MenuItem key={pt.id} value={pt.id}>{pt.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary" variant="text">Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{ bgcolor: gold, color: "#fff", fontWeight: 700, borderRadius: 2, "&:hover": { bgcolor: brown } }}
            disabled={saving || !form.name.trim()}
          >
            {saving ? <CircularProgress size={24} /> : (form.id ? "Update" : "Create")}
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

export default Breeds;
