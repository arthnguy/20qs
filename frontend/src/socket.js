import io from "socket.io-client";

const socket = io.connect("https://two0qs.onrender.com");

export default socket;