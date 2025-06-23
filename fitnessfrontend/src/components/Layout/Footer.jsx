import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">FitGenius</h3>
            <p className="text-gray-400">
              AI-powered fitness platform helping you achieve your dream physique.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <FaFacebook className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaTwitter className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaInstagram className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaLinkedin className="text-xl" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Press</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Privacy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Terms</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Status</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="text-gray-400">info@fitgenius.com</li>
              <li className="text-gray-400">+1 (555) 123-4567</li>
              <li className="text-gray-400">123 Fitness St, San Francisco, CA</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} FitGenius. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;