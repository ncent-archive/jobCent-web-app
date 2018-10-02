import React from "react";
import ReactDOM from "react-dom";
import "./scss/index.css";
import Root from "./root";
import configureStore from "./store/store";
import registerServiceWorker from "./registerServiceWorker";

let store;
store = configureStore();
window.getState = store.getState;
window.dispatch = store.dispatch;
ReactDOM.render(<Root store={store} />, document.getElementById("root"));
registerServiceWorker();
