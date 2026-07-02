import React, { useState, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { clearCart } from '../../features/cart/cartSlice';
import toast from 'react-hot-toast';
import { Menu, X, ShoppingCart, User, LogOut, Home, Store, Shield, ClipboardList, Briefcase } from 'lucide-react';

const Navbar = React.memo(() => {
  const { user } = useSelector((state) => state.auth);
  const { totalAmount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    dispatch(clearCart());
    toast.success('Başarıyla çıkış yapıldı.');
    setIsMobileMenuOpen(false);
    navigate('/');
  }, [dispatch, navigate]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const isActive = useCallback((path, queryParam = '') => {
    if (queryParam) {
      return location.pathname === path && location.search.includes(queryParam);
    }
    return location.pathname === path && !location.search;
  }, [location.pathname, location.search]);

  const getNavLinkClass = useCallback((path, queryParam = '') => {
    return `text-sm font-bold tracking-wide transition-all duration-200 ${
      isActive(path, queryParam)
        ? 'text-[#B83246] border-b-2 border-[#B83246] pb-1'
        : 'text-gray-300 hover:text-[#B83246]'
    }`;
  }, [isActive]);

  const getMobileNavLinkClass = useCallback((path, queryParam = '') => {
    return `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
      isActive(path, queryParam)
        ? 'bg-[#7A1E2C]/20 text-[#B83246] border border-[#7A1E2C]/30'
        : 'text-gray-400 hover:text-white hover:bg-gray-800/40'
    }`;
  }, [isActive]);

  return (
    <nav className="bg-[#0B0B0F]/90 backdrop-blur-md border-b border-[#2e303a] px-6 py-4 sticky top-0 z-50 animate-fadeIn">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="bg-[#7A1E2C] text-white font-extrabold px-3.5 py-1.5 rounded-lg text-lg tracking-wider hover:bg-[#B83246] transition duration-200">
            DELICIOUS
          </span>
        </Link>

        {/* Desktop Links based on role */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className={getNavLinkClass('/')}>
            Ana Sayfa
          </Link>

          {/* Admin Navigation */}
          {user && user.role === 'admin' && (
            <>
              <Link to="/admin" className={getNavLinkClass('/admin', 'tab=dashboard')}>
                Admin Panel
              </Link>
              <Link to="/admin?tab=restaurants" className={getNavLinkClass('/admin', 'tab=restaurants')}>
                Restoranlar
              </Link>
              <Link to="/admin?tab=orders" className={getNavLinkClass('/admin', 'tab=orders')}>
                Sipariş Takibi
              </Link>
            </>
          )}

          {/* User / Restaurant Owner Navigation */}
          {user && user.role === 'user' && (
            <>
              <Link to="/user" className={getNavLinkClass('/user', 'tab=dashboard')}>
                İşletme Panelim
              </Link>
              <Link to="/user?tab=menu" className={getNavLinkClass('/user', 'tab=menu')}>
                Menü Yönetimi
              </Link>
              <Link to="/user?tab=orders" className={getNavLinkClass('/user', 'tab=orders')}>
                Gelen Siparişler
              </Link>
            </>
          )}

          {/* Customer Navigation */}
          {user && user.role === 'customer' && (
            <>
              <Link to="/customer" className={getNavLinkClass('/customer', 'tab=browse')}>
                Restoranlar
              </Link>
              <Link to="/cart" className={`relative flex items-center space-x-1.5 ${getNavLinkClass('/cart')}`}>
                <ShoppingCart size={16} />
                <span>Sepetim</span>
                {totalAmount > 0 && (
                  <span className="bg-[#7A1E2C] text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full">
                    {totalAmount}
                  </span>
                )}
              </Link>
              <Link to="/customer?tab=orders" className={getNavLinkClass('/customer', 'tab=orders')}>
                Siparişlerim
              </Link>
            </>
          )}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3.5">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-full bg-[#7A1E2C]/20 border border-[#7A1E2C]/40 flex items-center justify-center text-sm font-bold text-white uppercase" title={user.name}>
                  {user.name.charAt(0)}
                </div>
                <div className="text-left">
                  <span className="text-gray-300 text-xs font-semibold block max-w-[100px] truncate leading-tight">{user.name}</span>
                  <span className="text-gray-500 text-[9px] font-bold block uppercase leading-none mt-0.5">
                    {user.role === 'user' ? 'İşletme Sahibi' : user.role === 'admin' ? 'Admin' : 'Müşteri'}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1.5 bg-transparent border border-[#2e303a] hover:border-red-500/30 hover:bg-red-500/10 text-gray-400 hover:text-red-500 px-3.5 py-1.5 rounded-lg font-bold text-xs transition duration-200"
              >
                <LogOut size={13} />
                <span>Çıkış</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="text-gray-300 hover:text-white px-3 py-1.5 text-sm font-bold transition duration-200"
              >
                Giriş Yap
              </Link>
              <Link
                to="/register"
                className="bg-[#7A1E2C] hover:bg-[#B83246] text-white px-4 py-2 rounded-lg font-bold text-sm transition duration-300 shadow-md hover:shadow-red-950/20"
              >
                Kayıt Ol
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger toggle button */}
        <div className="flex md:hidden items-center space-x-4">
          {user && user.role === 'customer' && totalAmount > 0 && (
            <Link to="/cart" className="relative text-gray-300 hover:text-[#B83246] p-1.5">
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 bg-[#7A1E2C] text-white text-[9px] font-black w-4.5 h-4.5 flex items-center justify-center rounded-full">
                {totalAmount}
              </span>
            </Link>
          )}
          <button
            onClick={toggleMobileMenu}
            className="text-gray-400 hover:text-white p-1 rounded-lg focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Slide-out menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#17171C] border-l border-[#2e303a] w-64 h-full p-6 flex flex-col justify-between">
            <div className="space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-[#2e303a]">
                <span className="font-extrabold text-white tracking-wider text-base">MENÜ</span>
                <button onClick={toggleMobileMenu} className="text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              {/* User profile inside menu */}
              {user && (
                <div className="flex items-center space-x-3 bg-[#0B0B0F] p-3.5 rounded-lg border border-[#2e303a]/50">
                  <div className="w-10 h-10 rounded-full bg-[#7A1E2C]/20 border border-[#7A1E2C]/40 flex items-center justify-center font-bold text-white text-base">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <div className="text-white text-sm font-bold max-w-[120px] truncate">{user.name}</div>
                    <div className="text-[#B83246] text-[10px] font-extrabold uppercase tracking-wide">
                      {user.role === 'user' ? 'İşletme Sahibi' : user.role === 'admin' ? 'Admin' : 'Müşteri'}
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile Links */}
              <div className="flex flex-col space-y-2">
                <Link to="/" onClick={toggleMobileMenu} className={getMobileNavLinkClass('/')}>
                  <Home size={16} />
                  <span>Ana Sayfa</span>
                </Link>

                {user && user.role === 'admin' && (
                  <>
                    <Link to="/admin" onClick={toggleMobileMenu} className={getMobileNavLinkClass('/admin', 'tab=dashboard')}>
                      <Shield size={16} />
                      <span>Admin Panel</span>
                    </Link>
                    <Link to="/admin?tab=restaurants" onClick={toggleMobileMenu} className={getMobileNavLinkClass('/admin', 'tab=restaurants')}>
                      <Store size={16} />
                      <span>Restoranlar</span>
                    </Link>
                    <Link to="/admin?tab=orders" onClick={toggleMobileMenu} className={getMobileNavLinkClass('/admin', 'tab=orders')}>
                      <ClipboardList size={16} />
                      <span>Sipariş Takibi</span>
                    </Link>
                  </>
                )}

                {user && user.role === 'user' && (
                  <>
                    <Link to="/user" onClick={toggleMobileMenu} className={getMobileNavLinkClass('/user', 'tab=dashboard')}>
                      <Briefcase size={16} />
                      <span>İşletme Panelim</span>
                    </Link>
                    <Link to="/user?tab=menu" onClick={toggleMobileMenu} className={getMobileNavLinkClass('/user', 'tab=menu')}>
                      <ClipboardList size={16} />
                      <span>Menü Yönetimi</span>
                    </Link>
                    <Link to="/user?tab=orders" onClick={toggleMobileMenu} className={getMobileNavLinkClass('/user', 'tab=orders')}>
                      <Store size={16} />
                      <span>Gelen Siparişler</span>
                    </Link>
                  </>
                )}

                {user && user.role === 'customer' && (
                  <>
                    <Link to="/customer" onClick={toggleMobileMenu} className={getMobileNavLinkClass('/customer', 'tab=browse')}>
                      <Store size={16} />
                      <span>Restoranlar</span>
                    </Link>
                    <Link to="/cart" onClick={toggleMobileMenu} className={getMobileNavLinkClass('/cart')}>
                      <ShoppingCart size={16} />
                      <span>Sepetim</span>
                    </Link>
                    <Link to="/customer?tab=orders" onClick={toggleMobileMenu} className={getMobileNavLinkClass('/customer', 'tab=orders')}>
                      <ClipboardList size={16} />
                      <span>Siparişlerim</span>
                    </Link>
                  </>
                )}
              </div>

            </div>

            {/* Logout/Login actions at bottom */}
            <div className="pt-6 border-t border-[#2e303a]">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 bg-[#7A1E2C]/10 border border-[#7A1E2C]/30 text-white font-bold py-2.5 rounded-lg text-sm hover:bg-[#7A1E2C] transition-all"
                >
                  <LogOut size={16} />
                  <span>Çıkış Yap</span>
                </button>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={toggleMobileMenu}
                    className="block text-center bg-transparent border border-[#2e303a] hover:border-white text-white font-bold py-2.5 rounded-lg text-sm transition"
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    to="/register"
                    onClick={toggleMobileMenu}
                    className="block text-center bg-[#7A1E2C] hover:bg-[#B83246] text-white font-bold py-2.5 rounded-lg text-sm transition shadow-md"
                  >
                    Kayıt Ol
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </nav>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
