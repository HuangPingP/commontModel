var config = false,debug = false; 

/*微信JS-SDK 
   * 使用JS-SDK的页面必须先注入配置信息*/ 
  function wxConfig(appId,timestamp,nonceStr,signature,callback){
    if(!config){
      wx.config({
    	  debug: debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: appId, // 必填，公众号的唯一标识
          timestamp: timestamp, // 必填，生成签名的时间戳
          nonceStr: nonceStr, // 必填，生成签名的随机串
          signature: signature,// 必填，签名
          jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口
      });     
      wx.ready(function(){
          // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        config = true;// 微信JS-SDK初始化绑定成功，下次调起无需再次绑定
        callback("wxConfig:ok");
      });     
      wx.error(function(res){
          // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        callback(res);
      });
    }else{
      callback("wxConfig:ok");
    }
  }
/*微信JS-SDK 
   * 发起一个微信支付请求*/
  function wxChooseWXPay(appId,timestamp,nonceStr,packageText,signType,paySign,signature,callback){
    if(!config){
      wx.config({
    	  debug: debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: appId, // 必填，公众号的唯一标识
          timestamp: timestamp, // 必填，生成签名的时间戳
          nonceStr: nonceStr, // 必填，生成签名的随机串
          signature: signature,// 必填，签名
          jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口
      });
      wx.ready(function(){
        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        config = true;// 微信JS-SDK初始化绑定成功，下次调起无需再次绑定
        setTimeout(wx.chooseWXPay({
            timestamp: timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            nonceStr: nonceStr, // 支付签名随机串，不长于 32 位
            package: packageText, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
            signType: signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign: paySign, // 支付签名
            complete: function (res) { // 接口调用完成时执行的回调函数，无论成功或失败都会执行。
              callback(res);
            }
        }),1500);
      });
      wx.error(function(res){
          // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        callback(res);
      });
    }else{
      wx.chooseWXPay({
          timestamp: timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
          nonceStr: nonceStr, // 支付签名随机串，不长于 32 位
          package: packageText, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
          signType: signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
          paySign: paySign, // 支付签名
          complete: function (res) { // 接口调用完成时执行的回调函数，无论成功或失败都会执行。
            callback(res);
          }
      });
    }
  } 

/*微信JS-SDK 
   * 使用JS-SDK的页面必须先注入配置信息*/ 
  function wxChooseCardConfig(appId,timestamp,nonceStr,signature,callback){
    if(!config){
      wx.config({
    	  debug: debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: appId, // 必填，公众号的唯一标识
          timestamp: timestamp, // 必填，生成签名的时间戳
          nonceStr: nonceStr, // 必填，生成签名的随机串
          signature: signature,// 必填，签名
          jsApiList: ['chooseCard'] // 必填，需要使用的JS接口
      });     
      wx.ready(function(){
          // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        config = true;// 微信JS-SDK初始化绑定成功，下次调起无需再次绑定
        callback("wxConfig:ok");
      });     
      wx.error(function(res){
          // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        callback(res);
      });
    }else{
      callback("wxConfig:ok");
    }
  }
/*微信JS-SDK 
	* 调起适用于门店的卡券列表并获取用户选择列表*/
  function wxChooseCard(appId, cardSign, signature, cardType, timeStamp, nonceStr, wxCardId, callback){		
		if(!config){
			wx.config({
			    debug: debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			    appId: appId, // 必填，公众号的唯一标识
			    timestamp: timeStamp, // 必填，生成签名的时间戳
			    nonceStr: nonceStr, // 必填，生成签名的随机串
			    signature: signature,// 必填，签名
			    jsApiList: ['chooseCard'] // 必填，需要使用的JS接口
			});
			wx.ready(function(){
			    // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
				config = true;// 微信JS-SDK初始化绑定成功，下次调起无需再次绑定
				wx.chooseCard({
					cardId: wxCardId, // 卡券Id
				    cardType: cardType, // 卡券类型
				    timestamp: timeStamp, // 卡券签名时间戳
				    nonceStr: nonceStr, // 卡券签名随机串
				    signType: 'SHA1', // 签名方式，默认'SHA1'
				    cardSign: cardSign, // 卡券签名
				    complete: function (res) { // 接口调用完成时执行的回调函数，无论成功或失败都会执行。
				    	callback(res);
				    }
				});
			});
			wx.error(function(res){
			    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
				callback(res);
			});
		}else{
			wx.chooseCard({
				cardId: wxCardId,
			    cardType: cardType, // 卡券类型
			    timestamp: timeStamp, // 卡券签名时间戳
			    nonceStr: nonceStr, // 卡券签名随机串
			    signType: 'SHA1', // 签名方式，默认'SHA1'
			    cardSign: cardSign, // 卡券签名
			    complete: function (res) { // 接口调用完成时执行的回调函数，无论成功或失败都会执行。
			    	callback(res);
			    }
			});
		}
	}  
 


