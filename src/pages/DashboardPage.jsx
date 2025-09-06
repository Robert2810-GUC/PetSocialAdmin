import { useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "../api";
import { Box, Typography, CircularProgress, Grid, Card, CardContent } from "@mui/material";

const API_CHECK_URL = `${API_BASE_URL}weatherforecast`;
const CHECK_INTERVAL = 5000; // 10 seconds

export default function DashboardPage() {
  const [serverDown, setServerDown] = useState(false);
  const [checking, setChecking] = useState(true);
  const intervalRef = useRef(null);

  const checkAPIHealth = async () => {
    try {
      const res = await fetch(API_CHECK_URL, { method: "GET" });
      if (res.ok) {
        setServerDown(false);
        setChecking(false);
        clearInterval(intervalRef.current); // ✅ stop retrying when back
      } else {
        throw new Error("API not OK");
      }
    } catch {
      setServerDown(true);
      setChecking(false);
    }
  };

  useEffect(() => {
    // Run first time immediately
    checkAPIHealth();

    // Retry loop only if it's down
    intervalRef.current = setInterval(() => {
      checkAPIHealth();
    }, CHECK_INTERVAL);

    return () => clearInterval(intervalRef.current); // cleanup
  }, []);

  if (checking) {
    return (
      <Box sx={{
        minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center"
      }}>
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

  const metrics = [
    { label: "Total Pets", value: 120 },
    { label: "Active Users", value: 45 },
    { label: "Breeds", value: 30 },
    { label: "Food Types", value: 15 },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, color: "#4e3e15" }}>
        Welcome to PetSocial Admin Panel
      </Typography>
      <Typography variant="body1" sx={{ mt: 1, mb: 3 }}>
        The API is live. You’re good to go!
      </Typography>
      <Grid container spacing={2}>
        {metrics.map((m) => (
          <Grid item xs={12} sm={6} md={3} key={m.label}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: "0 4px 24px #0001",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 6px 32px #0002",
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" color="#7a5c27">
                  {m.label}
                </Typography>
                <Typography variant="h4" color="#ae8625" fontWeight={700}>
                  {m.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
