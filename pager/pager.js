/*
	页面结构*****************
	<div id="pagerId"></div>
    
	使用说明*****************
	pager.getPage({
		"id": "pagerId", 	//外层div的id
		"page" : 1,			//当前页
		"totalPage" : "6",	//总页数
		"preBtnClick": function(){},//上一页点击事件
		"nextBtnClick": function(){},//下一页点击事件
		"toSomePageClick": function(){},//跳转到某一页点击事件
        "isShowAll": false //true：显示所有页数，false：显示...
	});


*/


(function () {
	var pager =  {
		defaults: {
			"page": 1,			//当前页
			"totalPage": 1,		//总页数
			"pageSize": 10,		//每页条数
			"middleNum": 5,      //中间显示的页码数量 例如总页数有10页  1 2 ...4 5 6 7 8 .. 10，只能填是奇数
			"preBtnClick": null, //绑定上一页点击事件
			"nextBtnClick": null,//绑定下一页点击事件
			"toSomePageClick": null,//绑定数字点击或者输入框输入某页数点击事件
			"isShowAll": true       //true：显示所有页数，false：显示...
		},
		getPage: function(options, callback){
			var settings = $.extend({}, this.defaults, options);
			var page_html = '';
			var lleft = false, lright = false;
			var lrCount = (settings.middleNum - 1) / 2;
			var count = 0;
			page_html += '<ul class="page">' +
				'<li><a class="bg-list-icons arrowleft-gray prePage" href="javascript:;"></a></li>';

			if(settings.isShowAll || settings.totalPage <= settings.middleNum){//没有...的情况
				for( var i = 1; i <= settings.totalPage; i++){
					page_html += '<li class="p-number" id="' + settings.id + i + '"><a href="javascript:;">' +
						i + '</a></li>';
				}
			}else{
				if(settings.page < (lrCount+2 )){
					for( var i = 1; i <= settings.middleNum; i++){
						page_html += '<li class="p-number" id="' + settings.id + i + '"><a href="javascript:;">' + i + '</a></li>';
					}
					if(settings.middleNum + 1 < settings.totalPage){
						page_html += '<li class=""><a href="javascript:;">...</a></li>';
					}
					page_html += '<li class="p-number" id="'+settings.id + settings.totalPage + '"><a href="javascript:;">' +
						settings.totalPage + '</a></li>';

				}else if(settings.page + lrCount >= settings.totalPage){
					page_html += '<li class="p-number" id="' + settings.id + '1"><a href="javascript:;">1</a></li>';
					var tmp = settings.totalPage - settings.middleNum + 1;
					if(tmp > 2){
						page_html += '<li class=""><a href="javascript:;">...</a></li>';
					}
					for( var i = settings.totalPage; i > settings.totalPage - settings.middleNum; i--){
						page_html += '<li class="p-number" id="' + settings.id + tmp + '"><a href="javascript:;">' + tmp +
							'</a></li>';
						tmp++;
					}
				}else{
					page_html += '<li class="p-number" id="' + settings.id + '1"><a href="javascript:;">1</a></li>';

					if(settings.page - lrCount > 2){
						page_html += '<li class=""><a href="javascript:;">...</a></li>';
					}
					for(var i = settings.page-lrCount; i <= settings.page + lrCount; i++){

						page_html += '<li class="p-number" id="' + settings.id + i + '"><a href="javascript:;">' + i + '</a></li>';
					}
					if((settings.page + lrCount + 1) < settings.totalPage){
						page_html += '<li class=""><a href="javascript:;">...</a></li>';
					}
					page_html += '<li class="p-number" id="' + settings.id + settings.totalPage + '"><a href="javascript:;">' +
						settings.totalPage + '</a></li>';
				}
			}



			page_html += '<li><a class="bg-list-icons arrowright-gray nextPage" href="javascript:;"></a></li>' +
				'<li class="inputLi"><input class="page-input" type="text" /></li>' +
				'<li class="toPageLi"><a class="toSomePage" href="javascript:;">跳转</a></li>' +
				'</ul>';
			if(settings.totalPage == 0){
				page_html = "";
			}
			$("#" + settings.id).html(page_html);
			$("#"+settings.id + settings.page).addClass("on");
//			$("#" + settings.id + " .page-input").val(settings.page);

			this.initFunction(settings)
		},

		/*
		*  @method 初始化事件注册
		*  @param setting 设置项
		*  @param setting.id  事件绑定id
		*  @param setting.preBtnClick  上一页事件回调
		*  @param setting.nextBtnClick 下一页事件毁掉
		*  @param setting.toSomePageClick 跳转到某一页事件回调
		*  @param setting.page 当前页码
		*
		* */
		initFunction: function(settings){
			//上一页
			$("#" + settings.id).on("click", ".prePage", function(){
				if(settings.page == 1){
					return;
				}
				settings.page--;
				$("#"+settings.id + ".page li").removeClass("on").eq(settings.page).addClass("on");
				typeof settings.preBtnClick == "function" && settings.preBtnClick(settings);
			});

			//下一页
			$("#" + settings.id).on("click", ".nextPage", function(){
				if(settings.page == settings.totalPage){
					return;
				}
				settings.page++;
				$("#"+settings.id + ".page li").removeClass("on").eq(settings.page).addClass("on");
				typeof settings.nextBtnClick == "function" && settings.nextBtnClick(settings);
			});

			//跳转到某一页
			$("#" + settings.id).on("click", ".toSomePage, .p-number", function(){
				var $this = $(this);
				var num = parseInt($(this).text());
				var inputNum = parseInt($.trim($("#" + settings.id + " .page-input").val())) || 0;
				if($this.hasClass("toSomePage")){
					if(inputNum <= 0 || inputNum == settings.page || inputNum > settings.totalPage){
						alert("请输入有效的页数");
						return;
					}
					settings.page = inputNum;
				}else{
					if(num == settings.page){
						return;
					}
					settings.page = num;
				}
				$("#" + settings.id + ".page li").removeClass("on").eq(settings.page).addClass("on");
				typeof settings.toSomePageClick == "function" && settings.toSomePageClick(settings);
			});
		}
	};




	window.pager = pager;

})();