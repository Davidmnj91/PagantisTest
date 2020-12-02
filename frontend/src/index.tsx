import { CssBaseline, ThemeProvider } from '@material-ui/core';
import createMuiTheme, { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import DashBoard from './modules/dashboard/dashboard';
import reportWebVitals from './reportWebVitals';

export const theme: ThemeOptions = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#00aeee',
    },
    secondary: {
      main: '#00aeee',
    },
  },
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <DashBoard />
  </ThemeProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
