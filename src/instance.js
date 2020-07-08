import Axios from 'axios';

const instance = Axios.create({
    withCredentials: true,
    baseURL: "http://localhost:5000/api"
});

export default instance;