

"use client";
import { useState, useRef, useEffect } from "react";
interface Message {
  id: string;
  senderId: string;
  text: string;
  time: string;
  status: "sent" | "delivered" | "read";
  type: "text" | "interest" | "image";
}

interface Contact {
  id: string;
  name: string;
  age: number;
  location: string;
  photo: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  online: boolean;
  verified: boolean;
}

const CONTACTS: Contact[] = [
  {
    id: "c1",
    name: "Priya Sharma",
    age: 26,
    location: "Lucknow, UP",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    lastMessage: "Thank you for your interest 😊",
    lastTime: "2m ago",
    unread: 3,
    online: true,
    verified: true,
  },
  {
    id: "c2",
    name: "Anjali Nair",
    age: 24,
    location: "Kochi, Kerala",
    photo: "https://randomuser.me/api/portraits/women/68.jpg",
    lastMessage: "Can we schedule a call?",
    lastTime: "1h ago",
    unread: 1,
    online: true,
    verified: true,
  },
  {
    id: "c3",
    name: "Meera Pillai",
    age: 27,
    location: "Trivandrum",
    photo: "https://randomuser.me/api/portraits/women/32.jpg",
    lastMessage: "My family would like to...",
    lastTime: "3h ago",
    unread: 0,
    online: false,
    verified: true,
  },
  {
    id: "c4",
    name: "Deepa Thomas",
    age: 25,
    location: "Thrissur, Kerala",
    photo: "https://randomuser.me/api/portraits/women/55.jpg",
    lastMessage: "Hello! I saw your profile",
    lastTime: "1d ago",
    unread: 0,
    online: false,
    verified: false,
  },
  {
    id: "c5",
    name: "Lakshmi Menon",
    age: 23,
    location: "Kozhikode",
    photo: "https://randomuser.me/api/portraits/women/17.jpg",
    lastMessage: "Interested in knowing more",
    lastTime: "2d ago",
    unread: 0,
    online: false,
    verified: true,
  },
];

const MESSAGES: Record<string, Message[]> = {
  c1: [
    { id: "m1", senderId: "c1", text: "Hello! I came across your profile and found it quite impressive. Would love to connect.", time: "10:30 AM", status: "read", type: "text" },
    { id: "m2", senderId: "me", text: "Thank you! I also went through your profile. Your education and values seem very compatible with ours.", time: "10:35 AM", status: "read", type: "text" },
    { id: "m3", senderId: "c1", text: "That's very kind of you. My family is from Lucknow. We follow traditional values while being open minded.", time: "10:38 AM", status: "read", type: "text" },
    { id: "m4", senderId: "me", text: "That sounds wonderful. Our family values are quite similar. Would you be comfortable sharing more about your hobbies and interests?", time: "10:45 AM", status: "read", type: "text" },
    { id: "m5", senderId: "c1", text: "I love reading, classical music and cooking. I also enjoy traveling during vacations. How about you?", time: "11:00 AM", status: "read", type: "text" },
    { id: "m6", senderId: "me", text: "I enjoy cricket, trekking and reading as well! It seems we have common interests 😊", time: "11:05 AM", status: "read", type: "text" },
    { id: "m7", senderId: "c1", text: "Thank you for your interest 😊", time: "11:10 AM", status: "read", type: "text" },
  ],
  c2: [
    { id: "m1", senderId: "c2", text: "Hi! I noticed we have similar backgrounds and interests.", time: "9:15 AM", status: "read", type: "text" },
    { id: "m2", senderId: "me", text: "Yes indeed! I was also thinking the same. Would love to know more about you.", time: "9:20 AM", status: "read", type: "text" },
    { id: "m3", senderId: "c2", text: "Can we schedule a call?", time: "9:30 AM", status: "delivered", type: "text" },
  ],
  c3: [
    { id: "m1", senderId: "me", text: "Hello! I came across your profile. Very impressive background.", time: "Yesterday", status: "read", type: "text" },
    { id: "m2", senderId: "c3", text: "My family would like to...", time: "Yesterday", status: "read", type: "text" },
  ],
  c4: [
    { id: "m1", senderId: "c4", text: "Hello! I saw your profile", time: "Mon", status: "read", type: "text" },
  ],
  c5: [
    { id: "m1", senderId: "c5", text: "Interested in knowing more about your family background.", time: "Sun", status: "read", type: "text" },
  ],
};

const QUICK_REPLIES = [
  "Thank you for connecting!",
  "Would love to know more about you",
  "Can we schedule a call?",
  "Please share your contact details",
];

export default function Chat() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>(MESSAGES);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [mobileScreen, setMobileScreen] = useState<"list" | "chat" | "profile">("list");
  const [animating, setAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"in" | "out">("in");

  // ✅ FIXED: added | null to the generic
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const currentMessages = selectedContact ? messages[selectedContact.id] || [] : [];
  const filteredContacts = CONTACTS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  const navigateTo = (screen: "list" | "chat" | "profile", direction: "in" | "out") => {
    if (animating) return;
    setSlideDirection(direction);
    setAnimating(true);
    setTimeout(() => {
      setMobileScreen(screen);
      setAnimating(false);
    }, 280);
  };

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    setShowQuickReplies(false);
    setInput("");
    navigateTo("chat", "in");
  };

  const handleBack = () => {
    navigateTo("list", "out");
  };

  const handleOpenProfile = () => {
    setShowProfile(true);
    navigateTo("profile", "in");
  };

  const handleCloseProfile = () => {
    setShowProfile(false);
    navigateTo("chat", "out");
  };

  const sendMessage = (text: string) => {
    if (!text.trim() || !selectedContact) return;
    const newMsg: Message = {
      id: `m${Date.now()}`,
      senderId: "me",
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
      type: "text",
    };
    setMessages((prev) => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), newMsg],
    }));
    setInput("");
    setShowQuickReplies(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      <style>{`
        @keyframes slideInFromRight {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        @keyframes slideOutToRight {
          from { transform: translateX(0); }
          to   { transform: translateX(100%); }
        }
        @keyframes slideInFromLeft {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
        @keyframes slideOutToLeft {
          from { transform: translateX(0); }
          to   { transform: translateX(-100%); }
        }
        .slide-in-right  { animation: slideInFromRight  0.28s cubic-bezier(0.25,0.46,0.45,0.94) forwards; }
        .slide-out-left  { animation: slideOutToLeft    0.28s cubic-bezier(0.25,0.46,0.45,0.94) forwards; }
        .slide-in-left   { animation: slideInFromLeft   0.28s cubic-bezier(0.25,0.46,0.45,0.94) forwards; }
        .slide-out-right { animation: slideOutToRight   0.28s cubic-bezier(0.25,0.46,0.45,0.94) forwards; }
      `}</style>

      <div className="bg-gray-100">
        <div className="max-w-7xl mx-auto sm:px-4 sm:py-6">
          <div className="bg-white sm:rounded-2xl shadow-xl flex overflow-hidden h-[93svh] sm:h-[85svh]">

            {/* Desktop Sidebar */}
            <div className="hidden lg:flex w-80 shrink-0 flex-col border-r border-gray-100">
              <SidebarContent
                search={search}
                setSearch={setSearch}
                filteredContacts={filteredContacts}
                selectedContact={selectedContact}
                onSelect={(c) => { setSelectedContact(c); setInput(""); setShowQuickReplies(false); }}
              />
            </div>

            {/* Desktop Chat */}
            <div className="hidden lg:flex flex-1 flex-col min-w-0 min-h-0 overflow-hidden">
              {selectedContact ? (
                <ChatContent
                  selectedContact={selectedContact}
                  currentMessages={currentMessages}
                  input={input}
                  setInput={setInput}
                  showQuickReplies={showQuickReplies}
                  setShowQuickReplies={setShowQuickReplies}
                  showProfile={showProfile}
                  onToggleProfile={() => setShowProfile((p) => !p)}
                  onBack={() => {}}
                  onSend={sendMessage}
                  onKeyDown={handleKeyDown}
                  messagesEndRef={messagesEndRef}
                  showBackButton={false}
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center bg-[#fdf8f8] text-gray-400">
                  <div className="text-5xl mb-3">💬</div>
                  <p className="text-sm font-medium">Select a conversation</p>
                </div>
              )}
            </div>

            {/* Desktop Profile Panel */}
            {showProfile && selectedContact && (
              <div className="hidden lg:flex w-64 shrink-0 flex-col border-l border-gray-100">
                <ProfileContent
                  contact={selectedContact}
                  onClose={() => setShowProfile(false)}
                />
              </div>
            )}

            {/* Mobile Screens */}
            <div className="flex lg:hidden w-full h-full overflow-hidden relative">

              {/* Screen 1 — List */}
              <div
                className={`absolute inset-0 flex flex-col bg-white
                  ${mobileScreen === "list" && !animating ? "" :
                    mobileScreen === "list" && animating ? "slide-in-left" :
                    mobileScreen !== "list" && animating && slideDirection === "out" ? "slide-in-left" :
                    mobileScreen !== "list" ? "hidden" : ""}
                `}
                style={{
                  zIndex: mobileScreen === "list" ? 10 : 5,
                  display: mobileScreen !== "list" && !animating ? "none" : undefined,
                }}
              >
                <SidebarContent
                  search={search}
                  setSearch={setSearch}
                  filteredContacts={filteredContacts}
                  selectedContact={selectedContact}
                  onSelect={handleSelectContact}
                />
              </div>

              {/* Screen 2 — Chat */}
              {selectedContact && (
                <div
                  className={`absolute inset-0 flex flex-col bg-white
                    ${mobileScreen === "chat" && !animating ? "" :
                      mobileScreen === "chat" && animating && slideDirection === "in" ? "slide-in-right" :
                      mobileScreen === "chat" && animating && slideDirection === "out" ? "slide-out-right" :
                      mobileScreen === "list" && animating && slideDirection === "in" ? "slide-in-right" :
                      ""}
                  `}
                  style={{
                    zIndex: mobileScreen === "chat" ? 10 : 8,
                    display: mobileScreen === "profile" && !animating ? "none" :
                             mobileScreen === "list" && !animating ? "none" : undefined,
                  }}
                >
                  <ChatContent
                    selectedContact={selectedContact}
                    currentMessages={currentMessages}
                    input={input}
                    setInput={setInput}
                    showQuickReplies={showQuickReplies}
                    setShowQuickReplies={setShowQuickReplies}
                    showProfile={showProfile}
                    onToggleProfile={handleOpenProfile}
                    onBack={handleBack}
                    onSend={sendMessage}
                    onKeyDown={handleKeyDown}
                    messagesEndRef={messagesEndRef}
                    showBackButton={true}
                  />
                </div>
              )}

              {/* Screen 3 — Profile */}
              {selectedContact && (
                <div
                  className={`absolute inset-0 flex flex-col bg-white
                    ${mobileScreen === "profile" && !animating ? "" :
                      mobileScreen === "profile" && animating ? "slide-in-right" :
                      mobileScreen === "chat" && animating && slideDirection === "out" && showProfile ? "slide-out-right" :
                      ""}
                  `}
                  style={{
                    zIndex: mobileScreen === "profile" ? 10 : 6,
                    display: mobileScreen !== "profile" && !animating ? "none" : undefined,
                  }}
                >
                  <ProfileContent
                    contact={selectedContact}
                    onClose={handleCloseProfile}
                  />
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Sidebar Content ─────────────────────────────────────────────── */
function SidebarContent({
  search, setSearch, filteredContacts, selectedContact, onSelect,
}: {
  search: string;
  setSearch: (v: string) => void;
  filteredContacts: Contact[];
  selectedContact: Contact | null;
  onSelect: (c: Contact) => void;
}) {
  return (
    <>
      <div className="bg-[#b22234] px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-bold text-lg tracking-wide">💬 Messages</h2>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white text-sm flex items-center justify-center transition-colors">✏️</button>
            <button className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white text-sm flex items-center justify-center transition-colors">⚙️</button>
          </div>
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:bg-white/30 transition-colors"
          />
        </div>
      </div>

      <div className="flex border-b border-gray-100">
        {["All", "Unread", "Interests"].map((tab, i) => (
          <button
            key={tab}
            className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${
              i === 0 ? "text-[#b22234] border-b-2 border-[#b22234]" : "text-gray-500 hover:text-[#b22234]"
            }`}
          >
            {tab}
            {tab === "Unread" && (
              <span className="ml-1 bg-[#b22234] text-white text-[9px] px-1.5 py-0.5 rounded-full">
                {CONTACTS.reduce((a, c) => a + c.unread, 0)}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredContacts.map((contact) => (
          <button
            key={contact.id}
            onClick={() => onSelect(contact)}
            className={`w-full flex items-center gap-3 px-4 py-3 border-b border-gray-50 hover:bg-[#fdf2f3] transition-colors text-left active:bg-[#fce4ec] ${
              selectedContact?.id === contact.id ? "bg-[#fdf2f3] border-l-4 border-l-[#b22234]" : ""
            }`}
          >
            <div className="relative shrink-0">
              <img
                src={contact.photo}
                alt={contact.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/48?text=?"; }}
              />
              {contact.online && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold text-gray-800 truncate">{contact.name}</span>
                  {contact.verified && <span className="text-blue-500 text-xs">✔</span>}
                </div>
                <span className="text-[10px] text-gray-400 shrink-0">{contact.lastTime}</span>
              </div>
              <p className="text-[11px] text-gray-400 truncate">{contact.lastMessage}</p>
              <p className="text-[9px] text-gray-300 mt-0.5">{contact.age} yrs • {contact.location}</p>
            </div>
            {contact.unread > 0 && (
              <span className="shrink-0 w-5 h-5 bg-[#b22234] text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                {contact.unread}
              </span>
            )}
          </button>
        ))}
      </div>
    </>
  );
}

/* ─── Chat Content ────────────────────────────────────────────────── */
function ChatContent({
  selectedContact, currentMessages, input, setInput,
  showQuickReplies, setShowQuickReplies, showProfile,
  onToggleProfile, onBack, onSend, onKeyDown, messagesEndRef, showBackButton,
}: {
  selectedContact: Contact;
  currentMessages: Message[];
  input: string;
  setInput: (v: string) => void;
  showQuickReplies: boolean;
  setShowQuickReplies: (v: boolean) => void;
  showProfile: boolean;
  onToggleProfile: () => void;
  onBack: () => void;
  onSend: (text: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  // ✅ FIXED: added | null
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  showBackButton: boolean;
}) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-3 sm:px-5 py-3 border-b border-gray-100 bg-white shadow-sm shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          {showBackButton && (
            <button
              onClick={onBack}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-[#b22234] hover:bg-red-50 active:bg-red-100 transition-colors shrink-0"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <div className="relative shrink-0">
            <img
              src={selectedContact.photo}
              alt={selectedContact.name}
              className="w-9 h-9 rounded-full object-cover border-2 border-[#f5d0d7]"
              onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/40?text=?"; }}
            />
            {selectedContact.online && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <h3 className="text-sm font-bold text-gray-800 truncate">{selectedContact.name}</h3>
              {selectedContact.verified && (
                <span className="hidden sm:inline text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full font-medium shrink-0">✔ Verified</span>
              )}
            </div>
            <p className="text-[10px] text-gray-400">
              {selectedContact.online
                ? <span className="text-green-500 font-medium">● Online now</span>
                : `${selectedContact.age} yrs • ${selectedContact.location}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button className="hidden sm:flex items-center gap-1.5 bg-[#b22234] hover:bg-[#9a1d2b] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-sm">
            💌 Send Interest
          </button>
          <button className="sm:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-[#b22234] text-white text-sm">💌</button>
          <button
            onClick={onToggleProfile}
            className={`w-8 h-8 rounded-lg border flex items-center justify-center text-sm transition-colors ${
              showProfile ? "bg-[#fdf2f3] border-[#f5c6cb] text-[#b22234]" : "border-gray-200 hover:bg-gray-50 text-gray-500"
            }`}
          >
            👤
          </button>
          <button className="hidden sm:flex w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 text-sm items-center justify-center">📞</button>
          <button className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 text-sm flex items-center justify-center">⋮</button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-5 py-4 space-y-3 bg-[#fdf8f8]">
        <div className="flex items-center gap-3 my-2">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-[10px] text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-200">Today</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <div className="flex justify-center">
          <div className="bg-linear-to-r from-[#fdf2f3] to-[#fce4ec] border border-[#f5c6cb] rounded-2xl px-4 sm:px-5 py-3 text-center max-w-xs shadow-sm">
            <div className="text-2xl mb-1">💝</div>
            <p className="text-xs font-semibold text-[#b22234]">Interest Accepted!</p>
            <p className="text-[10px] text-gray-500 mt-0.5">You and {selectedContact.name} are now connected</p>
          </div>
        </div>

        {currentMessages.map((msg) => {
          const isMe = msg.senderId === "me";
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"} items-end gap-2`}>
              {!isMe && (
                <img
                  src={selectedContact.photo}
                  alt=""
                  className="w-6 h-6 rounded-full object-cover shrink-0 mb-1"
                  onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/28?text=?"; }}
                />
              )}
              <div className={`max-w-[78%] sm:max-w-xs lg:max-w-md flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                <div className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  isMe ? "bg-[#b22234] text-white rounded-br-sm" : "bg-white text-gray-800 rounded-bl-sm border border-gray-100"
                }`}>
                  {msg.text}
                </div>
                <div className={`flex items-center gap-1 mt-1 ${isMe ? "flex-row-reverse" : ""}`}>
                  <span className="text-[9px] text-gray-400">{msg.time}</span>
                  {isMe && <span className="text-[9px]">{msg.status === "read" ? "✔✔" : msg.status === "delivered" ? "✔✔" : "✔"}</span>}
                </div>
              </div>
              {isMe && (
                <div className="w-6 h-6 rounded-full bg-[#b22234] flex items-center justify-center text-white text-[9px] font-bold shrink-0 mb-1">Me</div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      {showQuickReplies && (
        <div className="px-3 sm:px-4 py-2 bg-white border-t border-gray-100 shrink-0">
          <div className="flex gap-2 flex-wrap">
            {QUICK_REPLIES.map((reply) => (
              <button
                key={reply}
                onClick={() => onSend(reply)}
                className="text-xs bg-[#fdf2f3] text-[#b22234] border border-[#f5c6cb] px-3 py-1.5 rounded-full hover:bg-[#b22234] hover:text-white transition-colors font-medium"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-3 sm:px-4 py-3 bg-white border-t border-gray-100 shrink-0">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="flex gap-1 justify-center items-center">
            <button
              onClick={() => setShowQuickReplies(!showQuickReplies)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm transition-colors ${
                showQuickReplies ? "bg-[#b22234] text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-500"
              }`}
            >⚡</button>
            <button className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 text-sm flex items-center justify-center">📎</button>
          </div>
          <div className="flex relative justify-center items-center w-full">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-3 sm:px-4 py-2.5 pr-9 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#b22234] resize-none bg-gray-50 focus:bg-white transition-colors"
              style={{ maxHeight: "100px" }}
            />
            <button className="absolute right-2.5 bottom-2.5 text-gray-400 hover:text-[#b22234] text-sm transition-colors">😊</button>
          </div>
          <button
            onClick={() => onSend(input)}
            disabled={!input.trim()}
            className="w-10 h-10 rounded-xl bg-[#b22234] hover:bg-[#9a1d2b] disabled:bg-gray-200 text-white flex items-center justify-center transition-all shadow-sm hover:shadow-md disabled:cursor-not-allowed shrink-0"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

/* ─── Profile Content ─────────────────────────────────────────────── */
function ProfileContent({ contact, onClose }: { contact: Contact; onClose: () => void }) {
  return (
    <>
      <div className="bg-[#b22234] px-4 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={onClose} className="text-white/80 hover:text-white active:text-white/60 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-white font-semibold text-sm">Profile</span>
        </div>
        <button onClick={onClose} className="text-white/80 hover:text-white text-lg leading-none">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="relative">
          <img
            src={contact.photo}
            alt={contact.name}
            className="w-full h-56 object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/256x192?text=Photo"; }}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-4">
            <p className="text-white font-bold">{contact.name}</p>
            <p className="text-white/80 text-xs">{contact.age} yrs • {contact.location}</p>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${contact.online ? "bg-green-500" : "bg-gray-300"}`} />
            <span className="text-xs text-gray-500">{contact.online ? "Active now" : "Offline"}</span>
            {contact.verified && (
              <span className="ml-auto text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">✔ Verified</span>
            )}
          </div>

          <hr className="border-gray-100" />

          {[
            { label: "Age",       value: `${contact.age} years` },
            { label: "Location",  value: contact.location },
            { label: "Profile ID",value: "GM001247" },
            { label: "Religion",  value: "Hindu – Brahmin" },
            { label: "Education", value: "B.Tech Software" },
            { label: "Profession",value: "Software Engineer" },
          ].map((item) => (
            <div key={item.label} className="flex justify-between items-center">
              <span className="text-[11px] text-gray-400">{item.label}</span>
              <span className="text-[11px] text-gray-700 font-medium text-right max-w-[60%]">{item.value}</span>
            </div>
          ))}

          <hr className="border-gray-100" />

          <div className="space-y-2 pb-4">
            <button className="w-full bg-[#b22234] hover:bg-[#9a1d2b] text-white text-xs font-bold py-2.5 rounded-xl transition-colors">💌 Send Interest</button>
            <button className="w-full border border-[#b22234] text-[#b22234] hover:bg-[#fdf2f3] text-xs font-bold py-2.5 rounded-xl transition-colors">👤 View Full Profile</button>
            <button className="w-full border border-gray-200 text-gray-500 hover:bg-gray-50 text-xs py-2 rounded-xl transition-colors">🚫 Block / Report</button>
          </div>
        </div>
      </div>
    </>
  );
}