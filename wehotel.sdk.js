(function () {
'use strict';


var JINJIANG_APP = 'jinjiang';

var BOTAO_APP = 'botao';

var WEHOTEL = 'wehotel';

// scheme webhotel


var SCHEME_BOTAO = 'botaoota://';

// 目前（2017-7-7）了解的情况是使用 https协议


// 客户端版本
// 安卓客户端
var CLIENT_TYPE_ANDROID = 'android';
// iOS客户端
var CLIENET_TYPE_IOS = 'iOS';

/**
 * 获取客户端类型
 */
function getAppType(ua) {
    var u = ua || navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    var isApp = /wehotel/.test(u) || /botao/.test(u);
    if (isAndroid && isApp) {
        return CLIENT_TYPE_ANDROID;
    }
    if (isiOS && isApp) {
        return CLIENET_TYPE_IOS;
    }
    return '';
}

/**
 * 获取客户端版本号
 * @param {string} ua
 * @return {number}
 */
function getBotaoAppVersion(ua) {
    // exp: v=2.4.1
    var v = /(?=v\=).*/.exec(ua)[0].replace('v=', '');
    // => 2.0401
    // 将 版本号转为 number类型，容易做版本号前后差异对比
    v = v.replace(/(\.\d+)+/, function (match) {
        return '.' + match.slice(1).split('.').map(function (num) {
            return num < 10 ? '0' + num : num;
        }).join('');
    });
    return Number(v);
}

function getJinJiangAppVersion(ua) {
    // exp: v=2.4.1
    var v = /(?=v\=).*/.exec(ua)[0].replace('v=', '');
    // => 2.0401
    // 将 版本号转为 number类型，容易做版本号前后差异对比
    v = v.replace(/(\.\d+)+/, function (match) {
        return '.' + match.slice(1).split('.').map(function (num) {
            return num < 10 ? '0' + num : num;
        }).join('');
    });
    return Number(v);
}

/**
 * 获取APP 版本号， 非x'x'xAPP，版本号为0
 * @return {number}
 */
function getAppVersion(ua) {
    ua = ua || window.navigator.userAgent;
    if (ua.indexOf(BOTAO_APP) !== -1) {
        return getBotaoAppVersion(ua);
    } else if (ua.indexOf(JINJIANG_APP) !== -1) {
        return getJinJiangAppVersion(ua);
    } else {
        return 0;
    }
}

/**
 * 获取APP wehotel 标识，botao 可用此区分是改版前还是改版后
 * @return {string}
 */
function isWehotel(u) {
  var ua = u || window.navigator.userAgent;
  if (ua.indexOf(WEHOTEL) !== -1) {
    return WEHOTEL;
  } else {
    return '';
  }
}

/**
 * 获取APP渠道类型，区分是在锦江APP中还是在铂涛旅行APP中
 * @return {string}
 */
function getSourceType(u) {
  var ua = u || window.navigator.userAgent;
  if (ua.indexOf(BOTAO_APP) !== -1) {
    return BOTAO_APP;
  } else if (ua.indexOf(JINJIANG_APP) !== -1) {
    return JINJIANG_APP;
  } else {
    return '';
  }
}

// Android
function androidWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
        callback(WebViewJavascriptBridge);
    } else {
        document.addEventListener('WebViewJavascriptBridgeReady', function () {
            callback(WebViewJavascriptBridge);
        }, false);
    }
}

// iOS
function iOSWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
        return callback(WebViewJavascriptBridge);
    }
    if (window.WVJBCallbacks) {
        return window.WVJBCallbacks.push(callback);
    }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = SCHEME_BOTAO + '__BRIDGE_LOADED__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function () {
        document.documentElement.removeChild(WVJBIframe);
    }, 0);
}

/**
 * Created by Administrator on 2017/7/24.
 */
var native = {
  /**
   * 获取用户登录态
   * 未登录则跳转到native登录页
   */
  'login': 'BTLoginPlugin/login',
  /**
   * 获取当前native版本已实现的API
   */
  'getNativeApi': 'BTPublicPlugin/getNativeApi',

  /**
   * 获取地理位置信息
   */
  'gainLocation': 'BTPublicPlugin/gainLocation',
  /**
   * 获取设备信息
   */
  'getClientInfo': 'BTPublicPlugin/getClientInfo',
  /**
   * 打开新的web页面
   */
  'openNewWebView': 'BTPublicPlugin/openNewWebView',
  /**
   * 打开新的web页面(v2切换v1)
   */
  'openV1WebView': 'BTRouterPlugin/openV1WebView',
  /**
   * 关闭当前web页面
   */
  'closeWebView': 'BTPublicPlugin/closeWebView',
  /**
   * 显示一个弹窗
   */
  'showDialog': 'BTPublicPlugin/showDialog',
  /**
   * 发起拨打电话
   */
  'callPhone': 'BTPublicPlugin/callPhone',
  /**
   * 发起支付
   */
  'payOrder': 'BTPayPlugin/payOrder',
  'payOrderSDK': 'BTPayPlugin/payOrderSDK',
  /**
   * 初始化标题栏
   */
  'initTitle': 'BTTitlePlugin/initTitle',
  /**
   * 标题分享
   */
  'share': 'BTTitlePlugin/share',
  /**
   * 标题栏后退按钮,前往特定的链接
   */
  'goUrl': 'BTTitlePlugin/goUrl',
  /**
   * 打开发票列表页面
   */
  'openInvoiceListVC': 'BTRouterPlugin/openInvoiceListVC',
  /**
   * 打开优惠券列表页面
   */
  'openDiscountListVC': 'BTRouterPlugin/openDiscountListVC',
  /**
   * 打开常用联系人列表页面
   */
  'openCommonlyusedPassengerListVC': 'BTRouterPlugin/openCommonlyusedPassengerListVC',
  /*
   * 打开日历选择器
   */
  'openCalendarVC': 'BTRouterPlugin/openCalendarVC',
  /**
   * 打开地图页面
   */
  'openMapVC': 'BTRouterPlugin/openMapVC',
  /**
   * 打开酒店点评列表
   */
  'openCommentVC': 'BTRouterPlugin/openCommentVC',

  /**
   * 打开图片浏览页面，效果同app中酒店详情页点击图片看大图
   */
  'openImageSwitcher': 'BTRouterPlugin/openImageSwitcher',
  /**
   * 通知客户端选中的城市
   */
  'selectCity': 'BTCityPlugin/selectCity',
  /**
   * 获取客户端选中城市
   */
  'getSelectCity': 'BTCityPlugin/getSelectCity',
  /**
   * 获取客户端保存的城市数据
   */
  'getCityList': 'BTCityPlugin/getCityList',
  /**
   * 打开通信录获取电话号码
   */
  'openContactsVC': 'BTRouterPlugin/openContactsVC',
  /**
   * 打开loadingView，lodingView在当前容器是一个单例类，如果当前容器已经呈现有loadingVIew，再次调用这个函数没有操作
   */
  'openLoadingV': 'BTPublicPlugin/openLoadingV',
  /**
   * 关闭loadingView，lodingView在当前容器是一个单例类，如果当前容器已经关闭loadingVIew，再次调用这个函数没有操作
   */
  'closeLoadingV': 'BTPublicPlugin/closeLoadingV',
  /**
   * 跳转到首页
   */
  'gotoHomePage': 'BTRouterPlugin/gotoHomePage',
  /**
   * 跳转到钱包页
   */
  'jumpWalletHome': 'BTWalletPlugin/jumpWalletHome',
  /**
   * 跳转到充值页
   */
  'jumpBalancePage': 'BTWalletPlugin/jumpBalancePage',
  /**
   * 跳转到评论填写
   */
  'editHotelComment': 'BTRouterPlugin/editHotelComment',
  /**
   *  获取标题栏以及物理返回键 控制权限
   */
  'registTitleControler': 'BTTitlePlugin/registTitleControler',
  /**
   * 释放标题栏以及物理返回键 控制权限
   */
  'unregistTitleControler': 'BTTitlePlugin/unregistTitleControler',
  /**
   * 获取收货地址
   */
  'getDeliveryAddress': 'BTRouterPlugin/getDeliveryAddress',
  /**
   *
   */
  'refreshVC': 'BTPublicPlugin/refreshVC',
  /**
   * 顶栏透明渐变
   */
  'startTitleAnimation': 'BTTitlePlugin/startTitleAnimation',
  /*
  * 获取本地图片
  * */
  'selectImage': 'BTPublicPlugin/selectImage',
  /**
   * 打开修改个人资料
   */
  'modifyUserInfo': 'BTRouterPlugin/modifyUserInfo',
  /*跳轉到社交頁面*/
  'jumpSocialHome': 'BTSocialPlugin/jumpSocialHome',
  'jumpSocialTopicDetail': 'BTSocialPlugin/jumpSocialTopicDetail',
  'jumpSocialTopicTag': 'BTSocialPlugin/jumpSocialTopicTag',
  'jumpSocialHotelTag': 'BTSocialPlugin/jumpSocialHotelTag',
  'jumpSocialTopicUserCenter': 'BTSocialPlugin/jumpSocialTopicUserCenter',
  'jumpSocialVC': 'BTRouterPlugin/jumpSocialVC'
};

// 全局暴露对象
var wehotelSDK = {};

// native是否对容器注入完成
wehotelSDK.state = false; //false

// 系统类型
wehotelSDK.clientType = getAppType();

// 调试模式
wehotelSDK.debug = wehotelSDK.clientType ? false : true;
// 是否是Android客户端  boolean
wehotelSDK.isAndroid = wehotelSDK.clientType === CLIENT_TYPE_ANDROID;
// 是否是iOS客户端   boolean
wehotelSDK.isIOS = wehotelSDK.clientType === CLIENET_TYPE_IOS;
// 客户端版本号
// 锦江APP中读取锦江的版本号
// 铂涛旅行APP中读取铂涛旅行版本号
// 改版本号为对外版本号
wehotelSDK.appVersion = getAppVersion();
// APP渠道类型
// 该类型包括 锦江APP， 铂涛旅行APP
// Jinjian / botao
wehotelSDK.sourceType = getSourceType();

//区分改版前后   后：'wehotel'  前：''
wehotelSDK.isWehotel = isWehotel();

//区分业务线
wehotelSDK.appkey = '';
// wehotelSDK.sign = ''
// wehotelSDK.timestamp = ''

//任务队列的数组
wehotelSDK.readyCallbackList = [];

//native中的api列表
wehotelSDK.api = getApiArr(native);

//服务端获取的api列表
wehotelSDK.serviceApi = [];

//初始化api指向空函数
wehotelSDK.noop = function () {};

//自定义函数
wehotelSDK.register = [];

wehotelSDK.testArr = [];

/**
 * 降级方案
 */
var demotion = {};

for (var i = 0, len = wehotelSDK.api.length; i < len; i++) {
	wehotelSDK[wehotelSDK.api[i].key] = wehotelSDK.noop;
}

/**
 * 初始化bridge注入
 * @param {function} callback
 */
function initWebViewBridge(callback) {
	if (wehotelSDK.debug) {
		callback();
	} else {
		switch (wehotelSDK.clientType) {
			case 'android':
				androidWebViewJavascriptBridge(callback);
				break;
			case 'iOS':
				iOSWebViewJavascriptBridge(callback);
				break;
		}
	}
}

function webViewBridgeCallback(bridge) {
	if (wehotelSDK.clientType === 'android' && !wehotelSDK.debug && bridge) {
		/**
   * Android 客户端初始化
   */
		bridge.init(function (message, responseCallback) {
			responseCallback();
		});
	}
	//bridge初始化之后初始化api函数
	if (!wehotelSDK.debug) {
		console.log('注册函数');

		var _loop = function _loop(_i, _len) {
			wehotelSDK[wehotelSDK.api[_i].key] = function (option) {
				var opt = void 0;
				if (typeof option == 'function') {
					opt = {};
					opt.success = option;
				} else {
					opt = option || {};
				}
				var data = opt.data || {},
				    success = opt.success || wehotelSDK.noop;

				bridge.callHandler(wehotelSDK.api[_i].api, data, callHandlerCallback(success));
			};
		};

		for (var _i = 0, _len = wehotelSDK.api.length; _i < _len; _i++) {
			_loop(_i, _len);
		}
	}

	//初始化完成，执行自定义注册函数
	!wehotelSDK.debug && callRegister(bridge);

	//初始化完成，state= true；
	wehotelSDK.state = true;
	if (!wehotelSDK.debug) {
		getNativeApi();
	} else {
		callReady();
		callDemotion();
	}
}

//格式化回调函数中的data
function callHandlerCallback(callback) {
	return function (data) {
		if (typeof data === 'string') {
			data = JSON.parse(data);
		}
		callback(data);
	};
}

/*
 * 获取appKey
 * */
wehotelSDK.setAppKey = function (appKey) {
	if (!wehotelSDK.debug) {
		wehotelSDK.appkey = appKey;
		// wehotelSDK.sign = obj.sign;
		// wehotelSDK.timestamp = obj.timestamp;
		getNativeApi();
	}
};

wehotelSDK.ready = function (callback) {
	typeof callback === 'function' && wehotelSDK.readyCallbackList.push(callback);
	callReady();
};

wehotelSDK.init = function () {
	//非调试模式下进来之后自执行初始化
	if (!wehotelSDK.debug) {
		initWebViewBridge(webViewBridgeCallback);
	}
	if (wehotelSDK.debug && !wehotelSDK.state) {
		//调试模式
		wehotelSDK.state = true;
		initWebViewBridge(webViewBridgeCallback);
	}
}();

/*注册函数*/

/**
 *  @method registerHandler
 *  @param handleName 注册函数名
 *  @param callback 触发执行回调
 */
wehotelSDK.registerHandler = function (handleName, callback) {
	wehotelSDK.register.push({
		handleName: handleName,
		callback: callback
	});
	if (window.WebViewJavascriptBridge && wehotelSDK.state) {
		callRegister(WebViewJavascriptBridge);
	}
};

function callRegister(bridge) {
	if (wehotelSDK.state) {
		for (var _i2 = 0, _len2 = wehotelSDK.register.length; _i2 < _len2; _i2++) {
			bridge.registerHandler(wehotelSDK.register[_i2].handleName, callRegisterCallback(wehotelSDK.register[_i2].callback));
		}
	} else {
		console.log(wehotelSDK.register);
	}
}

/**
 *  返回一个正确的register回调函数
 */
function callRegisterCallback(callback) {
	return function (data, responseCallback) {
		if (typeof data === 'string') {
			data = JSON.parse(data);
		}
		callback(data, responseCallback);
	};
}

function getApiArr(obj, key, arr) {
	var apiArr = arr || [];
	if (typeof obj === 'string') {
		apiArr.push({ key: key, api: obj });
	} else {
		Object.keys(obj).forEach(function (key) {
			getApiArr(obj[key], key, apiArr);
		});
	}
	return apiArr;
}

function callReady() {
	console.log('任务列表');
	if (wehotelSDK.state) {
		for (var _i3 = 0, _len3 = wehotelSDK.readyCallbackList.length; _i3 < _len3; _i3++) {
			wehotelSDK.readyCallbackList[_i3].call(wehotelSDK);
		}
		wehotelSDK.readyCallbackList = [];
	}
}

//获取appKey之后和bridge初始化完成之后都会执行这个方法
function getNativeApi() {
	console.log(wehotelSDK.debug + ',' + wehotelSDK.state + ',' + wehotelSDK.appkey);
	if (!wehotelSDK.debug && wehotelSDK.appkey && wehotelSDK.state) {
		wehotelSDK.getNativeApi({
			data: { JSID: wehotelSDK.appkey }, success: function success(data) {
				data = data || {};
				if (data.msgCode == 100) {
					var result = data.result || '';
					wehotelSDK.serviceApi = result.split('&');
					console.log('服务端api列表:');
					console.log(wehotelSDK.serviceApi);
					//执行任务列表中的任务，并清空
					callReady();
				}
			}
		});
		wehotelSDK.registTitleControler(function (data) {
			if (data.msgCode == 100) {
				console.log('获取Android 标题返回键以及物理键权限成功');
			}
		});
	} else {

		console.log('没有初始化appkey或者处于debug模式或者bridge初始化未完成');
	}
}

function hasOwn(obj, key) {
	return hasOwnProperty.call(obj, key);
}

function callDemotion(handleName, callback) {
	if (handleName && callback) {
		wehotelSDK[handleName] = demotion[handleName] = callback;
	} else {
		for (var _i4 = 0; _i4 < wehotelSDK.api.length; _i4++) {
			if (hasOwn(demotion, wehotelSDK.api[_i4].key)) {
				wehotelSDK[wehotelSDK.api[_i4].key] = demotion[wehotelSDK.api[_i4]];
			} else {
				wehotelSDK[wehotelSDK.api[_i4].key] = function () {};
			}
		}
	}
}

/**
 * @method demotion 设置接口降级方案
 */
wehotelSDK.demotion = function (handleName, callback) {
	if (wehotelSDK.state) {
		demotion[handleName] = callback;
		callDemotion(handleName, callback);
	} else {
		demotion[handleName] = callback;
	}
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && _typeof(module.exports) === 'object') {
    module.exports = wehotelSDK;
} else {
    window.wehotelSDK = wehotelSDK;
}

}());