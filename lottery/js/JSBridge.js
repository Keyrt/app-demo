function initJsBridge(readyCallback) {
	var u = navigator.userAgent;
	var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
	var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

	// 注册jsbridge
	function connectWebViewJavascriptBridge(callback) {
		if (isAndroid) {
			if (window.WebViewJavascriptBridge) {
				callback(WebViewJavascriptBridge)
			} else {
				document.addEventListener(
					'WebViewJavascriptBridgeReady',
					function () {
						callback(WebViewJavascriptBridge)
					},
					false
				);
			}
			return;
		}

		if (isiOS) {
			if (window.WebViewJavascriptBridge) {
				return callback(WebViewJavascriptBridge);
			}
			if (window.WVJBCallbacks) {
				return window.WVJBCallbacks.push(callback);
			}
			window.WVJBCallbacks = [callback];
			var WVJBIframe = document.createElement('iframe');
			WVJBIframe.style.display = 'none';
			WVJBIframe.src = 'https://__bridge_loaded__';
			document.documentElement.appendChild(WVJBIframe);
			setTimeout(function () {
				document.documentElement.removeChild(WVJBIframe)
			}, 0)
		}
	}

	// 调用注册方法
	connectWebViewJavascriptBridge(function (bridge) {
		if (isAndroid) {
			bridge.init(function (message, responseCallback) {
				console.log('JS got a message', message);
				responseCallback(data);
			});
		}
		// 初始化获取userid
		bridge.registerHandler('jsbridge_getuserid', function (data, responseCallback) {
			// 将userid存入cookie
			document.cookie = "uid=" + data;

		});
		readyCallback();
	});
}
// 显示响应信息
//  @param response 响应信心

function showResponse(response) {
	$('#response').text(response);
}

$(function () {
    // 首先调用JSBridge初始化代码，完成后再设置其他
	initJsBridge(function () {
		$(".video").click(function () {
			alertMsg("拉起视频")
			// 通过JsBridge调用原生方法，写法固定，第一个参数时方法名，第二个参数时传入参数，第三个参数时响应回调
			window.WebViewJavascriptBridge.callHandler('getvideo', null, function (response) {
				// showResponse(response);
				console.log("getvideo" + response)
				alertMsg("拉起视频11111")
				$(".cover").fadeOut(500);
				$(this).parent().fadeOut(500);
			});
			$(".cover").fadeOut(500);
			$(this).parent().fadeOut(500);
		});
	})
})