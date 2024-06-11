import { forwardRef } from 'react';
import WebView, {
  WebViewProps,
  FileDownload,
  WebViewMessageEvent,
  WebViewNavigation,
} from 'react-native-webview';
export const debugging = `
  const consoleLog = (type, log) => window.ReactNativeWebView.postMessage(
    JSON.stringify({'type': 'Console', 'data': {
        'type': type,
        'log': log,
      }
    }));
  console = {
      log: (...args) => {
        consoleLog('log', args)
      },
      debug: (...args) => {
        consoleLog('debug', args)
      },
      info: (...args) => {
        consoleLog('info', args)
      },
      warn: (...args) => {
        consoleLog('warn', args)
      },
      error: (...args) => {
        consoleLog('error', args)
      },
    };
  `;

const CSWebview = forwardRef<WebView, WebViewProps>((props, ref) => {
  return (
    <WebView
      ref={ref}
      incognito
      allowFileAccessFromFileURLs
      allowUniversalAccessFromFileURLs
      allowsInlineMediaPlayback
      allowFileAccess
      allowsLinkPreview
      allowsFullscreenVideo
      injectedJavaScript={debugging}
      style={{ flex: 1 }}
      {...props}
    />
  );
});
CSWebview.displayName = 'CSWebview';

export { CSWebview as WebView, WebViewProps, FileDownload, WebViewMessageEvent, WebViewNavigation };
