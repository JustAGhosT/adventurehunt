import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Clock, MapPin, Zap, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { huntApi } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

export const HuntCreation: React.FC = () => {
  const { state: authState } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    theme: '',
    difficulty: '',
    location_type: '',
    duration: 30
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const themes = [
    { id: 'pirates', name: 'Pirates', icon: '🏴‍☠️', description: 'Ahoy! Search for hidden treasure' },
    { id: 'nature', name: 'Nature', icon: '🌲', description: 'Explore the great outdoors' },
    { id: 'city', name: 'City', icon: '🏙️', description: 'Urban adventures await' },
    { id: 'space', name: 'Space', icon: '🚀', description: 'Blast off to the stars' },
    { id: 'mystery', name: 'Mystery', icon: '🔍', description: 'Solve puzzling mysteries' },
    { id: 'animals', name: 'Animals', icon: '🦋', description: 'Meet amazing creatures' }
  ];

  const difficulties = [
    { id: 'easy', name: 'Easy', icon: '🌟', description: 'Perfect for beginners' },
    { id: 'medium', name: 'Medium', icon: '⚡', description: 'A fun challenge' },
    { id: 'hard', name: 'Hard', icon: '🔥', description: 'For expert adventurers' }
  ];

  const locationTypes = [
    { id: 'indoor', name: 'Indoor', icon: '🏠', description: 'Inside buildings' },
    { id: 'outdoor', name: 'Outdoor', icon: '🌞', description: 'Outside adventures' },
    { id: 'mixed', name: 'Mixed', icon: '🏞️', description: 'Both indoor and outdoor' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.theme || !formData.difficulty || !formData.location_type) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const response = await huntApi.createHunt(formData);
      const huntId = response.data.data.id;
      
      toast.success('Your adventure is being created! 🎉');
      navigate(`/hunt/${huntId}`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create hunt';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!authState.user) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 p-4 rounded-full w-16 h-16 mx-auto mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Create Your Adventure! 🎯
          </h1>
          <p className="text-xl text-gray-600">
            Design an amazing scavenger hunt that will be super fun to play!
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Hunt Title */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                <Compass className="inline h-5 w-5 mr-2" />
                What should we call your adventure?
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-lg"
                placeholder="My Amazing Adventure"
                disabled={isLoading}
              />
            </div>

            {/* Theme Selection */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                <Sparkles className="inline h-5 w-5 mr-2" />
                Choose your adventure theme:
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, theme: theme.id })}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      formData.theme === theme.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    disabled={isLoading}
                  >
                    <div className="text-2xl mb-2">{theme.icon}</div>
                    <div className="font-semibold">{theme.name}</div>
                    <div className="text-sm text-gray-600">{theme.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Selection */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                <Zap className="inline h-5 w-5 mr-2" />
                How challenging should it be?
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {difficulties.map((difficulty) => (
                  <button
                    key={difficulty.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, difficulty: difficulty.id })}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      formData.difficulty === difficulty.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    disabled={isLoading}
                  >
                    <div className="text-2xl mb-2">{difficulty.icon}</div>
                    <div className="font-semibold">{difficulty.name}</div>
                    <div className="text-sm text-gray-600">{difficulty.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Location Type */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                <MapPin className="inline h-5 w-5 mr-2" />
                Where will the adventure take place?
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {locationTypes.map((locationType) => (
                  <button
                    key={locationType.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, location_type: locationType.id })}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      formData.location_type === locationType.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    disabled={isLoading}
                  >
                    <div className="text-2xl mb-2">{locationType.icon}</div>
                    <div className="font-semibold">{locationType.name}</div>
                    <div className="text-sm text-gray-600">{locationType.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                <Clock className="inline h-5 w-5 mr-2" />
                How long should the adventure last?
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="15"
                  max="120"
                  step="15"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="flex-1"
                  disabled={isLoading}
                />
                <span className="text-lg font-semibold text-gray-700 min-w-[80px]">
                  {formData.duration} minutes
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-green-700 transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" text="Creating your adventure..." />
              ) : (
                <>
                  Create My Adventure
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};