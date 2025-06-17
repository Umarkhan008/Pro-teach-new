import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import back from '../assets/bac.mp4';
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
import { getDatabase, ref, set, onValue, push, update } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import styles from "./Message.module.css"
import BasicNavbar from '../Basic/BasicNavbar';

const firebaseConfig = {
    apiKey: "AIzaSyC94X37bt_vhaq5sFVOB_ANhZPuE6219Vo",
    authDomain: "project-pro-7f7ef.firebaseapp.com",
    databaseURL: "https://project-pro-7f7ef-default-rtdb.firebaseio.com",
    projectId: "project-pro-7f7ef",
    storageBucket: "project-pro-7f7ef.firebasestorage.app",
    messagingSenderId: "782106516432",
    appId: "1:782106516432:web:d4cd4fb8dec8572d2bb7d5",
    measurementId: "G-WV8HFBFPND"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

const Message = () => {
    const location = useLocation();
    const receivedData = location.state;  
    { console.log(receivedData) }
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [typing, setTyping] = useState(false);
    const [otherUserTyping, setOtherUserTyping] = useState(false);

    useEffect(() => {
        const messagesRef = ref(database, 'messages');
        onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setMessages(Object.values(data));
            }
        });

        const typingRef = ref(database, 'typing');
        onValue(typingRef, (snapshot) => {
            const data = snapshot.val();
            if (data && data.user !== receivedData) {
                setOtherUserTyping(data.typing);
            }
        });
    }, [receivedData]);

    const handleSendMessage = () => {
        const messagesRef = ref(database, 'messages');
        const newMessageRef = push(messagesRef);
        set(newMessageRef, {
            text: newMessage,
            timestamp: Date.now(),
            user: receivedData || 'Anonymous' // Foydalanuvchi ismi formData'dan olinadi yoki 'Anonymous'
        });
        setNewMessage('');
        update(ref(database, 'typing'), { typing: false, user: receivedData });
    };

    const handleTyping = (e) => {
        setNewMessage(e.target.value);
        if (!typing) {
            setTyping(true);
            update(ref(database, 'typing'), { typing: true, user: receivedData });
        }
        if (e.target.value === '') {
            setTyping(false);
            update(ref(database, 'typing'), { typing: false, user: receivedData });
        }
    };

    return (
        <div>
            <video autoPlay loop>
                <source src={back} />
            </video>
            <BasicNavbar />
            <div className={styles.chat}>
                <div className={styles.chatContainer}>
                    <div className={styles.chatHeader}>
                        <h3>Chat</h3>
                    </div>
                    <div className="flex-1 p-2.5 overflow-y-auto flex flex-col gap-3.5">
                        {messages.map((message, index) => (
                            <div 
                                key={index} 
                                className={`flex items-end gap-2.5 ${message.user === receivedData ? 'justify-end' : 'justify-start'}`}
                            >
                                <img className="w-10 h-10 rounded-full object-cover" src="https://via.placeholder.com/40" alt="User" />
                                <div className="max-w-[70%] p-2.5 rounded-lg relative text-sm leading-[1.4]">
                                    <p>{message.text}</p>
                                    <span className={styles.time}>{new Date(message.timestamp).toLocaleTimeString()}</span>
                                </div>
                            </div>
                        ))}
                        {otherUserTyping && <div className={styles.typingIndicator}>Yozmoqda...</div>}
                    </div>
                    <div className={styles.chatFooter}>
                        <input
                            type="text"
                            placeholder="Xabar yozing..."
                            value={newMessage}
                            onInput={handleTyping}
                        />
                        <button onClick={handleSendMessage}>Yuborish</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Message;