import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, User, Volume2, VolumeX } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAudio } from '../contexts/AudioContext';

export const Navbar: React.FC = () => {
  const { state: authState, logout } = useAuth();
  const { state: audioState, toggleAudio } = useAudio();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg border-b-4 border-blue-500 fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 p-2 rounded-full group-hover:scale-110 transition-transform">
              <Compass className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              Adventure Hunt
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {/* Audio Toggle */}
            <button
              onClick={toggleAudio}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title={audioState.isEnabled ? 'Disable Audio' : 'Enable Audio'}
            >
              {audioState.isEnabled ? (
                <Volume2 className="h-5 w-5 text-gray-700" />
              ) : (
                <VolumeX className="h-5 w-5 text-gray-400" />
              )}
            </button>

            {authState.user ? (
              <>
                <Link
                  to="/create"
                  className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 py-2 rounded-full hover:from-blue-700 hover:to-green-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                >
                  Create Hunt
                </Link>
                
                <div className="flex items-center space-x-3">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <User className="h-5 w-5 text-gray-700" />
                    <span className="text-sm font-medium text-gray-700">
                      {authState.user.name}
                    </span>
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-600 hover:text-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/"
                className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 py-2 rounded-full hover:from-blue-700 hover:to-green-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};