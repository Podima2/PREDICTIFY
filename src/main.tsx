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
              logo: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9InByaXZ5TG9nb0dyYWRpZW50IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcENvbG9yPSIjZGMyNjI2IiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjUwJSIgc3RvcENvbG9yPSIjZWY0NDQ0IiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3BDb2xvcj0iI2Y4NzE3MSIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjkiIGZpbGw9Im5vbmUiIHN0cm9rZT0idXJsKCNwcml2eUxvZ29HcmFkaWVudCkiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CiAgPHBhdGggZD0iTTEzIDIgTDQuNSAxMi41IEwxMCAxMi41IEwxMSAyMiBMMTkuNSAxMS41IEwxNCAxMS41IFoiIGZpbGw9InVybCgjcHJpdnlMb2dvR3JhZGllbnQpIiBzdHJva2U9InVybCgjcHJpdnlMb2dvR3JhZGllbnQpIiBzdHJva2Utd2lkdGg9IjAuNSIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiB0cmFuc2Zvcm09InNjYWxlKDAuNikgdHJhbnNsYXRlKDQuOCwgNC44KSIvPgogIDxjaXJjbGUgY3g9IjgiIGN5PSI4IiByPSIwLjgiIGZpbGw9IiNlZjQ0NDQiIG9wYWNpdHk9IjAuOCIvPgogIDxjaXJjbGUgY3g9IjE2IiBjeT0iOCIgcj0iMC44IiBmaWxsPSIjZWY0NDQ0IiBvcGFjaXR5PSIwLjgiLz4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjE2IiByPSIwLjgiIGZpbGw9IiNlZjQ0NDQiIG9wYWNpdHk9IjAuOCIvPgo8L3N2Zz4=',
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