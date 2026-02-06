import axios from "axios";


   export const Bash_URL="http://localhost:5000"
export const clientServer = axios.create({
  baseURL: Bash_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
