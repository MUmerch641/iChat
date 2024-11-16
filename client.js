const checkbox = document.getElementById("checkbox");
const chatMessages = document.getElementById("chatMessages");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");

var audio = new Audio('Msg.mp3');

// Dark mode toggle
checkbox.addEventListener("change", () => {
    document.body.classList.toggle("dark");
});

const socket = io('http://localhost:9000');

// Send message
sendButton.addEventListener('click', () => {
    const userMessage = messageInput.value.trim();
    if (userMessage) {
        appendMessage(`You: ${userMessage}`, 'right');
        socket.emit('send', userMessage);
        messageInput.value = '';
    }
});

// Append message to the chat
const appendMessage = (msg, position) => {
    const msgDiv = document.createElement('div');
    msgDiv.innerText = msg;
    msgDiv.classList.add('message');
    msgDiv.classList.add(position);
    chatMessages.append(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    audio.play();
};

let userName = prompt('Enter your name to join');

if (userName!=null) {
    socket.emit("new-user-joined", userName);
    
    socket.on('user-joined', (userName) => {
        appendMessage(`${userName} joined the chat`, 'left');
    });
}

socket.on('receive', (data) => {
    appendMessage(`${data.message}: ${data.userName}`, 'left');
});

socket.on('left', (name) => {
    appendMessage(`${name} left the chat`, 'left');
});
