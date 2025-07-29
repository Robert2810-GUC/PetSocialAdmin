import { useEffect, useState } from "react";
import { api } from "../api";
import { CircularProgress, Box, Typography } from "@mui/material";

export default function DashboardPage() {
  const [checking, setChecking] = useState(true);
  const [serverDown, setServerDown] = useState(false);

  useEffect(() => {
    const checkAPIHealth = async () => {
      try {
        await api.get("/admin/weatherforecast");
        setServerDown(false);
      } catch (err) {
        setServerDown(true);
      }
      setChecking(false);
    };

    checkAPIHealth();
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
      <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", bgcolor: "#fef9e7", p: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "#b8860b", mb: 2 }}>🚧 Server is Down</Typography>
        <Typography variant="body1" sx={{ color: "#6c4f1d", mb: 3 }}>
          We can't reach the API server right now. This page will automatically refresh when it's back online.
        </Typography>
        <CircularProgress sx={{ color: "#ae8625" }} />
      </Box>
    );
  }

  return (
    <div>
      <h2>Welcome to PetSocial Admin Panel</h2>
      <p>The API is reachable and dashboard is ready.</p>
    </div>
  );
}
