import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import WhatsAppFloat from '../components/common/WhatsAppFloat';
import ScrollToTopButton from '../components/common/ScrollToTopButton';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-brand-black text-brand-white">
      <Navbar />
      <main className="pt-[102px] sm:pt-[106px]">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTopButton />
      <WhatsAppFloat />
    </div>
  );
}