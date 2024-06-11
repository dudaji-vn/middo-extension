import { useEffect } from 'react';
import { BackHandler, Platform } from 'react-native';
import WebView from 'react-native-webview';

export const useWebviewGesture = (webviewRef: React.RefObject<WebView>) => {
  const onAndroidBackPress = () => {
    if (webviewRef.current) {
      webviewRef.current.goBack();
      return true;
    }
    return false;
  };

  useEffect((): (() => void) | undefined => {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', onAndroidBackPress);
      return (): void => {
        BackHandler.removeEventListener('hardwareBackPress', onAndroidBackPress);
      };
    }
  }, []);
};
