import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from "@mui/material";
import { api } from "../api";

const ADMIN_API = "/api/admin/pet-owners";
const gold = "#ae8625";
const brown = "#7a5c27";
const offWhite = "#fffbe6";

function PetOwners() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    verified: false,
    goldPaw: false,
    countryCode: "",
    search: ""
  });
  const [details, setDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    fetchOwners();
  }, []);

  async function fetchOwners() {
    setLoading(true);
    try {
      const params = {};
      if (filters.verified) params.verified = true;
      if (filters.goldPaw) params.goldPaw = true;
      if (filters.countryCode.trim()) params.countryCode = filters.countryCode.trim();
      if (filters.search.trim()) params.search = filters.search.trim();
      const res = await api.get(ADMIN_API, { params });
      setOwners(res.data);
    } catch (err) {
      console.error("Error fetching pet owners", err);
    }
    setLoading(false);
  }

  async function openDetails(id) {
    setDetailsLoading(true);
    try {
      const res = await api.get(`${ADMIN_API}/${id}`);
      setDetails(res.data);
    } catch (err) {
      console.error("Error fetching owner details", err);
    }
    setDetailsLoading(false);
  }

  return (
    <Box sx={{ pt: 1, px: { xs: 1, sm: 3 }, bgcolor: offWhite, minHeight: "100vh" }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <h2 style={{ color: brown, fontWeight: 700, letterSpacing: 1 }}>Pet Owners</h2>
      </Box>

      <Box
        sx={{
          mb: 2,
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          alignItems: 'center'
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.verified}
              onChange={e => setFilters({ ...filters, verified: e.target.checked })}
              sx={{ color: brown, '&.Mui-checked': { color: gold } }}
            />
          }
          label="Verified"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.goldPaw}
              onChange={e => setFilters({ ...filters, goldPaw: e.target.checked })}
              sx={{ color: brown, '&.Mui-checked': { color: gold } }}
            />
          }
          label="Gold Paw"
        />
        <TextField
          label="Country Code"
          value={filters.countryCode}
          onChange={e => setFilters({ ...filters, countryCode: e.target.value })}
          size="small"
        />
        <TextField
          label="Search"
          value={filters.search}
          onChange={e => setFilters({ ...filters, search: e.target.value })}
          size="small"
        />
        <Button
          variant="contained"
          onClick={fetchOwners}
          sx={{ bgcolor: gold, color: "#fff", '&:hover': { bgcolor: brown } }}
        >
          Apply
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
                <TableCell sx={{ color: "#fff", fontWeight: 700, bgcolor: gold }}>ID</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 700, bgcolor: gold }}>Name</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 700, bgcolor: gold }}>Country</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 700, bgcolor: gold }}>Verified</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 700, bgcolor: gold }}>Gold Paw</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {owners.map(row => (
                <TableRow hover key={row.id} onClick={() => openDetails(row.id)} sx={{ cursor: 'pointer' }}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.countryCode || "-"}</TableCell>
                  <TableCell>{row.verified ? "Yes" : "No"}</TableCell>
                  <TableCell>{row.goldPaw ? "Yes" : "No"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Dialog open={Boolean(details)} onClose={() => setDetails(null)} maxWidth="md" fullWidth>
        <DialogTitle>Pet Owner Details</DialogTitle>
        <DialogContent dividers>
          {detailsLoading ? (
            <CircularProgress />
          ) : (
            details && (
              <Box sx={{ color: brown }}>
                <Box mb={1}><strong>Name:</strong> {details.name}</Box>
                <Box mb={1}><strong>Phone:</strong> {details.phoneNumber || '-'}</Box>
                <Box mb={1}><strong>Email:</strong> {details.email || '-'}</Box>
                <Box mb={1}><strong>Country:</strong> {details.countryCode || '-'}</Box>
                {details.pets && details.pets.length > 0 && (
                  <Box mt={2}>
                    <strong>Pets:</strong>
                    {details.pets.map(p => (
                      <Box key={p.id} sx={{ ml: 2, mt: 1 }}>
                        {p.petName} - {p.petType}{p.petBreed ? ` (${p.petBreed})` : ''}
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            )
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetails(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PetOwners;
