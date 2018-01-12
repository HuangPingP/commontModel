/**
 * 移动端布局专用
 * 引入该模块后，当前在640宽的设计图片中，1rem=100px，
 * 当页面宽小于640时，页面会等比例缩放，大于640宽时，页面会保持640宽的大小
 * 举例：
 * 引入该模块后，在640宽的页面html标签上<html data-dpr="2" style="font-size: 100px;">
 * 即1rem = 100px，如果设计图中的某个字体是28px的，那么在CSS上直接font-size: .28rem就OK了，简单易用，又不用计算
 * @author https://github.com/HuangPingP
 */
(function (doc, win) {
    var docEl = doc.documentElement,
        dpr = 1,
        scale = 1 / dpr;

    docEl.setAttribute("data-dpr", win.devicePixelRatio);

    if (docEl.clientWidth > 1280) { scale = scale * Math.ceil(docEl.clientWidth / 1280) }

    docEl.style.width = '100%';
    docEl.style.height = '100%';

    var metaEl = doc.createElement('meta');
    metaEl.name = 'viewport';
    metaEl.content = 'initial-scale=' + scale + ',maximum-scale=' + scale + ', minimum-scale=' + scale;
    docEl.firstElementChild.appendChild(metaEl);

    var recalc = function () {
        var width = docEl.clientWidth;
        if (width / dpr > 640) { width = 640 * dpr; }
        docEl.style.fontSize = 100 * (width / 640) + 'px';
    };
    recalc()
})(document, window);