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

const ADMIN_API = "/api/admin/stories/summary";
const gold = "#ae8625";
const brown = "#7a5c27";
const offWhite = "#fffbe6";

function Stories() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const params = { days };
      const res = await api.get(ADMIN_API, { params });
      setData(res.data);
    } catch (err) {
      console.error("Error fetching stories summary", err);
    }
    setLoading(false);
  }

  return (
    <Box sx={{ pt: 1, px: { xs: 1, sm: 3 }, bgcolor: offWhite, minHeight: "100vh" }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <h2 style={{ color: brown, fontWeight: 700, letterSpacing: 1 }}>Stories</h2>
      </Box>

      <Box sx={{ mb: 2, display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
        <TextField
          label="Days"
          type="number"
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          size="small"
          inputProps={{ min: 1 }}
        />
        <Button
          variant="contained"
          onClick={fetchData}
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
                <TableCell sx={{ color: "#fff", fontWeight: 700, bgcolor: gold }}>Date</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 700, bgcolor: gold }}>Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow hover key={row.date || row.Date}>
                  <TableCell>{new Date(row.date || row.Date).toLocaleDateString()}</TableCell>
                  <TableCell>{row.count ?? row.Count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default Stories;

