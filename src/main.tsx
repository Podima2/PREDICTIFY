import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PrivyProvider } from '@privy-io/react-auth';
import App from './App.tsx';
import './index.css';
import { spicy } from 'viem/chains';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrivyProvider
      appId="cm6qt4wko001l64rpni0xtoo6"
      config={{
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
        appearance: {
          theme: 'dark',
          accentColor: '#dc2626',
          logo: '/predictify-logo.svg',
        },
        loginMethods: ['wallet', 'email', 'google', 'twitter'],
        supportedChains: [spicy],
      }}
    >
      <App />
    </PrivyProvider>
  </StrictMode>
);