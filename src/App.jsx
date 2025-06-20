    // src/App.jsx
    import './App.css' // Keep this for now, though Tailwind often replaces much of it
    import './index.css' // Ensure Tailwind CSS is imported

    function App() {
      return (
        // Tailwind classes applied:
        // min-h-screen: minimum height of the screen
        // bg-gray-100: light gray background
        // flex: enable flexbox for centering
        // items-center: center items vertically
        // justify-center: center items horizontally
        // p-4: padding on all sides
        <div>
          <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <h1 className="text-5xl font-bold text-indigo-700">
              Welcome to GrowEasySEO!
            </h1>
          </div>
        </div>
      )
    }

    export default App
    