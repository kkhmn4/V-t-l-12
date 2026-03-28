import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithGoogle } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { LogIn } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { user, role } = useAuth();

  useEffect(() => {
    if (user) {
      navigate(role === 'teacher' ? '/dashboard' : '/learn');
    }
  }, [user, role, navigate]);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f8] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-8 text-center">
        <h1 className="text-3xl font-bold text-[#000c24] mb-2 font-serif">Hạt Nhân Học</h1>
        <p className="text-gray-500 mb-8">Khám phá thế giới vi mô</p>
        
        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 bg-[#000c24] text-white py-4 px-6 rounded-xl hover:bg-opacity-90 transition-all font-medium"
        >
          <LogIn className="w-5 h-5" />
          Đăng nhập với Google
        </button>
      </div>
    </div>
  );
};

export default Login;
