import { useRef } from 'react';
import WebView from 'react-native-webview';

import { NativeEventData } from '~/types';

export const useWebviewPostMessage = () => {
  const ref = useRef<WebView>(null);
  const postMessage = (data: NativeEventData) => {
    if (ref.current) {
      ref.current.postMessage(JSON.stringify(data));
    }
  };
  return { postMessage, ref };
};
