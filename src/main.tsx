import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './App';

// StrictMode removed — it double-mounts the WebGL Canvas in dev, which
// destroys and recreates the GL context and causes visible flashing.
// The 3D scene is only stable with a single mount.

createRoot(document.getElementById('root')!).render(<App />);
