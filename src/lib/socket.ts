import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (token?: string) => {
    if (!socket) {
        socket = io("https://lawal.sakibalhasa.xyz", {
            transports: ["websocket"],
            auth: {
                token, // JWT if backend expects it
            },
        });
    }
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
