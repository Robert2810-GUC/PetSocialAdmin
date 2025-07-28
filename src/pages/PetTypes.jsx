import React, { useEffect, useState } from "react";
import { api, API_BASE_URL } from "../api";
import { Table, TableBody, TableCell, TableHead, TableRow, CircularProgress, Box, Button } from "@mui/material";

function PetTypes() {
  const [petTypes, setPetTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPetTypes();
  }, []);

  async function fetchPetTypes() {
    setLoading(true);
    const res = await api.get("/api/lookup/pet-types");
    setPetTypes(res.data);
    setLoading(false);
  }

  return (
    <Box p={2}>
      <h2>Pet Types</h2>
      {loading ? (
        <CircularProgress />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {petTypes.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <img
                    src={
                      row.imagePath.startsWith("http")
                        ? row.imagePath
                        : API_BASE_URL + row.imagePath
                    }
                    alt={row.name}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 8,
                      objectFit: "cover",
                    }}
                  />
                </TableCell>
                <TableCell>{row.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
}

export default PetTypes;
