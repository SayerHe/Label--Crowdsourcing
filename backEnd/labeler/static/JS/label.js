$(document).ready(function(){
    document.getElementById('ruletext').innerHTML = RuleText;
    taskList_init();
});

window.onload=function(){
}

function taskList_init(){
    var ih = '', len, id = 0;
    for(var i in DataList){
        ih += '<table class="datatable" border="2" cellpadding="8">\n'
        ih += '<tr>\n';
        len = 0;
        for(var j in DataList[i]){
            if(j != '__Label__' && j != '__ID__'){
                ih += '<th>'+j+'</th>\n';
                len += 1;
            }
        }
        ih += '</tr>\n';
        ih += '<tr>\n';
        for(var j in DataList[i]){
            if(j != '__Label__'){
                if(j == '__ID__'){
                    id = DataList[i][j];
                }
                else{
                    ih += '<td>'+DataList[i][j]+'</td>\n';
                }
            }
        }
        ih += '</tr>\n';
        ih += '</table>\n';
        ih += '<input class="labelinput" id="label_'+id+'">\n';
    }
    ih += '<button type="button" id="submit" onclick="SubmitLabelResult()">提交</button>'

    document.getElementById('tasktablediv').innerHTML = ih;
    $('.datatable').css('width', (14*len)+'em');
}

function SubmitLabelResult(){
    label_res = document.getElementsByClassName("labelinput");
    taskid = window.location.search.split('&')[0].split('=')[1];
    var labelData = [];
    for(var i = 0; i < label_res.length; i ++){
        id = label_res[i].getAttribute('id').slice(6);
        labelData.push({
            'id':id,
            'label':label_res[i].value
        })
    }
    labelData = JSON.stringify(labelData)
    console.log(labelData);
    $.ajax({
        url: label_url,
        type: "POST",        //请求类型
        data: {
            "TaskID":taskid,
            "Labels":labelData,
        },
        // dataType: "json",   // 这里指定了 dateType 为json后，服务端响应的内容为json.dumps(date)，下面 success 的callback 数据无需进行JSON.parse(callback)，已经是一个对象了，如果没有指定dateType则需要执行 JSON.parse(callback)
        success: function (callback) {
            alert("提交成功！")
            // userform_callback(callback['err'])
        },
        error: function () {
            //当请求错误之后，自动调用
        }
    });
}