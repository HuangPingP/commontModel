
var sweepstakesTemplate=function(){
	//日历插件
	!function(){
		laydate.skin('molv');
		var start = {
		    elem: '#start',
		    format: 'YYYY-MM-DD hh:mm:ss',
		    min: laydate.now(0, 'YYYY-MM-DD hh:00:00'), //设定最小日期为当前日期
		    max: '2099-12-31 23:59:59', //最大日期
		    istime: true,
		    istoday: true,
		    choose: function(datas){
		         end.min = datas; //开始日选好后，重置结束日的最小日期
		         end.start = datas //将结束日的初始值设定为开始日
		    }
		};
		var end = {
		    elem: '#end',
		    format: 'YYYY-MM-DD hh:mm:ss',
		    min: laydate.now(0, 'YYYY-MM-DD hh:00:00'),
		    max: '2099-12-31 23:59:59',
		    istime: true,
		    istoday: true,
		    choose: function(datas){
		        start.max = datas; //结束日选好后，重置开始日的最大日期
		        start.start = datas; 
		    }
		};
		laydate(start);
		laydate(end);
		
	}();
	
//	Alert 弹窗
    var Alert = {
        __flag__: true,
        __init__: function () {
	        if (!this.__flag__) return this;
	        this.__flag__ = false;
	        this.__wrap__ = $('<div class="alertWindow"><div class="alertView"><h2 class="alertTitle"></h2><div class="alertContent"></div><button class="cancelBtn">取消</button><button class="alertBtn">确认</button></div></div>');
	        this.__title__ = $('.alertTitle', this.__wrap__);
	        this.__content__ = $('.alertContent', this.__wrap__);
	        this.__btn__ = $('.alertBtn', this.__wrap__);
	        this.__cancelBtn__=$('.cancelBtn', this.__wrap__);
	        $('body').append(this.__wrap__);
	        var _self = this;
	        _self.__btn__.on('click', function () {
	            _self.__callback__();
	            _self.hide();
	        });
	        _self.__cancelBtn__.on('click', function (e) {
		        _self.hide();
	        })
	        return this;
        },
	    show: function (option) {
	        option = option || {};
	        this.__init__();
	        this.__title__.html(option.title);
	        this.__content__.html(option.content);
	        this.__btn__.html(option.btn || '确认');
	        this.__callback__ = option.callback || $.noop;
	        this.__wrap__.fadeIn();
	        if(option.cancelBtn){
	        	$('.cancelBtn').show();
	        }else{
	        	$('.cancelBtn').hide();
	        }
	    },
	    hide: function () {
	        this.__wrap__.fadeOut();
	        this.__callback__ = $.noop;
	    }
    };
    
    var warn = {
        step: '填写完成才能进入下一步',
        getCouponFail: {
            title: "提示",
            content: "获取优惠券列表失败"
        },
        error: {
            title: "提示",
            content: "网络错误"
        },
    };
    
    function failError() {
        Alert.show(warn.error);
    }
    function getSearch(key) {
      var reg = new RegExp("(^|&|\\?)" + key + "=([^&]*)(&|$)"),
        r;
      if (r = location.search.match(reg)) return unescape(r[2]);
      return null;
    }
    var queryType = getSearch('type'),
    	state=0,
    	rateLen=0,
    	queryId = getSearch('id');
    	
	var EVENT_CLICK = 'click',
	    EVENT_FOCUS = 'focus',
	    EVENT_BLUR = 'blur',
	    EVENT_INPUT = 'input',
	    EVENT_CHANGE = 'change';
	
//	BASE_PATH = formPost.getWebPath() +'/business/roulette/';//线上
    BASE_PATH = 'http://10.100.33.92:8080/plateno-cube-admin/business/roulette/'//测试
	
	return {
		init:function(){
			sweepstakesTemplate.initData();
			sweepstakesTemplate.updataImg(jQuery);
			//奖品列表滑动效果
		    $('.prizeSettings .prizeHeadContent li').on('mouseover',function(){
		    	$(this).addClass('active').siblings().removeClass('active');
		    	var num=$(this).attr('data-num');
		    	$('.prizeItem[data-num="'+num+'"]').addClass('active').siblings().removeClass('active');
		    });
		    //选择抽奖类型的滑动效果
		    $('.chooseLotteryType li').on('mouseover',function(){
		    	$(this).addClass('active').siblings().removeClass('active');
		    	var num=$(this).attr('data-num');
		    	$('.isDraws[data-num="'+num+'"]').addClass('active').siblings().removeClass('active');
		    }); 
		    //普通抽检和高级抽奖的点击选择效果
		    $('.prizeBtnContent button').on('click',function(e){
		    	e=e||window.event;
		    	$(this).addClass('active').siblings().removeClass('active');
				if($(e.target).hasClass('btnOne')){
					$('.generalSettings').show();
					$('.probabilityNumContent').hide();
				}else{
					$('.generalSettings').hide();
					$('.probabilityNumContent').show();
				}
		    });
		    $('.addRangeContent .add').on('click',function(){
		    	var len=$('.rateContent').length+1,
		    		tableList=sweepstakesTemplate.rateTpl(false,"jifenRangeBegin"+len,"jifenRangeEnd"+len,2);
			    var strings='<div class="rateContent active">'+
					    	    '<div class="drawsNum">'+
					    			'<span class="Numbering">'+len+'</span>'+
					    			'<span class="text-danger">*</span>抽奖次数范围'+
					    			'<input type="text" class="text jifenRangeBegin'+len+'" value="" />——<input type="text" class="text jifenRangeEnd'+len+'" value="" />'+
					    			'<span class="tips">积分抽奖总数400次</span>'+
					    		'</div>'+
						        '<div class="rate" id="jifenRate'+len+'">'+tableList+
						        '</div>'+
						        '<div class="clearFix"><span class="tips probability">概率不能大于1！</span></div>'+
					        '</div>';
				$('.integralDrawsContent').append(strings);
				if(len==4){
					$(this).css('display','none');
				}
				if(len>=2){
					$('.addRangeContent .cut').css('display','inline-block');
				}
				$('.integralDrawsContent .rateContent:last').find('.drawsNum input').on('input',sweepstakesTemplate.positiveInteger);
		    	$('.integralDrawsContent .rateContent:last').find('.rate input').on('change',sweepstakesTemplate.probabilityItem);
		    	$('.integralDrawsContent .rateContent:last').find('.rate input').on('change',sweepstakesTemplate.positiveDecimal);
		    })
		    $('.addRangeContent .cut').on('click',function(){
		    	$('.rateContent:last').remove();
		    	var len=$('.rateContent').length;
		    	if(len<=1){
		    		$(this).css('display','none');
		    	}
		    	if(len<4){
		    		$('.addRangeContent .add').css('display','inline-block');
		    	}
		    })
		},
		//初始化页面
		initData:function (){
			if(queryId){
				$.ajax({
					url: BASE_PATH + 'initData',
					type: "post",
					dataType: 'json',
					async : true,
					data: {
						'id': queryId,
					},
					beforeSend:function(){
						var confirmPan=$('<div class="popDiv pop-formDiv" id="uploadLoading">'+$(".pop-formDiv").html()+'</div>');
						var coverPan=$('<div class="opacityDiv"></div>');
						$('body', window.parent.document).append(coverPan);
						$('body', window.parent.document).append(confirmPan);
					},
					success : function(res) {
						$('.opacityDiv', window.parent.document).remove();
						$('.popDiv', window.parent.document).remove();
						if(res.result=='fail'){
							openParentAlert("获取数据失败", "");
							location.href = BASE_PATH + '/toList';
						}
						sweepstakesTemplate.initType(res);
					},
					error : function(XMLHttpRequest, textStatus, errorThrown) {
						$('.opacityDiv', window.parent.document).remove();
						$('.popDiv', window.parent.document).remove();
						Alert.show({
				            title: "提示",
				            content: "网络错误",
				            callback:function(){
				            	location.href = BASE_PATH + '/toList';
				            }
						});
					}
				})
			}else{
				$('.probabilityNumContent').show();
				$('.generalSettings').hide();
				$('.prizeBtnContent button').eq(1).addClass('active').siblings().removeClass('active');
				var prizePic='http://images.plateno.com/images/c/1685ZRIXbR',//http://images.plateno.com/images/c/160iQmK5Fi
					startDate = new Date().getTime();
				var	prizes=[{
							"id": 1,
							"rewardType": "4",
							"rewardName": "谢谢参与",
							"rewardCouponId": "",
							"rewardPoints": "",
							"hint": "继续加油，还差一点点就抽中了~",
							"dailyLimitNumber": "",
							"totalNumber": "",
							"personalLimitNumber":""
						}, {
							"id": 2,
							"rewardType": "4",
							"rewardName": "谢谢参与",
							"rewardCouponId": "",
							"rewardPoints": "",
							"hint": "继续加油，还差一点点就抽中了~",
							"dailyLimitNumber": "",
							"totalNumber": "",
							"personalLimitNumber":""
						}, {
							"id": 3,
							"rewardType": "4",
							"rewardName": "谢谢参与",
							"rewardCouponId": "",
							"rewardPoints": "",
							"hint": "继续加油，还差一点点就抽中了~",
							"dailyLimitNumber": "",
							"totalNumber": "",
							"personalLimitNumber":""
						}, {
							"id": 4,
							"rewardType": "4",
							"rewardName": "谢谢参与",
							"rewardCouponId": "",
							"rewardPoints": "",
							"hint": "继续加油，还差一点点就抽中了~",
							"dailyLimitNumber": "",
							"totalNumber": "",
							"personalLimitNumber":""
						}, {
							"id": 5,
							"rewardType": "4",
							"rewardName": "谢谢参与",
							"rewardCouponId": "",
							"rewardPoints": "",
							"hint": "继续加油，还差一点点就抽中了~",
							"dailyLimitNumber": "",
							"totalNumber": "",
							"personalLimitNumber":""
						}, {
							"id": 6,
							"rewardType": "4",
							"rewardName": "谢谢参与",
							"rewardCouponId": "",
							"rewardPoints": "",
							"hint": "继续加油，还差一点点就抽中了~",
							"dailyLimitNumber": "",
							"totalNumber": "",
							"personalLimitNumber":""
						}, {
							"id": 7,
							"rewardType": "4",
							"rewardName": "谢谢参与",
							"rewardCouponId": "",
							"rewardPoints": "",
							"hint": "继续加油，还差一点点就抽中了~",
							"dailyLimitNumber": "",
							"totalNumber": "",
							"personalLimitNumber":""
						}, {
							"id": 8,
							"rewardType": "4",
							"rewardName": "谢谢参与",
							"rewardCouponId": "",
							"rewardPoints": "",
							"hint": "继续加油，还差一点点就抽中了~",
							"dailyLimitNumber": "",
							"totalNumber": "",
							"personalLimitNumber":""
						}, {
							"id": 9,
							"rewardType": "4",
							"rewardName": "谢谢参与",
							"rewardCouponId": "",
							"rewardPoints": "",
							"hint": "继续加油，还差一点点就抽中了~",
							"dailyLimitNumber": "",
							"totalNumber": "",
							"personalLimitNumber":""
						}, {
							"id": 10,
							"rewardType": "4",
							"rewardName": "谢谢参与",
							"rewardCouponId": "",
							"rewardPoints": "",
							"hint": "继续加油，还差一点点就抽中了~",
							"dailyLimitNumber": "",
							"totalNumber": "",
							"personalLimitNumber":""
					}];
				sweepstakesTemplate.defaultDisplay();
				$('.prizeItemContent').append(sweepstakesTemplate.prizeTpl(prizes));
				$('.getUpImg').find("img").attr({"data-img": prizePic,"src":prizePic});
				$(".getUpImg").show();
				$(".bannerFile").hide();
				$(".btnClick").hide();
				$("#start").val(sweepstakesTemplate.DateFormat(startDate,"yyyy-mm-dd hh:MM:ss"));
				sweepstakesTemplate.initEvent();
			}
		},
		//普通设置和高级设置的初始化
		initType:function(res){
			var data = res.resultMap.rouletteTemplate,
				prizes = (data.rewardList),
				probabliesList = (data.probablyList),
				prizePic = data.rewardPicUrl,
				startDate = (new Date(data.beginEffectiveTime)).getTime(),
				advanced = data.advanced===0?0:1,
				endDate = (new Date(data.endEffectiveTime)).getTime();
			state = data.state;
			rateLen=probabliesList.length-1;
			if(advanced==0){    //普通设置
				$('.probabilityNumContent').hide();
				$('.generalSettings').show();
				$('.prizeBtnContent button').eq(0).addClass('active').siblings().removeClass('active');
				$('.generalFree').val(probabliesList[0].end);
				$('.generalNum').val(probabliesList[1].end);
			}else{       //高级设置
				$('.probabilityNumContent').show();
				$('.generalSettings').hide();
				$('.prizeBtnContent button').eq(1).addClass('active').siblings().removeClass('active');
				sweepstakesTemplate.generateRange(probabliesList);
				for(var j=0;j<probabliesList.length;j++){
					probabliesList[j].probablies = eval(probabliesList[j].probablies);
					if(j==0){
						$("#freeRate").html(sweepstakesTemplate.rateTpl(probabliesList[j],"freeRangeBegin","freeRangeEnd",1));
					}else{
						$('.rateContent .rate').eq(j-1).html(sweepstakesTemplate.rateTpl(probabliesList[j],"jifenRangeBegin"+j,"jifenRangeEnd"+j,2));
					}
				}
			}
			$('.getUpImg').find("img").attr({"data-img": prizePic,"src":prizePic});
			$(".getUpImg").show();
			$(".bannerFile").hide();
			$(".btnClick").hide();
			$(".rules").val(data.description.replace(/\\n/g,"\n"));
			$('.acTitleCon').val(data.name);
			//通过时间差判断是否是默认时间
			datePoor=(new Date(endDate)).getFullYear()-(new Date(startDate)).getFullYear();
			$("#start").val(sweepstakesTemplate.DateFormat(startDate,"yyyy-mm-dd hh:MM:ss"));
			$("#end").val(datePoor==10?'':sweepstakesTemplate.DateFormat(endDate,"yyyy-mm-dd hh:MM:ss"));
			$('.prizeItemContent').append((sweepstakesTemplate.prizeTpl(prizes)));
			sweepstakesTemplate.initEvent();
			if(queryType == "query"){
				$("input, textarea, .actmsCommitDrafts, .actmsCommit").attr("disabled","disabled");
				$('.actmsCommitDrafts').removeClass('saveDraftsBtnNormal').addClass('saveDraftsBtnDisable');
				$('.actmsCommit').removeClass('submitBtnNormal').addClass('submitBtnDisable');
				$(".clearUpImg").hide();
				$('#actmsPreview').show();
				$('.addRangeContent').hide();
				$('.prizeBtnContent button').attr('disabled','disabled');
				//获取预览信息
			    $('#actmsPreview').popover({
			        title:'预览',
			        html:true,
			        trigger:"click",
			        content:'<p class="text-center" ><img src="'+data.qrcodeUrl+
			          '"><br /><a style="color: #337ab7;font-size: 22px;line-height: 36px;word-wrap: break-word;" href="'+data.provideUrl+
			          '" target="_blank">'+data.provideUrl+
			          '</a></p>'
			    });
			}else if(state!=0){
				$('.actmsCommitDrafts').removeClass('saveDraftsBtnNormal').addClass('saveDraftsBtnDisable').attr("disabled","disabled");
			}
			if(queryType != "query"){
				if(advanced==0){
					sweepstakesTemplate.defaultDisplay();
				}
			}
		},
		//创建的时候页面默认的样式
		defaultDisplay:function(){
			var probabliesList=[{
						"id": 1,
						"type": 0,
						"begin": 1,
						"end": 3,
						"probablies": ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"]
					}, {
						"id": 2,
						"type": 1,
						"begin": 1,
						"end": 100,
						"probablies": ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"]
				}];
			sweepstakesTemplate.generateRange(probabliesList);	
			for(var k=0;k<probabliesList.length;k++){
				probabliesList[k].probablies = eval(probabliesList[k].probablies);
				if(k==0){
					$("#freeRate").html(sweepstakesTemplate.rateTpl(probabliesList[k],"freeRangeBegin","freeRangeEnd",1));
				}else{
					$('.rateContent .rate').eq(k-1).html(sweepstakesTemplate.rateTpl(probabliesList[k],"jifenRangeBegin"+k,"jifenRangeEnd"+k,2));
				}
			}
			
		},
		//生成积分抽奖范围
		generateRange:function(list){
			$('.integralDrawsContent').html('');
			for(var i=0;i<list.length-1;i++){
			    var strings='<div class="rateContent">'+
					    	    '<div class="drawsNum">'+
					    			'<span class="Numbering">'+(i+1)+'</span>'+
					    			'<span class="text-danger">*</span>抽奖次数范围'+
					    			'<input type="text" class="text jifenRangeBegin'+(i+1)+'" value="" />——<input type="text" class="text jifenRangeEnd'+(i+1)+'" value="" />'+
					    			'<span class="tips">积分抽奖总数400次</span>'+
					    		'</div>'+
						        '<div class="rate" id="jifenRate'+(i+1)+'">'+
						        '</div>'+
						        '<div class="clearFix"><span class="tips probability">概率不能大于1！</span></div>'+
					        '</div>';
				$('.integralDrawsContent').append(strings);       
			}
			$('.jifenRangeBegin1').attr('disabled','disabled').val('1')
			if(rateLen<4){
				$('.addRangeContent .add').css('display','inline-block');
			}else{
				$('.addRangeContent .add').css('display','none');
			}
			if(rateLen>1){
				$('.addRangeContent .cut').css('display','inline-block');
			}else{
				$('.addRangeContent .cut').css('display','none');
			}
		},
		//生成概率表格
		rateTpl:function(options,bgn,nd,type){
			if(!options){
				options = {
					probablies:['0','0','0','0','0','0','0','0','0','0']
				}
			}else{
				$("."+bgn).val(options.begin?options.begin:0);
				$("."+nd).val(options.end?options.end:0);
			}
			type = type == 1 ? "freeRange" : "jifenRange";
			
			if (options.probablies.length == 0) {
				options.probablies = ['0','0','0','0','0','0','0','0','0','0']
			}
			
			var html = '';
			html +=
				'<table class="table">'+
					'<tr>'+
						'<td>奖项1</td>'+
						'<td>奖项2</td>'+
						'<td>奖项3</td>'+
						'<td>奖项4</td>'+
						'<td>奖项5</td>'+
						'<td>奖项6</td>'+
						'<td>奖项7</td>'+
						'<td>奖项8</td>'+
						'<td>奖项9</td>'+
						'<td>奖项10</td>'+
					'</tr>'+
					'<tr>';
			for(var i = 0; i < options.probablies.length; i++){
				html += '<td><input type="text" class="text '+type+'" value="'+options.probablies[i]+'" ／></td>';
			}			
			html += '</tr></table>';
			return html;
		},
		//时间格式
		DateFormat:function(timestamp,fmt){
	        var D = new Date();
	        var week = ['日','一','二','三','四','五','六'];
	        timestamp && D.setTime(timestamp);
	        fmt = fmt || "yyyy-mm-dd";
	
	        var o = {"m+":D.getMonth()+1,"d+":D.getDate(),"w+":week[D.getDay()],"h+":D.getHours(),"M+":D.getMinutes(),"s+":D.getSeconds()};
	
	        if((/(y+)/).test(fmt)){
	            fmt = fmt.replace(RegExp.$1,(D.getFullYear()+"").substr(4 - RegExp.$1.length));
	        }
	        for(var k in o){
	            if(new RegExp("(" + k + ")").test(fmt)){
	                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	            }
	        }
	        return fmt;
	    },
		//奖品项渲染
    	prizeTpl:function(options){
    		options ? options : {};
    		var htmlOne='';
		    for(var i=0;i<10;i++){
				var prizeDescr = '',
					prizeId = '',
					dailyLimitNumber = '',
					totalNumber = '',
					personalLimitNumber = '',
					prizeName = '',
					prizePoint = '',
					prizeType = '1',
					checked1 = "",
					checked2 = "",
					checked3 = "",
					checked4 = "",
					checked5 = "",
					requireId = "",
					isNotify = 0,
					requirejifen = "";
				if(options){
					prizeDescr = options[i].hint.replace(/"/g, '&quot;');
					prizeId = options[i].rewardCouponId.replace(/"/g, '&quot;');
					dailyLimitNumber = options[i].dailyLimitNumber;
					totalNumber = options[i].totalNumber;
					personalLimitNumber = options[i].personalLimitNumber;
					prizeName = options[i].rewardName.replace(/"/g, '&quot;');
					prizePoint = options[i].rewardPoints.replace(/"/g, '&quot;');
					prizeType = options[i].rewardType;
					isNotify = options[i].isNotify;
				}
				checked1 = prizeType == 1 ? "checked" : "";
				checked2 = prizeType == 2 ? "checked" : "";
				checked3 = prizeType == 3 ? "checked" : "";
				checked4 = prizeType == 4 ? "checked" : "";
				checked5 = isNotify == 1 ? "checked" : "";
				requireId = prizeType == 1 ? '<span class="text-danger">*</span>' : '';
				requirejifen = prizeType == 2 ? '<span class="text-danger">*</span>' : '';
		    	htmlOne +=	'<div class="prizeItem'+(i==0?' active':'')+'" data-num="'+(i+1)+'">'+
		                		'<div class="itemNum"><span>'+(i+1)+'</span></div>'+
		                		'<div class="itemContent clearFix">'+
		                			'<div class="itemContentLeft">'+
								        '<table class="table">'+
								        	'<tr>' +
								        		'<td width="10%"><span class="text-danger">*</span>奖品类型</td>'+
								        		'<td width="40%" class="vm"><label><input class="radio lotteryType" name="type'+(i+1)+'" type="radio" value="1" checked="'+checked1+'" /> 券类</label><label><input class="radio lotteryType" name="type'+(i+1)+'" type="radio" value="2" checked="'+checked2+'" /> 积分</label><label><input class="radio lotteryType" name="type'+(i+1)+'" type="radio" value="3" checked="'+checked3+'" /> 实物</label><label><input class="radio lotteryType" name="type'+(i+1)+'" type="radio" value="4" checked="'+checked4+'" /> 谢谢参与</label></td>'+
								        	'</tr>'+
								        	'<tr>'+
								        		'<td><span class="text-danger">*</span>奖品名称</td>'+
								        		'<td><input type="text" class="text lotteryName" placeholder="请输入奖品名称" value="'+prizeName+'"／></td>'+
								        	'</tr>'+
								        	'<tr>'+
								        		'<td>'+requireId+'券类ID</td>'+
								        		'<td><input type="text" class="text couponId" placeholder="含抵用券、免费房、体验券的奖品ID必填" value="'+prizeId+'"／></td>'+
								        	'</tr>'+
								        	'<tr>'+
								        		'<td>'+requirejifen+'积分数值</td>'+
								        		'<td><input type="text" class="text jifenValue" placeholder="积分类奖品必填" value="'+prizePoint+'" ／></td>'+
								        	'</tr>'+
								        	'<tr>'+
								        		'<td style="vertical-align: top;"><span class="text-danger">*</span>得奖提示</td>'+
								        		'<td><textarea class="textarea lotteryTips" placeholder="限字数500以内">'+prizeDescr+'</textarea></td>'+
								        	'</tr>'+
								        '</table>'+
							        '</div>'+
							        '<div class="itemContentRight">'+
							        	'<p>奖品数量设置<span class="numTitle">（不设置表示不限所有数量）</span></p>'+
							        	'<div class="numSet">'+
							        		'<label class="clearFix"><span>每天发放数量</span><input class="inputStyle dayCount" value="'+(dailyLimitNumber==999999999?'':dailyLimitNumber)+'" /></label>'+
							        		'<label class="clearFix"><span>奖品总数</span><input class="inputStyle allCount" value="'+(totalNumber==999999999?'':totalNumber)+'" /></label>'+
							        		'<label class="clearFix"><span>活动期间每人限中数量</span><input class="inputStyle bodyCount" value="'+(personalLimitNumber==999999999?'':personalLimitNumber)+'" /></label>'+
							        	'</div>'+
							        '</div>'+
		                		'</div>'+
		                		'<div class="pushMessagesCon">'+
		                			'<label class="pushMessages"><input type="checkbox" '+checked5+' /> 是否推送中奖消息<span>（目前仅支持微信公众号消息通知，内容与设置的中奖提示一致）</span></label>'+
		                		'</div>'+
		                	'</div>'
		    }
		    return htmlOne;
    	},
    	//事件初始化
		initEvent:function(){
			$(".actmsBack").on(EVENT_CLICK,sweepstakesTemplate.actmsBackCallback);
			$(".actmsCommitDrafts").on(EVENT_CLICK, {"state":0},sweepstakesTemplate.actmsCommitCallback);
			$(".actmsCommit").on(EVENT_CLICK, {"state":state==0?1:state},sweepstakesTemplate.actmsCommitCallback);
			$('.radio').on(EVENT_CLICK,sweepstakesTemplate.radioClickCallback);
			$('.radio[checked="checked"]').trigger(EVENT_CLICK,true);
			$('.textarea').on('input',function(){
				limit(this,500);
			})
			$('.freeRange,.jifenRange').on('change',sweepstakesTemplate.probabilityItem);
			$('.freeRange,.jifenRange').on('change',sweepstakesTemplate.positiveDecimal);
			$('.dayCount,.allCount,.bodyCount,.freeRangeEnd,.drawsNum input,.generalFree,.generalNum,.jifenValue').on('input',sweepstakesTemplate.positiveInteger);
		},
    	//返回
		actmsBackCallback:function(){
			location.href = BASE_PATH + '/toList';
		},
		//正整数的限制
		positiveInteger:function(){
			if(!(/^[1-9][0-9]*$/.test(this.value))){
				if(this.value != ''){
					openParentAlert("只能输入正整数！", "");
				}
				$(this).val('');
				$(this).blur();
				return false;
			}
			sweepstakesTemplate.limit(this,9);
		},
		//小数的限制
		positiveDecimal:function(){
			if(!(/^[0-1](\.[0-9]+)?$/.test(this.value))){
				if(this.value != ''){
					openParentAlert("只能输入大于等于0小于等于1的数字！", "");
				}
				$(this).val('0');
				$(this).blur();
				return false;
			}
		},
		limit:function(obj, num){
		    var val = obj.value;
			if($.trim(val).length > num) {
				openParentAlert("输入长度最大只能为"+num+"！", "");
                $(obj).val(val.substring(0,num));
                $(obj).blur();
		    }
		},
		//保存函数
    	actmsCommitCallback:function(e){
			var prizeItem=$('.prizeItem'),freeDraws=$('.freeDraws'),rateContent=$('.rateContent');
			
			var prizeJson = [],//奖项数组
				probabliesList = [],//概率数组
				freeProbablies = [],//免费概率
				advanced = $('.prizeBtnContent .active').attr('data-num')*1;
			var jifenArr=[[],[],[],[]];  //保存积分抽奖概率的数组
			var lotteryName = prizeItem.find('.lotteryName'),//奖品名称
				dayCount = prizeItem.find('.dayCount'),//每天发放数量
				allCount = prizeItem.find('.allCount'),//奖品总数
				bodyCount = prizeItem.find('.bodyCount'),//活动期间每人限中数量
				couponId = prizeItem.find('.couponId'),//券类ID
				jifenValue = prizeItem.find('.jifenValue'),//积分数值
				lotteryTips = prizeItem.find('.lotteryTips'),//得奖提示
				pushMessages = prizeItem.find('.pushMessages input'),//是否推送中奖消息
				lotteryType = [];//奖品类型集合
				for(var n=0;n<10;n++){
					lotteryType.push(prizeItem.find("input[name='type"+(n+1)+"']:checked").val());
				}
			var lotteryUploadImg = $('.uploadPic').find(".getUpImg img").attr("data-img");//主图
			var lotteryRules = $('.rules').val().replace(/\n/g,"\\n");
				lotteryRules = lotteryRules.replace(/\r/g,"\\r");
				lotteryRules = $.trim(lotteryRules);//规则
			var acTitleCon = $.trim($('.acTitleCon').val());//标题
			//免费抽奖概率以及范围
			var freeRangeValue = freeDraws.find(".freeRange"),//所有免费抽奖概率项
				freeTotalValue = 0,//免费概率总值
				freeRangeBegin = freeDraws.find(".freeRangeBegin").val(),//免费抽奖次数范围开始
				freeRangeEnd = freeDraws.find(".freeRangeEnd").val();//免费抽奖次数范围结束
		//公共的校验
			//时间，图片，规则，标题
			var startDate = $.trim($("#start").val()),//开始时间
				endDate = $.trim($("#end").val());//结束时间
			if(startDate==''){
				openParentAlert("请选择活动开始时间！", "");
				return false;
			}else{
				startDate = new Date(startDate);
			}
			if(endDate==''){
				endDate = new Date(startDate);
				endDate.setFullYear(endDate.getFullYear()+10); 
				endDate.setDate(endDate.getDate()-1); 
				endDate = new Date(endDate);
			}else{
				endDate = new Date(endDate);
			}
			if(lotteryUploadImg == ""){
				openParentAlert("请上传图片！", "");
				return false;
			}
			if(acTitleCon==''){
				openParentAlert("请填写活动标题！", "");
				return false;
			}
			if(lotteryRules==''){
				openParentAlert("请填写活动规则！", "");
				return false;
			}
			//奖项
			var numData={"dayCount":[],"allCount":[],"bodyCount":[]};
			for(var i = 0; i < 10; i++){
				var _lotteryType = lotteryType[i];//1:抵用券   2:积分   3:实体奖品  4:其他
				var _lotteryName = $.trim($(lotteryName[i]).val());//奖品名称
				var _dayCount = $.trim($(dayCount[i]).val());//每天发放数量
				var _allCount = $.trim($(allCount[i]).val());//奖品总数
				var _bodyCount = $.trim($(bodyCount[i]).val());//每人限领数量
				var _couponId = $.trim($(couponId[i]).val());//券类ID
				var _jifenValue = $.trim($(jifenValue[i]).val());//积分数值
				var _lotteryTips = $(lotteryTips[i]).val();   //得奖提示
				var _pushMessage = $(pushMessages[i]).prop('checked')?1:0;
				if(_lotteryName == ""){
					openParentAlert("请输入奖项"+(i+1)+"的奖品名称", "");
					return false;
				}
				if(_lotteryTips == ""){
					openParentAlert("请输入奖项"+(i+1)+"的得奖提示", "");
					return false;
				} else if (_lotteryTips.length > 255) {
					openParentAlert("奖项"+(i+1)+"的得奖提示不能多于255个字符", "");
					return false;
				}
				if((_dayCount.length > 0 && isNaN(_dayCount))||_dayCount<0){
					openParentAlert("请输入奖项"+(i+1)+"的有效每天发放数量", "");
					return false;
				}
				if((_allCount.length > 0 && isNaN(_allCount))||_allCount<0){
					openParentAlert("请输入奖项"+(i+1)+"的有效奖品总数", "");
					return false;
				}
				if((_bodyCount.length > 0 && isNaN(_bodyCount))||_bodyCount<0){
					openParentAlert("请输入奖项"+(i+1)+"的有效每人限领数量", "");
					return false;
				}
				if(_dayCount==''){
					numData["dayCount"].push(i+1);
					_dayCount=999999999;
				}
				if(_allCount==''){
					numData["allCount"].push(i+1);
					_allCount=999999999;
				}
				if(_bodyCount==''){
					numData["bodyCount"].push(i+1);
					_bodyCount=999999999;
				}
				if(_lotteryType == 1){
					if(_couponId == ""){
						openParentAlert("请填写奖项"+(i+1)+"的券类ID", "");
						return false;
					}else if(isNaN(_couponId)){
						openParentAlert("请填写奖项"+(i+1)+"的有效券类ID", "");
						return false;
					}
				}else if(_lotteryType == 2){
					if(_jifenValue == ""){
						openParentAlert("请填写奖项"+(i+1)+"的积分数值", "");
						return false;
					}else if(isNaN(_jifenValue) || _jifenValue <= 0){
						openParentAlert("请填写奖项"+(i+1)+"的积分数值，并且要求是大于0的数字类型", "");
						return false;
					}else if(_jifenValue > 50){
						openParentAlert("奖项"+(i+1)+"的积分数值不能超过50", "");
						return false;
					}
				}
				if(_lotteryType != 4){
					var allCountNum=$.trim($(allCount[i]).val())
					if(allCountNum.length <= 0 || isNaN(allCountNum)||allCountNum<0){
						openParentAlert("请输入奖项"+(i+1)+"的奖品总数", "");
						return false;
					}
				}
				var objPrize = {
					'id': i + 1,
					'rewardType': _lotteryType,//类型
					'rewardName': _lotteryName,//名称
					'rewardCouponId': _couponId,//券类ID
					'rewardPoints': _jifenValue,//积分分值
					'hint': _lotteryTips,//得奖提示
					'dailyLimitNumber':_dayCount*1,//每天发放数量
					'totalNumber':_allCount*1,//奖品总数
					'personalLimitNumber':_bodyCount*1,//每人限领数量
					'isNotify':_pushMessage
				}
				prizeJson.push(objPrize);
			}
		//非公共的校验
			if(advanced===1){     //高级抽奖
                //免费概率
				for(var m=0;m<10;m++){
					var _freeRangeValue = $(freeRangeValue[m]).val();//免费抽奖概率
					if(_freeRangeValue == ""){
						_freeRangeValue = 0;
					}else if (isNaN(_freeRangeValue) || _freeRangeValue*1 < 0){
						openParentAlert("请输入奖项"+(m+1)+"的有效免费抽奖概率", "");
						return false;
					}
					freeTotalValue += parseFloat(_freeRangeValue)*1000000000000;
					freeProbablies.push(_freeRangeValue);
				}
				if($('.freeRangeEnd').val()>400||$('.freeRangeEnd').val()<=0){
					openParentAlert("免费抽奖总数不能大于400并且不能小于等于0！", "");
					return false;
				}
				//免费抽奖概率验证
				if(freeTotalValue/1000000000000 > 1){
					openParentAlert("免费抽奖次数的概率不能大于1！", "");
					return false;
				} else if (freeTotalValue/1000000000000 < 1) {
					openParentAlert("免费抽奖次数的概率不能小于1！", "");
					return false;
				}
				probabliesList.push({
					'id': 1,
					'type': 0,//免费抽奖：0， 积分抽奖：1
					'begin': freeRangeBegin,
					'end': freeRangeEnd,
					'probablies': freeProbablies
				});
				//积分概率
				for(var j = 0; j < rateContent.length; j++){
					var _jifenRangeValue = $(rateContent[j]).find(".jifenRange");
					var _jifenTotalValue = 0;//积分概率总值
					var beginVal=rateContent.eq(j).find('input').eq(0).val()*1;
					var endVal=rateContent.eq(j).find('input').eq(1).val()*1;
					if (endVal > 400 || !endVal) {
						openParentAlert("积分抽奖范围"+(j+1)+"的结束值不能大于400或者为空", "");
						return false;
					}
					if(!beginVal || endVal > 400){
						openParentAlert("积分抽奖范围"+(j+1)+"的起始值不能大于400或者为空", "");
						return false;
					}
					if(beginVal>endVal){
						openParentAlert("积分抽奖范围"+(j+1)+"的起始值不能大于结束值", "");
						return false;
					}
					if(j===1){
						if(beginVal != (rateContent.eq(0).find('input').eq(1).val()*1+1)){
							openParentAlert("请确保积分抽奖抽奖次数范围1和范围2的范围是连续的。", "");
							return false;
						}
					}else if(j==2){
						if(beginVal != (rateContent.eq(1).find('input').eq(1).val()*1+1)){
							openParentAlert("请确保积分抽奖抽奖次数范围2和范围3的范围是连续的。", "");
							return false;
						}
					}else if(j==3){
						if(beginVal != (rateContent.eq(2).find('input').eq(1).val()*1+1)){
							openParentAlert("请确保积分抽奖抽奖次数范围3和范围4的范围是连续的。", "");
							return false;
						}
					}
					for(var k = 0; k < _jifenRangeValue.length; k++){
						var __jifenRangeValue = $(_jifenRangeValue[k]).val();
						if(__jifenRangeValue == ""){
							openParentAlert("请填写积分抽奖次数范围"+(j+1)+",奖项"+(k+1)+"的概率", "");
							return false;
						}
						if(isNaN(__jifenRangeValue) || __jifenRangeValue < 0){
							openParentAlert("请填写积分抽奖次数范围"+(j+1)+",奖项"+(k+1)+"的有效概率", "");
							return false;
						}
						_jifenTotalValue += parseFloat(__jifenRangeValue)*1000000000000;
						jifenArr[j].push(__jifenRangeValue);
					}
					if(_jifenTotalValue/1000000000000 > 1){
						openParentAlert("积分抽奖次数范围"+(j+1)+"的概率不能大于1！", "");
						return false;
					} else if (_jifenTotalValue/1000000000000 < 1) {
						openParentAlert("积分抽奖次数范围"+(j+1)+"的概率不能小于1！", "");
						return false;
					}
					probabliesList.push({
						'id': j+2,
						'type': 1,//免费抽奖：0， 积分抽奖：1
						'begin': beginVal*1,
						'end': endVal*1,
						'probablies': jifenArr[j]
					});
					
					
				}
			}else{           //普通抽奖
				if(!$('.generalFree').val()){
					openParentAlert("请输入免费抽奖次数", "");
					return false;
				}else if($('.generalFree').val()*1>400){
					openParentAlert("免费抽奖最多400次", "");
					return false;
				}
				if(!$('.generalNum').val()){
					openParentAlert("请输入积分抽奖次数", "");
					return false;
				}else if($('.generalNum').val()*1>400){
					openParentAlert("积分抽奖最多400次", "");
					return false;
				}
				probabliesList.push({
					'id': 1,
					'type': 0,//免费抽奖：0， 积分抽奖：1
					'begin': 1,
					'end': $('.generalFree').val()*1,
					'probablies': []
				});
				probabliesList.push({
					'id': 2,
					'type': 1,//免费抽奖：0， 积分抽奖：1
					'begin': 1,
					'end': $('.generalNum').val()*1,
					'probablies': []
				});
			}
			var urls='doAdd';
			var dataObj={
					"rewardList": JSON.stringify(prizeJson),
					"rewardPicUrl": lotteryUploadImg,
					"beginEffectiveTime": startDate,
					"endEffectiveTime": endDate,
					"probablyList": JSON.stringify(probabliesList),
					"description":lotteryRules,
					"state":e.data.state,
					"name":acTitleCon,
					"advanced":advanced
			};
			if(queryId){
				dataObj.id=queryId;
				urls='doEdit';
			}
			if(numData["dayCount"].length!=0||numData["allCount"].length!=0||numData["bodyCount"].length!=0){
				var strings=(numData["dayCount"].length?'奖项'+numData["dayCount"].join()+'每天发放数量，</br>':'')+(numData["allCount"].length?'奖项'+numData["allCount"].join()+'奖品总数，</br>':'')+(numData["bodyCount"].length?'奖项'+numData["bodyCount"].join()+'活动期间每人限中数量，</br>':'');
				strings+='没有填写，默认不限制数量，是否继续'+(e.data.state!=0?'发布':'保存草稿')+'？';
				
        		Alert.show({
                    title: "提示",
                    content: strings,
                    callback:save,
                    cancelBtn:true
                });
			}else{
				save()
			}
			function save(){
				$.ajax({
					url: BASE_PATH + urls,
					type: "post",
					dataType: 'json',
					data: dataObj,
					beforeSend:function(){
						var confirmPan=$('<div class="popDiv pop-formDiv" id="uploadLoading">'+$(".pop-formDiv").html()+'</div>');
						var coverPan=$('<div class="opacityDiv"></div>');
						$('body', window.parent.document).append(coverPan);
						$('body', window.parent.document).append(confirmPan);
					},
					success : function(res) {
						$('.opacityDiv', window.parent.document).remove();
						$('.popDiv', window.parent.document).remove();
						if (res.code == -3) {
							openParentAlert("发布失败,系统错误！", "");
							return false;
						} else if (res.code == -4) {
							openParentAlert("发布失败，参数错误！", "");
							return false;
						} else {
							if(e.data.state==0){
								openParentAlert("保存草稿成功!", "");
								location.href = BASE_PATH + '/toList';
							}else{
								openParentAlert("发布成功!", "");
								location.href = BASE_PATH + '/toList';
							}
						}
					},
					error : function(XMLHttpRequest, textStatus, errorThrown) {
						$('.opacityDiv', window.parent.document).remove();
						$('.popDiv', window.parent.document).remove();
						failError();
					}
				})
			}
    	},
    	//奖品列表的交互
    	radioClickCallback:function(e,flag){
			var $this = $(this),
				$table=$this.closest('.table'),
				$itemContent=$this.closest('.itemContent');
			var value = $this.val();
			if(!flag){
				$table.find(".couponId").val('');
				$table.find(".jifenValue").val('');
				$itemContent.find(".dayCount").val('');
				$itemContent.find(".allCount").val('');
				$itemContent.find(".bodyCount").val('');
			}
			if(value==4){
				$table.find(".couponId").closest('tr').hide();
				$table.find(".jifenValue").closest('tr').hide();
				$itemContent.find(".itemContentRight").hide();
			}else{
				$table.find(".couponId").closest('tr').show();
				$table.find(".jifenValue").closest('tr').show();
				$itemContent.find(".itemContentRight").show();
			}
			if(value==3){
				$itemContent.siblings('.pushMessagesCon').show();
			}else{
				$itemContent.siblings('.pushMessagesCon').hide();
			}
			if(value == 1){
				$table.find(".couponId").closest('tr').show();
				$table.find(".jifenValue").closest('tr').hide();
				$table.find(".couponId").parent().prev("td").html('<span class="text-danger">*</span>券类ID');
				$table.find(".jifenValue").parent().prev("td").html('积分数值');
				
			}else if(value == 2){
				$table.find(".couponId").closest('tr').hide();
				$table.find(".jifenValue").closest('tr').show();
				$table.find(".couponId").parent().prev("td").html('券类ID');
				$table.find(".jifenValue").parent().prev("td").html('<span class="text-danger">*</span>积分数值');
			}else{
				$table.find(".couponId").closest('tr').hide();
				$table.find(".jifenValue").closest('tr').hide();
				$table.find(".couponId").parent().prev("td").html('券类ID');
				$table.find(".jifenValue").parent().prev("td").html('积分数值');
			}
    	},
		//验证概率总数及单项
		probabilityItem:function(){
			if($(this).val()<0||$(this).val()>1){
				openParentAlert("概率要大于等于0小于等于1！", "");
				$(this).val('0');
				return false;
			}
			var $Ranges=$(this).closest('tr').find('input'),
				num=0;
			for(var i=0;i<$Ranges.length;i++){
				num+=$Ranges.eq(i).val()*1;
			}
			if(num>1){
				$(this).closest('div').siblings('.clearFix').find('span').addClass('error').html('概率大于1，请重新计算！');
			}else{
				$(this).closest('div').siblings('.clearFix').find('span').removeClass('error').html('概率不能大于1！');
			}
		},
    	
		//图片上传
		updataImg:function (){
		    var FILE_TYPE = /^image\/(jpg|png|jpeg)$/i,
		        COUNT_TYPE = /^[0-9]*[1-9][0-9]*$/;
			    
			var bannerFile=$('.bannerFile');
			
			(function () {
			    var defaults = {
			        type: /^image\/(jpg|png|gif|jpeg)$/i,
			        sizeError: $.noop,
			        typeError: $.noop,
			        scaleError: $.noop,
			        widthHeightError: $.noop,
			        uploadStart: $.noop,
			        error: $.noop,
			    };
			    var obj={};
			    $.fn.fileUpload = function (option) {
			        option = $.extend({}, defaults, option || {});
		            obj=option;
			    };
			    bannerFile.off().on(EVENT_CHANGE, function (e) {
		            fileUpload.call(this, e, obj);
		        });
			    var fr = new FileReader(),
			        img = new Image();
			    function fileUpload(e, option) {  
			        var fileData = this.files[0];
			        var _self = this;
			        if (_self.value == '') return;
			        /*
			           * 类型检测
			        */
			        if (option.type && !option.type.test(fileData.type)) {
			            option.typeError.call(this);
			            _self.value ='';
			            return;
			        }
			      /*
			       * 大小检测
			       */
			        if (option.size && fileData.size > option.size * 1024) {
			            option.sizeError.call(this);
			            _self.value ='';
			            return;
			        }
			        fr.readAsDataURL(fileData);
			        fr.onload = function () {
				        img.src = this.result;
				        img.onload = function () {
				            imgOnload.call(_self, option);
				        }
			        }
			    }
			    function imgOnload(option) {
			        var scale = img.width / img.height;
			        var _self = this;
			        /*
			        * 宽高检测
			        */
			        if ((img.width!=option.width || img.height!=option.height) && typeof option.widthHeightError == 'function' && option.width && option.height) {
			            option.widthHeightError.call(_self);
			            _self.value ='';
			            return;
			        }
			        /*
			         * 比例检测
			         */
			        if (option.scale && scale != option.scale) {
			            option.scaleError.call(_self);
			            _self.value ='';
			            return;
			        }
			        var fd = new FormData();
			        option.data = option.data || {};
			        for (var k in option.data) {
			            fd.append(k, option.data[k]);
			        }
			        fd.append(option.fileKey, _self.files[0]);
			        option.uploadStart.call(_self);
			        $.ajax({
			            url: option.url || '',
				        dataType: option.dataType || 'json',
				        type: "post",
				        data: fd,
				        processData: false,
				        contentType: false,
				        success: function (data) {
				          option.success.call(_self, data, img.src);
				        },
				        error: option.error
			        });
			    }
			})()
		    function bannerFileUploadFn(ops) {
				var cel='';
				if(ops){
					cel = '.bannerFile';
				}
		        bannerFile.fileUpload({
					curEl: cel,
		            width:'',
		            height:'',
		        	sizeError: function () {
				        Alert.show({
				            content: "文件大小不超过KB，请重新选择文件",
				        });
		        	},
		        	type: FILE_TYPE,
		        	typeError: function () {
			            Alert.show({
			                title: "提示",
			                content: "只能上传 JPG/PNG 格式的图片！"
			            })
		            },
		            widthHeightError:function(){
			            Alert.show({
			                title: "提示",
			                content: ""
			            })
		            },
		        	url: BASE_PATH + 'uploadImg',
		        	fileKey: 'uploadFile',
		       		uploadStart: function () {
		                $(this).siblings('.btnClick').hide();
		                $(this).siblings('.btnUping').show();
		                $(this).hide();
		       		},
		            success: function (res, src) {
		          		$(this).siblings('.btnUping').hide();
		          		if (res.result == 'success') {
		           			 $(this).siblings('.getUpImg').show();
		            		 $(this).siblings('.getUpImg').find('.previewPic').attr({'src': src,'data-img':res.code});
		         		} else {
		            		Alert.show({
		                        title: "提示",
		                        content: "图片上传失败！请重试"
		                    });
		                    $('.bannerFile').val('');
					        $('.bannerFile').siblings('.btnClick').show();     
					        $('.bannerFile').show();
		                }
		       		},
		            error:function(){
		            	failError();
				        $('.bannerFile').siblings('.btnClick').show();
				        $('.bannerFile').siblings('.btnUping').hide();
				        $('.bannerFile').show();
		            } 
		        });
		    }
		    function fileCloseCallback(e){
//		    	$(this).siblings('.previewPic').attr('src', '').attr('data-img', '');
				$(this).parent(".getUpImg").find('.previewPic').attr('src', '').attr('data-img', '');
		    	$(this).parent(".getUpImg").siblings('.btnClick').show();
		    	$(this).parent(".getUpImg").siblings('.bannerFile').show();
		    	$(this).parent(".getUpImg").hide();
		    	bannerFile.val('');
		    }
		    
		    bannerFileUploadFn(true);
		    $(".clearUpImg").off().on(EVENT_CLICK,fileCloseCallback);
		}
		
	}
	
}()
$(document).ready(function(){
	sweepstakesTemplate.init();
});









