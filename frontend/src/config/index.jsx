import axios from "axios";


   export const Bash_URL="https://pro-connect-2.onrender.com"
export const clientServer = axios.create({
  baseURL: Bash_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
