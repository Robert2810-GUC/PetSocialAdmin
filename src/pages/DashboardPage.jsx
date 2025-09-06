import { useEffect, useRef, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { api, API_BASE_URL } from "../api";

const DASHBOARD_API = "/api/admin/dashboard";
const CHECK_INTERVAL = 5000; // 5 seconds

export default function DashboardPage() {
  const [serverDown, setServerDown] = useState(false);
  const [checking, setChecking] = useState(true);
  const [stats, setStats] = useState(null);
  const intervalRef = useRef(null);

  const checkAPIHealth = async () => {
    try {
      const res = await api.get(DASHBOARD_API);
      setStats(res.data);
      setServerDown(false);
      setChecking(false);
      clearInterval(intervalRef.current);
    } catch {
      setServerDown(true);
      setChecking(false);
    }
  };

  useEffect(() => {
    checkAPIHealth();

    intervalRef.current = setInterval(() => {
      checkAPIHealth();
    }, CHECK_INTERVAL);

    return () => clearInterval(intervalRef.current);
  }, []);

  if (checking) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (serverDown) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#fef9e7",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          p: 4
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, color: "#b8860b", mb: 2 }}>
          🚧 Server is Down
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, color: "#6c4f1d" }}>
          We're trying to reach the API at:
        </Typography>
        <Typography variant="caption" sx={{ mb: 2, color: "#6c4f1d" }}>
          <code>{API_BASE_URL}</code>
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: "#6c4f1d" }}>
          Retrying every {CHECK_INTERVAL / 1000} seconds...
        </Typography>
        <CircularProgress sx={{ color: "#ae8625" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, color: "#4e3e15", mb: 3 }}>
        Dashboard
      </Typography>
      {stats && (
        <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          <Box sx={{ flex: "1 1 200px" }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Pet Owners</Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>{stats.petOwners ?? stats.PetOwners}</Typography>
          </Box>
          <Box sx={{ flex: "1 1 200px" }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Businesses</Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>{stats.businesses ?? stats.Businesses}</Typography>
          </Box>
          <Box sx={{ flex: "1 1 200px" }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Stories</Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>{stats.stories ?? stats.Stories}</Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}

