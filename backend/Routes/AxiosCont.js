const axios = require("axios");
export const AxiosCont = axios.create({
    baseURL:"http://localhost:9099/"
})