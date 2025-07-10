import { useState, useEffect } from 'react';
import NetInfo from '@react-native-netinfo/netinfo';

const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [connectionType, setConnectionType] = useState('unknown');

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      setConnectionType(state.type);
      console.log('Network status:', state.isConnected ? 'online' : 'offline', state.type);
    });

    return () => unsubscribe();
  }, []);

  return { isConnected, connectionType };
};

export default useNetworkStatus;