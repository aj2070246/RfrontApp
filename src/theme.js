import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  direction: 'rtl',
  typography: {
    textAlign: "right" ,
    fontFamily: 'Vazir, sans-serif', // فونت برای تمام پروژه
  },
  components: {
    MuiSelect: {
      styleOverrides: {
        root: {
            textAlign: "right" ,
          fontFamily: 'Vazir, sans-serif', // فونت برای Select
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
            textAlign: "right" ,
             fontFamily: 'Vazir, sans-serif', // فونت برای InputLabel
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
            textAlign: "right" ,
          fontFamily: 'Vazir, sans-serif', // فونت برای MenuItem
        },
      },
    },
  },
});

export default theme;
