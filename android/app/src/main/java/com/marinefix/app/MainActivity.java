package com.marinefix.app;

import android.content.Context;
import android.os.Bundle;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public void onStart() {
        super.onStart();
        // WebView instance get panni Android Native Print Interface add seigirom
        if (this.bridge != null && this.bridge.getWebView() != null) {
            WebView webView = this.bridge.getWebView();
            webView.addJavascriptInterface(new AndroidPrintInterface(this, webView), "AndroidPrint");
        }
    }

    public static class AndroidPrintInterface {
        private final Context context;
        private final WebView webView;

        public AndroidPrintInterface(Context context, WebView webView) {
            this.context = context;
            this.webView = webView;
        }

        @JavascriptInterface
        public void printPage() {
            webView.post(() -> {
                try {
                    PrintManager printManager = (PrintManager) context.getSystemService(Context.PRINT_SERVICE);
                    if (printManager != null) {
                        String jobName = "MarineFix_SOP_Document";
                        PrintDocumentAdapter printAdapter = webView.createPrintDocumentAdapter(jobName);
                        printManager.print(jobName, printAdapter, new PrintAttributes.Builder().build());
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            });
        }
    }
}