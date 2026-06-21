import React from 'react';
import { HiOutlineChatBubbleBottomCenterText } from 'react-icons/hi2';
import { company } from '../../assets/data/siteData';

export default function WhatsAppFloat() {
  const url = `https://wa.me/${company.whatsapp.replace('+', '')}?text=Hello%20S%20N%20Enterprises%2C%20I%20need%20a%20scaffolding%20rental%20quote.`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-xl transition hover:scale-105"
    >
      <HiOutlineChatBubbleBottomCenterText size={18} />
      WhatsApp
    </a>
  );
}