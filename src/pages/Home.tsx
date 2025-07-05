import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Star, Shield, Users, Zap, Camera } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

export const Home: React.FC = () => {
  const { state: authState, login } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    ageGroup: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.ageGroup) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await login(formData.name.trim(), formData.ageGroup);
      toast.success(`Welcome, ${formData.name}! Let's start your adventure!`);
      navigate('/create');
    } catch (error) {
      toast.error('Failed to start your adventure. Please try again!');
    }
  };

  const features = [
    {
      icon: <Compass className="h-8 w-8 text-blue-600" />,
      title: 'Adventure Awaits',
      description: 'Explore amazing places and discover hidden treasures in your own neighborhood!'
    },
    {
      icon: <Star className="h-8 w-8 text-yellow-600" />,
      title: 'Magical Stories',
      description: 'Every hunt comes with an exciting story featuring pirates, nature friends, and city heroes!'
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: 'Super Safe',
      description: 'All adventures are designed to be safe and fun with grown-up supervision!'
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: 'Family Fun',
      description: 'Perfect for families to explore together and create amazing memories!'
    },
    {
      icon: <Zap className="h-8 w-8 text-orange-600" />,
      title: 'Interactive Magic',
      description: 'Take photos, listen to sounds, and interact with your environment!'
    },
    {
      icon: <Camera className="h-8 w-8 text-pink-600" />,
      title: 'Capture Memories',
      description: 'Document your discoveries and share your adventures with friends!'
    }
  ];

  if (authState.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 p-4 rounded-full w-20 h-20 mx-auto mb-6">
              <Compass className="h-12 w-12 text-white" />
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome back, {authState.user.name}! 🌟
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              Ready for your next amazing adventure? Let's create a new hunt!
            </p>
            
            <button
              onClick={() => navigate('/create')}
              className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-full hover:from-blue-700 hover:to-green-700 transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Create New Adventure
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 p-6 rounded-full w-24 h-24 mx-auto mb-8">
            <Compass className="h-12 w-12 text-white" />
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to Adventure Hunt! 🎉
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Create amazing scavenger hunts that turn any place into an exciting adventure! 
            Perfect for kids aged 6-12 who love exploring, discovering, and having fun!
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Sign Up Form */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Start Your Adventure! 🚀
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  What's your name?
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-lg"
                  placeholder="Enter your name"
                  disabled={authState.isLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  How old are you?
                </label>
                <select
                  value={formData.ageGroup}
                  onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-lg"
                  disabled={authState.isLoading}
                >
                  <option value="">Select your age group</option>
                  <option value="6-8">6-8 years old</option>
                  <option value="9-12">9-12 years old</option>
                </select>
              </div>
              
              <button
                type="submit"
                disabled={authState.isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-green-700 transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {authState.isLoading ? (
                  <LoadingSpinner size="sm" text="Starting your adventure..." />
                ) : (
                  'Let\'s Go Adventure! 🎯'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};