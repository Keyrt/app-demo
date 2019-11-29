// 获取后台参数
(function ($) {
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    }
    console.log(typeof ($.getUrlParam('index')))
    switch ($.getUrlParam('index')) {
        case "7":
            text = "#index7"
            break;
        case "8":
            text = "#index8"
            break;
        case "9":
            text = "#index9"
            break;
        case "10":
            text = "#index10"
            break;
        case "11":
            text = "#index11"
            break;
        case "12":
            text = "#index12"
            break;
        case "13":
            text = "#index13"
            break;
        case "14":
            text = "#index14"
            break;
        case "15":
            text = "#index15"
            break;
        case "16":
            text = "#index16"
            break;
        case "17":
            text = "#index17"
            break;
        case "18":
            text = "#index18"
            break;
        case "19":
            text = "#index19"
            break;
        case "20":
            text = "#index20"
            break;
        case "21":
            text = "#index21"
            break;
        case "22":
            text = "#index22"
            break;
        case "23":
            text = "#index23"
            break;
        case "24":
            text = "#index24"
            break;
        case "25":
            text = "#index25"
            break;
        case "26":
            text = "#index26"
            break;
        case "27":
            text = "#index27"
            break;
        case "28":
            text = "#index28"
            break;
        case "29":
            text = "#index29"
            break;
        case "30":
            text = "#index30"
            break;
        case "31":
            text = "#index31"
            break;
        case "32":
            text = "#index32"
            break;
        case "33":
            text = "#index33"
            break;
        default:
            text = ""
    }
    console.log(text)
    setTimeout(() => {
        $(text).addClass("show");
    }, 5);

})(jQuery);

// var uid = $.getUrlParam('uid');

$(function () {




    // 我知道了按钮
    $(".covers_quit").click(function () {
        $(".cover").fadeOut(500);
        $(this).parent().fadeOut(500);
    });

    var alertMsg = function (txt) {
        var alertFram = document.createElement("DIV");
        alertFram.id = "alertFram";
        alertFram.style.position = "fixed";
        alertFram.style.width = "100%";
        alertFram.style.textAlign = "center";
        alertFram.style.top = "40%";
        alertFram.style.zIndex = "10001";
        strHtml =
            " <span style=\"font-family: 微软雅黑;display:inline-block;background:#333;color:#fff;padding:0 20px;line-height:36px;border-radius:6px; \">" +
            txt + "</span>";
        alertFram.innerHTML = strHtml;
        document.body.appendChild(alertFram);
        setTimeout((function () {
            alertFram.style.display = "none";
        }), 2000);
    };

    /*手机号判断*/
    function isPhoneNo(phone) {
        var pattern = /^1[3456789]\d{9}$/;
        return pattern.test(phone);
    }

    function userTel(inputid) {
        var flag = false
        if ($.trim($(inputid).val()).length == 0) {
            alertMsg("请输入手机号码");
        } else {
            if (isPhoneNo($.trim($(inputid).val())) == false) {
                alertMsg("手机号码不正确");
            } else {
                flag = true;
            }
        }
        return flag;
    };
    var timer = "";
    var nums = 60;
    var validCode = true; //定义该变量是为了处理后面的重复点击事件
    $("#getCode").on('click', function () {
        // let flags = userTel('#phone');
        // console.log(flags);
        // if (flags) {
        //     console.log(11111);

        // }
        var phone = $.trim($("#phone").val());
        if (phone.length == 0) {
            alertMsg("请输入手机号码");
        } else {
            if (isPhoneNo(phone) == false) {
                alertMsg("手机号码不正确");
            } else {
                // let baseurl = "http://a.aibookchina.com";
                var Url4 = "/home/logins/send";

                var codes = $(this);
                $.post(Url4, {
                    "phone": phone,
                    "send": 4
                }, function (res) {
                    if (res.code == 0) {
                        alertMsg(res.msg)
                        if (validCode) {
                            validCode = false;
                            timer = setInterval(function () {
                                if (nums > 0) {
                                    nums--;
                                    codes.val(nums + "秒后重新发送");
                                    codes.addClass("gray-bg");
                                    codes.disabled = false;
                                } else {
                                    clearInterval(timer);
                                    nums = 60; //重置回去
                                    validCode = true;
                                    codes.removeClass("gray-bg");
                                    codes.disabled = true;
                                    codes.val("发送验证码");
                                }
                            }, 1000)
                        }
                    } else {
                        alertMsg(res.msg)
                    }
                })
            }
        }
    })

    $("#join").on('click', function () {
        var phone = $.trim($("#phone").val());
        var verification = $.trim($("#number").val());
        if (phone.length == 0) {
            alertMsg("请输入手机号码");
        } else {
            if (isPhoneNo(phone) == false) {
                alertMsg("手机号码不正确");
            } else if ($.trim($("#number").val()).length == 0) {
                alertMsg("请输入验证码");
            } else {
                // let baseurl = "http://a.aibookchina.com";
                var Url3 = "/api/star/joinTeam";

                $.post(Url3, {
                    "team_id": $.getUrlParam('team_id'),
                    "phone": phone,
                    "verification": verification
                }, function (res) {
                    var _res = JSON.parse(res);
                    if (_res.code == 0) {
                        alertMsg(_res.msg)
                        var u = navigator.userAgent;
                        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
                        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //IOS端
                        var ua = window.navigator.userAgent.toLowerCase();
                        var isWX = ua.match(/MicroMessenger/i) == 'micromessenger'; //微信端安卓无法下载
                        if (isAndroid) {
                            if (isWX) {
                                alert('请点击右上角在浏览器打开')
                                return
                            }
                            location.href = 'https://sj.qq.com/myapp/detail.htm?apkName=com.t550211788.nqu'
                        } else if (isiOS) {
                            // $(".cover,.covers").show();
                            window.location.href =
                                'https://apps.apple.com/cn/app/%E5%BE%A1%E4%B9%A6%E6%88%BF%E6%96%87%E5%AD%A6/id1454806464';
                        } else {
                            // alert('手机扫描二维码下载')
                            $(".cover,.covers").show();
                        }

                        var ua = window.navigator.userAgent;
                        window.device.isIOS = !!ua.match(/(iPhone|iPod|iPad);?/i);
                        window.device.isSafari = window.device.isIOS && d.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/);
                        var o = navigator.userAgent.match(/OS\s([\d]+)/),
                            edition = o ? parseInt(o[1], 10) : 0;
                        edition >= 9 ? window.device.isSafari || (window.location.href = iosUrl) : this.wakeupApp(iosUrl);
                    } else {
                        alertMsg(_res.msg)
                    }
                })
            }
        }
    })
})