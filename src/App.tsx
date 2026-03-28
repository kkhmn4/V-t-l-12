import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import { db } from './lib/firebase';
import { doc, getDocFromServer } from 'firebase/firestore';

const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode, allowedRole?: 'teacher' | 'student' }) => {
  const { user, role, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRole && role !== allowedRole) {
    return <Navigate to={role === 'teacher' ? '/dashboard' : '/learn'} />;
  }

  return <>{children}</>;
};

function App() {
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRole="teacher">
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/learn/*" element={
            <ProtectedRoute allowedRole="student">
              <Learn />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
