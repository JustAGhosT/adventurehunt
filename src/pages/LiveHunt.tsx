import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Camera, MapPin, Volume2, VolumeX, CheckCircle, Star, Award, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { huntApi, ratingApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useAudio } from '../contexts/AudioContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

export const LiveHunt: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { state: authState } = useAuth();
  const { playSuccessSound, playDiscoverySound } = useAudio();
  
  const [currentClueIndex, setCurrentClueIndex] = useState(0);
  const [completedClues, setCompletedClues] = useState<Set<number>>(new Set());
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState({ engagement: 0, difficulty: 0, feedback: '' });
  const [startTime] = useState(Date.now());

  // Fetch hunt data
  const { data: hunt, isLoading } = useQuery({
    queryKey: ['hunt', id],
    queryFn: () => huntApi.getHunt(id!),
    enabled: !!id
  });

  // Submit rating mutation
  const submitRatingMutation = useMutation({
    mutationFn: (ratingData: any) => ratingApi.submitRating(ratingData),
    onSuccess: () => {
      toast.success('Thank you for your feedback! 🌟');
      navigate('/profile');
    },
    onError: () => {
      toast.error('Failed to submit rating');
    }
  });

  const huntData = hunt?.data?.data;
  const clues = huntData?.clues || [];
  const currentClue = clues[currentClueIndex];

  useEffect(() => {
    if (!authState.user) {
      navigate('/');
    }
  }, [authState.user, navigate]);

  const handleClueComplete = () => {
    if (!currentClue) return;
    
    const newCompleted = new Set(completedClues);
    newCompleted.add(currentClueIndex);
    setCompletedClues(newCompleted);
    
    playSuccessSound();
    toast.success(currentClue.success_message || 'Great job! 🎉');

    // Check if all clues are completed
    if (newCompleted.size === clues.length) {
      // Hunt completed!
      setTimeout(() => {
        setShowRatingModal(true);
      }, 1000);
    } else {
      // Move to next clue
      setTimeout(() => {
        setCurrentClueIndex(currentClueIndex + 1);
        playDiscoverySound();
      }, 1500);
    }
  };

  const handleSkipClue = () => {
    if (currentClueIndex < clues.length - 1) {
      setCurrentClueIndex(currentClueIndex + 1);
      playDiscoverySound();
    }
  };

  const handleSubmitRating = () => {
    if (rating.engagement === 0 || rating.difficulty === 0) {
      toast.error('Please rate both engagement and difficulty');
      return;
    }

    const completionTime = Math.floor((Date.now() - startTime) / 1000 / 60); // minutes

    submitRatingMutation.mutate({
      hunt_id: id,
      engagement_score: rating.engagement,
      difficulty_rating: rating.difficulty,
      feedback: rating.feedback,
      completed: completedClues.size === clues.length,
      completion_time: completionTime
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <LoadingSpinner size="lg" text="Loading your adventure..." />
          </div>
        </div>
      </div>
    );
  }

  if (!huntData || !currentClue) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Adventure not found
            </h2>
            <button
              onClick={() => navigate('/create')}
              className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-full hover:from-blue-700 hover:to-green-700 transition-all duration-200 font-semibold"
            >
              Create New Adventure
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-600">
              Progress: {completedClues.size} of {clues.length} clues completed
            </span>
            <span className="text-sm text-gray-500">
              Clue {currentClueIndex + 1} of {clues.length}
            </span>
          </div>
          <div className="bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-600 to-green-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(completedClues.size / clues.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Clue */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Clue Header */}
          <div className="bg-gradient-to-r from-blue-600 to-green-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">
                🎯 Clue {currentClueIndex + 1}
              </h1>
              <div className="flex items-center space-x-2">
                {currentClue.audio_url && (
                  <button
                    onClick={() => {/* TODO: Play audio */}}
                    className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-colors"
                  >
                    <Volume2 className="h-5 w-5" />
                  </button>
                )}
                <button
                  onClick={() => navigate(`/hunt/${id}`)}
                  className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Clue Content */}
          <div className="p-8">
            {/* Clue Image */}
            {currentClue.image_url && (
              <div className="mb-6">
                <img 
                  src={currentClue.image_url} 
                  alt="Clue illustration"
                  className="w-full max-w-md mx-auto rounded-xl shadow-md"
                />
              </div>
            )}

            {/* Riddle */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-xl mb-6">
              <h3 className="text-lg font-bold text-yellow-800 mb-2">
                🤔 Your Challenge:
              </h3>
              <p className="text-yellow-700 text-lg leading-relaxed">
                {currentClue.riddle_text}
              </p>
            </div>

            {/* Location Hint */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-xl mb-6">
              <h3 className="text-lg font-bold text-blue-800 mb-2 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Hint:
              </h3>
              <p className="text-blue-700">
                {currentClue.location_hint}
              </p>
            </div>

            {/* Visual Description */}
            {currentClue.visual_description && (
              <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-xl mb-6">
                <h3 className="text-lg font-bold text-green-800 mb-2">
                  👀 Look for:
                </h3>
                <p className="text-green-700">
                  {currentClue.visual_description}
                </p>
              </div>
            )}

            {/* Interactive Elements */}
            {currentClue.interactive_elements && currentClue.interactive_elements.length > 0 && (
              <div className="bg-purple-50 border-l-4 border-purple-400 p-6 rounded-xl mb-6">
                <h3 className="text-lg font-bold text-purple-800 mb-3">
                  🎮 Fun Activities:
                </h3>
                <ul className="space-y-2">
                  {currentClue.interactive_elements.map((element: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-purple-600 font-bold">•</span>
                      <span className="text-purple-700">{element}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Safety Notes */}
            {currentClue.safety_notes && (
              <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-xl mb-6">
                <h3 className="text-lg font-bold text-red-800 mb-2">
                  🛡️ Safety First:
                </h3>
                <p className="text-red-700">
                  {currentClue.safety_notes}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleClueComplete}
                className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-full hover:from-green-700 hover:to-blue-700 transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
              >
                <CheckCircle className="mr-2 h-6 w-6" />
                Found It!
              </button>
              
              <button
                onClick={handleSkipClue}
                className="bg-gray-200 text-gray-700 px-6 py-4 rounded-full hover:bg-gray-300 transition-colors font-semibold"
              >
                Skip This Clue
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-full w-16 h-16 mx-auto mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                🎉 Adventure Complete!
              </h2>
              <p className="text-gray-600">
                You did an amazing job! How was your adventure?
              </p>
            </div>

            <div className="space-y-6">
              {/* Engagement Rating */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  How fun was it? ⭐
                </label>
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating({ ...rating, engagement: star })}
                      className={`w-8 h-8 ${
                        star <= rating.engagement ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      <Star className="w-full h-full fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Rating */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  How challenging was it? 🔥
                </label>
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating({ ...rating, difficulty: star })}
                      className={`w-8 h-8 ${
                        star <= rating.difficulty ? 'text-red-400' : 'text-gray-300'
                      }`}
                    >
                      <Star className="w-full h-full fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tell us more! (Optional)
                </label>
                <textarea
                  value={rating.feedback}
                  onChange={(e) => setRating({ ...rating, feedback: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  rows={3}
                  placeholder="What did you like most about your adventure?"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowRatingModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  Skip
                </button>
                <button
                  onClick={handleSubmitRating}
                  disabled={submitRatingMutation.isLoading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-green-700 transition-all duration-200 disabled:opacity-50"
                >
                  {submitRatingMutation.isLoading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};