import React, { useEffect, useState } from "react";
import {
  Box, Table, TableBody, TableCell, TableHead, TableRow,
  TableContainer, Paper, CircularProgress, IconButton,
  Tooltip, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { api } from "../api";

const ADMIN_API = "/api/admin/business-profiles";

const gold = "#ae8625";
const brown = "#7a5c27";
const offWhite = "#fffbe6";

export default function BusinessProfiles() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => { fetchProfiles(); }, []);

  async function fetchProfiles() {
    setLoading(true);
    const res = await api.get(ADMIN_API);
    setProfiles(res.data);
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
        <h2 style={{ color: brown, fontWeight: 700, letterSpacing: 1 }}>Business Profiles</h2>
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
                <TableCell sx={{ color: "#fff", fontWeight: 700, bgcolor: gold }}>Business Name</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 700, bgcolor: gold }}>Country</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 700, bgcolor: gold }}>Address</TableCell>
                <TableCell align="right" sx={{ color: "#fff", fontWeight: 700, bgcolor: gold }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {profiles.map(p => (
                <TableRow hover key={p.id}>
                  <TableCell sx={{ fontWeight: 600, color: brown }}>{p.businessName}</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: brown }}>{p.countryCode}</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: brown }}>{p.address}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton onClick={() => openDetails(p.id)} sx={{ color: gold }}>
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {profiles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ color: brown }}>No business profiles found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ color: gold, fontWeight: 700 }}>Business Details</DialogTitle>
        <DialogContent dividers>
          {detailLoading || !selected ? (
            <CircularProgress sx={{ m: 2 }} />
          ) : (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: brown }}>
                {selected.business.businessName}
              </Typography>
              <Typography variant="body2" sx={{ color: brown, mb: 1 }}>
                {selected.name}
              </Typography>
              <Typography variant="body2" sx={{ color: brown, mb: 1 }}>
                Country: {selected.countryCode}
              </Typography>
              <Typography variant="body2" sx={{ color: brown, mb: 1 }}>
                Address: {selected.business.address}
              </Typography>
              {selected.email && (
                <Typography variant="body2" sx={{ color: brown, mb: 1 }}>
                  Email: {selected.email}
                </Typography>
              )}
              {selected.phoneNumber && (
                <Typography variant="body2" sx={{ color: brown }}>
                  Phone: {selected.phoneNumber}
                </Typography>
              )}
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
