import { useLocation } from 'wouter';

// Get the base path from Vite's env
const base = import.meta.env.BASE_URL;

export function useBasePath() {
  const [, setLocation] = useLocation();
  
  // Wrap the navigate function to include the base path
  const navigateWithBase = (to: string) => {
    // Remove leading slash if present since base already has it
    const path = to.startsWith('/') ? to.slice(1) : to;
    setLocation(base + path);
  };

  return navigateWithBase;
}
