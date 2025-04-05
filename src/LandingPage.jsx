import React, { useState } from 'react';
import { Brain, LineChart, Heart, ArrowRight, Menu, X, User, Lock, Mail } from 'lucide-react';
import { createUserWithEmailAndPassword , signInWithEmailAndPassword , onAuthStateChanged , auth,db,doc,getFirestore,updateDoc,onSnapshot,setDoc,getDoc,
  ref,set,get,push

 } from './firebaseinit';
import {Link,NavLink,useNavigate} from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [userType, setUserType] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const signInUser = async () => {
    const token = `AAAAAAAAAAAAAAAAAAAAAOaT0QEAAAAAxTjI37fujQoFODFdvgjgoeWbbNg%3DveKKWhu2t1Zz1u6mifAS4GV5r5tMoT9f0S5kRsFuhbSWd2RFg3`
    fetch("https://thingproxy.freeboard.io/fetch/https://api.twitter.com/2/tweets/search/recent?query=%23AI&max_results=10", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err));
    
    
    
    // const alldatasnap = await get(ref(db))
    // console.log(alldatasnap.val());
    try{
      if (!email) {
        alert("Enter Email");
        return;
      }
      if (!password) {
        alert("Enter Password");
        return;
      }
      const cred = await signInWithEmailAndPassword(auth,email,password);
      let uid = cred.user.uid;
      const snapshot = await get(ref(db,`users/${uid}/role`))
      const userRole = snapshot.val();
      if(userRole=="organizer"){
        navigate("/organizerdash")
      }
      if(userRole=="attendee"){
        navigate("/attendeedash")
      }
    }
    catch(error)
    {
      alert(error.message);
    }
  }

  const saveDataOfNewUser = async () => {
    try{
      if (!email) {
        alert("Enter Email");
        return;
      }
      if (!password) {
        alert("Enter Password");
        return;
      }
      if (!name){
        alert("Enter Name");
        return;
      }
      const cred = await createUserWithEmailAndPassword(auth,email,password);
      const uid = cred.user.uid;
        const userData = {
          name : name,
          email : email,
        }
        const userRef = ref(db,`users/${uid}`)
        await(set(userRef,{
          name: name,
          email: email,
          role: userType
        }))
        if(userType == "organizer"){
          navigate("/organizerdash")
        }
        else if(userType == "attendee"){
          navigate("/attendeedash")
        }
    }
    catch(error){
      console.log(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="fixed w-full z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Brain className="text-indigo-400" size={32} />
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                EventSense AI
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
              <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
              <button 
                onClick={() => {
                  setUserType(null);
                  setIsSignInOpen(true);
                }}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </button>
              <button 
                onClick={() => {
                  setUserType(null);
                  setIsRegisterOpen(true);
                }}
                className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition-colors"
              >
                Get Started
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-300 hover:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-800 border-b border-gray-700">
            <div className="px-4 py-3 space-y-3">
              <a href="#features" className="block text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="block text-gray-300 hover:text-white transition-colors">Pricing</a>
              <a href="#about" className="block text-gray-300 hover:text-white transition-colors">About</a>
              <button 
                onClick={() => {
                  setUserType(null);
                  setIsSignInOpen(true);
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </button>
              <button 
                onClick={() => {
                  setUserType(null);
                  setIsRegisterOpen(true);
                  setIsMenuOpen(false);
                }}
                className="block w-full bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80"
            alt="Background" 
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              AI-Powered Event Sentiment Monitoring
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Transform your event management with real-time sentiment analysis and
              attendee feedback monitoring.
            </p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => {
                  setUserType('organizer');
                  setIsRegisterOpen(true);
                }}
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-500 transition-all transform hover:scale-105 flex items-center gap-2"
              >
                Start Monitoring
                <ArrowRight size={20} />
              </button>
              {/* <button className="border-2 border-indigo-600 text-indigo-400 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-600/10 transition-all transform hover:scale-105">
                View Demo
              </button> */}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-800" id="features">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Advanced Sentiment Analysis Features
          </h2>
          <p className="text-xl text-gray-300 text-center mb-16">
            Leverage the power of AI to understand and improve your event experience.
          </p>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="bg-gray-900 rounded-xl p-8 shadow-lg hover:shadow-indigo-500/10 transition-all transform hover:scale-105 border border-gray-800">
              <div className="w-12 h-12 bg-indigo-900/50 rounded-lg flex items-center justify-center mb-6">
                <Heart className="text-indigo-400" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Real-time Sentiment Tracking</h3>
              <p className="text-gray-400">
                Monitor attendee sentiment in real-time with advanced natural language processing.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-900 rounded-xl p-8 shadow-lg hover:shadow-indigo-500/10 transition-all transform hover:scale-105 border border-gray-800">
              <div className="w-12 h-12 bg-indigo-900/50 rounded-lg flex items-center justify-center mb-6">
                <LineChart className="text-indigo-400" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Trend Analysis</h3>
              <p className="text-gray-400">
                Track sentiment trends and patterns throughout your event lifecycle.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-900 rounded-xl p-8 shadow-lg hover:shadow-indigo-500/10 transition-all transform hover:scale-105 border border-gray-800">
              <div className="w-12 h-12 bg-indigo-900/50 rounded-lg flex items-center justify-center mb-6">
                <Brain className="text-indigo-400" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Emotion Recognition</h3>
              <p className="text-gray-400">
                Identify and categorize different emotional responses for better insights.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80"
            alt="Background" 
            className="w-full h-full object-cover opacity-5"
          />
        </div>
        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Events?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join leading event organizers who use EventSense AI to create better experiences.
          </p>
          <button 
            onClick={() => {
              setUserType('organizer');
              setIsRegisterOpen(true);
            }}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-500 transition-all transform hover:scale-105 flex items-center gap-2 mx-auto"
          >
            Start Your Free Trial
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* Sign In Modal */}
      {isSignInOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-xl shadow-xl w-full max-w-md border border-gray-800 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Sign In</h3>
              <button 
                onClick={() => setIsSignInOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            
              <form className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      type="email"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-10 text-white focus:outline-none focus:border-indigo-500"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => {setEmail(e.target.value)}}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      type="password"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-10 text-white focus:outline-none focus:border-indigo-500"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => {setPassword(e.target.value)}}
                    />
                  </div>
                </div>
                <button 
                  type="button"
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-500 transition-colors"
                  onClick={(e) => {e.preventDefault;
                    console.log(email,password,userType);
                    signInUser();
                  }}
                >
                  Sign In
                </button>
              </form>
            
            
            <p className="text-center mt-4 text-gray-400">
              Don't have an account?{' '}
              <button 
                onClick={() => {
                  setIsSignInOpen(false);
                  setIsRegisterOpen(true);
                }}
                className="text-indigo-400 hover:text-indigo-300"
              >
                Register
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-xl shadow-xl w-full max-w-md border border-gray-800 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Create Account</h3>
              <button 
                onClick={() => setIsRegisterOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            {!userType ? (
              <div className="space-y-4">
                <button
                  onClick={() => setUserType('organizer')}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2"
                >
                  <User size={20} />
                  Register as Event Organizer
                </button>
                <button
                  onClick={() => setUserType('attendee')}
                  className="w-full border border-indigo-600 text-indigo-400 py-3 rounded-lg hover:bg-indigo-600/10 transition-colors flex items-center justify-center gap-2"
                >
                  <User size={20} />
                  Register as Event Attendee
                </button>
              </div>
            ) : (
              <form className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      type="text"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-10 text-white focus:outline-none focus:border-indigo-500"
                      placeholder="Enter your name"
                      value={name} // just for the sake of keeping values
                      // will remove lter 
                      onChange={(e) => {setName(e.target.value)}}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      type="email"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-10 text-white focus:outline-none focus:border-indigo-500"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => {setEmail(e.target.value)}}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      type="password"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-10 text-white focus:outline-none focus:border-indigo-500"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => {setPassword(e.target.value)}}
                    />
                  </div>
                </div>
                <button 
                  type="button"
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-500 transition-colors"
                  onClick={(e) => {e.preventDefault;
                    console.log(email,password,name,userType);
                    saveDataOfNewUser();
                  }}
                >
                  Create Account as {userType === 'organizer' ? 'Event Organizer' : 'Event Attendee'}
                </button>
                <button
                  type="button"
                  onClick={() => setUserType(null)}
                  className="w-full text-gray-400 hover:text-white transition-colors"
                >
                  Back to user selection
                </button>
              </form>
            )}
            
            <p className="text-center mt-4 text-gray-400">
              Already have an account?{' '}
              <button 
                onClick={() => {
                  setIsRegisterOpen(false);
                  setIsSignInOpen(true);
                }}
                className="text-indigo-400 hover:text-indigo-300"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;