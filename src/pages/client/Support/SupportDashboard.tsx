/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client"; // You'll need to install this: npm install socket.io-client
import { Send, X, ArrowLeft, Loader2 } from "lucide-react";
import { useGetMyTicketsQuery } from "@/store/Api/AdminApi/ClientSupportApi";

interface Ticket {
  id: string;
  subject: string;
  user: string;
  status: "open" | "closed" | "pending";
}

interface Message {
  id: string;
  ticketId: string;
  text: string;
  sender: "user" | "agent";
  timestamp: string;
}
// --- CONFIGURATION ---
const SOCKET_URL = "https://your-api-domain.com"; // Change to your API URL
const TICKETS_API_URL = import.meta.env.VITE_API_BASE_URL; // Change to your API URL

const SupportDashboard = () => {
  //   const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [socket, setSocket] = useState<Socket | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const { data, isLoading } = useGetMyTicketsQuery({});
  console.log(isLoading, data?.data);
  const tickets = data?.data;
  console.log(tickets);
  // 1. FETCH INITIAL TICKETS FROM API
  //   useEffect(() => {
  //     const fetchTickets = async () => {
  //       try {
  //         setLoading(true);
  //         const response = await fetch(TICKETS_API_URL);
  //         const data = await response.json();
  //         setTickets(data);
  //       } catch (error) {
  //         console.error("Failed to fetch tickets:", error);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };
  //     fetchTickets();
  //   }, []);

  // 2. INITIALIZE REAL SOCKET.IO
  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ["websocket"],
    });

    newSocket.on("receive_message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    newSocket.on("display_typing", (data: { isTyping: boolean }) => {
      setIsTyping(data.isTyping);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect(); // ✔ returns void implicitly
    };
  }, []);

  // 3. JOIN SPECIFIC ROOM WHEN TICKET IS SELECTED
  useEffect(() => {
    if (selectedTicket && socket) {
      // Clear previous chat messages and join room
      setMessages([]);
      socket.emit("joinTicket", { ticketId: selectedTicket.id });

      // Fetch message history for this ticket via REST API
      fetch(`${TICKETS_API_URL}/${selectedTicket.id}/messages`)
        .then((res) => res.json())
        .then((data) => setMessages(data))
        .catch((err) => console.error("History error:", err));
    }
  }, [selectedTicket, socket]);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !socket || !selectedTicket) return;

    const messageData: Message = {
      id: String(Date.now()),
      ticketId: selectedTicket.id,
      text: inputValue,
      sender: "user", // or your actual user ID
      timestamp: new Date().toISOString(),
    };

    // Emit to server
    socket.emit("user_joined_room", messageData);

    // Optimistic UI update (optional)
    setMessages((prev: Message[]) => [...prev, { ...messageData }]);
    setInputValue("");
  };

  // Emit "typing" status while user types
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (socket && selectedTicket) {
      socket.emit("typing", {
        ticketId: selectedTicket.id,
        isTyping: e.target.value.length > 0,
      });
    }
  };

  if (isLoading)
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="flex h-screen  overflow-hidden border border-gray-200 rounded-xl ">
      {/* Table Section */}
      <div
        className={`flex-1 flex flex-col transition-all ${
          selectedTicket ? "hidden lg:flex" : "flex"
        }`}
      >
        <header className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Support Center</h1>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-t-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
                <tr className="">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tickets?.map((ticket: any) => (
                  <tr
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className="hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-500">
                      {ticket.id}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {ticket?.issueType}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                        {ticket.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Chat Section */}
      <div
        className={`lg:w-[450px] border-l bg-white flex flex-col transition-all ${
          selectedTicket ? "w-full lg:w-[450px]" : "hidden"
        }`}
      >
        {selectedTicket && (
          <>
            <header className="h-16 border-b px-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="lg:hidden p-2"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div>
                  <h3 className="text-sm font-bold">Agent Support</h3>
                  <p className="text-[11px] text-emerald-500">Live</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg"
              >
                <X />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
              {messages?.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-slate-100 text-slate-800 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 rounded-2xl px-4 py-2 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Type a message..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none pr-12"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 p-2 bg-blue-600 text-white rounded-lg"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default SupportDashboard;
