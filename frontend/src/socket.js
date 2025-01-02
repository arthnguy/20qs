import io from "socket.io-client";

const socket = io.connect(process.env.SERVER);

export default socket;