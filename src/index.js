import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { createStore,applyMiddleware } from "redux";
import { Provider } from "react-redux";
import rootReducer from "./store/reducers";
import createSagaMiddleware from 'redux-saga'
import indexSaga from "./store/sagas";
import 'bootstrap-v4-rtl/dist/css/bootstrap-rtl.css';


//components
import App from "./App";

import * as serviceWorker from "./serviceWorker";

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

const store = createStore(rootReducer,applyMiddleware(sagaMiddleware));

// then run the saga
sagaMiddleware.run(indexSaga);

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
