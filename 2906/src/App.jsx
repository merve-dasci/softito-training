import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Filter from './pages/Filter';
import Detail from './pages/Detail';
import Payment from './pages/Payment';
import Admin from './pages/Admin';
import Bookings from './pages/Bookings';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-950 text-white font-sans antialiased selection:bg-blue-600 selection:text-white">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/filter" element={<Filter />} />
            <Route path="/detail/:id" element={<Detail />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/bookings" element={<Bookings />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
