import Axios from 'axios';

const instance = Axios.create({
    withCredentials: true,
    baseURL: "https://costume-management-server.herokuapp.com/api"
});

export default instance;