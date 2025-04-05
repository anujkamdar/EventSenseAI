import React, { useState,useref,use } from 'react';
import { Brain, Calendar, MessageSquare, Bell, User as UserIcon, Search, LogOut, Plus, Users, Settings, ChevronLeft, MessageCircle, X, Send, Upload, Calendar as CalendarIcon, MapPin } from 'lucide-react';
import { auth, db, ref, set, get, push, onAuthStateChanged, signOut } from './firebaseinit';
import {Link,NavLink,useNavigate} from "react-router-dom";
let uid;
function OrganizerDashboard() {

  const navigate = useNavigate();
  const [userData,setUserData] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [events,setEvents] = useState([]);

  let loadedEvents = [];
  if(!initialized){
    setInitialized(true);
    onAuthStateChanged(auth, async (user) => {
      // if(user){
        uid = user.uid;
        // console.log(uid)
        const snap = await get(ref(db,`users/${uid}`))
        setEventForm(prev => ({
          ...prev,
          organizerId: uid
        }));
    
        let data = snap.val()
        setUserData(data);
        console.log(data);
        let eventList = data.events
        for(let eventId in eventList){
          let eventData = eventList[eventId]["basicdata"];
          loadedEvents.push({
            id: eventId,
            name: eventData.name,
            date: eventData.date,
            location: eventData.location,
            status: "Active",
            image: eventData.image,
            description: eventData.description,
            attendees: 245,
            totalCapacity: 500,
            revenue: 24500
          })
        }
        setEvents(loadedEvents);
      // }
    })
  }


  const uploadToCloudinary = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'ml_default');

    const responce = await fetch("https://api.cloudinary.com/v1_1/djxunz1zm/image/upload",
      { method: "post", body: formData }
    )
    const data = await responce.json();
    return data.secure_url;
  }


  const saveEventData = async () => {
    eventForm.previewImage = null;
    let imageUrl = await uploadToCloudinary(eventForm.image);
    eventForm.image = imageUrl;
    console.log(imageUrl);
    try {
      let eventId = await push(ref(db, `basiceventdata`), eventForm);
      eventId = eventId.key
      console.log(eventId);
      console.log(uid);
      await set(ref(db, `users/${uid}/events/${eventId}/basicdata`), eventForm);
    } catch {
      (error) => {
        alert(error.message)
      }
    }

  }



  const [activeTab, setActiveTab] = useState('events');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [eventForm, setEventForm] = useState({
    name: '',
    description: '',
    date: '',
    location: '',
    image: null,
    previewImage: null,
    
  });
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "Hello! How can I help you today?", isBot: true },
  ]);


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEventForm(prev => ({
        ...prev,
        image: file,
        previewImage: URL.createObjectURL(file)
      }));
    }
  };

  // const handleEventFormSubmit = (e) => {
  //   e.preventDefault();
  //   console.log('Form submitted:', eventForm);
  //   setIsCreatingEvent(false);
  // };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    setChatMessages(prev => [...prev, { id: Date.now(), text: chatMessage, isBot: false }]);

    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "I'm here to help! What would you like to know about your events?",
        isBot: true
      }]);
    }, 1000);

    setChatMessage('');
  };

  if (isCreatingEvent) {
    return (
      <div className="min-h-screen relative bg-gray-900">
        {/* Dynamic Background with Particles */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 animate-gradient" />
            <div className="absolute inset-0 backdrop-blur-[100px]" />
            {/* Animated circles */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-float-delayed" />
            <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '-2s' }} />
          </div>
        </div>

        {/* Header */}
        <header className="relative z-10 bg-black/10 backdrop-blur-lg border-b border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between h-16 px-4">
              <button
                onClick={() => setIsCreatingEvent(false)}
                className="text-white/90 hover:text-white transition-colors flex items-center gap-2 group"
              >
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span>Back to Dashboard</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative z-10 pt-16 px-4 pb-12">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-8 border border-white/10 shadow-2xl">
              <h1 className="text-3xl font-bold text-white mb-2">Create New Event</h1>
              <p className="text-gray-300 mb-8">Share the details of your upcoming event</p>

              <form className="space-y-8">
                {/* Image Upload */}
                <div className="relative group">
                  <div
                    className={`h-64 rounded-2xl border-3 border-dashed ${eventForm.previewImage
                        ? 'border-indigo-400/50'
                        : 'border-white/20'
                      } flex items-center justify-center overflow-hidden cursor-pointer transition-all duration-300 group-hover:border-indigo-400 bg-white/5`}
                    onClick={() => document.getElementById('event-image').click()}
                  >
                    {eventForm.previewImage ? (
                      <>
                        <img
                          src={eventForm.previewImage}
                          alt="Event preview"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform text-center">
                            <Upload className="text-white mb-2 mx-auto" size={24} />
                            <p className="text-white text-sm">Change Image</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center transform group-hover:scale-105 transition-transform p-8">
                        <div className="w-20 h-20 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Upload className="text-indigo-400" size={32} />
                        </div>
                        <p className="text-white/90 font-medium text-lg mb-2">Upload Event Image</p>
                        <p className="text-white/60 text-sm">Drag and drop or click to select</p>
                        <p className="text-white/40 text-xs mt-2">Recommended: 1920x1080px</p>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    id="event-image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>

                {/* Event Details */}
                <div className="grid gap-6">
                  <div>
                    <label className="block text-white/90 mb-2 font-medium">Event Name</label>
                    <input
                      type="text"
                      // value={eventForm.name}
                      onChange={(e) => setEventForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-indigo-400 focus:bg-white/10 transition-all"
                      placeholder="Enter a memorable event name"
                    />
                  </div>

                  <div>
                    <label className="block text-white/90 mb-2 font-medium">Description</label>
                    <textarea
                      // value={eventForm.description}
                      onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-indigo-400 focus:bg-white/10 transition-all h-32 resize-none"
                      placeholder="Describe what makes your event special"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white/90 mb-2 font-medium">Date</label>
                      <div className="relative group">
                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 group-hover:text-indigo-300 transition-colors" size={20} />
                        <input
                          type="date"
                          // value={eventForm.date}
                          onChange={(e) => setEventForm(prev => ({ ...prev, date: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-indigo-400 focus:bg-white/10 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-white/90 mb-2 font-medium">Location</label>
                      <div className="relative group">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 group-hover:text-indigo-300 transition-colors" size={20} />
                        <input
                          type="text"
                          // value={eventForm.location}
                          onChange={(e) => setEventForm(prev => ({ ...prev, location: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-indigo-400 focus:bg-white/10 transition-all"
                          placeholder="Where is your event?"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-500 transform hover:scale-[1.02] transition-all duration-200 font-medium"
                    onClick={(e) => {
                      e.preventDefault();
                      console.log(eventForm);
                      saveEventData();
                      setIsCreatingEvent(false);
                    }}
                  >
                    Create Event
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsCreatingEvent(false);
                      eventForm.previewImage = null;
                    }}
                    className="flex-1 bg-white/5 text-white py-3 px-6 rounded-lg hover:bg-white/10 transform hover:scale-[1.02] transition-all duration-200 font-medium border border-white/10"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (selectedEvent) {
    return (
      <div className="min-h-screen bg-gray-900">
        {/* Header */}
        <header className="bg-gray-900/80 backdrop-blur-lg border-b border-gray-800 fixed w-full z-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between h-16 px-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <ChevronLeft size={20} />
                  <span>Back to Dashboard</span>
                </button>
              </div>
              <div className="flex items-center gap-3">
                <UserIcon className="text-gray-300" size={20} />
                <LogOut className="text-gray-300 cursor-pointer hover:text-white transition-colors" size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Event Details */}
        <main className="pt-20 px-4 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Event Info */}
            <div>
              <div className="rounded-xl overflow-hidden">
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.name}
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="mt-6">
                <div className="flex justify-between items-start">
                  <h1 className="text-3xl font-bold text-white">{selectedEvent.name}</h1>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${selectedEvent.status === 'Active'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-gray-700/50 text-gray-300'
                    }`}>
                    {selectedEvent.status}
                  </span>
                </div>
                <div className="mt-4 space-y-2 text-gray-300">
                  <p>{selectedEvent.date}</p>
                  <p>{selectedEvent.location}</p>
                </div>
                <p className="mt-4 text-gray-400">{selectedEvent.description}</p>
              </div>
            </div>

            {/* Right Column - Event Stats */}
            <div className="space-y-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                  <h3 className="text-gray-400 text-sm mb-2">Attendees</h3>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-white">{selectedEvent.attendees}</span>
                    <span className="text-gray-400">/ {selectedEvent.totalCapacity}</span>
                  </div>
                  <div className="mt-2 bg-gray-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full rounded-full"
                      style={{ width: `${(selectedEvent.attendees / selectedEvent.totalCapacity) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                  <h3 className="text-gray-400 text-sm mb-2">Revenue</h3>
                  <div className="text-2xl font-bold text-white">
                    ${selectedEvent.revenue.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button className="bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2">
                  <Users size={20} />
                  Manage Attendees
                </button>
                <button className="border border-indigo-600 text-indigo-400 py-3 px-4 rounded-lg hover:bg-indigo-600/10 transition-colors flex items-center justify-center gap-2">
                  <Settings size={20} />
                  Edit Event
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }


  if(userData) return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-lg border-b border-gray-800 fixed w-full z-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16 px-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Brain className="text-indigo-400" size={32} />
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                EventSense AI
              </span>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex items-center flex-1 max-w-xl mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search events..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-10 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center gap-6">
              <button
                className={`text-gray-300 hover:text-white transition-colors ${activeTab === 'events' ? 'text-white' : ''}`}
                onClick={() => setActiveTab('events')}
              >
                <Calendar size={20} />
              </button>
              <button
                className={`text-gray-300 hover:text-white transition-colors ${activeTab === 'messages' ? 'text-white' : ''}`}
                onClick={() => setActiveTab('messages')}
              >
                <MessageSquare size={20} />
              </button>
              <button
                className={`text-gray-300 hover:text-white transition-colors ${activeTab === 'notifications' ? 'text-white' : ''}`}
                onClick={() => setActiveTab('notifications')}
              >
                <Bell size={20} />
              </button>
              <div className="h-6 w-px bg-gray-700"></div>
              <div className="flex items-center gap-3">
                <button className="text-gray-300 hover:text-white transition-colors">
                  <UserIcon size={20} />
                </button>
                <button className="text-gray-300 hover:text-white transition-colors">
                  <LogOut size={20} onClick={async () => {
                    signOut(auth);
                    navigate("/");
                  }}/>
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 px-4 max-w-7xl mx-auto">
        {/* Page Title */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">My Events</h1>
            <p className="text-gray-400 mt-2">Manage your events and track their performance</p>
          </div>
          <button
            onClick={() => setIsCreatingEvent(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Create Event
          </button>
        </div>

        {/* Event Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <div
              key={event.id}
              className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-indigo-500 transition-all transform hover:scale-[1.02] cursor-pointer"
              onClick={() => setSelectedEvent(event)}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-white">{event.name}</h3>
                  {/* <span className={`px-3 py-1 rounded-full text-sm font-medium ${event.status === 'Active'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-gray-700/50 text-gray-300'
                    }`}>
                    {event.status}
                  </span> */}
                </div>
                <div className="space-y-2 text-gray-400">
                  <p>{event.date}</p>
                  <p>{event.location}</p>
                </div>
                {/* <div className="mt-4 flex justify-between items-center text-sm text-gray-400"> */}
                  {/* <span>Attendees: {event.attendees}/{event.totalCapacity}</span>
                  <span>${event.revenue.toLocaleString()}</span> */}
                {/* </div> */}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Chatbot Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-500 transition-colors"
      >
        <MessageCircle size={24} />
      </button>

      {/* Chatbot Modal */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 w-96 bg-gray-900 rounded-xl border border-gray-800 shadow-xl">
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <Brain className="text-indigo-400" size={24} />
              <h3 className="font-semibold text-white">EventSense Assistant</h3>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {chatMessages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`max-w-[80%] rounded-lg p-3 ${message.isBot
                    ? 'bg-gray-800 text-white'
                    : 'bg-indigo-600 text-white'
                  }`}>
                  {message.text}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-500 transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default OrganizerDashboard;