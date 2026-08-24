import axios from "axios";

const instance = axios.create({
    baseURL: "https://public-ai-resume-mern.onrender.com",
});

export default instance;