import { useState } from 'react';
import './App.css';
import UrlInput from './components/UrlInput'; // Corrected import path

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <header className="mb-8 text-center">
        <h1 className="text-5xl font-extrabold text-blue-600 tracking-tight">
          GrowEasySEO
        </h1>
        <p className="mt-2 text-lg text-gray-600">Your ultimate SEO companion.</p>
      </header>

      <main className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-xl">
        <UrlInput />
      </main>

      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} GrowEasySEO. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;