 /*使用方法
var dataPicker = new DatePicker({
	divId: "calendarView",
	inDate: "20151110",  //默认选中入住日期
	outDate: "20151119",//默认选中离店日期
    completeHandler:function(inTime,outTime,days){},  参数为时间戳  可调用 commonjs DateFormat 方法格式化 days是整型
    firstClick:function(){}
});
 */



/**日历控件**/
try {
	serverTime = globle_serverTime;
} catch (e) {
	serverTime = 0;
} 
//服务器时间
//if (serverTime) {
//	newDate = new Date(serverTime);
//} else {
//	newDate = new Date();
//}
var DatePicker = function (args) {
    this.inTime = 0;
//  this.outTime = 0;
	this.init(args);
};
jQuery.extend(DatePicker.prototype, {
	init: function (options) {
		var defaults = {
			divId: "calendarView", //存放日历的外层div id
			index: [0, 1, 2, 3], //0为当月，1为次月，如此类推
			//disableDate: 0,//该日期之前的日期不能选择
			//flag:"inTime"//inTime为入住点击标记，outTime为离店点击标记
			inDate: "20151110",  //默认选中入住日期
			//outDate: "20151119",//默认选中离店日期
			clickCount: 0,
			isFirstTime: false,  //第一次打开日历
			firstClick: null,
            completeHandler: null,
			maxDays: 90	//有效日期
		};
		var settings = $.extend({}, defaults, options);
		//如果没设置值或者是点击入住弹出层，就默认不能选择当天之前的 日期
		if (typeof settings.disableDate == "undefined" || settings.flag == "inTime") {
			// var tmp_today = new Date();
			var tmp_today;
			if (serverTime) {
				tmp_today = new Date(serverTime);
			} else {
				tmp_today = new Date();
			}
			tmp_today.setDate(tmp_today.getDate() - 1);
			var tmp_year = tmp_today.getFullYear();
			var tmp_month = (tmp_today.getMonth() + 1) < 10 ? "0" + (tmp_today.getMonth() + 1) : (tmp_today.getMonth() + 1);
			var tmp_date = tmp_today.getDate() < 10 ? "0" + tmp_today.getDate() : tmp_today.getDate();
			settings.disableDate = tmp_year + "" + tmp_month + "" + tmp_date;

		}
		var indexArray = settings.index;
		

		var headHtml =
			'<div class="date_body date_body_head">' +
			'<table cellpadding="0" cellspacing="0" border="0">' +
			'<tbody>' +
			'<tr>' +
			'<th><div>日</div></th>' +
			'<th><div>一</div></th>' +
			'<th><div>二</div></th>' +
			'<th><div>三</div></th>' +
			'<th><div>四</div></th>' +
			'<th><div>五</div></th>' +
			'<th><div>六</div></th>' +
			'</tr>' +
			'</tbody>' +
			'</table>' +
			'</div>';
		$("#" + settings.divId).append(headHtml);
		var tempMaxDay = 1;
		var tempArr = [];
		for (var idx = 0; idx < indexArray.length; idx++) {
			var index = indexArray[idx];
			var html = "";
			var monthdays = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
			var today;
			if (serverTime) {
				today = new Date(serverTime);
			} else {
				today = new Date();
			}

			var tmp_month = today.getMonth(); //当前月份
			//设置月份
			if (index > 0) {
				//修复本月31天，下一月份溢出多一跳一个月的bug
				if (today.getDate() > 28) {
					today.setDate(28);
				}
				//如果本月为12月
				if (tmp_month == 11) {
					today.setMonth(index - 1);
					today.setFullYear(today.getFullYear() + 1);
				} else {
					today.setMonth(tmp_month + index);
				}
			}
			var year = today.getFullYear();
			var month = today.getMonth();
			var day = today.getDay();
			var dayN = today.getDate();
			var days = monthdays[month];
			var hours = today.getHours();
			if (month == 1) {
				if (today.getYear() % 4 == 0) days = 29;
			}
			if (month == 11) {
				today.setFullYear(today.getFullYear() + 1);
			}
			if (month + 1 < 10) {
				month = "0" + (month + 1);
			} else {
				month = month + 1;
			}
			html += "<table border='0' cellspacing='0' cellpadding='0'>";
			for (var i = 0; i < 7; i++) {
				html += "<th></th>";
			}
			var jumped = 0;
			var inserted = 1;
			var start = day - dayN % 7 + 1;
			if (start < 0) start += 7;
			var weeks = parseInt((start + days) / 7);
			if ((start + days) % 7 != 0) weeks++;
			
			for (var i = weeks; i > 0; i--) {
				html += "<tr>";
				for (var j = 7; j > 0; j--) {
					html += "<td>";
					if (jumped < start || inserted > days) {
						jumped++;
					} else {
						var tempInserted = inserted;
						if (tempInserted < 10) {
							tempInserted = "0" + tempInserted;
						}

						var dayValue = parseInt(year + "" + month + "" + tempInserted);
						var normalHtml = "<div class='td_value ' dayValue='" + 
							dayValue + "'><span>" + inserted + "</span></div>";
						var disableHtml = "<div class='td_value disable' dayValue='" + 
							dayValue + "'><span>" + inserted + "</span></div>";
						if (settings.disableDate >= dayValue) {  //不可选日期
							if (inserted + 1 == dayN && index == 0) { //前一天
								if (hours >= 0 && hours < 3) { //凌晨0~3点内
									html += normalHtml;
									tempMaxDay++;
								} else {
									html += disableHtml;
								}
							} else {
								html += disableHtml;
							}
						} else if (inserted == dayN && index == 0) { //当天
							html += normalHtml;
							tempMaxDay++;
						} else {
							if(tempMaxDay > settings.maxDays){
								html += disableHtml;
							}else{
								html += normalHtml;
								tempMaxDay++;
							}
						}
						inserted++;
					}
					html += "</td>";
				}
				html += "</tr>";
			}
			html += "</table>";
			$("#" + settings.divId).append("<div class='date_title' id='date_title" + index + "'>" + 
										   year + "年" + month + "月" + "</div>");
			$("#" + settings.divId).append("<div class='date_body' id='date_body" + index + "'>" + 
										   html + "</div>");
			
            
            var that = this;
			
			//超过最大日期，不加载新日历
			if(tempMaxDay > settings.maxDays)	break;
		}
		
//		if(!settings.isFirstTime){
//			settings.isFirstTime = true;
//		}else{
//			if (parseInt(settings.inDate) > 0 && parseInt(settings.outDate) > 0) {
//				$("[dayValue='" + settings.inDate + "']").addClass("begin").addClass("selected");
////				$("[dayValue='" + settings.outDate + "']").addClass("end").append("<i>离店</i><b></b>").addClass("selected");
//				
//				var curValue = $(".td_value");
//				for(var x = 0; x < curValue.length; x++){
//					var $cur = $(curValue[x]);
//					tempArr.push(parseInt($cur.attr("dayValue")));
//				}
//				
//				for(var y = 0; y < tempArr.length; y++){
//					if(tempArr[y] > settings.inDate && tempArr[y] < settings.outDate){
//						$("[dayValue='" + tempArr[y] + "']").addClass("line");
//					}
//				}
//			}
//		}
		
		$("#calendarView").delegate(".td_value", "click", function () {
			var $that = $(this);
			if ($that.hasClass("disable")) {
				return;
			}
			settings.clickCount++;
			$that.addClass("selected");
			var outTime = $that.attr("dayValue");
			var inTime = $(".date_body .selected").attr("dayValue");
//			if (inTime) {
//				if (parseInt(inTime) >= parseInt(outTime)) {
//					settings.clickCount = 1;
//				}
//			}
//			if (settings.clickCount == 1) {
				$(".date_body td div").removeClass("selected line begin end");
				$(".date_body td i, .date_body td b").remove();
//				$that.append("<i>入住</i><b></b>").addClass("begin");
//				typeof settings.firstClick == "function" && settings.firstClick();
//				$that.addClass("selected");
//			} else if (settings.clickCount == 2) {
//				settings.clickCount = 0;
//				$that.append("<i>离店</i><b></b>").addClass("end");
				var tempInTime = parseInt(inTime), tempOutTime = parseInt(outTime);
				
				
//				var curValue = $(".td_value");
//				for(var x = 0; x < curValue.length; x++){
//					var $cur = $(curValue[x]);
//					tempArr.push(parseInt($cur.attr("dayValue")));
//				}
//				for(var y = 0; y < tempArr.length; y++){
//					if(tempArr[y] > tempInTime && tempArr[y] < tempOutTime){
//						$("[dayValue='" + tempArr[y] + "']").addClass("line");
//					}
//				}
//				$that.addClass("selected");
				that.inTime = new Date(that.format(inTime)).getTime();
//				that.outTime = new Date(that.format(outTime)).getTime();
				
//				that.days = $(".date_body td .selected").length + $(".date_body td .line").length - 1;
				typeof settings.completeHandler == "function" &&
					settings.completeHandler(that.inTime,that.outTime,that.days);
//			}
		});
		
	},
    format:function(time){
      return time.replace(/^\d{4}/,function(e){return e+"-";})
        .replace(/\d{2}$/,function(e){return "-"+e;});
    }
});