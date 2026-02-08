import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { fetchEmployeePaySlips } from "../../../Services/employeeService";

export default function EmployeePayslip({userId}) {
  const [paySlips, setPaySlips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPaySlips = async () => {
      try {
        const data = await fetchEmployeePaySlips(userId);
        setPaySlips(data);
      } catch (error) {
        console.error("Failed to load payslips", error);
      } finally {
        setLoading(false);
      }
    };

    loadPaySlips();
  }, [userId]);

  if (loading) {
    return (
      <Box sx={{ padding: "20px", textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (paySlips.length === 0) {
    return (
      <Box sx={{ padding: "20px" }}>
        <Typography>No payslips generated yet.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "10px", display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h6">PaySlips</Typography>

      {paySlips.map((slip, index) => (
        <Card
          key={slip.id}
          sx={{
            borderLeft: index === 0 ? "4px solid #1976d2" : "4px solid transparent",
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                {slip.month} {slip.year}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Paid Amount: ₹{slip.paidAmount}
              </Typography>

              {slip.createdAt && (
                <Typography variant="caption" color="text.secondary">
                  Generated on:{" "}
                  {slip.createdAt.toDate().toLocaleDateString("en-IN")}
                </Typography>
              )}
            </Box>

            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={() => window.open(slip.paySlipUrl, "_blank")}
            >
              Download
            </Button>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
