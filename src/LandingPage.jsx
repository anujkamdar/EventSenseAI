import React from 'react';
import { Brain, LineChart, Heart, ArrowRight} from 'lucide-react';

function LandingPage() {
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
              <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
              <button 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </button>
              <button 
                className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition-colors"
              >
                Get Started
              </button>
            </nav>
          </div>
        </div>
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
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-500 transition-all transform hover:scale-105 flex items-center gap-2"
              >
                Start Monitoring
                <ArrowRight size={20} />
              </button>
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
        </div>
      </div>
    </div>
  );
}

export default LandingPage;