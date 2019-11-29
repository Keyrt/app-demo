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

			console.log("----------------")

			console.log("+++++++++++++++++")
			let datas = JSON.parse(data);
			console.log(datas)
			document.cookie = "uid=" + datas.userid;
			// document.cookie = "uid=" + datas.userid;
			document.cookie = "taskid=" + datas.taskid;

		});
		// 看完视频后回调，请求看视频接口增加抽奖次数
		bridge.registerHandler('jsbridge_videoend', function (data, responseCallback) {
			// $(".cover").fadeOut(500);
			// $(this).parent().fadeOut(500);
			// alertMsg("")
			// alert("视频回调")
			// let baseurl = "https://www.aibookchina.com";
			// var Url4 = baseurl + "/api/Goldrandom/video_random";
			// $.post(Url4, {
			// 	"uid": getCookie("uid"),
			// 	"status": 1
			// 	// "uid": 16417
			// }, function (res) {
			// 	alert("视频回调fun")
			// 	let _res = JSON.parse(res);
			// 	alertMsg(_res.msg)
			// })

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
			// alertMsg("拉起视频")
			// 通过JsBridge调用原生方法，写法固定，第一个参数时方法名，第二个参数时传入参数，第三个参数时响应回调
			window.WebViewJavascriptBridge.callHandler('getvideo', null, function (response) {
				// showResponse(response);
				// console.log("getvideo" + response)
				// alertMsg("拉起视频11111")
				$(".cover").fadeOut(500);
				$(this).parent().fadeOut(500);
			});
			$(".cover").fadeOut(500);
			$(this).parent().fadeOut(500);
		});
	})

	console.log(getCookie("taskid"))
	if(getCookie("taskid") != undefined || getCookie("taskid") != null) {
		setTimeout(() => {
			$("#star").addClass("show");
		}, 5);
	}else{
		setTimeout(() => {
			$("#glod").addClass("show");
		}, 5);
	}


	var alertMsg = function (txt) {
		var alertFram = document.createElement("DIV");
		alertFram.id = "alertFram";
		alertFram.style.position = "fixed";
		alertFram.style.width = "100%";
		alertFram.style.textAlign = "center";
		alertFram.style.top = "40%";
		alertFram.style.zIndex = "10001";
		strHtml = " <span style=\"font-family: 微软雅黑;display:inline-block;background:#333;color:#fff;padding:0 20px;line-height:36px;border-radius:6px; \">" + txt + "</span>";
		alertFram.innerHTML = strHtml;
		document.body.appendChild(alertFram);
		setTimeout((function () {
			alertFram.style.display = "none";
		}), 2000);
	};

	// $(".rules_footer").click(function () {
	// 	$(".rules_cover,.rules_footer").hide();
	// 	$(".rules_con").css("height", "95vw");
	// });
	// 立即抽奖按钮
	$('.pointer').click(function () {
		Rotate();
	});
	// 我知道了按钮
	$(".covers_quit").click(function () {
		$(".cover").fadeOut(500);
		$(this).parent().fadeOut(500);
	});
	// 放弃抽奖按钮
	$(".covers_btn1").click(function () {
		$(".cover").fadeOut(500);
		$(this).parent().fadeOut(500);
	});
	// $(".video").click(function () {
	// 	$(".cover").fadeOut(500);
	// 	$(this).parent().fadeOut(500);
	// });
	// 金币抽奖按钮
	$(".gold").click(function () {
		$(".cover").fadeOut(500);
		$(this).parent().fadeOut(500);
		// 防止多次点击
		if (bRotate) return;
		let baseurl = "https://www.aibookchina.com";
		var Url3 = baseurl + "/api/Goldrandom/gold_prize";
		// alertMsg("用户id>>>>>>" + getCookie("uid"))
		$.post(Url3, {
			"uid": getCookie("uid")
			// "taskid": getCookie("taskid")
			// "uid": 16417
		}, function (res) {
			var _res = JSON.parse(res);
			var code = _res.code;
			alert("code" + code)
			if (code == 0) {
				let item = _res.data[0].id
				switch (item - 1) {
					case 0:
						rotateFn(0, 360, '88金币', '/public/api/images/gold.png');
						break;
					case 1:
						rotateFn(1, 300, '6666御币', '/public/api/images/royal.png');
						break;
					case 2:
						rotateFn(2, 240, '5张推荐票', '/public/api/images/ticket.png');
						break;
					case 3:
						rotateFn(3, 180, '8888金币', '/public/api/images/gold.png');
						break;
					case 4:
						rotateFn(4, 120, '66御币', '/public/api/images/royal.png');
						break;
					case 5:
						rotateFn(5, 60, '华为P30PRO');
						break;
				}

			} else if (code == 1) {
				// alert("金币不足，抽奖失败！")
				alertMsg(_res.msg)
			}
		});

	});
	// 中奖记录跳转
	$(".float_btn").click(function () {
		window.location.href = 'https://www.aibookchina.com/api/Goldrandom/lottery_list?uid=' + getCookie("uid");
		// let baseurl = "https://www.aibookchina.com";
		// var Url3 = baseurl + "/api/Goldrandom/lottery_list";	
		// $.post(Url3, {
		// 	"uid": getCookie("uid")
		// 	// "uid": 16417
		// }, function (res) {
		// 	alertMsg(getCookie("uid"))
		// 	window.location.href = 'https://www.aibookchina.com/api/Goldrandom/lottery_list';
		// })


	});

	function Init() {
		var H = $(window).height(),
			W = $(window).width();
		$(".cover").css({
			"width": W,
			"height": H
		});


	}
	Init();
	// 抽奖
	var rotateTimeOut = function () {
		$('#rotate').rotate({
			angle: 0,
			animateTo: 2160,
			duration: 8000,
			callback: function () {
				alert('网络超时，请检查您的网络设置！');
			}
		});
	};
	var bRotate = false;

	var rotateFn = function (awards, angles, txt, img) {
		bRotate = !bRotate;
		$('#rotate').stopRotate();
		$('#rotate').rotate({
			angle: 0,
			animateTo: angles + 2880,
			duration: 8000,
			callback: function () {
				$(".cover,.covers2").show();
				$(".covers2 .covers_icon .img").attr('src', img);
				$(".covers2 .covers_font .reward span").text(txt);
				bRotate = !bRotate;
			}
		})
	};

	function getCookie(name) {
		var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
		if (arr = document.cookie.match(reg))
			return unescape(arr[2]);
		else
			return null;
	}

	function Rotate() {
		// 防止多次点击
		if (bRotate) return;
		let baseurl = "https://www.aibookchina.com";
		var Url3 = baseurl + "/api/Goldrandom/index";
		var userid = getCookie("uid")
		// alertMsg("用户id>>>>>>" + getCookie("uid"))
		$.post(Url3, {
			"uid": getCookie("uid"),
			"taskid": getCookie("taskid")
			// "uid": 18867
		}, function (res) {
			let _res = JSON.parse(res);
			// alertMsg("time"+_res.item)
			var time = _res.item;
			var endtime = null;
			endtime = _res.endtime;
			// alertMsg("endtime>>>>>>>>" + _res.endtime + "s")
			// var time = 10;
			if (time == "free") {

				let item = _res.data[0].id
				switch (item - 1) {
					case 0:
						rotateFn(0, 360, '88金币', '/public/api/images/gold.png');
						break;
					case 1:
						rotateFn(1, 300, '6666御币', '/public/api/images/royal.png');
						break;
					case 2:
						rotateFn(2, 240, '5张推荐票', '/public/api/images/ticket.png');
						break;
					case 3:
						rotateFn(3, 180, '8888金币', '/public/api/images/gold.png');
						break;
					case 4:
						rotateFn(4, 120, '66御币', '/public/api/images/royal.png');
						break;
					case 5:
						rotateFn(5, 60, '华为P30PRO');
						break;
				}
				// }
			} else if (time == "video") {

				if (endtime != 0 && endtime != null) {
					alertMsg("休息休息一下~" + endtime + "s之后再来抽奖吧！")
				} else {
					$(".cover,.covers3").show();
				}

			} else if (time == "gold") {
				$(".cover,.covers4").show();
			} else {
				alertMsg(_res.msg + ">>>>>>" + _res.item)
			}
		});
	}






})