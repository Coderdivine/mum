const axios = require("axios");
const AxiosCont = axios.create({
    baseURL:"http://localhost:9099/"
})
module.exports = AxiosCont