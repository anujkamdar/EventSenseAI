import React, { useState } from 'react';
import { Brain, Calendar, MessageSquare, Bell, User as UserIcon, Search, LogOut, Star, ChevronLeft, SmilePlus } from 'lucide-react';
import { db,get,ref,onAuthStateChanged,auth,signOut,push} from './firebaseinit';
let uid;
import { Link,NavLink,useNavigate } from 'react-router-dom';

function AttendeeDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('events');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [sentiment, setSentiment] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [permanenteventList, setPermanentEventList] = useState({});

  
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
          let data = snap.val()
          console.log(data);
          const eventSnap = await get(ref(db,`basiceventdata`));
          let eventList = eventSnap.val()
          console.log(eventList);
          setPermanentEventList(eventList);
          for(let eventId in eventList){
            // console.log(eventId);
            let eventData = eventList[eventId];
            loadedEvents.push({
              id: eventId,
              name: eventData.name,
              date: eventData.date,
              location: eventData.location,
              status: "Upcoming",
              image: eventData.image,
              description: eventData.description,
              reviews: [
                { id: 1, user: "John Doe", rating: 5, comment: "Amazing conference! Learned so much.", sentiment: "happy" },
                { id: 2, user: "Jane Smith", rating: 4, comment: "Great speakers and networking opportunities.", sentiment: "satisfied" }]
            })
          }
          setEvents(loadedEvents);
          setUserData(data);
        // }
      })
    }


  const sentimentEmojis = [
    { name: 'excited', emoji: '😃', label: 'Excited' },
    { name: 'happy', emoji: '😊', label: 'Happy' },
    { name: 'satisfied', emoji: '🙂', label: 'Satisfied' },
    { name: 'neutral', emoji: '😐', label: 'Neutral' },
    { name: 'disappointed', emoji: '😕', label: 'Disappointed' }
  ];

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    let idOfSelected = selectedEvent.id;
    // console.log(eventList);
    console.log(permanenteventList);

    try{
      await push(ref(db,`users/${permanenteventList[idOfSelected]["organizerId"]}/events/${idOfSelected}/reviews`),{rating, feedback, sentiment})
    }catch(error){
      alert(error.message)
    }
    
    console.log({ rating, feedback, sentiment });
    alert('Thank you for your feedback!');
    setRating(0);
    setFeedback('');
    setSentiment(null);
  };

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
                  <span>Back to Events</span>
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
                <h1 className="text-3xl font-bold text-white">{selectedEvent.name}</h1>
                <div className="mt-4 space-y-2 text-gray-300">
                  <p>{selectedEvent.date}</p>
                  <p>{selectedEvent.location}</p>
                </div>
                <p className="mt-4 text-gray-400">{selectedEvent.description}</p>
              </div>
            </div>

            {/* Right Column - Feedback and Reviews */}
            <div className="space-y-8">
              {/* Sentiment Selection */}
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <SmilePlus size={24} className="text-indigo-400" />
                  How are you feeling about this event?
                </h2>
                <div className="flex justify-between">
                  {sentimentEmojis.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => setSentiment(item.name)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all ${
                        sentiment === item.name ? 'bg-indigo-600/20 scale-110' : 'hover:bg-gray-700'
                      }`}
                    >
                      <span className="text-3xl">{item.emoji}</span>
                      <span className="text-sm text-gray-400">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback Form */}
              <form onSubmit={handleSubmitFeedback} className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-4">Share Your Feedback</h2>
                
                {/* Star Rating */}
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`text-2xl transition-colors ${
                          star <= rating ? 'text-yellow-400' : 'text-gray-600'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                {/* Feedback Text */}
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">Your Feedback</label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500"
                    rows="4"
                    placeholder="Share your thoughts about the event..."
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-500 transition-colors"
                >
                  Submit Feedback
                </button>
              </form>

              {/* Reviews Section */}
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-4">Event Reviews</h2>
                <div className="space-y-4">
                  {selectedEvent.reviews.length > 0 ? (
                    selectedEvent.reviews.map(review => (
                      <div key={review.id} className="border-b border-gray-700 last:border-0 pb-4 last:pb-0">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-white font-medium">{review.user}</span>
                          <div className="flex text-yellow-400">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} size={16} fill="currentColor" />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-400">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">No reviews yet. Be the first to review!</p>
                  )}
                </div>
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
                  <LogOut size={20} onClick={ async () => {
                    await signOut(auth);
                    navigate("/");  
                  }} />
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 px-4 max-w-7xl mx-auto">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Upcoming Events</h1>
          <p className="text-gray-400 mt-2">Discover and join exciting events in your area</p>
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
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    event.status === 'Registered' 
                      ? 'bg-indigo-500/20 text-indigo-400'
                      : 'bg-gray-700/50 text-gray-300'
                  }`}>
                    {event.status}
                  </span>
                </div>
                <div className="space-y-2 text-gray-400">
                  <p>{event.date}</p>
                  <p>{event.location}</p>
                </div>
                <button 
                  className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-500 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEvent(event);
                  }}
                >
                  {event.status === 'Registered' ? 'View Details' : 'Register Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default AttendeeDashboard;