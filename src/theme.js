import { createTheme } from '@mui/material/styles';

const gold = '#ae8625';
const brown = '#7a5c27';
const offWhite = '#fffbe6';

const theme = createTheme({
  palette: {
    primary: { main: gold, contrastText: '#fff' },
    secondary: { main: brown },
    background: { default: '#fcf7f1', paper: '#fff' },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: offWhite,
          transition: 'transform 0.3s ease-in-out',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'background-color 0.3s, transform 0.3s',
          '&:hover': {
            backgroundColor: '#f2e6da',
            transform: 'translateX(4px)',
          },
          '&.Mui-selected': {
            backgroundColor: '#f2e6da',
            color: gold,
            '&:hover': {
              backgroundColor: '#e8dccf',
            },
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.3s',
          '&:nth-of-type(odd)': {
            backgroundColor: offWhite,
          },
          '&:hover': {
            backgroundColor: '#f7f1e3',
          },
        },
      },
    },
  },
});

export default theme;
