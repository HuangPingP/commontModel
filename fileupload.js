/*  支持 IE10+
   * 图片上传,包括类型、大小、比例检测
   * @param option {json} 设置
   * @param option.size {string|number} 文件大小 ，单位： kb 
   * @param option.width {Number|object} ps：1000 {min:100,max:1000}
   * @param option.height {Number|object} ps:1000 {min:100,max:1000}
   * @param option.type {RegExp} 文件类型 正则 默认：/^image\/(jpg|png|gif|jpeg)$/i
   * @param option.scale : {Number} 图片比例 默认： 空 ps: 0.75 , 4/3
   * @param option.tagName : {id|class|tagName} 子元素 当事件是绑定在父元素上时有用
   * @param option.fileKey {String} 图片字段名
   * @param option.url : {urlString} 上传图片接口
   * @param option.data : {object|String} 跟随图片上传的需要数据
   * @param option.dataType : {String} [json|text|xml] 返回的数据格式
   * @param option.success : {function} 上传成功回调
   * @param option.error : {function} 上传失败回调
   * @param option.sizeError: {function} 大小错误回调
   * @param option.typeError: {function} 类型错误回调
   * @param option.scaleError: {function} 比例错误回调
   * @param option.widthHeightError {function} 宽高错误回调
   * @param option.uploadStart {function} 开始上传回调
   */
  (function ($) {
    var defaults = {
      type: /^image\/(jpg|png|gif|jpeg)$/i,
      sizeError: $.noop,
      typeError: $.noop,
      scaleError: $.noop,
      widthHeightError: $.noop,
      uploadStart: $.noop,
      error: $.noop,
    };

    $.fn.fileUpload = function (option) {

      option = $.extend({}, defaults, option || {});
      var el = $(this);
      if (option.tagName) {
        el.on(EVENT_CHANGE, option.tagName, function (e) {
          fileUpload.call(this, e, option);
        });
      } else {
        el.on(EVENT_CHANGE, function (e) {
          fileUpload.call(this, e, option);
        });
      }

    };

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
        return;
      }
      /*
       * 大小检测
       */
      if (option.size && fileData.size > option.size * 1024) {
        option.sizeError.call(this);
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
      var isW = option.width ? getScope(img.width, option.width) : true,
        isH = option.height ? getScope(img.height, option.height) : true;
      if ((!isW || !isH) && typeof option.widthHeightError == 'function') {
        option.widthHeightError.call(_self, isW, isH);
        return;
      }
      /*
       * 比例检测
       */
      if (option.scale && scale != option.scale) {
        option.scaleError.call(_self);
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


    function getScope(cur, scope) {
      if (typeof scope == 'string' || typeof scope == 'number') {
        return scope == cur;
      } else {

        var min = scope.min,
          max = scope.max;

        if (min && !max) {
          return cur >= min;
        } else if (!min && max) {
          return cur <= max;
        } else if (min && max) {
          return cur >= min && cur <= max;
        }
      }
      return false;
    }


  })(jQuery);