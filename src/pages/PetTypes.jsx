import React, { useEffect, useState } from "react";
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableBody, TableCell, TableHead, TableRow,
  TableContainer, Paper,
  IconButton, TextField, CircularProgress, Tooltip, Avatar, Snackbar, Alert,
  TablePagination, InputAdornment
} from "@mui/material";
import { Edit, Delete, Add, Search } from "@mui/icons-material";
import { api, API_BASE_URL } from "../api";

const ADMIN_API = "/api/admin/pet-types";

const gold = "#ae8625";
const brown = "#7a5c27";
const offWhite = "#fffbe6";

function PetTypes() {
  const [petTypes, setPetTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ id: null, name: "", sortOrder: 0, imagePath: "" });
  const [uploadFile, setUploadFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notif, setNotif] = useState({ open: false, msg: "", type: "success" });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => { fetchPetTypes(); }, []);

  async function fetchPetTypes() {
    setLoading(true);
    const res = await api.get(ADMIN_API);
    setPetTypes(res.data);
    setLoading(false);
  }

  const handleOpen = (item = { id: null, name: "", sortOrder: 0, imagePath: "" }) => {
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
      fd.append("sortOrder", Number(form.sortOrder));
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
    try {
      await api.delete(`${ADMIN_API}/${id}`);
      fetchPetTypes();
      setNotif({ open: true, msg: "Pet type deleted.", type: "success" });

    }
    catch (err) {
      setNotif({
        open: true,
        msg: err?.response?.data || "Delete failed!",
        type: "error"
      });
    }
  }
  const filteredPetTypes = petTypes.filter(pt =>
    pt.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ pt: 1, px: { xs: 1, sm: 3 }, bgcolor: offWhite, minHeight: "100vh" }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
        flexWrap="wrap"
        gap={2}
      >
        <h2 style={{ color: brown, fontWeight: 700, letterSpacing: 1 }}>Pet Types</h2>
        <TextField
          size="small"
          placeholder="Search..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: { xs: "100%", sm: 200 } }}
        />
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
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 3,
            boxShadow: "0 4px 24px #0001",
            border: `1.5px solid ${gold}`,
            mx: "auto"
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ bgcolor: gold }}>
                <TableCell sx={{ color: "#fff", fontWeight: 700, bgcolor: gold }}>Image</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 700, bgcolor: gold }}>Name</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 700, bgcolor: gold }}>SortOrder</TableCell>
                <TableCell align="right" sx={{ color: "#fff", fontWeight: 700, bgcolor: gold }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPetTypes
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow hover key={row.id}>
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
              {filteredPetTypes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ color: brown }}>
                    No pet types found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredPetTypes.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25]}
            sx={{ borderTop: `1px solid ${gold}` }}
          />
        </TableContainer>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={saving ? null : handleClose} disableEscapeKeyDown={saving}
        disableBackdropClick={true} fullWidth maxWidth="xs">
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
            onChange={e => setForm({ ...form, sortOrder: Number(e.target.value) })}
            fullWidth sx={{ mb: 2 }}
          />
          <Box
            sx={{
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              flexWrap: 'wrap'
            }}
          >
            {/* Image Preview */}
            {(uploadFile || form.imagePath) && (
              <Box
                sx={{
                  width: 150,
                  height: 150,
                  borderRadius: 2,
                  border: `1.5px solid ${gold}`,
                  backgroundColor: '#f5f5f5',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden',
                  padding: 1,
                }}
              >
                <img
                  src={
                    uploadFile
                      ? URL.createObjectURL(uploadFile)
                      : (form.imagePath.startsWith("http")
                        ? form.imagePath
                        : API_BASE_URL + form.imagePath)
                  }
                  alt="preview"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    borderRadius: 4,
                  }}
                />
              </Box>
            )}

            {/* Upload / Change Image Button */}
            <Button
              variant="outlined"
              component="label"
              sx={{
                bgcolor: "#fcf7e6",
                color: "brown",
                border: `1px solid ${gold}`,
                fontWeight: 500,
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              {uploadFile || form.imagePath ? "Change Image" : "Upload Image"}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={e => setUploadFile(e.target.files?.[0] || null)}
              />
            </Button>
          </Box>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={saving} color="secondary" variant="text">Cancel</Button>
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
