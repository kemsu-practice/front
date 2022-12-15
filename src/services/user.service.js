import axios from 'axios';
import authHeader from './auth-header';

class UserService {
  getPublicContent() {
    return axios.get(process.env.VUE_APP_API_URL + 'all');
  }

  getUserBoard() {
    return axios.get(process.env.VUE_APP_API_URL + 'auth/profile', { headers: authHeader() });
  }

  getModeratorBoard() {
    return axios.get(process.env.VUE_APP_API_URL + 'mod', { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(process.env.VUE_APP_API_URL + 'admin', { headers: authHeader() });
  }
}

export default new UserService();
