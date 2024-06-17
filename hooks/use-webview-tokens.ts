import { requestCameraPermissionsAsync, requestMicrophonePermissionsAsync } from 'expo-camera';
import { NativeSyntheticEvent } from 'react-native';
import WebView, { WebViewNavigation } from 'react-native-webview';
import { WebViewMessage } from 'react-native-webview/lib/WebViewTypes';

import { useAuthStore } from '~/features/auth';
import { useWebviewStore } from '~/stores';
import { Tokens } from '~/types';
const CHECK_COOKIE: string = `
  ReactNativeWebView.postMessage("Cookie: " + document.cookie);
  true;
`;

export const useWebviewTokens = (webviewRef: React.RefObject<WebView>) => {
  const { storeTokens } = useAuthStore((state) => ({
    storeTokens: state.storeTokens,
    logout: state.logout,
  }));
  const { setCurrentRoomId, setCurrentSpaceId } = useWebviewStore();

  const onNavigationStateChange = (navigationState: WebViewNavigation) => {
    console.log('\n \n onNavigationStateChange: ', navigationState.url);
    console.log('\n \n webviewRef.current: ', webviewRef.current);

    if (webviewRef.current) {
      webviewRef.current.injectJavaScript(CHECK_COOKIE);
    }
    const roomId = extractRoomIdFormUrl(navigationState.url);
    const spaceId = extractSpaceIdFormUrl(navigationState.url);
    console.log('roomId::>', roomId);
    console.log('spaceId::>', spaceId);
    setCurrentRoomId(roomId);
    setCurrentSpaceId(spaceId);
  };

  const onMessage = (event: NativeSyntheticEvent<WebViewMessage>) => {
    const { data } = event.nativeEvent;
    console.log('onMessage:::: >>  ', data);

    if (data.includes('Cookie:')) {
      const cookie = data.replace('Cookie: ', '').trim();
      const tokens = extractTokens(cookie);
      if (tokens) {
        storeTokens(tokens);
      }
    } else {
      let payload;
      try {
        payload = JSON.parse(event.nativeEvent.data);
      } catch (e) {
        console.error(e);
      }
      switch (payload?.type) {
        case 'logout':
          storeTokens({ accessToken: '', refreshToken: '' });
          break;
        case 'Console':
          handleMessagesConsole(payload.data);
          break;
        case 'Trigger':
          switch (payload?.data.event) {
            case 'start-call':
              requestCameraPermissionsAsync();
              requestMicrophonePermissionsAsync();
              break;
            case 'mic':
              requestMicrophonePermissionsAsync();
              break;
            default:
              console.log('Unknown event', payload?.data.event, payload?.data.roomId);

              break;
          }
          break;
        default:
          break;
      }
    }
  };

  return { onNavigationStateChange, onMessage };
};

function extractTokens(tokenString: string): Tokens | null {
  const regex = /access_token=([^;]+);.*refresh_token=([^;]+)/;
  const match = tokenString.match(regex);
  if (match) {
    return {
      accessToken: match[1],
      refreshToken: match[2],
    };
  }
  return null;
}

function extractRoomIdFormUrl(url: string): string | null {
  const match = url.match(/conversations\/([^?]+)/) || url.match(/archived\/([^?]+)/);
  if (match) {
    return match[1];
  }
  return null;
}
function extractSpaceIdFormUrl(url: string): string | null {
  const match = url.match(/spaces\/([^?]+)/);
  if (match) {
    const spaceId = match[1]?.split('/')[0];
    return spaceId || null;
  }
  return null;
}

const handleMessagesClick = (payload: any) => {
  switch (payload?.event) {
    case 'start-call':
      console.log('start-call', payload.roomId);

      break;
    default:
      break;
  }
};

const handleMessagesConsole = (payload: any) => {
  switch (payload?.type) {
    case 'log':
      console.log(...payload.log);
      break;
    case 'debug':
      console.debug(...payload.log);
      break;
    case 'info':
      console.info(...payload.log);
      break;
    case 'warn':
      console.warn(...payload.log);
      break;
    case 'error':
      console.error(...payload.log);
      break;
    default:
      console.error('Unknown');
      break;
  }
};
