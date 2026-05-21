package com.unionpay.payapp2

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.View
import android.view.Window
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        requestWindowFeature(Window.FEATURE_NO_TITLE)
        window.decorView.systemUiVisibility = View.SYSTEM_UI_FLAG_FULLSCREEN
        actionBar?.hide()

        val webView = WebView(this)
        setContentView(webView)

        webView.webViewClient = WebViewClient()
        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
        webView.settings.allowFileAccess = true
        webView.settings.allowContentAccess = true
        webView.setBackgroundColor(0xFFF6F7FB.toInt())
        webView.loadDataWithBaseURL("file:///android_asset/www/", html, "text/html", "UTF-8", null)
    }

    private val html = """
        <!doctype html>
        <html lang="zh-CN">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
          <title>云闪付</title>
          <style>
            *{box-sizing:border-box}html,body{margin:0;min-height:100%;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;background:#eef1f7;color:#111}button{font:inherit}
            .app{width:min(100vw,430px);min-height:100vh;margin:0 auto;background:#f4f4f4;position:relative;overflow-x:hidden;padding-bottom:96px}
            .hero{height:326px;padding:0 16px;position:relative;overflow:hidden;color:#fff;background:radial-gradient(circle at 50% 60%,rgba(255,185,124,.55),transparent 32%),linear-gradient(180deg,#fe0717 0%,#f71066 50%,#ff835a 100%)}
            .hero:after{content:"";position:absolute;left:-18%;right:-18%;bottom:-42px;height:82px;background:#fff;border-radius:50% 50% 0 0/100% 100% 0 0;z-index:1}
            .status{height:40px;display:flex;align-items:center;justify-content:space-between;padding:0 7px;font-size:16px;font-weight:800;position:relative;z-index:2}
            .nav{height:54px;display:grid;grid-template-columns:auto minmax(0,1fr)42px 42px;gap:8px;align-items:center;position:relative;z-index:3}
            .loc{border:0;background:transparent;color:#fff;display:flex;align-items:center;gap:2px;padding:0;font-size:26px;font-weight:900;white-space:nowrap}
            .search{height:38px;min-width:0;border-radius:999px;background:rgba(255,255,255,.96);display:flex;align-items:center;gap:8px;padding:0 11px 0 14px;color:#8b8b8b;font-size:17px;font-weight:700}
            .search span{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.search:after{content:"";width:1px;height:24px;background:#f5c8d0}.search b{flex:0 0 auto;color:#f20d54;font-size:17px;white-space:nowrap;line-height:1}
            .round{width:40px;height:40px;border:2px solid rgba(255,255,255,.92);border-radius:14px;background:transparent;color:#fff;display:grid;place-items:center;padding:0;font-size:26px;font-weight:700}
            .top-actions{position:relative;z-index:3;display:grid;grid-template-columns:repeat(4,1fr);margin-top:34px}.top-action{border:0;background:transparent;color:#fff;display:grid;justify-items:center;gap:9px;padding:0}.top-action img{width:52px;height:52px;object-fit:contain}.top-action span{font-size:20px;line-height:1;font-weight:900}
            .promo{height:82px;margin:32px 11px 0;padding:0 14px 0 86px;border:1px solid rgba(255,255,255,.7);border-radius:20px;background:radial-gradient(circle at 83% 52%,rgba(255,237,153,.8),transparent 32%),linear-gradient(90deg,rgba(255,239,233,.95),rgba(255,220,235,.93));display:grid;grid-template-columns:1fr 76px;align-items:center;box-shadow:0 10px 24px rgba(170,45,72,.2);position:relative;z-index:3}
            .promo p{margin:0 0 6px;color:#20222b;font-size:17px}.promo strong{display:block;color:#181a20;font-size:22px;line-height:1.1;font-weight:900}.promo button{width:64px;height:36px;border:0;border-radius:999px;background:linear-gradient(180deg,#ff246d,#f23c44);color:#fff;font-size:17px;font-weight:900;box-shadow:0 8px 14px rgba(225,24,72,.28)}
            .panda{position:absolute;left:22px;bottom:12px;width:56px;height:54px}.panda:before{content:"";position:absolute;left:7px;top:2px;width:35px;height:31px;border-radius:50%;background:#fff;box-shadow:inset 7px -2px 0 #222,inset -8px -1px 0 #222}.panda:after{content:"";position:absolute;right:0;bottom:8px;width:24px;height:16px;border-radius:0 0 16px 16px;background:#ff7149}
            .services{position:relative;z-index:2;margin-top:-6px;padding:0 0 8px;background:#fff}.grid{display:grid;grid-template-columns:repeat(5,1fr);row-gap:14px;padding:18px 7px 6px}.service{border:0;background:transparent;display:grid;justify-items:center;align-items:start;gap:5px;padding:0;color:#111;font-size:13px;line-height:18px;font-weight:900;white-space:nowrap}.icon{width:54px;height:43px;display:grid;place-items:center;overflow:hidden;background:#fff}.icon img{max-width:100%;max-height:100%;object-fit:contain;display:block;transform:scale(.85);transform-origin:center}.icon.keep img{transform:translateX(8px) scale(1)}
            .message{height:72px;margin:10px 16px 0;border-radius:8px;background:rgba(255,255,255,.96);display:grid;grid-template-columns:1fr 10px 22px;align-items:center;padding:0 13px 0 18px;box-shadow:0 6px 18px rgba(27,38,64,.08)}.message p{margin:4px 0;display:flex;gap:10px;color:#8f8f8f;font-size:15px}.message strong{color:#111;font-size:15px;font-weight:900}.message em{font-style:normal;color:#b5b5b5}.dot{width:10px;height:10px;border-radius:50%;background:#f42335}
            .travel{height:86px;margin:14px 16px 0;border-radius:8px;overflow:hidden;background:linear-gradient(90deg,#d6fff0 0%,#effff6 58%,#fff8cf 100%);display:grid;grid-template-columns:1fr 74px 64px;align-items:center;padding:0 12px 0 24px}.travel h2{margin:0 0 11px;font-size:22px;line-height:1;color:#111;font-weight:900}.travel h2 b{color:#e50935}.travel p{margin:0;color:#56645f;font-size:15px}.travel .ball{width:56px;height:56px;border-radius:50%;background:radial-gradient(circle at 42% 42%,#fff 0 18%,transparent 19%),radial-gradient(circle at 63% 42%,#fff 0 18%,transparent 19%),radial-gradient(circle,#25a8f5 0 47%,transparent 49%)}.travel button{width:64px;height:48px;border:4px solid rgba(255,232,97,.75);border-radius:999px;background:linear-gradient(180deg,#ffbb29,#f0191c);color:#fff;font-size:18px;font-weight:900}
            .cards{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:14px 16px 0}.cards article{min-height:124px;border-radius:8px;background:#fff;padding:17px 18px;overflow:hidden}.cards h2{margin:0 0 18px;color:#111;font-size:24px;line-height:1;font-weight:900}.mini-rec{display:grid;grid-template-columns:56px 1fr;align-items:center;height:48px;background:#fff1f5;border-radius:4px}.mini-rec i{width:44px;height:44px;margin-left:8px;border-radius:12px;background:linear-gradient(135deg,#ff8e8c,#ff1f5c)}.cards strong{font-size:16px}.cards p{margin:5px 0 0;color:#999;font-size:13px}
            .tab{position:fixed;left:50%;bottom:0;transform:translateX(-50%);width:min(100vw,430px);height:82px;background:#fff;display:grid;grid-template-columns:repeat(5,1fr);box-shadow:0 -3px 12px rgba(0,0,0,.05);z-index:9}.tab button{border:0;background:transparent;display:grid;justify-items:center;align-content:center;gap:3px;color:#888;font-size:14px}.tab img{width:30px;height:30px;object-fit:contain}.tab .active{color:#e81c23;font-weight:800}
            .mini-page{display:none;min-height:100vh;background:#f7f7f7;padding-bottom:20px}.mini-status{height:46px;padding:0 26px;display:flex;align-items:center;justify-content:space-between;color:#3d3d3d;font-size:18px;font-weight:800}.mini-head{height:58px;padding:0 27px;display:grid;grid-template-columns:54px 1fr 54px;align-items:center}.mini-head button{border:0;background:transparent;color:#111;padding:0;font-size:34px}.mini-head h1{margin:0;text-align:center;font-size:24px;font-weight:900}.mini-head .discover{font-size:17px;font-weight:500}.mini-search{width:calc(100% - 80px);height:43px;margin:14px auto 0;border-radius:999px;background:#eee;display:flex;align-items:center;justify-content:center;gap:8px;color:#969696;font-size:18px}.mini-section{margin:28px 0 0;padding:0 40px}.mini-section h2{margin:0 0 18px;color:#9b9b9b;font-size:17px;font-weight:500}.mini-row{display:grid;grid-template-columns:repeat(4,1fr);column-gap:24px}.mini-row.single{grid-template-columns:70px}.mini-item{border:0;background:transparent;display:grid;justify-items:center;padding:0}.mini-item img,.travel-icon{width:58px;height:58px;border-radius:50%;object-fit:cover}.mini-item span{width:82px;margin-top:14px;color:#494949;font-size:16px;line-height:20px;text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.travel-icon{position:relative;background:linear-gradient(180deg,#60dce3,#40bbc6);overflow:hidden}.travel-icon:before{content:"";position:absolute;left:50%;top:12px;transform:translateX(-50%);width:36px;height:38px;background:#fff;clip-path:polygon(50% 0,84% 30%,67% 30%,67% 100%,33% 100%,33% 30%,16% 30%)}
          </style>
        </head>
        <body>
          <main class="app" id="home">
            <header class="hero">
              <div class="status"><span>00:42</span><span>5G 48</span></div>
              <div class="nav"><button class="loc">鞍山⌄</button><div class="search"><span>⌕ 62VIP华住会特权</span><b>搜索</b></div><button class="round">≡</button><button class="round">＋</button></div>
              <div class="top-actions">
                <button class="top-action"><img src="assets/receiving_white_new.png"><span>收付款</span></button><button class="top-action"><img src="assets/travel_white.png"><span>出行</span></button><button class="top-action"><img src="assets/scan_white_selection_new.png"><span>扫一扫</span></button><button class="top-action"><img src="assets/transfer_white_new.png"><span>转账</span></button>
              </div>
              <section class="promo"><div class="panda"></div><div><p>抽最高620元立减券</p><strong>新增绑定 一张银行卡</strong></div><button>查看</button></section>
            </header>
            <section class="services"><div class="grid" id="services"></div></section>
            <section class="message"><div><p><strong>优惠助手：</strong><span>为你推荐</span><em>4月26日</em></p><p><strong>服务助手：</strong><span>银行卡绑定提醒</span><em>4月26日</em></p></div><span class="dot"></span><span>›</span></section>
            <section class="travel"><div><h2>五一出境 <b>带上银联卡</b></h2><p>汇率补贴至高超1000元</p></div><div class="ball"></div><button>签到</button></section>
            <section class="cards"><article><h2>专属推荐</h2><div class="mini-rec"><i></i><div><strong>玩赚中心</strong><p>点我抽奖 ›</p></div></div></article><article><h2>本地精彩</h2><div><strong>加油享优惠</strong><p>中石油中石化活动</p></div></article></section>
            <nav class="tab"><button class="active"><img src="tabs/home_selected.png"><span>首页</span></button><button><img src="tabs/promo_unselected.png"><span>优惠</span></button><button><img src="tabs/card_unselected.png"><span>卡管理</span></button><button><img src="tabs/finance_unselected.png"><span>财富</span></button><button><img src="tabs/mine_unselected.png"><span>我的</span></button></nav>
          </main>
          <main class="app mini-page" id="mini">
            <div class="mini-status"><span>20:32</span><span>5G 82</span></div><header class="mini-head"><button onclick="showHome()">‹</button><h1>我的小程序</h1><button class="discover">发现</button></header>
            <section class="mini-search">⌕ 搜索小程序</section>
            <section class="mini-section"><h2>最近使用</h2><div class="mini-row single"><button class="mini-item"><img src="assets/ic_applet_default.png"><span>信用报告...</span></button></div></section>
            <section class="mini-section"><h2>我的关注</h2><div class="mini-row"><button class="mini-item"><img src="assets/ic_applet_default.png"><span>信用报告...</span></button><button class="mini-item"><img src="assets/mini-programs/cmb.png"><span>招商银行...</span></button><button class="mini-item"><i class="travel-icon"></i><span>出行助手</span></button><button class="mini-item"><img src="assets/mini-programs/unionpay-dalian.jpg"><span>银联大连</span></button></div></section>
          </main>
          <script>
            var services=[["bus.png","乘公交"],["transfer.png","转账"],["gov-consume.png","政府促消费","keep"],["credit-repay.png","信用卡还款"],["earn.png","玩赚中心","keep"],["bank-card.png","查银行卡"],["mobile-recharge.png","手机充值"],["loan.png","借款"],["apply-card.png","申请信用卡"],["life-payment.png","生活缴费"],["public-service.png","政务民生"],["payment-guard.png","支付守护"],["benefits.png","权益精选"],["mini-programs.png","我的小程序","keep"],["more.png","更多"]];
            var box=document.getElementById("services");
            services.forEach(function(s){var b=document.createElement("button");b.className="service";b.innerHTML='<span class="icon '+(s[2]||"")+'"><img src="assets/service-icons-white/'+s[0]+'"></span><span>'+s[1]+'</span>';if(s[1]=="我的小程序")b.onclick=showMini;box.appendChild(b);});
            function showMini(){document.getElementById("home").style.display="none";document.getElementById("mini").style.display="block";}
            function showHome(){document.getElementById("mini").style.display="none";document.getElementById("home").style.display="block";}
          </script>
        </body>
        </html>
    """.trimIndent()
}
