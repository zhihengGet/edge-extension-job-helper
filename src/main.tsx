import * as React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

import CssBaseline from '@mui/material/CssBaseline';
import {
  createTheme,
  ThemeProvider,
} from '@mui/material/styles';

import App from './App';
import { store } from './redux/store';

const outerTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={outerTheme}>
      <CssBaseline />
      <React.StrictMode>
        <App />
      </React.StrictMode>{" "}
    </ThemeProvider>
  </Provider>,
  document.getElementById("root")
);
