import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ZoneTimeAPI from './ZoneTimeAPI';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ZoneTimeAPI />
  </StrictMode>,
)
