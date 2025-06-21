    // src/App.jsx
    import UrlInput from './components/UrlInput'; // Import our new UrlInput component
    import './index.css'; // Ensure Tailwind CSS is imported

    function App() {
      return (
        // Main application container
        <div className="min-h-screen bg-lightBg text-textDark font-inter antialiased">
          {/* We'll add a simple header here */}
          <header className="bg-primary text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-3xl font-bold">GrowEasySEO</h1>
              {/* Navigation or other elements can go here later */}
            </div>
          </header>

          {/* Main content area where our UrlInput component will live */}
          <main className="py-8">
            <UrlInput /> {/* Render our UrlInput component here */}
          </main>
        </div>
      );
    }

    export default App;
    