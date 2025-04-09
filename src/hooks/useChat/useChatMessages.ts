import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase";

interface Message {
  id: string;
  text: string;
  senderId: string;
  createdAt: Timestamp;
  senderUserName: string;
}

export function useChatMessages(chatId: string) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!chatId) return;

    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [chatId]);

  return messages;
}

interface Chat {
  id: string;
  participants: string[];
  lastMessage?: string;
}

export function useUserChats(userId: string) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    console.log("🔍 Buscando chats para o usuário:", userId);

    // Agora a query vai encontrar os chats pelo campo `participants`
    const chatsRef = collection(db, "chats");
    const q = query(chatsRef, where("participants", "array-contains", userId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatData: Chat[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Chat[];

      console.log("📌 Todos os chats do usuário:", chatData);
      setChats(chatData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return { chats, loading };
}


