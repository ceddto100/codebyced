import { useEffect, useRef } from 'react';

const ElevenLabsConvai = () => {
  const scriptRef = useRef(null);
  const widgetRef = useRef(null);

  useEffect(() => {
    // Check if the custom element is already registered
    if (!customElements.get('elevenlabs-convai')) {
      // Create and load the script only if it hasn't been loaded yet
      scriptRef.current = document.createElement('script');
      scriptRef.current.src = 'https://elevenlabs.io/convai-widget/index.js';
      scriptRef.current.async = true;
      scriptRef.current.type = 'text/javascript';
      
      // Wait for the script to load before creating the widget
      scriptRef.current.onload = () => {
        // Create widget element only after script has loaded
        widgetRef.current = document.createElement('elevenlabs-convai');
        widgetRef.current.setAttribute('agent-id', 'klyy8evZGhBfu4B4LDuy');
        document.body.appendChild(widgetRef.current);
      };

      document.body.appendChild(scriptRef.current);
    }

    // Cleanup function
    return () => {
      // Only remove elements if they were created by this instance
      if (scriptRef.current) {
        document.body.removeChild(scriptRef.current);
      }
      if (widgetRef.current) {
        document.body.removeChild(widgetRef.current);
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount

  // Component doesn't render anything visible
  return null;
};

export default ElevenLabsConvai; 