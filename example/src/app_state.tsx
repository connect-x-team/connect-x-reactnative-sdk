import { ConnectXMobileSdk } from 'connect-x-react-native-sdk';
import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

const AppStateHandler = () => {
  const appState = useRef(AppState.currentState);

  // Handle app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  });
  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    // App came to foreground (resumed)
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      onResume();
    }
    // App went to background (paused)
    else if (
      appState.current === 'active' &&
      nextAppState.match(/inactive|background/)
    ) {
      onPause();
    }

    appState.current = nextAppState;
  };

  // Your pause function
  const onPause = () => {
    console.log('App PAUSED - running cleanup tasks');
    // Pause audio/video, stop sensors, save data, etc.
    ConnectXMobileSdk.cxTracking({
      cx_title: 'App Paused',
      cx_event: 'App Paused',
    });
  };

  // Your resume function
  const onResume = () => {
    console.log('App RESUMED - restoring state');
    // Refresh data, restart animations, check auth, etc.
    ConnectXMobileSdk.cxTracking({
      cx_title: 'App Resumed',
      cx_event: 'App Resumed',
    });
  };

  return null; // Or your component JSX
};

export default AppStateHandler;
