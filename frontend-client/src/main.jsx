import React from 'react'
import ReactDOM from 'react-dom/client'

import './sass/index.scss'
import '@fortawesome/fontawesome-free/css/all.min.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import { store } from './redux/store';
import { Provider } from 'react-redux';

import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  // </React.StrictMode>,
)
