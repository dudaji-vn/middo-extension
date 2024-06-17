import { useEffect, useRef } from 'react';
import WebView from 'react-native-webview';

import { SafeAreaLayout } from '~/components/uis/safe-area-layout';
import { debugging } from '~/components/uis/webview';
import { WEB_URL } from '~/configs/env.config';
import { SPK_PLATFORM } from '~/configs/search-params.config';
import { useAuthStore } from '~/features/auth';
import { useWebviewGesture, useWebviewTokens } from '~/hooks';
import { useWebviewStore } from '~/stores';

export default function SpacesList() {
  const webviewRef = useRef<WebView>(null);
  const { accessToken, refreshToken, setIsLoaded } = useAuthStore((state) => state);
  const query = `?access_token=${accessToken}&refresh_token=${refreshToken}&redirect_uri=${WEB_URL}/spaces?${SPK_PLATFORM}=mobile`;
  const uri = `${WEB_URL}/api/callback/${query}`;
  const { onMessage, onNavigationStateChange } = useWebviewTokens(webviewRef);
  useWebviewGesture(webviewRef);
  useEffect(() => {
    console.log('Spaces mounted', accessToken, refreshToken);
  }, []);
  return (
    <SafeAreaLayout>
      <WebView
        style={{ flex: 1 }}
        onLoadEnd={() => {
          setIsLoaded(true);
        }}
        javaScriptEnabled
        domStorageEnabled
        allowFileAccessFromFileURLs
        allowUniversalAccessFromFileURLs
        allowsInlineMediaPlayback
        ref={webviewRef}
        allowsBackForwardNavigationGestures
        allowFileAccess
        allowsLinkPreview
        allowsFullscreenVideo
        onMessage={onMessage}
        onNavigationStateChange={onNavigationStateChange}
        injectedJavaScript={debugging}
        onContentProcessDidTerminate={() => {
          console.log('Content process terminated');
          webviewRef.current?.reload();
        }}
        source={{ uri }}
      />
      <NotificationCenter webviewRef={webviewRef} />
    </SafeAreaLayout>
  );
}

const NotificationCenter = ({ webviewRef }: { webviewRef: React.RefObject<WebView> }) => {
  const { redirectUrl, setRedirectUrl } = useWebviewStore((state) => state);
  useEffect(() => {
    if (!redirectUrl || !webviewRef.current) return;
    webviewRef.current.injectJavaScript(`window.location.href = '${redirectUrl}';`);
    setRedirectUrl(null);
  }, [redirectUrl, webviewRef]);
  return null;
};
