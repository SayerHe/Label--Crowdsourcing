$(document).ready(function(){
    document.getElementById('ruletext').innerHTML = '<pre>'+RuleText+'</pre>';
    if(DataType == 'text'){
        taskList_init_text();
    }
    else if(DataType == 'image'){
        taskList_init_image();
    }
    else if(DataType == 'audio'){
        taskList_init_audio();
    }
    $('.tasknumber').click(function() {
        window.location.search = window.location.search.split('&')[0]+'&DataNum='+$("input[name='sc-0']:checked").val();
    })
    // $('#ruletext').mouseup(function(){
    //     sel = window.getSelection();
    //     if (sel.anchorNode != sel.focusNode) return;
    //     st = sel.anchorOffset;
    //     ed = sel.focusOffset;
    //     if (st == ed) return;
    //     if (st > ed) {t = st; st = ed; ed = t;}
    //     var ele = sel.getRangeAt(0).commonAncestorContainer.parentElement,
    //         ih = ele.outerHTML,
    //         ihst = 0,
    //         ihed = ih.length;

    //     for(let t = 0; t < ih.length; t ++){
    //         if(ih[t] == '<'){
    //             while(ih[++t] != '>'){}
    //         }
    //         else{
    //             if(st == 0){
    //                 ihst = t;
    //             }
    //             if(ed == 0){
    //                 ihed = t;
    //             }
    //             st --; ed --;
    //         }
    //     }
    //     a = ih.substring(0, ihst)
    //     b = ih.substring(ihst, ihed)
    //     c = ih.substring(ihed)
    //     ele.outerHTML = a+'</p> <p class="selected">'+b+'</p> <p>'+c
    // });
});

window.onload=function(){
    datanum = window.location.search.split('&')[1].split('=')[1];
    $('#sc-0-'+datanum).attr("checked", true);
}

function draw_question(id){
    var tmp = '';
    if(LabelType == 'choose'){
        var queid = 0;
        tmp += '<div class="choose_div">';
        for(que in ChoicesList){
            tmp += '<div class="radio_div">';
            tmp += '<p>&nbsp;'+que+'</p>';
            tmp += '<div class="container">';
            for(ans in ChoicesList[que]){
                tmp += '<label><input type="radio" name="radio-'+id+'-'+queid+'" value="'+ChoicesList[que][ans]+'"><span>'+ChoicesList[que][ans]+'</span></label>';
            }
            tmp += '</div>';
            tmp += '</div>';
            queid += 1;
        }
        tmp += '</div>';
    }
    else{
        tmp += '<input class="labelinput" id="label_'+id+'" placeholder="标签">\n';
    }
    return tmp;
}
function taskList_init_text(){
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
        ih += draw_question(id);
        ih += '</div>';
    }
    ih += '<button type="button" id="submit" onclick="SubmitLabelResult()">提&nbsp;交</button>';

    document.getElementById('tasktablediv').innerHTML = ih;
}
function taskList_init_image(){
    var ih = '', len, id = 0;
    for(var i in DataList){
        ih += '<div class="datadiv">';
        id = DataList[i]['__ID__'];
        ih += '<img src="data:image/'+DataList[i]['file_type']+';base64,'+DataList[i]['files']+'">';
        ih += '</div>';
        ih += '<div class="questiondiv">';
        ih += draw_question(id);
        ih += '</div>';
    }
    ih += '<button type="button" id="submit" onclick="SubmitLabelResult()">提&nbsp;交</button>'

    document.getElementById('tasktablediv').innerHTML = ih;
}
function taskList_init_audio(){
    var ih = '', len, id = 0;
    for(var i in DataList){
        id = DataList[i]['__ID__'];
        ih += '<div class="datadiv">';
        ih += '<audio controls controlsList="nodownload"><source src="data:audio/'+DataList[i]['file_type']+';base64,'+DataList[i]['files']+'"></audio>';
        ih += '</div>';
        ih += '<div class="questiondiv">';
        ih += draw_question(id);
        ih += '</div>';
    }
    ih += '<button type="button" id="submit" onclick="SubmitLabelResult()">提&nbsp;交</button>'

    document.getElementById('tasktablediv').innerHTML = ih;
}


function SubmitLabelResult(){
    var labelData = [];
    var taskid = window.location.search.split('&')[0].split('=')[1];;
    if(LabelType == 'choose'){
        label_res = $('input[type="radio"]:checked')
        for(var i = 0; i < label_res.length; i ++){
            s = label_res[i].getAttribute('name').split('-');
            if(s[0] == 'radio'){
                labelData.push({
                    'id':s[1],
                    'question_id':s[2],
                    'label':label_res[i].value
                });
            }
        }
    }
    else{
        label_res = document.getElementsByClassName("labelinput");
        for(var i = 0; i < label_res.length; i ++){
            id = label_res[i].getAttribute('id').slice(6);
            labelData.push({
                'id':id,
                'label':label_res[i].value
            });
        }
    }
    labelData = JSON.stringify(labelData)
    $.ajax({
        url: label_url,
        type: "POST",        //请求类型
        data: {
            "TaskID":taskid,
            "Labels":labelData,
        },
        // dataType: "json",   // 这里指定了 dateType 为json后，服务端响应的内容为json.dumps(date)，下面 success 的callback 数据无需进行JSON.parse(callback)，已经是一个对象了，如果没有指定dateType则需要执行 JSON.parse(callback)
        success: function (callback) {
            alert("提交成功！");
            window.location.reload();
            // userform_callback(callback['err'])
        },
        error: function () {
            //当请求错误之后，自动调用
        }
    });
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