import { useState, useEffect, useMemo, useCallback } from 'react';
import { createPublicClient, createWalletClient, http, custom } from 'viem';
import { spicy } from 'viem/chains';
import { useWallet } from './useWallet';
import { USER_REGISTRY_CONTRACT } from '../constants/contracts';
import { UserRole, AthleteProfile, ScoutProfile, UserRegistrationState } from '../types';

export const useUserRegistry = () => {
  const { address, isConnected, primaryWallet } = useWallet();
  const [registrationState, setRegistrationState] = useState<UserRegistrationState>({
    userRole: UserRole.None,
    isOnboarded: false,
    isLoading: false,
    error: null
  });

  // Create public client for reading contract data - memoized to prevent recreation on every render
  const publicClient = useMemo(() => createPublicClient({
    chain: spicy,
    transport: http()
  }), []);

  // Check user registration status on wallet connection
  useEffect(() => {
    const checkRegistrationStatus = async () => {
      console.log('🔍 Checking registration status...', { isConnected, address });
      
      if (!isConnected || !address) {
        console.log('❌ Wallet not connected or no address');
        setRegistrationState({
          userRole: UserRole.None,
          isOnboarded: false,
          isLoading: false,
          error: null
        });
        return;
      }

      // Skip if contract address is not set (placeholder)
      if (USER_REGISTRY_CONTRACT.address === '0x0000000000000000000000000000000000000000') {
        console.warn('❌ UserRegistry contract address not set. Please deploy the contract and update the address.');
        setRegistrationState({
          userRole: UserRole.None,
          isOnboarded: false,
          isLoading: false,
          error: 'Contract not deployed'
        });
        return;
      }

      console.log('📋 Contract address:', USER_REGISTRY_CONTRACT.address);
      setRegistrationState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        console.log('📞 Calling getUserRole on contract...');
        const userRole = await publicClient.readContract({
          address: USER_REGISTRY_CONTRACT.address,
          abi: USER_REGISTRY_CONTRACT.abi,
          functionName: 'getUserRole',
          args: [address as `0x${string}`]
        }) as UserRole;

        console.log('✅ User role from contract:', userRole);
        console.log('✅ Is onboarded:', userRole !== UserRole.None);

        setRegistrationState({
          userRole,
          isOnboarded: userRole !== UserRole.None,
          isLoading: false,
          error: null
        });
      } catch (error) {
        console.error('❌ Failed to check registration status:', error);
        setRegistrationState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to check registration status'
        }));
      }
    };

    checkRegistrationStatus();
  }, [isConnected, address, publicClient]);

  // Register as athlete
  const registerAthlete = async (profile: AthleteProfile) => {
    if (!isConnected || !address || !primaryWallet) {
      throw new Error('Wallet not connected');
    }

    if (USER_REGISTRY_CONTRACT.address === '0x0000000000000000000000000000000000000000') {
      throw new Error('Contract not deployed. Please deploy the UserRegistry contract first.');
    }

    setRegistrationState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const provider = await primaryWallet.getEthereumProvider();
      const walletClient = createWalletClient({
        chain: spicy,
        transport: custom(provider)
      });

      const txHash = await walletClient.writeContract({
        account: address as `0x${string}`,
        address: USER_REGISTRY_CONTRACT.address,
        abi: USER_REGISTRY_CONTRACT.abi,
        functionName: 'registerAthlete',
        args: [
          profile.avatar || "https://sapphire-following-turkey-778.mypinata.cloud/ipfs/QmQw6eumeuiLVLby4SP4E7QN1gufHySjoJpjoNw8hK9Mx8", // Avatar is now first parameter
          profile.name,
          BigInt(profile.age),
          profile.sport,
          profile.position,
          profile.bio
        ]
      });

      console.log('Athlete registration transaction:', txHash);

      // Wait for transaction confirmation
      const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
      console.log('Transaction confirmed:', receipt);

      // Update state after successful registration
      setRegistrationState({
        userRole: UserRole.Athlete,
        isOnboarded: true,
        isLoading: false,
        error: null
      });

      return txHash;
    } catch (error) {
      console.error('Failed to register athlete:', error);
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setRegistrationState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      throw error;
    }
  };

  // Register as scout
  const registerScout = async (profile: ScoutProfile) => {
    if (!isConnected || !address || !primaryWallet) {
      throw new Error('Wallet not connected');
    }

    if (USER_REGISTRY_CONTRACT.address === '0x0000000000000000000000000000000000000000') {
      throw new Error('Contract not deployed. Please deploy the UserRegistry contract first.');
    }

    setRegistrationState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const provider = await primaryWallet.getEthereumProvider();
      const walletClient = createWalletClient({
        chain: spicy,
        transport: custom(provider)
      });

      const txHash = await walletClient.writeContract({
        account: address as `0x${string}`,
        address: USER_REGISTRY_CONTRACT.address,
        abi: USER_REGISTRY_CONTRACT.abi,
        functionName: 'registerScout',
        args: [
          profile.avatar || '', // Avatar is now first parameter
          profile.name,
          profile.organization,
          profile.position
        ]
      });

      console.log('Scout registration transaction:', txHash);

      // Wait for transaction confirmation
      const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
      console.log('Transaction confirmed:', receipt);

      // Update state after successful registration
      setRegistrationState({
        userRole: UserRole.Scout,
        isOnboarded: true,
        isLoading: false,
        error: null
      });

      return txHash;
    } catch (error) {
      console.error('Failed to register scout:', error);
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setRegistrationState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      throw error;
    }
  };

  // Get athlete profile from contract
  const getAthleteProfile = useCallback(async (athleteAddress: string): Promise<AthleteProfile | null> => {
    console.log('🔍 Getting athlete profile for:', athleteAddress);
    console.log('📋 Contract address:', USER_REGISTRY_CONTRACT.address);
    
    if (USER_REGISTRY_CONTRACT.address === '0x0000000000000000000000000000000000000000') {
      console.log('❌ Contract address not set');
      return null;
    }

    try {
      console.log('📞 Calling getAthleteProfile on contract...');
      const profile = await publicClient.readContract({
        address: USER_REGISTRY_CONTRACT.address,
        abi: USER_REGISTRY_CONTRACT.abi,
        functionName: 'getAthleteProfile',
        args: [athleteAddress as `0x${string}`]
      }) as any;

      console.log('✅ Raw profile data:', profile);

      if (!profile || !profile.name) {
        console.log('❌ Profile data is empty or invalid');
        return null;
      }

      const formattedProfile = {
        avatar: profile.avatar,
        name: profile.name,
        age: Number(profile.age),
        sport: profile.sport,
        position: profile.position,
        bio: profile.bio
      };

      console.log('✅ Formatted athlete profile:', formattedProfile);
      return formattedProfile;
    } catch (error) {
      console.error('❌ Failed to get athlete profile:', error);
      return null;
    }
  }, [publicClient]);

  // Get scout profile from contract
  const getScoutProfile = useCallback(async (scoutAddress: string): Promise<ScoutProfile | null> => {
    console.log('🔍 Getting scout profile for:', scoutAddress);
    console.log('📋 Contract address:', USER_REGISTRY_CONTRACT.address);
    
    if (USER_REGISTRY_CONTRACT.address === '0x0000000000000000000000000000000000000000') {
      console.log('❌ Contract address not set');
      return null;
    }

    try {
      console.log('📞 Calling getScoutProfile on contract...');
      const profile = await publicClient.readContract({
        address: USER_REGISTRY_CONTRACT.address,
        abi: USER_REGISTRY_CONTRACT.abi,
        functionName: 'getScoutProfile',
        args: [scoutAddress as `0x${string}`]
      }) as any;

      console.log('✅ Raw profile data:', profile);

      if (!profile || !profile.name) {
        console.log('❌ Profile data is empty or invalid');
        return null;
      }

      const formattedProfile = {
        avatar: profile.avatar,
        name: profile.name,
        organization: profile.organization,
        position: profile.position
      };

      console.log('✅ Formatted scout profile:', formattedProfile);
      return formattedProfile;
    } catch (error) {
      console.error('❌ Failed to get scout profile:', error);
      return null;
    }
  }, [publicClient]);

  return {
    ...registrationState,
    registerAthlete,
    registerScout,
    getAthleteProfile,
    getScoutProfile
  };
};