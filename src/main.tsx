import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { EnsureKontentAsParent } from "./customElement/EnsureKontentAsParent";
import { IntegrationApp } from './IntegrationApp';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Cannot find the root element. Please, check your html.');
}

createRoot(rootElement).render(
  <StrictMode>
    <EnsureKontentAsParent>
      <IntegrationApp />
    </EnsureKontentAsParent>
  </StrictMode>
);
