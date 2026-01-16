import { useEffect, useRef } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useListsStore } from '../store/listsStore';

export const useOfflineSync = () => {
  const { syncOfflineOperations } = useListsStore();
  const previousConnectionStatus = useRef<boolean>(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const isConnected = state.isConnected && state.isInternetReachable;

      // If we just reconnected (was offline, now online)
      if (!previousConnectionStatus.current && isConnected) {
        console.log('Connection restored, syncing offline operations...');
        syncOfflineOperations().catch((error) => {
          console.error('Error syncing offline operations:', error);
        });
      }

      previousConnectionStatus.current = isConnected ?? true;
    });

    return () => {
      unsubscribe();
    };
  }, [syncOfflineOperations]);
};
