import React, { useEffect, useState } from "react";
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableBody, TableCell, TableHead, TableRow,
  IconButton, TextField, CircularProgress, Tooltip, Avatar, Snackbar, Alert
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { api, API_BASE_URL } from "../api";

const ADMIN_API = "/api/admin/pet-types";

const gold = "#ae8625";
const brown = "#7a5c27";
const offWhite = "#fffbe6";

function PetTypes() {
  const [petTypes, setPetTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ id: null, name: "", sortOrder:0, imagePath: "" });
  const [uploadFile, setUploadFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notif, setNotif] = useState({ open: false, msg: "", type: "success" });

  useEffect(() => { fetchPetTypes(); }, []);

  async function fetchPetTypes() {
    setLoading(true);
    const res = await api.get(ADMIN_API);
    setPetTypes(res.data);
    setLoading(false);
  }

  const handleOpen = (item = { id: null, name: "", sortOrder: "", imagePath: "" }) => {
    setForm(item);
    setUploadFile(null);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  async function handleSave() {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      if (uploadFile) fd.append("image", uploadFile);

      if (form.id) {
        // Update
        await api.put(`${ADMIN_API}/${form.id}`, fd);
        setNotif({ open: true, msg: "Pet type updated.", type: "success" });
      } else {
        // Create
        await api.post(ADMIN_API, fd);
        setNotif({ open: true, msg: "Pet type created.", type: "success" });
      }
      setOpen(false);
      fetchPetTypes();
    } catch (err) {
      setNotif({ open: true, msg: err?.response?.data?.message || "Error!", type: "error" });
    }
    setSaving(false);
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this pet type?")) return;
    await api.delete(`${ADMIN_API}/${id}`);
    fetchPetTypes();
    setNotif({ open: true, msg: "Pet type deleted.", type: "success" });
  }

  return (
  <Box sx={{ pt: 1, px: { xs: 1, sm: 3 }, bgcolor: offWhite, minHeight: "100vh" }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <h2 style={{ color: brown, fontWeight: 700, letterSpacing: 1 }}>Pet Types</h2>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{
            bgcolor: gold, color: "#fff", fontWeight: 600, borderRadius: 2,
            "&:hover": { bgcolor: brown }
          }}
          onClick={() => handleOpen()}
        >
          Add Pet Type
        </Button>
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
                <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Image</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Name</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 700 }}>SortOrder</TableCell>
                <TableCell align="right" sx={{ color: "#fff", fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {petTypes.map(row => (
                <TableRow key={row.id}>
                  <TableCell>
                    {row.imagePath ? (
                      <Avatar
                        src={row.imagePath.startsWith("http") ? row.imagePath : API_BASE_URL + row.imagePath}
                        alt={row.name}
                        variant="rounded"
                        sx={{ width: 48, height: 48, border: `2px solid ${gold}` }}
                      />
                    ) : "-"}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: brown }}>{row.name}</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: brown }}>{row.sortOrder}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleOpen(row)} sx={{ color: gold }}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleDelete(row.id)} sx={{ color: "#d13f25" }}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {petTypes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ color: brown }}>No pet types found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={saving ? null : handleClose} disableEscapeKeyDown={saving}         
          disableBackdropClick={true}   fullWidth maxWidth="xs">
        <DialogTitle sx={{ color: gold, fontWeight: 700 }}>
          {form.id ? "Edit Pet Type" : "Add Pet Type"}
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Box sx={{ mt: 1 }}>
          <TextField
            label="Name"
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
          <Button
            component="label"
            variant="outlined"
            sx={{
              bgcolor: "#fcf7e6", color: brown, border: `1px solid ${gold}`,
              fontWeight: 500, mb: 2
            }}
          >
            {uploadFile ? uploadFile.name : "Upload Image"}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={e => setUploadFile(e.target.files[0])}
            />
          </Button>
          {(form.imagePath && !uploadFile) && (
            <Box mt={2}>
              <img
                src={form.imagePath.startsWith("http") ? form.imagePath : API_BASE_URL + form.imagePath}
                alt="Current"
                style={{ width: 72, borderRadius: 10, border: `1.5px solid ${gold}` }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}  disabled={saving}  color="secondary" variant="text">Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              bgcolor: gold, color: "#fff", fontWeight: 700, borderRadius: 2,
              "&:hover": { bgcolor: brown }
            }}
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

export default PetTypes;
