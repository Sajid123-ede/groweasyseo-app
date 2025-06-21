import UrlInput from './components/UrlInput';
import './index.css';

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900 p-4">
      <header className="mb-8 text-center">
        <h1 className="text-5xl font-extrabold text-blue-600 mb-2">GrowEasySEO</h1>
        <p className="text-xl text-gray-700">Your ultimate SEO companion.</p>
      </header>
      <main className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <UrlInput />
      </main>
    </div>
  );
}

export default App;