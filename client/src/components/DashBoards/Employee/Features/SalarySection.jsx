import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Grid,
} from "@mui/material";
import { getCurrentMonthSalary } from "../../../../Services/employeeService";
import { auth } from "../../../../utils/firebaseConfig";

const SalarySection = () => {
  const [salaryData, setSalaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalaryData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not logged in");

        const data = await getCurrentMonthSalary(user.uid);
        setSalaryData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching salary data:", err);
        setError("Failed to load salary information");
      } finally {
        setLoading(false);
      }
    };

    fetchSalaryData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Card sx={{ bgcolor: "#ffebee", p: 2 }}>
        <Typography color="error">{error}</Typography>
      </Card>
    );
  }

  if (!salaryData) {
    return (
      <Card>
        <CardContent>
          <Typography color="textSecondary">No salary data available</Typography>
        </CardContent>
      </Card>
    );
  }

  const currentMonth = new Date().toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <Card sx={{ mb: 3, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", mb: 2 }}>
          💰 Salary Information - {currentMonth}
        </Typography>

        <Grid container spacing={2}>
          {/* Monthly Salary */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ p: 2, bgcolor: "#e3f2fd", borderRadius: 1 }}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Monthly Salary
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "#1976d2" }}>
                ₹{salaryData.monthlySalary.toLocaleString()}
              </Typography>
            </Box>
          </Grid>

          {/* Daily Rate */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ p: 2, bgcolor: "#f3e5f5", borderRadius: 1 }}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Daily Rate
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "#7b1fa2" }}>
                ₹{salaryData.dailyRate.toLocaleString()}
              </Typography>
            </Box>
          </Grid>

          {/* Total Working Days */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ p: 2, bgcolor: "#f1f8e9", borderRadius: 1 }}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Total Days (This Month)
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "#558b2f" }}>
                {salaryData.totalDaysInMonth} days
              </Typography>
            </Box>
          </Grid>

          {/* Present Days */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ p: 2, bgcolor: "#e8f5e9", borderRadius: 1 }}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Present Days (This Month)
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "#2e7d32" }}>
                {salaryData.presentDays} days
              </Typography>
            </Box>
          </Grid>

          {/* Current Month Salary */}
          <Grid item xs={12}>
            <Box
              sx={{
                p: 2.5,
                bgcolor: "#1b5e20",
                borderRadius: 1,
                textAlign: "center",
              }}
            >
              <Typography variant="subtitle2" sx={{ color: "#c8e6c9", mb: 1 }}>
                Your Current Month Salary (Based on Attendance)
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  color: "#fff",
                }}
              >
                ₹{salaryData.currentMonthSalary.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SalarySection;
