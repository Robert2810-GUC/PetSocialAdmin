import React, { useEffect, useState } from "react";
import {
  Box, Table, TableBody, TableCell, TableHead, TableRow,
  TableContainer, Paper, CircularProgress, IconButton,
  Tooltip, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Avatar, Typography
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { api, API_BASE_URL } from "../api";

const ADMIN_API = "/api/admin/pet-owners";

const gold = "#ae8625";
const brown = "#7a5c27";
const offWhite = "#fffbe6";

export default function PetOwners() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => { fetchOwners(); }, []);

  async function fetchOwners() {
    setLoading(true);
    const res = await api.get(ADMIN_API);
    setOwners(res.data);
    setLoading(false);
  }

  async function openDetails(id) {
    setDetailLoading(true);
    const res = await api.get(`${ADMIN_API}/${id}`);
    setSelected(res.data);
    setDetailLoading(false);
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };

  return (
    <Box sx={{ pt: 1, px: { xs: 1, sm: 3 }, bgcolor: offWhite, minHeight: "100vh" }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <h2 style={{ color: brown, fontWeight: 700, letterSpacing: 1 }}>Pet Owners</h2>
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
                <TableCell sx={{ color: "#fff", fontWeight: 700, bgcolor: gold }}>Name</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 700, bgcolor: gold }}>Country</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 700, bgcolor: gold }}>Verified</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 700, bgcolor: gold }}>Gold Paw</TableCell>
                <TableCell align="right" sx={{ color: "#fff", fontWeight: 700, bgcolor: gold }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {owners.map(o => (
                <TableRow hover key={o.id}>
                  <TableCell sx={{ fontWeight: 600, color: brown }}>{o.name}</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: brown }}>{o.countryCode || "-"}</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: brown }}>{o.verified ? "Yes" : "No"}</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: brown }}>{o.goldPaw ? "Yes" : "No"}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton onClick={() => openDetails(o.id)} sx={{ color: gold }}>
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {owners.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ color: brown }}>No pet owners found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle sx={{ color: gold, fontWeight: 700 }}>Owner Details</DialogTitle>
        <DialogContent dividers>
          {detailLoading || !selected ? (
            <CircularProgress sx={{ m: 2 }} />
          ) : (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: brown }}>
                {selected.name}
              </Typography>
              <Typography variant="body2" sx={{ color: brown, mb: 2 }}>
                {selected.email && `Email: ${selected.email} `}
                {selected.phoneNumber && `Phone: ${selected.phoneNumber}`}
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: brown, mb: 1 }}>
                Pets
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: brown }}>Image</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: brown }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: brown }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: brown }}>Breed</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: brown }}>Donations</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: brown }}>Stories</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selected.pets && selected.pets.map(p => (
                    <TableRow key={p.id}>
                      <TableCell>
                        {p.imagePath && (
                          <Avatar
                            src={p.imagePath.startsWith("http") ? p.imagePath : API_BASE_URL + p.imagePath}
                            alt={p.petName}
                            variant="rounded"
                            sx={{ width: 48, height: 48, border: `2px solid ${gold}` }}
                          />
                        )}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: brown }}>{p.petName}</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: brown }}>{p.petType}</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: brown }}>{p.petBreed || "-"}</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: brown }}>{p.donations?.length || 0}</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: brown }}>{p.stories?.length || 0}</TableCell>
                    </TableRow>
                  ))}
                  {selected.pets?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ color: brown }}>
                        No pets found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ color: brown }}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
