import React from "react";
import { List, Card, CardContent, Typography, Box, Avatar, CircularProgress } from "@mui/material";
import EventAvailableIcon from '@mui/icons-material/EventAvailable';


const HolidayList = ({ holidays }) => {
  const today = new Date();
  const isToday = (date) =>
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  return (
    <Box sx={{ overflowY: 'auto', maxHeight: 500 }}>
      <List>
        {holidays.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          holidays.map((holiday) => (
            <Card
              key={holiday.id}
              sx={{
                mb: 2,
                background: isToday(holiday.date)
                  ? 'linear-gradient(90deg, #f7971e 0%, #ffd200 100%)'
                  : 'white',
                boxShadow: isToday(holiday.date)
                  ? 6
                  : 1,
                borderLeft: isToday(holiday.date)
                  ? '6px solid #f7971e'
                  : '6px solid #1976d2',
                transition: 'all 0.2s',
              }}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: isToday(holiday.date) ? '#f7971e' : '#1976d2' }}>
                  <EventAvailableIcon />
                </Avatar>
                <Box>
                  <Typography variant={isToday(holiday.date) ? 'h6' : 'subtitle1'} fontWeight={isToday(holiday.date) ? 700 : 500} color={isToday(holiday.date) ? '#f7971e' : 'text.primary'}>
                    {holiday.name || 'Holiday'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {holiday.date.toLocaleDateString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </List>
    </Box>
  );
};

export default HolidayList;
