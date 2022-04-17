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
            if(j != '__Label__' && j != '__id__'){
                ih += '<th>'+j+'</th>\n';
                len += 1;
            }
        }
        ih += '</tr>\n';
        ih += '<tr>\n';
        for(var j in DataList[i]){
            if(j != '__Label__'){
                if(j == '__id__'){
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

    document.getElementById('taskdiv').innerHTML = ih;
    $('.datatable').css('width', (14*len)+'em');
}

function SubmitLabelResult(){
    label_res = document.getElementsByClassName("labelinput");
    // console.log(label_res);
    for(var i = 0; i < label_res.length; i ++){
        id = label_res[i].getAttribute('id').slice(6);
    }
}