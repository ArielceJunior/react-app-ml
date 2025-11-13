// src/api.js
import axios from 'axios';

const api = axios.create({
  
  baseURL: 'https://ariflaskml-dff5g9c7bdhyhsc5.brazilsouth-01.azurewebsites.net/', 
});

export default api;