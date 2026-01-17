import io from "socket.io-client";

const socket = io.connect(
  import.meta.env.VITE_APP_BACKEND
);

export default socket;