import axios from 'axios';
import authHeader from "@/services/auth-header";

class GamesService {
  list() {
    return axios
      .get(process.env.VUE_APP_API_URL + 'games', { headers: authHeader() });
  }

  create() {
    return axios
      .post(process.env.VUE_APP_API_URL + 'games', {}, { headers: authHeader() });
  }

  get(id) {
    return axios
      .get(`${process.env.VUE_APP_API_URL}games/${id}`, { headers: authHeader() });
  }

  sendField(id, cells) {
    return axios
      .post(`${process.env.VUE_APP_API_URL}games/${id}/field`, {
        cells
      }, { headers: authHeader() });
  }

  join(id) {
    return axios
      .post(`${process.env.VUE_APP_API_URL}games/${id}/join`, {}, { headers: authHeader() });
  }

  shot(id, row, col) {
    return axios
      .post(`${process.env.VUE_APP_API_URL}games/${id}/shot`, {
        row, col
      }, { headers: authHeader() });
  }
}

export default new GamesService();
