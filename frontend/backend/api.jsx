import axios from "axios";

class API {
  constructor() {
    this.client = axios.create({
      baseURL: "http://localhost:5000",
      timeout: 20000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this._initializeInterceptors();
  }

  _initializeInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        const method = config.method?.toUpperCase();
        const url = `${config.baseURL}${config.url}`;

        console.log(
          `%c[API REQUEST] ${method} ${url}`,
          "color: #1976d2; font-weight: bold;"
        );

        if (config.params) {
          console.log("➡ Params:", config.params);
        }

        if (config.data) {
          console.log("➡ Payload:", config.data);
        }

        return config;
      },
      (error) => {
        console.error("[API REQUEST ERROR]", error);
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        console.log(
          `%c[API RESPONSE] ${response.status} ${response.config.url}`,
          "color: #2e7d32; font-weight: bold;"
        );
        return response;
      },
      (error) => {
        const status = error.response?.status;
        const url = error.config?.url;

        console.error(
          `%c[API RESPONSE ERROR] ${status || "NO STATUS"} ${url}`,
          "color: #d32f2f; font-weight: bold;"
        );

        return Promise.reject(error);
      }
    );
  }


  register(data) {
    return this.client.post("/api/auth/register", data);
  }

  login(data) {
    return this.client.post("/api/auth/login", data);
  }

  masterslist(tablename){
    return this.client.get(`/api/masters/list/${tablename}`);
  }

  masteradd(data){
    return this.client.post(`/api/masters/add`,data);
  }

  masteredit(data){
    return this.client.put(`/api/masters/edit`,data);
  }

  masterdelete(data){
    return this.client.delete(`/api/masters/delete`,data);
  }

  savedonor(data){
    return this.client.post(`/api/donors/add`,data);
  }

}

export default new API();
