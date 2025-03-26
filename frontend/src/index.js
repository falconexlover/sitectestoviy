import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './styles/variables.css';
import './styles/mixins.css';
import reportWebVitals from './reportWebVitals';

// Импорт и настройка Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faUtensils, faSpa, faDumbbell, faSwimmingPool, faChild, 
  faBellConcierge, faCheck, faHome, faBed, faPhone, 
  faEnvelope, faUser, faMapMarkerAlt, faCalendarAlt, 
  faArrowRight, faClock, faWifi, faCar, faStar, faSearch,
  faExpand
} from '@fortawesome/free-solid-svg-icons';
import { 
  faFacebookF, faTwitter, faInstagram, faTelegram, faVk 
} from '@fortawesome/free-brands-svg-icons';

// Добавляем иконки в библиотеку
library.add(
  faUtensils, faSpa, faDumbbell, faSwimmingPool, faChild, 
  faBellConcierge, faCheck, faHome, faBed, faPhone, 
  faEnvelope, faUser, faMapMarkerAlt, faCalendarAlt, 
  faArrowRight, faClock, faWifi, faCar, faStar, faSearch,
  faExpand,
  faFacebookF, faTwitter, faInstagram, faTelegram, faVk
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
