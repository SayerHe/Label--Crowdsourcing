$(document).ready(function(){
    if(Finished == 'True'){
        alert('finished');
        open(location, '_self').close();
        return;
    }
    datanum = window.location.search.split('&')[2].split('=')[1];
    $('#sc-0-'+datanum).attr("checked", true);
    document.getElementById('ruletext').innerHTML = '<pre>'+RuleText+'</pre>';
    if(LabelType == 'frame'){
        $('#radiobox').css('display', 'none');
        var ctrl_down = false;
        $(document).keydown(function(e){
            // console.log(e.keyCode)
            if(e.keyCode == 32){
                e.preventDefault();
                $('#frame_add').click();
            }
            else if(e.keyCode == 17){
                ctrl_down = true;
            }
            else if(e.keyCode == 90 && ctrl_down){
                $('#frame_cancel').click();
            }
        })
        $(document).keyup(function(e){
            if(e.keyCode == 17){
                ctrl_down = false;
            }
        })
        if(DataType == 'text'){
            taskList_init_text_frame();
        }
        else if(DataType == 'image'){
            taskList_init_image_frame();
        }
    }
    else {
        // $('.tasknumber').click(function() {
        // })
        if(DataType == 'text'){
            taskList_init_text();
        }
        else if(DataType == 'table'){
            taskList_init_table();
        }
        else if(DataType == 'image'){
            taskList_init_image();
        }
        else if(DataType == 'audio'){
            taskList_init_audio();
        }
    }
    if(RuleText.length == 0){
        $('#foldbutton').click();
    }
    if(window.location.search.split('&').length > 3){
        $("#nowpage").css('display', 'inline');
    }
    $('input').change(function(){
        if(this.className == 'tasknumber'){
            var s = window.location.search.split('&');
            if(s.length >= 3){
                s[2] = 'DataNum='+$("input[name='sc-0']:checked").val();
                window.location.search = s.join('&');
            }
            else{
                s.push('&DataNum='+$("input[name='sc-0']:checked").val());
                window.location.search = s.join('&');
            }
        }
        else{
            if(LabelType == 'describe'){
                this.style.borderColor = '#8080804D';
            }
            else{
                this.parentNode.parentNode.parentNode.style.borderColor = '#00000000';
            }
        }
    })
});

var frame_pos = {}, tmpframe = {}, img_list = {}, text_his = {};

function offset(curEle){
    var totalLeft = null,totalTop = null,par = curEle.offsetParent;
    //?????????????????????????????????????????????
    totalLeft+=curEle.offsetLeft;
    totalTop+=curEle.offsetTop
    //??????????????????body???????????????????????????????????????????????????????????????
    while(par){
        //??????????????????????????????
        totalLeft+=par.clientLeft;
        totalTop+=par.clientTop
        //????????????????????????????????????
        totalLeft+=par.offsetLeft;
        totalTop+=par.offsetTop
        par = par.offsetParent;
    }

    return{
        left:totalLeft,
        top:totalTop
    }
}

function draw_question(id, data){
    var tmp = '';
    if(LabelType == 'choose'){
        var queid = 0;
        tmp += '<div class="choose_div">';
        for(que in ChoicesList){
            tmp += '<div class="radio_div">';
            tmp += '<p>&nbsp;'+que+'</p>';
            tmp += '<div class="container">';
            if(data && data[que]){
                for(ans in ChoicesList[que]){
                    if(ChoicesList[que][ans] == data[que]){
                        tmp += '<label><input type="radio" name="radio-'+id+'-'+queid+'" value="'+ChoicesList[que][ans]+'" checked="checked"><span>'+ChoicesList[que][ans]+'</span></label>';
                    }
                    else{
                        tmp += '<label><input type="radio" name="radio-'+id+'-'+queid+'" value="'+ChoicesList[que][ans]+'"><span>'+ChoicesList[que][ans]+'</span></label>';
                    }
                }
            }
            else{
                for(ans in ChoicesList[que]){
                    tmp += '<label><input type="radio" name="radio-'+id+'-'+queid+'" value="'+ChoicesList[que][ans]+'"><span>'+ChoicesList[que][ans]+'</span></label>';
                }
            }
            tmp += '</div>';
            tmp += '</div>';
            queid += 1;
        }
        tmp += '</div>';
    }
    else{
        tmp += '<input class="labelinput" id="label_'+id+'" placeholder="??????" value="'+data+'">\n';
    }
    return tmp;
}
function taskList_init_text(){
    var ih = '', id = 0;
    for(var i in DataList){
        ih += '<div class="datadiv">';
        id = DataList[i]['__ID__'];
        ih += '<div class="prediv"><pre class="textarea">'+DataList[i]['files']+'</pre></div>';
        ih += '</div>';
        ih += '<div class="questiondiv">';
        ih += draw_question(id, DataList[i]['__Label__']);
        ih += '</div>';
    }
    // ih += '<button type="button" id="submit" onclick="SubmitLabelResult()">???&nbsp;???</button>';

    document.getElementById('tasktablediv').innerHTML = ih;
}
function taskList_init_table(){
    var ih = '', len, id = 0;
    for(var i in DataList){
        ih += '<div class="datadiv">';
        ih += '<table class="datatable" cellpadding="8" cellspacing="0">\n';
        len = 0;
        for(var j in DataList[i]){
            ih += '<tr>\n';
            if(j != '__Label__'){
                if(j == '__ID__'){
                    id = DataList[i][j];
                }
                else{
                    ih += '<th>'+j+'</th>\n';
                    ih += '<td>'+DataList[i][j]+'</td>\n';
                    len += 1;
                }
            }
            ih += '</tr>\n';
        }
        ih += '</table>\n';
        ih += '</div>';
        ih += '<div class="questiondiv">';
        ih += draw_question(id, DataList[i]['__Label__']);
        ih += '</div>';
    }
    // ih += '<button type="button" id="submit" onclick="SubmitLabelResult()">???&nbsp;???</button>';

    document.getElementById('tasktablediv').innerHTML = ih;
}
function taskList_init_image(){
    var ih = '', id = 0;
    for(var i in DataList){
        ih += '<div class="datadiv">';
        id = DataList[i]['__ID__'];
        ih += '<img src="data:image/'+DataList[i]['file_type']+';base64,'+DataList[i]['files']+'">';
        ih += '</div>';
        ih += '<div class="questiondiv">';
        ih += draw_question(id, DataList[i]['__Label__']);
        ih += '</div>';
    }
    // ih += '<button type="button" id="submit" onclick="SubmitLabelResult()">???&nbsp;???</button>'

    document.getElementById('tasktablediv').innerHTML = ih;
}
function taskList_init_audio(){
    var ih = '', id = 0;
    for(var i in DataList){
        id = DataList[i]['__ID__'];
        ih += '<div class="datadiv">';
        ih += '<audio controls controlsList="nodownload"><source src="data:audio/'+DataList[i]['file_type']+';base64,'+DataList[i]['files']+'"></audio>';
        ih += '</div>';
        ih += '<div class="questiondiv">';
        ih += draw_question(id, DataList[i]['__Label__']);
        ih += '</div>';
    }
    // ih += '<button type="button" id="submit" onclick="SubmitLabelResult()">???&nbsp;???</button>'

    document.getElementById('tasktablediv').innerHTML = ih;
}

function taskList_init_image_frame(){
    var ih = '', id = 0;
    for(var i in DataList){
        id = DataList[i]['__ID__'];
        img_list[id] = 'data:image/'+DataList[i]['file_type']+';base64,'+DataList[i]['files'];
        ih += '<div class="datadiv">';
        ih += '<div class="imagediv" id="imagediv_'+id+'"><img src="data:image/'+DataList[i]['file_type']+';base64,'+DataList[i]['files']+'"></div>';
        ih += '<button type="button" class="framebutton" id="frame_add" onclick="addframe('+id+')">?????????Space???</button>';
        ih += '<button type="button" class="framebutton" id="frame_cancel" onclick="cancelframe('+id+')">?????????Ctrl+Z???</button>';
        ih += '</div>';
        ih += '<div id="que_'+id+'" class="questiondiv">';
        // ih += draw_question(id);
        ih += '</div>';
    }
    // ih += '<button type="button" id="submit" onclick="SubmitLabelResult()">???&nbsp;???</button>';
    document.getElementById('tasktablediv').innerHTML = ih;

    for(var i in DataList){
        add_image_frame_function(DataList[i]['__ID__']);
        frame_pos[DataList[i]['__ID__']] = [];
    }
}
function add_image_frame_function(id){
    var imagearea = document.getElementById('imagediv_'+id);
    console.log(imagearea)
    imagearea.onmousedown = function(e){
        var x1, x2, y1, y2, posx, posy, imageoffset, div;
        if(document.getElementsByClassName("frameDiv").length != 0){
            return
        }
        div = document.createElement("div");
        // console.log(offset(imagearea))
        imageoffset = offset(imagearea);
        x1 = x2 = posx = e.clientX - imageoffset.left;
        y1 = y2 = posy = e.clientY - imageoffset.top ;
        div.className = "frameDiv";
        div.style.left = posx+"px";
        div.style.top = posy+"px";
        imagearea.appendChild(div);
        imagearea.onmousemove = function(ev){
            x1 = Math.min(ev.clientX - imageoffset.left, posx);
            y1 = Math.min(ev.clientY - imageoffset.top , posy);
            x2 = Math.max(ev.clientX - imageoffset.left, posx);
            y2 = Math.max(ev.clientY - imageoffset.top , posy);
            div.style.left = x1 + "px";
            div.style.top  = y1 + "px";
            div.style.width  = x2-x1-3+"px";
            div.style.height = y2-y1-3+"px";
        }
        imagearea.onmouseup = function(){
            // div.parentNode.removeChild(div);
            imagearea.onmousemove = null;
            imagearea.onmouseup = null;
            imagearea.onmousedown = null;
            tmpframe[id] = {
                x1:Math.max(x1 - 10, 0),
                x2:Math.max(x2 - 10, 0),
                y1:Math.max(y1 - 10, 0),
                y2:Math.max(y2 - 10, 0),
                div:div
            }
            // stateBar.innerHTML= "Mouse1X: " + x1 + "&nbsp;&nbsp;&nbsp;&nbsp;Mouse1Y: " + y1 +
            //                     "<br/>Mouse2X: " + x2 + "&nbsp;&nbsp;&nbsp;&nbsp;Mouse2Y: " + y2;
        }
    }
}
function taskList_init_text_frame(){
    var ih = '', id = 0;
    for(var i in DataList){
        ih += '<div class="datadiv">';
        id = DataList[i]['__ID__'];
        text_his[id] = [];
        ih += '<div class="prediv" id="prediv_'+id+'"><pre class="textarea">'+DataList[i]['files']+'</pre></div>';
        ih += '<button type="button" class="framebutton" id="frame_add" onclick="addframe('+id+')">?????????Space???</button>';
        ih += '<button type="button" class="framebutton" id="frame_cancel" onclick="cancelframe('+id+')">?????????Ctrl+Z???</button>';
        ih += '</div>';
        ih += '<div class="questiondiv">';
        ih += '</div>';
    }
    // ih += '<button type="button" id="submit" onclick="SubmitLabelResult()">???&nbsp;???</button>';

    document.getElementById('tasktablediv').innerHTML = ih;
}
function add_text_frame_function(id){
}
function addframe(id){
    if(DataType == 'image'){
        if(tmpframe[id]){
            x1 = tmpframe[id].x1;
            y1 = tmpframe[id].y1;
            w  = tmpframe[id].x2 - tmpframe[id].x1;
            h  = tmpframe[id].y2 - tmpframe[id].y1;
            var img = new Image();
            img.src = img_list[id];
            var canvas = document.createElement('canvas');
            canvas.className = 'framed_img';
            var ctx = canvas.getContext('2d');
            var createw = document.createAttribute('width');
            var createh = document.createAttribute('height');
            createw.nodeValue  = w;
            createh.nodeValue = h;
            canvas.setAttributeNode(createh);
            canvas.setAttributeNode(createw);
            document.getElementById('que_'+id).appendChild(canvas);
            ctx.drawImage(img, x1, y1, w, h, 0, 0, w, h);

            frame_pos[id].push({
                x1:tmpframe[id].x1,
                x2:tmpframe[id].x2,
                y1:tmpframe[id].y1,
                y2:tmpframe[id].y2,
                img:canvas
            });

            div = tmpframe[id].div;
            div.parentNode.removeChild(div);
            tmpframe[id] = null;
            add_image_frame_function(id);

            ih = document.getElementById('que_'+id).innerHTML;
        }
    }
    else if(DataType == 'text'){
        sel = window.getSelection();
        if (sel.isCollapsed || sel.anchorNode != sel.focusNode) {return;}
        if (sel.getRangeAt(0).commonAncestorContainer.parentElement.className != 'textarea') {return;}
        st = sel.anchorOffset;
        ed = sel.focusOffset;
        if (st == ed) return;
        if (st > ed) {t = st; st = ed; ed = t;}
        var ele = sel.getRangeAt(0).commonAncestorContainer.parentElement,
            ih = ele.outerHTML,
            ihst = 0,
            ihed = ih.length;

        for(let t = 0; t < ih.length; t ++){
            if(ih[t] == '<'){
                while(ih[++t] != '>'){}
            }
            else{
                if(st == 0){
                    ihst = t;
                }
                if(ed == 0){
                    ihed = t;
                }
                st --; ed --;
            }
        }
        a = ih.substring(0, ihst);
        b = ih.substring(ihst, ihed);
        c = ih.substring(ihed);
        text_his[id].push(document.getElementById('prediv_'+id).innerHTML);
        ele.outerHTML = a+'</pre>'+'<a class="selected">'+b+'</a>'+'<pre class="textarea">'+c;
    }
}
function cancelframe(id){
    if(DataType == 'image'){
        if(tmpframe[id]){
            div = tmpframe[id].div;
            div.parentNode.removeChild(div);
            tmpframe[id] = null;
            add_image_frame_function(id);
        }
        else if(frame_pos[id].length > 0){
            img = frame_pos[id].pop().img;
            document.getElementById('que_'+id).removeChild(img);
            add_image_frame_function(id);
        }
    }
    else if(DataType == 'text'){
        if(text_his[id].length > 0){
            document.getElementById('prediv_'+id).innerHTML = text_his[id].pop();
        }
    }
}
function pageup_callback(){
    var s = window.location.search.split('&');
    if(s.length >= 4){
        s[3] = 'CurrentItem=-'+DataList[0]['__ID__'];
        window.location.search = s.join('&');
    }
    else{
        window.location.search = window.location.search+'&CurrentItem=-'+DataList[0]['__ID__'];
    }
}
function nowpage_callback(){
    var s = window.location.search.split('&');
    window.location.search = s[0]+'&'+s[1]+'&'+s[2];
}

function SubmitLabelResult(){
    var labelData = [], finished = true, scr = 0;
    var s = window.location.search.split('&')
    var taskid = s[0].split('=')[1], batchid = s[1].split('=')[1];
    if(LabelType == 'choose'){
        for(i in DataList){
            id = DataList[i]['__ID__'];
            var j = 0;
            for(que in ChoicesList){
                label_res = $('input[name="radio-'+id+'-'+j+'"]:checked');
                if(label_res.length > 0){
                    labelData.push({
                        'id':id,
                        'question_id':j,
                        'label':label_res[0].value
                    });
                }
                else{
                    node = $('input[name="radio-'+id+'-'+j+'"]')[0].parentNode.parentNode.parentNode;
                    if(finished){
                        scr = offset(node).top - 132 + "px";
                    }
                    node.style.borderColor = 'red';
                    finished = false;
                }
                j ++;
            }
        }
    }
    else if(LabelType == 'describe'){
        label_res = document.getElementsByClassName("labelinput");
        for(var i = 0; i < label_res.length; i ++){
            if(label_res[i].value){
                id = label_res[i].getAttribute('id').slice(6);
                labelData.push({
                    'id':id,
                    'label':label_res[i].value
                });
            }
            else{
                if(finished){
                    scr = offset(label_res[i]).top - 132 + "px";
                }
                label_res[i].style.borderColor = 'red';
                finished = false;
            }
        }
    }
    else if(LabelType == 'frame'){
        if(DataType == 'image'){
            for(var i in DataList){
                id = DataList[i]['__ID__'];
                var tmplist = [];
                for(t in frame_pos[id]){
                    tmplist.push({
                        x1 : frame_pos[id][t].x1,
                        x2 : frame_pos[id][t].x2,
                        y1 : frame_pos[id][t].y1,
                        y2 : frame_pos[id][t].y2,
                    })
                }
                labelData.push({
                    'id': id,
                    'label': JSON.stringify(tmplist)
                });
            }
        }
        else{
            for(var i in DataList){
                id = DataList[i]['__ID__'];
                var tmplist = [];
                tmp = document.getElementsByClassName('selected');
                for(var t = 0; t < tmp.length; t ++){
                    tmplist.push(tmp[t].innerText)
                }
                labelData.push({
                    'id': id,
                    'label': JSON.stringify(tmplist)
                });
            }
        }
    }
    if(finished){
        labelData = JSON.stringify(labelData)
        $.ajax({
            url: label_url,
            type: "POST",        //????????????
            data: {
                "TaskID":taskid,
                "BatchID":batchid,
                "Labels":labelData,
            },
            // dataType: "json",   // ??????????????? dateType ???json?????????????????????????????????json.dumps(date)????????? success ???callback ??????????????????JSON.parse(callback)????????????????????????????????????????????????dateType??????????????? JSON.parse(callback)
            success: function (callback) {
                alert("???????????????");
                var s = window.location.search.split('&');
                if(s.length >= 4){
                    s[3] = 'CurrentItem='+Math.max(0, DataList[DataList.length-1]['__ID__']);
                    window.location.search = s.join('&');
                }
                else{
                    window.location.reload();
                }
                
                // userform_callback(callback['err'])
            },
            error: function () {
                //????????????????????????????????????
            }
        });
    }
    else{
        $("#taskdiv").animate({scrollTop:scr}, 100);
    }
}

function foldbutton_onclick(){
    bt = $('#foldbutton')
    // bt = document.getElementById('foldbutton')
    if(bt[0].getAttribute('show') == '1'){
        bt[0].setAttribute('show', '0');
        bt.animate(
            {left:0},
            300
        );
        bt[0].classList.add('hide');

        $('#ruletextdiv').animate(
            {width:'0',opacity:'0'},
            300
        );
        $('#taskdiv').animate(
            {left:'0',width:'100%'},
            300
        );
        $('.datadiv').css('width','calc(61.8% - 1em)');
        $('.datadiv').css('margin-bottom','1.5em');
        $('.questiondiv').css('width','38.2%');
    }
    else{
        bt[0].setAttribute('show', '1');
        bt.animate(
            {left:'38.2vw'},
            300
        );
        bt[0].classList.remove('hide');

        $('#ruletextdiv').animate(
            {width:'38.2vw', opacity:'1'},
            300
        );
        $('#taskdiv').animate(
            {left:'38.2vw',width:'61.8%'},
            300
        );
        $('.datadiv').animate(
            {width:'100%', marginBottom:'0.5em'},
            300
        );
        $('.questiondiv').animate(
            {width:'100%'},
            300
        );
    }
}