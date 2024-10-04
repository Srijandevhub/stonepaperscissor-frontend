import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./assets/css/font.css";
import './assets/css/ui.css';
import "./assets/css/style.css";
import './assets/css/buttons.css';
import './assets/css/card.css';
import './assets/css/container.css';
import './assets/css/flex.css';
import './assets/css/form.css';
import './assets/css/grid.css';
import './assets/css/margin.css';
import './assets/css/padding.css';
import './assets/css/table.css';
import './assets/css/textandbackground.css';
import './assets/css/typography.css';
import './assets/css/fileuploads.css';
import './assets/css/responsive.css';
import './assets/css/game.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    <ToastContainer />
  </React.StrictMode>
);