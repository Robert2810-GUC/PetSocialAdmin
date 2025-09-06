import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
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

const ADMIN_API = "/api/admin/business-profiles";
const gold = "#ae8625";
const brown = "#7a5c27";
const offWhite = "#fffbe6";

function BusinessProfiles() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [countryCode, setCountryCode] = useState("");

  useEffect(() => {
    fetchBusinesses();
  }, []);

  async function fetchBusinesses() {
    setLoading(true);
    try {
      const params = {};
      if (countryCode.trim()) params.countryCode = countryCode.trim();
      const res = await api.get(ADMIN_API, { params });
      setBusinesses(res.data);
    } catch (err) {
      console.error("Error fetching businesses", err);
    }
    setLoading(false);
  }

  return (
    <Box sx={{ pt: 1, px: { xs: 1, sm: 3 }, bgcolor: offWhite, minHeight: "100vh" }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <h2 style={{ color: brown, fontWeight: 700, letterSpacing: 1 }}>Businesses</h2>
      </Box>

      <Box sx={{ mb: 2, display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
        <TextField
          label="Country Code"
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
          size="small"
        />
        <Button
          variant="contained"
          onClick={fetchBusinesses}
          sx={{ bgcolor: gold, color: "#fff", "&:hover": { bgcolor: brown } }}
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
            mx: "auto",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ bgcolor: gold }}>
                <TableCell sx={{ color: "#fff", fontWeight: 700, bgcolor: gold }}>ID</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 700, bgcolor: gold }}>Business Name</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 700, bgcolor: gold }}>Country</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 700, bgcolor: gold }}>Address</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {businesses.map((b) => (
                <TableRow hover key={b.id}>
                  <TableCell>{b.id}</TableCell>
                  <TableCell>{b.businessName}</TableCell>
                  <TableCell>{b.countryCode || "-"}</TableCell>
                  <TableCell>{b.address || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default BusinessProfiles;

