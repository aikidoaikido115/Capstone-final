import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-wrap justify-center space-x-64 ">
            <div className="mb-4">
              <a href="/" className="text-sm block underline hover:underline">FAQ</a>
              <a href="/" className="text-sm block underline hover:underline">Investor Relations</a>
              <a href="/" className="text-sm block underline hover:underline">Privacy</a>
              <a href="/" className="text-sm block underline hover:underline">Speed Test</a>
            </div>
            <div className="mb-4">
              <a href="/" className="text-sm block underline hover:underline">Account</a>
              <a href="/" className="text-sm block underline hover:underline">Ways to Watch</a>
              <a href="/" className="text-sm block underline hover:underline">Corporate Information</a>
              <a href="/" className="text-sm block underline hover:underline">Only on Anime Hub</a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} Anime ACS  Project.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
