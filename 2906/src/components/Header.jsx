import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/authSlice';
import { Compass, User, LogOut } from 'lucide-react';

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md text-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center space-x-2 text-xl font-bold tracking-tight text-blue-400 hover:text-blue-300 transition-colors">
          <Compass className="h-6 w-6" />
          <span>GezginBilet</span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link to="/" className="text-slate-200 hover:text-white transition-colors">Anasayfa</Link>
          <Link to="/bookings" className="text-slate-200 hover:text-white transition-colors">Biletlerim</Link>
          <Link to="/admin" className="text-slate-200 hover:text-white transition-colors">Admin Paneli</Link>
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1 text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full">
                <User className="h-4 w-4 text-blue-400" />
                <span className="text-xs font-semibold">{user.name} {user.surname}</span>
              </span>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-red-900/50 bg-red-950/30 text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all text-xs font-semibold"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Çıkış</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link 
                to="/login" 
                className="text-slate-300 hover:text-white transition-colors"
              >
                Giriş Yap
              </Link>
              <Link 
                to="/register" 
                className="bg-blue-600 text-white hover:bg-blue-500 transition-colors px-4 py-2 rounded-lg text-xs font-semibold"
              >
                Kayıt Ol
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
