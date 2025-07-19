// Script for the chatbox 

document.addEventListener("DOMContentLoaded", function () {
    const sendMessageButton = document.getElementById("sendMessage");
    const messageInput = document.getElementById("messageInput");
    const chatBox = document.getElementById("chatBox");
    const pinnedBox = document.getElementById("pinnedBox");

    // Load messages from localStorage
    function loadMessages() {
        let messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
        messages.forEach(({ text, pinned }) => {
            let messageDiv = createMessageElement(text, "You", pinned); 
            chatBox.appendChild(messageDiv);
            if (pinned) pinMessage(text);
        });
    }
    
    // Save messages to localStorage
    function saveMessages() {
        let messages = Array.from(chatBox.children).map(div => {
            let text = div.querySelector(".message-text").innerText;
            let pinned = div.querySelector(".pin-button").classList.contains("pinned");
            return { text, pinned };
        });
        localStorage.setItem("chatMessages", JSON.stringify(messages));
    }

    // Create a chat message bubble with pin & delete buttons
    function createMessageElement(text, sender = "You", isPinned = false) {
        let messageDiv = document.createElement("div");
        messageDiv.classList.add("textMessage", "d-flex", "justify-content-between", "align-items-center", "p-2", "mb-2", "rounded");

        // Determine if the message is from the user or received from someone else
        if (sender === "You") {
            messageDiv.classList.add("sent-message");
        } else {
            messageDiv.classList.add("received-message");
        }

        messageDiv.innerHTML = `<div><strong>${sender}</strong><p class="mb-0 message-text">${text}</p></div>`;

        let buttonGroup = document.createElement("div");

        // Pin button
        let pinButton = document.createElement("button");
        pinButton.innerHTML = `<i class="${isPinned ? 'fas' : 'fa-solid'} fa-thumbtack"></i>`;
        pinButton.classList.add("btn", "btn-sm", "text-white", "pin-button");
        if (isPinned) pinButton.classList.add("pinned");

        pinButton.addEventListener("click", function () {
            if (!pinButton.classList.contains("pinned")) {
                pinButton.classList.add("pinned");
                pinButton.innerHTML = '<i class="fa-solid fa-thumbtack-slash text-white"></i>';
                pinMessage(text);
            } else {
                pinButton.classList.remove("pinned");
                pinButton.innerHTML = '<i class="fa-solid fa-thumbtack text-white"></i>';
                unpinMessage(text);
            }
            saveMessages();
        });

        // Delete button
        let deleteButton = document.createElement("button");
        deleteButton.innerHTML = `<i class="fas fa-trash"></i>`;
        deleteButton.classList.add("btn", "btn-sm", "btn-bin", "ms-2");
        deleteButton.addEventListener("click", function () {
            deleteMessage(text, messageDiv);
        });

        buttonGroup.appendChild(pinButton);
        buttonGroup.appendChild(deleteButton);
        messageDiv.appendChild(buttonGroup);

        return messageDiv;
    }

    // Function to create a pinned message bubble (with Unpin button)
    function pinMessage(text) {
        if (Array.from(pinnedBox.children).some(msg => msg.getAttribute("data-text") === text)) return;

        let pinnedDiv = document.createElement("div");
        pinnedDiv.classList.add("pinned-message", "d-flex", "justify-content-between", "align-items-center", "p-2", "mb-2", "rounded");
        pinnedDiv.setAttribute("data-text", text);

        let textDiv = document.createElement("div");
        textDiv.innerHTML = `<p class="mb-0">${text}</p>`;

        let unpinBtn = document.createElement("button");
        unpinBtn.classList.add("btn", "unpinBtn", "btn-sm");
        unpinBtn.textContent = "Unpin";
        unpinBtn.addEventListener("click", function () {
            unpinMessage(text);
            saveMessages();
        });

        pinnedDiv.appendChild(textDiv);
        pinnedDiv.appendChild(unpinBtn);
        pinnedBox.appendChild(pinnedDiv);
    }

    // Function to unpin a message from pinned section
    function unpinMessage(text) {
        Array.from(pinnedBox.children).forEach(pinnedDiv => {
            if (pinnedDiv.getAttribute("data-text") === text) {
                pinnedDiv.remove();
            }
        });

        Array.from(chatBox.children).forEach(messageDiv => {
            let msgText = messageDiv.querySelector(".message-text").innerText;
            if (msgText === text) {
                let pinButton = messageDiv.querySelector(".pin-button");
                if (pinButton && pinButton.classList.contains("pinned")) {
                    pinButton.classList.remove("pinned");
                    pinButton.innerHTML = '<i class="far fa-thumbtack"></i>';
                }
            }
        });
    }

    // Function to delete a message
    function deleteMessage(text, messageDiv) {
        messageDiv.remove();
        unpinMessage(text);
        saveMessages();
    }

    function sendMessage() {
        let messageText = messageInput.value.trim();
        if (messageText === "") return;

        let messageDiv = createMessageElement(messageText);
        chatBox.appendChild(messageDiv);
        saveMessages();
        messageInput.value = "";
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Load messages on page load
    loadMessages();

    // Event listeners for sending messages
    sendMessageButton.addEventListener("click", sendMessage);
    messageInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });
});
