import React from 'react';
import { User, Calendar, Star, Trophy, Clock, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Profile: React.FC = () => {
  const { state: authState } = useAuth();
  const navigate = useNavigate();

  if (!authState.user) {
    navigate('/');
    return null;
  }

  const user = authState.user;

  // Mock data for demonstration
  const userStats = {
    totalHunts: 3,
    completedHunts: 2,
    averageRating: 4.5,
    totalPlayTime: 120, // minutes
    favoriteTheme: 'nature',
    achievements: [
      { id: 1, name: 'First Adventure', icon: '🎯', description: 'Completed your first hunt' },
      { id: 2, name: 'Nature Explorer', icon: '🌲', description: 'Completed 3 nature hunts' },
      { id: 3, name: 'Treasure Hunter', icon: '💎', description: 'Found all clues in a hunt' }
    ]
  };

  const recentHunts = [
    {
      id: 1,
      title: 'Pirate Treasure Adventure',
      theme: 'pirates',
      status: 'completed',
      completedAt: '2 days ago',
      rating: 5
    },
    {
      id: 2,
      title: 'Forest Friends Quest',
      theme: 'nature',
      status: 'completed',
      completedAt: '1 week ago',
      rating: 4
    },
    {
      id: 3,
      title: 'City Detective Mission',
      theme: 'city',
      status: 'in-progress',
      completedAt: 'Started today',
      rating: null
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <div className="flex items-center space-x-6">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 p-6 rounded-full">
              <User className="h-12 w-12 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {user.name} 🌟
              </h1>
              <p className="text-gray-600 text-lg">
                Age Group: {user.age_group} years old
              </p>
              <p className="text-gray-500 text-sm">
                Adventure Explorer since {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-3">
              <Trophy className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{userStats.totalHunts}</h3>
            <p className="text-gray-600">Total Adventures</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto mb-3">
              <Star className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{userStats.completedHunts}</h3>
            <p className="text-gray-600">Completed</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="bg-yellow-100 p-3 rounded-full w-12 h-12 mx-auto mb-3">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{userStats.totalPlayTime}m</h3>
            <p className="text-gray-600">Play Time</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="bg-purple-100 p-3 rounded-full w-12 h-12 mx-auto mb-3">
              <MapPin className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 capitalize">{userStats.favoriteTheme}</h3>
            <p className="text-gray-600">Favorite Theme</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Adventures */}
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Recent Adventures 🎯
            </h2>
            <div className="space-y-4">
              {recentHunts.map((hunt) => (
                <div
                  key={hunt.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">
                      {hunt.theme === 'pirates' && '🏴‍☠️'}
                      {hunt.theme === 'nature' && '🌲'}
                      {hunt.theme === 'city' && '🏙️'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{hunt.title}</h3>
                      <p className="text-sm text-gray-600">{hunt.completedAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {hunt.status === 'completed' && hunt.rating && (
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">{hunt.rating}</span>
                      </div>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      hunt.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {hunt.status === 'completed' ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Achievements 🏆
            </h2>
            <div className="space-y-4">
              {userStats.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center space-x-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl"
                >
                  <div className="text-3xl">{achievement.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{achievement.name}</h3>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Create New Adventure Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/create')}
            className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-full hover:from-blue-700 hover:to-green-700 transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Create New Adventure! 🚀
          </button>
        </div>
      </div>
    </div>
  );
};