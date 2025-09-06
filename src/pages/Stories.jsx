import React, { useEffect, useState } from "react";
import {
  Box, Table, TableBody, TableCell, TableHead, TableRow,
  TableContainer, Paper, CircularProgress, TextField, Button
} from "@mui/material";
import { api } from "../api";

const ADMIN_API = "/api/admin/stories/summary";

const gold = "#ae8625";
const brown = "#7a5c27";
const offWhite = "#fffbe6";

export default function Stories() {
  const [days, setDays] = useState(7);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(days); }, []);

  async function fetchData(d) {
    setLoading(true);
    const res = await api.get(`${ADMIN_API}?days=${d}`);
    setData(res.data);
    setLoading(false);
  }

  return (
    <Box sx={{ pt: 1, px: { xs: 1, sm: 3 }, bgcolor: offWhite, minHeight: "100vh" }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <h2 style={{ color: brown, fontWeight: 700, letterSpacing: 1 }}>Stories Summary</h2>
        <Box display="flex" gap={2}>
          <TextField
            type="number"
            label="Days"
            value={days}
            onChange={e => setDays(Number(e.target.value))}
            size="small"
            sx={{ width: 100 }}
          />
          <Button
            variant="contained"
            onClick={() => fetchData(days)}
            sx={{ bgcolor: gold, color: "#fff", fontWeight: 600, borderRadius: 2, "&:hover": { bgcolor: brown } }}
          >
            Refresh
          </Button>
        </Box>
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
                <TableCell sx={{ color: "#fff", fontWeight: 700, bgcolor: gold }}>Date</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 700, bgcolor: gold }}>Stories</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map(row => (
                <TableRow hover key={row.date}>
                  <TableCell sx={{ fontWeight: 600, color: brown }}>{row.date}</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: brown }}>{row.count}</TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} align="center" sx={{ color: brown }}>No data.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
