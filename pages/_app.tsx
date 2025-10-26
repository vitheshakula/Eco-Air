import '../styles/globals.css';
import { useEffect } from 'react';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Ensure Leaflet CSS is loaded after Tailwind
    import('leaflet/dist/leaflet.css');
  }, []);

  return <Component {...pageProps} />;
}
