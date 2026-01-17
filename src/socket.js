import io from "socket.io-client";

console.log("VITE_APP_BACKEND =", import.meta.env.VITE_APP_BACKEND);
const socket = io.connect(
  import.meta.env.VITE_APP_BACKEND
);

export default socket;