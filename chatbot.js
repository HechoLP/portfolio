// Configuration
const CHATBOT_API_KEY = 'sk-proj-5hHBrX3cUOPHqdNmxLHhIPNzQLNKgHrm7PKANa36gvZzU2Ib7BlJaQ_AKDgZVkrd_l2IrRqY7jT3BlbkFJ-CEsUmTyiR7TYN8M97xlm766VxIEIPdZAdtyf2ON4h412eq8a6Jq3VNJ3ACK6NNaBc6HgcEqY'; // ⚠️ 여기에 API 키를 입력하세요

// DOM Elements
const chatbotWindow = document.getElementById('chatbot-window');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const toggleBtn = document.getElementById('chat-toggle-btn');
const closeBtn = document.getElementById('close-chat-btn');

// State
let isChatOpen = false;
let messages = [
    { role: 'assistant', content: '안녕하세요! 무엇을 도와드릴까요? 포트폴리오에 대해 궁금한 점이 있으신가요?' }
];

function setToggleIcon(isOpen) {
    toggleBtn.innerHTML = isOpen
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
}

function toggleChat() {
    isChatOpen = !isChatOpen;
    chatbotWindow.classList.toggle('open', isChatOpen);
    setToggleIcon(isChatOpen);
}

toggleBtn.addEventListener('click', toggleChat);
closeBtn.addEventListener('click', () => {
    isChatOpen = false;
    chatbotWindow.classList.remove('open');
    setToggleIcon(false);
});

function renderMessages() {
    chatMessages.innerHTML = '';
    messages.forEach(msg => {
        const div = document.createElement('div');
        div.className = `message ${msg.role === 'user' ? 'user' : 'bot'}`;
        div.textContent = msg.content;
        chatMessages.appendChild(div);
    });
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    messages.push({ role: 'user', content: text });
    renderMessages();
    chatInput.value = '';

    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message bot';
    loadingDiv.textContent = '...';
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CHATBOT_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a helpful assistant for a developer's portfolio website. Answer politely and concisely in Korean." },
                    ...messages
                ]
            })
        });

        if (!response.ok) throw new Error('API Error');

        const data = await response.json();
        const botContent = data.choices[0].message.content;

        chatMessages.removeChild(loadingDiv);
        messages.push({ role: 'assistant', content: botContent });
        renderMessages();

    } catch (error) {
        console.error(error);
        chatMessages.removeChild(loadingDiv);
        messages.push({ role: 'assistant', content: '죄송합니다. 오류가 발생했습니다. API 키를 확인해주세요.' });
        renderMessages();
    }
}

sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

renderMessages();

