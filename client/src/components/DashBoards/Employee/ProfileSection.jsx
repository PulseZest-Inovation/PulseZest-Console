import React from "react";
import {
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";

const ProfileSection = ({ userData }) => {
  return (
    <div
      style={{
        overflowY: "auto",
        maxHeight: "calc(100vh - 260px)",
        paddingRight: "15px",
        paddingBottom: "80px",
      }}
    >
      <div style={{ marginBottom: "30px" }}>
        <Avatar
          src={userData.passportPhotoUrl}
          style={{ width: "100px", height: "100px", marginRight: "20px" }}
        />
      </div>
      <TableContainer
        style={{ maxHeight: "calc(100vh - 280px)", overflowY: "auto" }}
      >
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <strong>Name:</strong>
              </TableCell>
              <TableCell>{userData.fullName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Email:</strong>
              </TableCell>
              <TableCell>{userData.email}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Address:</strong>
              </TableCell>
              <TableCell>{userData.address}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Phone:</strong>
              </TableCell>
              <TableCell>{userData.phoneNumber}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Alternative Phone No:</strong>
              </TableCell>
              <TableCell>{userData.alternativePhoneNumber}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Microsoft Teams Id:</strong>
              </TableCell>
              <TableCell>{userData.teamsId}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ProfileSection;