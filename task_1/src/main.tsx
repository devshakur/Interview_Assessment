import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { FlowProvider } from './store/FlowContext.tsx';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FlowProvider>
    <App />

    </FlowProvider>
  </StrictMode>
);
