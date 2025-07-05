import React, { createContext, useContext, useReducer, useRef, ReactNode } from 'react';

interface AudioState {
  isEnabled: boolean;
  isPlaying: boolean;
  currentTrack: string | null;
  volume: number;
}

type AudioAction = 
  | { type: 'TOGGLE_AUDIO' }
  | { type: 'PLAY_TRACK'; payload: string }
  | { type: 'STOP_TRACK' }
  | { type: 'SET_VOLUME'; payload: number };

const initialState: AudioState = {
  isEnabled: true,
  isPlaying: false,
  currentTrack: null,
  volume: 0.7,
};

const audioReducer = (state: AudioState, action: AudioAction): AudioState => {
  switch (action.type) {
    case 'TOGGLE_AUDIO':
      return { ...state, isEnabled: !state.isEnabled };
    case 'PLAY_TRACK':
      return { ...state, isPlaying: true, currentTrack: action.payload };
    case 'STOP_TRACK':
      return { ...state, isPlaying: false, currentTrack: null };
    case 'SET_VOLUME':
      return { ...state, volume: action.payload };
    default:
      return state;
  }
};

const AudioContext = createContext<{
  state: AudioState;
  toggleAudio: () => void;
  playTrack: (url: string) => void;
  stopTrack: () => void;
  setVolume: (volume: number) => void;
  playSuccessSound: () => void;
  playDiscoverySound: () => void;
} | null>(null);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

interface AudioProviderProps {
  children: ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(audioReducer, initialState);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleAudio = () => {
    dispatch({ type: 'TOGGLE_AUDIO' });
    if (state.isPlaying) {
      stopTrack();
    }
  };

  const playTrack = (url: string) => {
    if (!state.isEnabled) return;
    
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    audioRef.current = new Audio(url);
    audioRef.current.volume = state.volume;
    audioRef.current.play().catch(error => {
      console.error('Error playing audio:', error);
    });
    
    dispatch({ type: 'PLAY_TRACK', payload: url });
    
    audioRef.current.onended = () => {
      dispatch({ type: 'STOP_TRACK' });
    };
  };

  const stopTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    dispatch({ type: 'STOP_TRACK' });
  };

  const setVolume = (volume: number) => {
    dispatch({ type: 'SET_VOLUME', payload: volume });
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  };

  const playSuccessSound = () => {
    if (!state.isEnabled) return;
    
    // Create a simple success sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  const playDiscoverySound = () => {
    if (!state.isEnabled) return;
    
    // Create a simple discovery sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
    oscillator.frequency.setValueAtTime(554.37, audioContext.currentTime + 0.1); // C#5
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  };

  return (
    <AudioContext.Provider value={{ 
      state, 
      toggleAudio, 
      playTrack, 
      stopTrack, 
      setVolume,
      playSuccessSound,
      playDiscoverySound
    }}>
      {children}
    </AudioContext.Provider>
  );
};