import './App.css'; // Or './index.css' depending on your setup
import UrlInput from './components/UrlInput'; // Correct relative path

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full text-center">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-4">GrowEasySEO</h1>
        <p className="text-xl text-gray-600 mb-8">Your ultimate SEO companion.</p>
        <UrlInput />
        <footer className="mt-8 text-gray-500 text-sm">
          &copy; 2025 GrowEasySEO. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

export default App;