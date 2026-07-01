import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

const Layout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Sticky Header Navigation */}
      <Navbar />

      {/* Main Page Content Body */}
      <main className="container-xl py-5 flex-grow-1">
        <Outlet />
      </main>

      {/* Brand Footer */}
      <Footer />
    </div>
  )
}

export default Layout
