import { styled } from '@mui/material/styles';
import { Box, Button, Typography } from '@mui/material';

export const Container = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.default,
}));

export const Header = styled('header')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2), // Adjusted spacing using theme
  borderBottom: `1px solid ${theme.palette.divider}`, // Adjusted styling using theme
  paddingBottom: theme.spacing(1), // Adjusted spacing using theme
  '@media (max-width: 960px)': {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
}));

export const TitleContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  '@media (max-width: 960px)': {
    marginBottom: theme.spacing(1), // Adjusted spacing using theme
  },
}));

export const CompanyLogo = styled('img')({
  height: '40px',
  marginLeft: '16px',
});

export const Main = styled('main')({
  display: 'flex',
  flex: 1,
  overflowY: 'auto',
  '@media (max-width: 960px)': {
    flexDirection: 'column',
  },
});

export const Sidebar = styled('aside')(({ theme }) => ({
  minWidth: '240px',
  backgroundColor: '#fff', // Adjusted for clarity
  boxShadow: theme.shadows[1], // Adjusted using theme shadows
  borderRadius: theme.shape.borderRadius, // Adjusted using theme shape
  '@media (max-width: 960px)': {
    width: '100%',
    marginBottom: theme.spacing(2),
    display: 'flex', // Sidebar as row on small screens
    overflowX: 'auto',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
}));

export const Content = styled('div')(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(2),
  overflowY: 'auto',
  backgroundColor: '#fff', // Adjusted for clarity
  borderRadius: theme.shape.borderRadius, // Adjusted using theme shape
}));

export const Section = styled('section')({
  marginBottom: '16px',
});

export const SectionTitle = styled(Typography)({
  marginBottom: '12px', // Adjusted spacing
});

export const EmployeeDetails = styled(Box)({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: '12px', // Adjusted spacing
});

export const Avatar = styled('img')({
  width: '220px',
  height: '220px',
  borderRadius: '90%',
  boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)', // Adjusted styling
  marginRight: '12px', // Adjusted spacing
});

export const PersonalInfo = styled(Box)({
  flex: 1,
});

export const DataItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '8px', // Adjusted spacing
});

export const ViewButton = styled(Button)({
  display: 'flex',
  marginLeft: '100px', // Adjusted spacing
});

export const MarkButton = styled(Button)({
  backgroundColor: '#1976d2',
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#1565c0',
  },
});
