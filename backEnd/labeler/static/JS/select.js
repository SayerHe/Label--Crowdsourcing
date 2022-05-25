function Listen_for_Mouse () {
    var mouseStopId;
    var mouseOn = false;
    var startX = 0;
    var startY = 0;

    document.onmousedown = function (e) {
    
        clearEventBubble(e);
        
        if (e.buttons !== 1 || e.which !== 1) return;

        mouseStopId = setTimeout(function () {
            mouseOn = true;
            // 获取容器元素
            var selectContainer = document.getElementById('selectContainer');
            // 调整坐标原点为容器左上角
            startX = e.clientX - selectContainer.offsetLeft + selectContainer.scrollLeft;
            startY = e.clientY - selectContainer.offsetTop + selectContainer.scrollTop;
            var selDiv = document.createElement('div');
            selDiv.style.cssText = 'position:absolute;width:0;height:0;margin:0;padding:0;border:1px dashed #eee;background-color:#aaa;z-index:1000;opacity:0.6;display:none;';
            selDiv.id = 'selectDiv';

            // 添加框选元素到容器内
            document.getElementById('selectContainer').appendChild(selDiv);
            selDiv.style.left = startX + 'px';
            selDiv.style.top = startY + 'px';
        }, 300);
    }
    
    document.onmousemove = function (e) {
    
        if (!mouseOn) return;
        
        clearEventBubble(e);
        
        var selectContainer = document.getElementById('selectContainer');
        var _x = e.clientX - selectContainer.offsetLeft + selectContainer.scrollLeft;
        var _y = e.clientY - selectContainer.offsetTop + selectContainer.scrollTop;
        var _H = selectContainer.clientHeight;
        // 鼠标移动超出容器内部，进行相应的处理
        
        // 向下拖拽
        
        if (_y >= _H && selectContainer.scrollTop <= _H) {
            selectContainer.scrollTop += _y - _H;
        }
    
        // 向上拖拽
        
        if (e.clientY <= selectContainer.offsetTop && selectContainer.scrollTop > 0) {
            selectContainer.scrollTop = Math.abs(e.clientY - selectContainer.offsetTop);
        }
        var selDiv = document.getElementById('selectDiv');
        selDiv.style.display = 'block';
        selDiv.style.left = Math.min(_x, startX) + 'px';
        selDiv.style.top = Math.min(_y, startY) + 'px';
        selDiv.style.width = Math.abs(_x - startX) + 'px';
        selDiv.style.height = Math.abs(_y - startY) + 'px';
    };
        
    document.onmouseup = function (e) {
        
        if (!mouseOn) return;
        
        clearEventBubble(e);
        
        var selDiv = document.getElementById('selectDiv');
        var fileDivs = document.getElementsByClassName('fileDiv');
        var selectedEls = [];
        var l = selDiv.offsetLeft;
        var t = selDiv.offsetTop;
        var w = selDiv.offsetWidth;
        var h = selDiv.offsetHeight;
        for (var i = 0; i < fileDivs.length; i++) {
            var sl = fileDivs[i].offsetWidth + fileDivs[i].offsetLeft;
            var st = fileDivs[i].offsetHeight + fileDivs[i].offsetTop;
            if (sl > l && st > t && fileDivs[i].offsetLeft < l + w && fileDivs[i].offsetTop < t + h) {
                selectedEls.push(fileDivs[i]);
            }
        }
        console.log(selectedEls);
        selDiv.style.display = 'none';
        mouseOn = false;
    };
    
    function clearEventBubble (e) {
        if (e.stopPropagation) e.stopPropagation();
        else e.cancelBubble = true;
        if (e.preventDefault) e.preventDefault();
        else e.returnValue = false;
    }
}