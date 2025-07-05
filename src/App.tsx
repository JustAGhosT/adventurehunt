import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { AudioProvider } from './contexts/AudioContext';
import { Home } from './pages/Home';
import { HuntCreation } from './pages/HuntCreation';
import { HuntDetails } from './pages/HuntDetails';
import { LiveHunt } from './pages/LiveHunt';
import { Profile } from './pages/Profile';
import { Navbar } from './components/Navbar';
import { ErrorBoundary } from './components/ErrorBoundary';
import './styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AudioProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
              <ErrorBoundary>
                <Navbar />
                <main className="pt-16">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/create" element={<HuntCreation />} />
                    <Route path="/hunt/:id" element={<HuntDetails />} />
                    <Route path="/hunt/:id/play" element={<LiveHunt />} />
                    <Route path="/profile" element={<Profile />} />
                  </Routes>
                </main>
                <Toaster 
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#ffffff',
                      color: '#1f2937',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                />
              </ErrorBoundary>
            </div>
          </Router>
        </AudioProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;