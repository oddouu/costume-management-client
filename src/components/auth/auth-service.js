import axios from "axios";

class AuthService {
  constructor() {
    let service = axios.create({
      baseURL: "https://costume-management-server.herokuapp.com/api",
      withCredentials: true,
    });
    this.service = service;
  }

  signup = (username, password) => {
    return this.service
      .post("/signup", { username, password })
      .then((response) => {
        return response;
      })
      .catch((err) => err.response.data.message);
  };

  login = (username, password) => {
    return this.service
      .post("/login", { username, password })
      .then((response) => response)
      .catch((err) => err.response.data.message);
  };

  loggedin = () => {
    return this.service
      .get("/loggedin")
      .then((response) => {
        return response.data;
      })
      .catch((err) => err.response.data.message);
  };

  logout = () => {
    return this.service
      .post("/logout")
      .then((response) => {
        return response.data;
      })
      .catch((err) => err.response.data.message);
  };
}

export default AuthService;
