const axios = require("axios");
const AxiosCont = axios.create({
    baseURL:"https://ax-mum-herokuapp.com/"
})
module.exports = AxiosCont;