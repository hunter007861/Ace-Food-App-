import axios from "axios";

const Axios = axios.create({  
    baseURL: "https://aceinternational.herokuapp.com"
})

export { Axios}
