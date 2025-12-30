// import { useState, useEffect, useRef } from "react";
// import {
//   Search,
//   MessageSquare,
//   Send,
//   ChevronRight,
//   MoreHorizontal,
//   Circle,
//   X,
//   ArrowLeft,
// } from "lucide-react";

// // --- MOCK SOCKET.IO SERVICE ---
// // This simulates the behavior of a real socket.io connection
// class MockSocketService {
//   constructor() {
//     this.callbacks = {};
//   }
//   on(event, cb) {
//     this.callbacks[event] = cb;
//   }
//   emit(event, data) {
//     console.log(`Socket Emit [${event}]:`, data);
//     // Simulate server response for a message
//     if (event === "send_message") {
//       // 1. Trigger "typing" after a short delay
//       setTimeout(() => {
//         if (this.callbacks["typing"])
//           this.callbacks["typing"]({ isTyping: true, userId: "agent-1" });

//         // 2. Send actual response after typing finishes
//         setTimeout(() => {
//           if (this.callbacks["typing"])
//             this.callbacks["typing"]({ isTyping: false, userId: "agent-1" });
//           if (this.callbacks["receive_message"]) {
//             this.callbacks["receive_message"]({
//               id: Date.now(),
//               text: "Thanks for reaching out! I'm looking into your ticket right now. Could you provide a bit more detail?",
//               sender: "agent",
//               timestamp: new Date().toISOString(),
//             });
//           }
//         }, 2000);
//       }, 500);
//     }
//   }
//   disconnect() {
//     this.callbacks = {};
//   }
// }

// const mockTickets = [
//   {
//     id: "TIC-8421",
//     subject: "Payment failed on checkout",
//     user: "Alex Rivera",
//     status: "Open",
//     priority: "High",
//     date: "2023-10-24",
//   },
//   {
//     id: "TIC-8422",
//     subject: "Cannot access course videos",
//     user: "Sarah Chen",
//     status: "In Progress",
//     priority: "Medium",
//     date: "2023-10-23",
//   },
//   {
//     id: "TIC-8423",
//     subject: "Refund request for Course #12",
//     user: "Mike Johnson",
//     status: "Resolved",
//     priority: "Low",
//     date: "2023-10-22",
//   },
//   {
//     id: "TIC-8424",
//     subject: "Certificate not generated",
//     user: "Emma Wilson",
//     status: "Open",
//     priority: "Medium",
//     date: "2023-10-21",
//   },
//   {
//     id: "TIC-8425",
//     subject: "Login issue with Google Auth",
//     user: "David Smith",
//     status: "In Progress",
//     priority: "High",
//     date: "2023-10-20",
//   },
// ];

// const App = () => {
//   const [selectedTicket, setSelectedTicket] = useState(null);
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       text: "Hello, how can I help you today?",
//       sender: "agent",
//       timestamp: "10:00 AM",
//     },
//   ]);
//   const [inputValue, setInputValue] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [socket, setSocket] = useState(null);

//   const chatEndRef = useRef(null);

//   // Initialize Mock Socket
//   useEffect(() => {
//     const s = new MockSocketService();

//     s.on("receive_message", (msg) => {
//       setMessages((prev) => [...prev, msg]);
//     });

//     s.on("typing", (data) => {
//       setIsTyping(data.isTyping);
//     });

//     setSocket(s);
//     return () => s.disconnect();
//   }, []);

//   // Auto scroll to bottom
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, isTyping]);

//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     if (!inputValue.trim() || !socket) return;

//     const newMessage = {
//       id: Date.now(),
//       text: inputValue,
//       sender: "user",
//       timestamp: new Date().toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       }),
//     };

//     setMessages([...messages, newMessage]);
//     socket.emit("send_message", {
//       text: inputValue,
//       ticketId: selectedTicket.id,
//     });
//     setInputValue("");
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Open":
//         return "bg-emerald-100 text-emerald-700 border-emerald-200";
//       case "In Progress":
//         return "bg-blue-100 text-blue-700 border-blue-200";
//       case "Resolved":
//         return "bg-gray-100 text-gray-700 border-gray-200";
//       default:
//         return "bg-gray-100 text-gray-700";
//     }
//   };

//   return (
//     <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
//       {/* --- LEFT SIDE: TICKET TABLE --- */}
//       <div
//         className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
//           selectedTicket ? "hidden lg:flex" : "flex"
//         }`}
//       >
//         <header className="h-16 border-b bg-white px-6 flex items-center justify-between shrink-0">
//           <h1 className="text-xl font-bold flex items-center gap-2">
//             <MessageSquare className="text-blue-600" size={24} />
//             Support Center
//           </h1>
//           <div className="relative w-64">
//             <Search
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//               size={16}
//             />
//             <input
//               type="text"
//               placeholder="Search tickets..."
//               className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//             />
//           </div>
//         </header>

//         <main className="flex-1 overflow-auto p-6">
//           <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-semibold">
//                   <th className="px-6 py-4">Ticket ID</th>
//                   <th className="px-6 py-4">Subject</th>
//                   <th className="px-6 py-4">Requested By</th>
//                   <th className="px-6 py-4">Status</th>
//                   <th className="px-6 py-4">Priority</th>
//                   <th className="px-6 py-4 text-right">Action</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100">
//                 {mockTickets.map((ticket) => (
//                   <tr
//                     key={ticket.id}
//                     onClick={() => setSelectedTicket(ticket)}
//                     className={`hover:bg-blue-50/50 cursor-pointer transition-colors group ${
//                       selectedTicket?.id === ticket.id ? "bg-blue-50" : ""
//                     }`}
//                   >
//                     <td className="px-6 py-4 text-sm font-medium text-slate-500">
//                       {ticket.id}
//                     </td>
//                     <td className="px-6 py-4 text-sm font-semibold text-slate-900">
//                       {ticket.subject}
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-2">
//                         <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
//                           {ticket.user.charAt(0)}
//                         </div>
//                         <span className="text-sm text-slate-700">
//                           {ticket.user}
//                         </span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span
//                         className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
//                           ticket.status
//                         )}`}
//                       >
//                         {ticket.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-1.5 text-sm">
//                         <Circle
//                           size={8}
//                           fill={
//                             ticket.priority === "High" ? "#ef4444" : "#f59e0b"
//                           }
//                           className={
//                             ticket.priority === "High"
//                               ? "text-red-500"
//                               : "text-amber-500"
//                           }
//                         />
//                         {ticket.priority}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-right">
//                       <ChevronRight
//                         className="inline text-slate-300 group-hover:text-blue-500 transition-colors"
//                         size={20}
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </main>
//       </div>

//       {/* --- RIGHT SIDE: CHAT INTERFACE --- */}
//       <div
//         className={`lg:w-[450px] border-l bg-white flex flex-col shadow-2xl transition-all duration-300 ${
//           selectedTicket
//             ? "translate-x-0 w-full lg:w-[450px]"
//             : "translate-x-full lg:hidden"
//         }`}
//       >
//         {selectedTicket ? (
//           <>
//             <header className="h-16 border-b px-4 flex items-center justify-between shrink-0 bg-white">
//               <div className="flex items-center gap-3">
//                 <button
//                   onClick={() => setSelectedTicket(null)}
//                   className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-full"
//                 >
//                   <ArrowLeft size={20} />
//                 </button>
//                 <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
//                   S
//                 </div>
//                 <div>
//                   <h3 className="text-sm font-bold text-slate-900 leading-tight">
//                     Support Agent
//                   </h3>
//                   <div className="flex items-center gap-1 text-[11px] text-emerald-500 font-medium">
//                     <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
//                     Online
//                   </div>
//                 </div>
//               </div>
//               <div className="flex items-center gap-1">
//                 <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
//                   <MoreHorizontal size={20} />
//                 </button>
//                 <button
//                   onClick={() => setSelectedTicket(null)}
//                   className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>
//             </header>

//             <div className="bg-blue-50/50 px-4 py-2 border-b">
//               <p className="text-[11px] font-bold text-blue-600 uppercase tracking-widest mb-0.5">
//                 Ticket Context
//               </p>
//               <h4 className="text-xs font-semibold text-slate-700 truncate">
//                 {selectedTicket.subject}
//               </h4>
//             </div>

//             {/* Chat Messages */}
//             <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white custom-scrollbar">
//               <div className="flex justify-center my-4">
//                 <span className="text-[10px] bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-medium">
//                   Conversation started • {selectedTicket.id}
//                 </span>
//               </div>

//               {messages.map((msg) => (
//                 <div
//                   key={msg.id}
//                   className={`flex ${
//                     msg.sender === "user" ? "justify-end" : "justify-start"
//                   }`}
//                 >
//                   <div
//                     className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
//                       msg.sender === "user"
//                         ? "bg-blue-600 text-white rounded-br-none"
//                         : "bg-slate-100 text-slate-800 rounded-bl-none"
//                     }`}
//                   >
//                     {msg.text}
//                     <p
//                       className={`text-[10px] mt-1 opacity-70 ${
//                         msg.sender === "user" ? "text-right" : "text-left"
//                       }`}
//                     >
//                       {msg.timestamp}
//                     </p>
//                   </div>
//                 </div>
//               ))}

//               {isTyping && (
//                 <div className="flex justify-start">
//                   <div className="bg-slate-100 rounded-2xl rounded-bl-none px-4 py-3 flex gap-1">
//                     <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
//                     <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
//                     <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
//                   </div>
//                 </div>
//               )}
//               <div ref={chatEndRef} />
//             </div>

//             {/* Input Area */}
//             <form
//               onSubmit={handleSendMessage}
//               className="p-4 bg-white border-t"
//             >
//               <div className="relative flex items-center gap-2">
//                 <input
//                   type="text"
//                   value={inputValue}
//                   onChange={(e) => setInputValue(e.target.value)}
//                   placeholder="Type your message..."
//                   className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none pr-12 transition-all"
//                 />
//                 <button
//                   type="submit"
//                   disabled={!inputValue.trim()}
//                   className="absolute right-1.5 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
//                 >
//                   <Send size={18} />
//                 </button>
//               </div>
//               <p className="text-[10px] text-center text-slate-400 mt-3">
//                 Press Enter to send. Your conversation is secure.
//               </p>
//             </form>
//           </>
//         ) : (
//           <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50">
//             <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
//               <MessageSquare size={32} />
//             </div>
//             <h3 className="text-lg font-bold text-slate-800">
//               No ticket selected
//             </h3>
//             <p className="text-sm text-slate-500 mt-2 max-w-[250px]">
//               Select a ticket from the list to view the conversation history and
//               chat with an agent.
//             </p>
//           </div>
//         )}
//       </div>

//       <style>{`
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 5px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: transparent;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: #e2e8f0;
//           border-radius: 10px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: #cbd5e1;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default App;
