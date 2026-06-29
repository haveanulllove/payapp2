package com.unionpay.payapp2

import android.annotation.SuppressLint
import android.Manifest
import android.content.Context
import android.content.pm.ActivityInfo
import android.content.pm.PackageManager
import android.content.res.Configuration
import android.graphics.Color
import android.os.Build
import android.os.Bundle
import android.view.View
import android.view.Window
import android.view.WindowInsets
import android.webkit.JavascriptInterface
import android.webkit.PermissionRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebChromeClient
import android.webkit.WebViewClient
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import kotlin.math.roundToInt

class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView
    private var statusBarHeightCssPx: Int = 0
    private var pendingPermissionRequest: PermissionRequest? = null
    private val cameraPermissionLauncher = registerForActivityResult(ActivityResultContracts.RequestPermission()) { granted ->
        val request = pendingPermissionRequest ?: return@registerForActivityResult
        pendingPermissionRequest = null
        if (granted) {
            request.grant(request.resources)
        } else {
            request.deny()
        }
    }

    override fun attachBaseContext(newBase: Context) {
        val config = Configuration(newBase.resources.configuration)
        config.fontScale = 1.0f
        super.attachBaseContext(newBase.createConfigurationContext(config))
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_PORTRAIT
        requestWindowFeature(Window.FEATURE_NO_TITLE)
        WindowCompat.setDecorFitsSystemWindows(window, false)
        window.statusBarColor = Color.TRANSPARENT
        window.navigationBarColor = Color.TRANSPARENT
        WindowInsetsControllerCompat(window, window.decorView).isAppearanceLightStatusBars = false
        supportActionBar?.hide()

        webView = WebView(this).apply {
            webChromeClient = object : WebChromeClient() {
                override fun onPermissionRequest(request: PermissionRequest) {
                    if (!request.resources.contains(PermissionRequest.RESOURCE_VIDEO_CAPTURE)) {
                        request.deny()
                        return
                    }

                    if (ContextCompat.checkSelfPermission(this@MainActivity, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED) {
                        request.grant(arrayOf(PermissionRequest.RESOURCE_VIDEO_CAPTURE))
                        return
                    }

                    pendingPermissionRequest?.deny()
                    pendingPermissionRequest = request
                    cameraPermissionLauncher.launch(Manifest.permission.CAMERA)
                }
            }
            webViewClient = object : WebViewClient() {
                override fun onPageFinished(view: WebView?, url: String?) {
                    super.onPageFinished(view, url)
                    applyStatusBarInsetCss()
                }
            }
            setBackgroundColor(0xFFF6F7FB.toInt())
            setOnApplyWindowInsetsListener { _: View, insets: WindowInsets ->
                val statusHeight = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                    insets.getInsets(WindowInsets.Type.statusBars()).top
                } else {
                    WindowInsetsCompat.toWindowInsetsCompat(insets)
                        .getInsets(WindowInsetsCompat.Type.statusBars()).top
                }
                statusBarHeightCssPx = (statusHeight / resources.displayMetrics.density).roundToInt()
                applyStatusBarInsetCss()
                insets
            }

            settings.apply {
                javaScriptEnabled = true
                domStorageEnabled = true
                allowFileAccess = true
                allowContentAccess = true
                allowUniversalAccessFromFileURLs = true
                cacheMode = WebSettings.LOAD_DEFAULT
                loadWithOverviewMode = false
                mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
                builtInZoomControls = false
                displayZoomControls = false
                textZoom = 100
                useWideViewPort = false
            }

            addJavascriptInterface(CreditReportStorage(context), "PayAppCreditReport")
            loadUrl("file:///android_asset/www/index.html")
        }

        setContentView(webView)

        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack()
                    return
                }
                finish()
            }
        })
    }

    private fun applyStatusBarInsetCss() {
        if (!::webView.isInitialized) {
            return
        }
        webView.evaluateJavascript(
            "document.documentElement.style.setProperty('--android-statusbar-height','${statusBarHeightCssPx}px')",
            null,
        )
    }

    private inner class CreditReportStorage(context: Context) {
        private val preferences = context.getSharedPreferences("payapp2_credit_report", Context.MODE_PRIVATE)

        @JavascriptInterface
        fun saveQueryDate(queryDate: String) {
            preferences.edit().putString("query_date", queryDate).apply()
        }

        @JavascriptInterface
        fun getQueryRecord(): String {
            val queryDate = preferences.getString("query_date", "") ?: ""
            if (queryDate.isBlank()) {
                return ""
            }
            return "{\"queryDate\":\"$queryDate\"}"
        }

        @JavascriptInterface
        fun getStatusBarHeight(): Int {
            return statusBarHeightCssPx
        }

        @JavascriptInterface
        fun getScreenDpWidth(): Int {
            val dm = resources.displayMetrics
            return (dm.widthPixels / dm.density).roundToInt()
        }
    }
}
