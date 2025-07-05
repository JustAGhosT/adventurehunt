import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Clock, MapPin, Star, Users, Loader2, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { huntApi } from '../services/api';
import { wsService } from '../services/websocket';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

export const HuntDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state: authState } = useAuth();
  
  const [huntStatus, setHuntStatus] = useState<string>('generating');
  const [progress, setProgress] = useState(0);

  // Fetch hunt details
  const { data: hunt, isLoading, error, refetch } = useQuery({
    queryKey: ['hunt', id],
    queryFn: () => huntApi.getHunt(id!),
    enabled: !!id,
    retry: 3
  });

  // Fetch hunt status for generating hunts
  const { data: statusData } = useQuery({
    queryKey: ['hunt-status', id],
    queryFn: () => huntApi.getHuntStatus(id!),
    enabled: !!id && huntStatus === 'generating',
    refetchInterval: 2000 // Poll every 2 seconds
  });

  useEffect(() => {
    if (!authState.user) {
      navigate('/');
      return;
    }

    if (id) {
      // Connect to WebSocket
      wsService.connect();
      wsService.joinHunt(id);

      // Listen for hunt updates
      wsService.onHuntReady(() => {
        setHuntStatus('ready');
        toast.success('Your adventure is ready! 🎉');
        refetch();
      });

      wsService.onHuntProgress((data) => {
        setProgress(data.progress);
      });

      wsService.onHuntError((data) => {
        setHuntStatus('error');
        toast.error('Something went wrong creating your adventure 😔');
      });

      return () => {
        wsService.leaveHunt(id);
        wsService.off('hunt-ready');
        wsService.off('hunt-progress');
        wsService.off('hunt-error');
      };
    }
  }, [id, authState.user, navigate, refetch]);

  useEffect(() => {
    if (hunt?.data?.data) {
      setHuntStatus(hunt.data.data.status.toLowerCase());
      setProgress(hunt.data.data.progress || 0);
    }
  }, [hunt]);

  useEffect(() => {
    if (statusData?.data?.data) {
      setHuntStatus(statusData.data.data.status);
      setProgress(statusData.data.data.progress);
    }
  }, [statusData]);

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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4">
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Adventure Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't find this adventure. It might have been deleted or you might not have permission to view it.
            </p>
            <button
              onClick={() => navigate('/create')}
              className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-full hover:from-blue-700 hover:to-green-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
            >
              Create New Adventure
            </button>
          </div>
        </div>
      </div>
    );
  }

  const huntData = hunt?.data?.data;

  if (!huntData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <LoadingSpinner size="lg" text="Loading adventure details..." />
          </div>
        </div>
      </div>
    );
  }

  // Show generation progress
  if (huntStatus === 'generating') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 p-4 rounded-full w-16 h-16 mx-auto mb-6">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Creating Your Adventure! ✨
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              Our AI adventure team is working hard to create the perfect hunt for you!
            </p>
            
            <div className="max-w-md mx-auto mb-8">
              <div className="bg-gray-200 rounded-full h-4 mb-2">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-green-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">{progress}% Complete</p>
            </div>
            
            <div className="text-left max-w-md mx-auto space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <div className={`w-3 h-3 rounded-full mr-3 ${progress > 10 ? 'bg-green-500' : 'bg-gray-300'}`} />
                Creating your story...
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className={`w-3 h-3 rounded-full mr-3 ${progress > 30 ? 'bg-green-500' : 'bg-gray-300'}`} />
                Finding safe locations...
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className={`w-3 h-3 rounded-full mr-3 ${progress > 50 ? 'bg-green-500' : 'bg-gray-300'}`} />
                Adding visual elements...
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className={`w-3 h-3 rounded-full mr-3 ${progress > 70 ? 'bg-green-500' : 'bg-gray-300'}`} />
                Checking safety...
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className={`w-3 h-3 rounded-full mr-3 ${progress > 90 ? 'bg-green-500' : 'bg-gray-300'}`} />
                Adding interactive magic...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (huntStatus === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4">
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">
              We had trouble creating your adventure. Don't worry, let's try again!
            </p>
            <button
              onClick={() => navigate('/create')}
              className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-full hover:from-blue-700 hover:to-green-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
            >
              Create New Adventure
            </button>
          </div>
        </div>
      </div>
    );
  }

  const themeEmojis: { [key: string]: string } = {
    pirates: '🏴‍☠️',
    nature: '🌲',
    city: '🏙️',
    space: '🚀',
    mystery: '🔍',
    animals: '🦋'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-green-600 p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {themeEmojis[huntData.theme] || '🎯'} {huntData.title}
                </h1>
                <p className="text-blue-100 text-lg">
                  Your adventure is ready to begin!
                </p>
              </div>
              <div className="text-right">
                <div className="bg-white bg-opacity-20 rounded-full px-4 py-2">
                  <span className="text-sm font-semibold">
                    {huntData.status === 'READY' ? 'Ready to Play!' : huntData.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Hunt Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Duration</p>
                  <p className="text-gray-600">{huntData.duration || 30} minutes</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <MapPin className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Location</p>
                  <p className="text-gray-600 capitalize">{huntData.location_type}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <Star className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Difficulty</p>
                  <p className="text-gray-600 capitalize">{huntData.difficulty}</p>
                </div>
              </div>
            </div>

            {/* Clues Preview */}
            {huntData.clues && huntData.clues.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Adventure Preview 🎯
                </h3>
                <div className="bg-gray-50 rounded-2xl p-6">
                  <p className="text-gray-700 mb-4">
                    This adventure has <span className="font-semibold text-blue-600">
                      {huntData.clues.length} exciting clues
                    </span> for you to discover!
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {huntData.clues.slice(0, 2).map((clue: any, index: number) => (
                      <div key={clue.id} className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="flex items-center mb-2">
                          <span className="bg-blue-100 text-blue-600 font-bold px-2 py-1 rounded-full text-sm">
                            Clue {index + 1}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm">
                          {clue.riddle_text.substring(0, 100)}...
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Play Button */}
            <div className="text-center">
              <button
                onClick={() => navigate(`/hunt/${id}/play`)}
                className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-full hover:from-blue-700 hover:to-green-700 transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center mx-auto"
              >
                <Play className="mr-2 h-6 w-6" />
                Start Adventure!
              </button>
              
              <p className="text-gray-600 mt-4 text-sm">
                Make sure you have an adult with you and are ready to explore safely!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};