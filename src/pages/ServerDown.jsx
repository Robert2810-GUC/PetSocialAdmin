import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const CHECK_INTERVAL = 5000; // 5 seconds
const API_CHECK_URL = "/weatherforecast";

export default function ServerDown() {
  const [checking, setChecking] = useState(true);
  const [attempts, setAttempts] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      checkServer();
    }, CHECK_INTERVAL);

    checkServer(); // run immediately on mount

    return () => clearInterval(interval);
  }, []);

  const checkServer = async () => {
    setChecking(true);
    try {
      const res = await fetch(API_CHECK_URL, { method: "GET" });
      if (res.ok) {
        navigate("/"); // Redirect to home or dashboard
      }
    } catch (err) {
      setAttempts((prev) => prev + 1);
    }
    setChecking(false);
  };

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
        p: 4,
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 700, color: "#b8860b", mb: 2 }}>
        🚧 Server is Down
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, color: "#6c4f1d" }}>
        We're trying to reach the server. This page will refresh automatically once it's back online.
      </Typography>

      <CircularProgress sx={{ color: "#ae8625" }} />
      <Typography variant="caption" sx={{ mt: 2 }}>
        Attempt #{attempts + 1} • Retrying every {CHECK_INTERVAL / 1000}s
      </Typography>

      <Button variant="outlined" sx={{ mt: 4 }} onClick={checkServer}>
        Retry Now
      </Button>
    </Box>
  );
}
