import App from "./App";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

export default ({ store }) => (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
