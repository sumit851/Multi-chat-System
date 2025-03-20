const token = localStorage.getItem("token"); //tries by specifying explicitly jwt token

console.log(
  "Socket auth token received:",
  socket.handshake.auth?.token ? "Yes" : "No"
);

const socket = io("http://localhost:8000", {
  auth: { token: token },
});

socket.on("connect", () => {
  console.log("Connected to socket:", socket.id);

  socket.emit("private_message", {
    reciptId: selectedUserId,
    message: "Hello there!",
  });
});

function joinRoom(room) {
  document.getElementById("room-name").innerText = `Room: ${room}`;
  document.getElementById("messages").innerHTML = "";
  socket.emit("joinRoom", room);
}

function startPrivateChat(user) {
  document.getElementById("room-name").innerText = `Chat with: ${user}`;
  document.getElementById("messages").innerHTML = "";
  socket.emit("startPrivateChat", user);
}

function sendMessage() {
  const messageInput = document.getElementById("message-input");
  const message = messageInput.value;
  if (message.trim() !== "") {
    socket.emit("message", message);
    addMessageToChat(message, "sent");
    messageInput.value = "";
  }
}

socket.on("message", (message) => {
  addMessageToChat(message, "received");
});

function addMessageToChat(message, type) {
  const messagesContainer = document.getElementById("messages");
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", type);
  messageElement.innerText = message;
  messagesContainer.appendChild(messageElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
