import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import './css/mobile-big.css';
import './css/mobile-small.css';
import './css/tablet.css';
import {createStore} from "redux";
import {Provider} from "react-redux";
import reducer from "./redux/reducers";
import HomePage from "./main/Main";
import {ToastContainer} from "react-toastify";
import conf from './config';
import {AuthProvider} from 'oidc-react';
import "./i18n/i18n";

const store = createStore(
    reducer);

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
/* global document */
root.render(
    <Provider store={store}>
      <AuthProvider {...conf.oidcConfig}>
        <HomePage/>
        <ToastContainer/>
      </AuthProvider>
    </Provider>);