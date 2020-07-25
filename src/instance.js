import Axios from 'axios';

const instance = Axios.create({
    baseURL: "https://costume-management-server.herokuapp.com/api",
    withCredentials: true
});

export default instance;