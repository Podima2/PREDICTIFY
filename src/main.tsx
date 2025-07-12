import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { spicy } from 'viem/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';
import './index.css';

// Create wagmi config
const config = createConfig({
  chains: [spicy],
  transports: {
    [spicy.id]: http(),
  },
});

// Create a client
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);