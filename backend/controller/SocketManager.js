import { Server } from "socket.io";

let connections = {};
let messages = {};     
let timeOnline = {};

export const connectToSocket = (server) => {
  const io = new Server(server,
    {
      cors:{
        origin:"*",
        methods:["GET","POST"],
        allowedHeaders:["*"],
        credentials:true
      }
    }
  );  

  io.on("connection", (socket) => {
    console.log("Someone connected:", socket.id);
    console.log("socket connected successfully")

    socket.on("join-call", (room_id) => {
      console.log(`A new member joined the meeting: ${room_id}`);

      if (!connections[room_id]) {
        connections[room_id] = [];    
      }

      connections[room_id].push(socket.id);  
      timeOnline[socket.id] = Date.now();     

      connections[room_id].forEach((otherSocketId) => {
        io.to(otherSocketId).emit("user-joined", socket.id, connections[room_id]);  
      });

      if (messages[room_id]) {   
        messages[room_id].forEach((msg) => {
          io.to(socket.id).emit("chat-message", msg.data, msg.sender, msg["socket-id-sender"]);
        });
      }
    });

    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message);  
    });

    socket.on("chat-message", (data, sender) => {
      const [matchingRoom, found] = Object.entries(connections).reduce(
        ([room, isFound], [roomKey, roomValue]) => {
          if (!isFound && roomValue.includes(socket.id)) {
            return [roomKey, true];
          }
          return [room, isFound];
        },
        ["", false]
      );

      if (found) {
        if (!messages[matchingRoom]) {
          messages[matchingRoom] = [];   
        }

        messages[matchingRoom].push({
          sender,
          data,
          "socket-id-sender": socket.id,
        });  

        connections[matchingRoom].forEach((elem) => {
          io.to(elem).emit("chat-message", data, sender, socket.id);  
        });
      }
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);

      for (const [roomId, socketIds] of JSON.parse(JSON.stringify(Object.entries(connections)))) {
        const index = socketIds.indexOf(socket.id);
        if (index !== -1) {
          connections[roomId].splice(index, 1);   

          connections[roomId].forEach((otherSocketId) => {
            io.to(otherSocketId).emit("user-left", socket.id);   
          });

          if (connections[roomId].length === 0) {
            delete connections[roomId];  
            delete messages[roomId];      
          }
          break;
        }
      }

      delete timeOnline[socket.id];   
    });
  });

  return io;
};
