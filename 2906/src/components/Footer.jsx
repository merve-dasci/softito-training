import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 py-12">
      <div className="container mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-xl font-bold text-blue-400">
            <Compass className="h-6 w-6" />
            <span className="text-white">GezginBilet</span>
          </div>
          <p className="text-sm">En ucuz uçak ve otobüs biletlerini saniyeler içinde karşılaştırın ve güvenle satın alın.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Hızlı Erişim</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white transition-colors">Anasayfa</Link></li>
            <li><Link to="/login" className="hover:text-white transition-colors">Giriş Yap</Link></li>
            <li><Link to="/register" className="hover:text-white transition-colors">Kayıt Ol</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Popüler Rotalar</h4>
          <ul className="space-y-2 text-sm">
            <li><span className="hover:text-white transition-colors cursor-pointer">İstanbul - Ankara Otobüs</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">İstanbul - İzmir Uçak</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Ankara - İzmir Otobüs</span></li>
          </ul>
        </div>
        <div className="space-y-3 text-sm">
          <h4 className="text-white font-semibold mb-4">İletişim</h4>
          <div className="flex items-center space-x-2"><Phone className="h-4 w-4 text-blue-400" /><span>0850 123 4567</span></div>
          <div className="flex items-center space-x-2"><Mail className="h-4 w-4 text-blue-400" /><span>destek@gezginbilet.com</span></div>
          <div className="flex items-center space-x-2"><MapPin className="h-4 w-4 text-blue-400" /><span>İstanbul, Türkiye</span></div>
        </div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 mt-8 pt-8 border-t border-slate-900/50 text-center text-xs">
        <p>&copy; {new Date().getFullYear()} GezginBilet. Tüm hakları saklıdır. Bu proje eğitim amaçlı simüle edilmiştir.</p>
      </div>
    </footer>
  );
};

export default Footer;
