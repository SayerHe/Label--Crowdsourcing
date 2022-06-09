const tableTitle={
    'TaskID':'任务ID',
    'TaskName':'任务名称',
    'PublishDate':'发布日期',
    'Deadline':'截止日期',
    'Progress':'任务进度',
    'TaskState':'任务状态',
},
DTC = {
    "text":"文本",
    "table":"表格",
    "image":"图像",
    "audio":"音频",
    "video":"视频",
};
const TaskNumOnOnePage = 10;
var Tasks;

$(document).ready(function(){
    Tasks = TaskList;
    page_init(Math.max(1, Math.ceil(Tasks.length/TaskNumOnOnePage)));
    changepage(1);
    $('#searchinput').change(function(){
        var s = this.value
        Tasks = [];
        for(i in TaskList){
            if(TaskList[i]['TaskName'].indexOf(s) != -1){
                Tasks.push(TaskList[i]);
            }
        }
        page_init(Math.max(1, Math.ceil(Tasks.length/TaskNumOnOnePage)));
        changepage(1);
    })
});

window.onload=function(){
}

function changepage(page){
    if(UserType == 'publisher'){
        showhtml_publisher(Tasks.slice((page-1)*TaskNumOnOnePage, page*TaskNumOnOnePage));
    }
    else if(UserType == 'labeler'){
        showhtml_labeler(Tasks.slice((page-1)*TaskNumOnOnePage, page*TaskNumOnOnePage));
    }
}

function page_init(pagedata){
    document.getElementById("pagination").setAttribute("size", pagedata);
    Pagination_init();
}

function showhtml_publisher(tasks){
    var tmphtml = '';
    tmphtml += '<thead><tr><th>任务ID</th><th>任务名称</th><th>发布日期</th><th>截止日期</th><th>完成度</th><th>操作</th></tr></thead>';
    // tmphtml += '<thead><tr>';
    // for(t in tasks[0]){
    //     tmphtml += '<th>'+tableTitle[t]+'</th>';
    // }
    // tmphtml += '</tr></thead>';
    if(tasks.length > 0){
        tmphtml += '<tbody>';
        for(var i in tasks){
            tmphtml += '<tr>';
            for(var t in tasks[i]){
                if(t == 'Progress'){
                    tmphtml += '<td><div class="skillbar html"><div class="filled" data-width="'+tasks[i][t]*100+'%"></div></div><span class="percent">'+Math.floor(tasks[i][t]*100)+'%</span></td>';
                }
                else{
                    tmphtml += '<td>'+tasks[i][t]+'</td>';
                }
            }
            tmphtml += '<td>';
            tmphtml += '<button class="operation-button contact-button" onclick="contactbutton('+tasks[i]['TaskID']+')">联系客服</button>';
            if(tasks[i]['Progress'] == 1){
                tmphtml += '<button class="operation-button export-button" onclick="exportbutton('+tasks[i]['TaskID']+')">导出结果</button>';
            }
            else{
                tmphtml += '<button class="operation-button delete-button" onclick="deletebutton('+tasks[i]['TaskID']+')">申请退款</button>';
            }
            tmphtml += '</td>';
            tmphtml += '</tr>';
        }
        tmphtml += '</tbody>';
    }
    document.getElementById("datatable").innerHTML = tmphtml;
    $('.skillbar').skillbar({
        speed: 800,
    });
}

function showhtml_labeler(tasks){
    var tmphtml = '';
    tmphtml += '<thead><tr><th>任务名称</th><th>任务类型</th><th>已完成条数</th><th>最近标注时间</th><th>任务状态</th><th>操作</th></tr></thead>';
    if(tasks.length > 0){
        tmphtml += '<tbody>';
        for(var i in tasks){
            tmphtml += '<tr>';
            for(var t in tasks[i]){
                if(t == 'DataType'){
                    tmphtml += '<td>'+DTC[tasks[i][t]]+'</td>';
                }
                else if(t != 'TaskID' && t != 'BatchID'){
                    tmphtml += '<td>'+tasks[i][t]+'</td>';
                }
            }
            tmphtml += '<td>';
            if(tasks[i]['TaskState'] == '进行中'){
                tmphtml += '<button class="operation-button continue-button" onclick="continuebutton('+tasks[i]['TaskID']+','+tasks[i]['BatchID']+')">继续标注</button>';
            }
            else{
                tmphtml += '<button class="operation-button">继续标注</button>';
            }
            tmphtml += '</td>';
            tmphtml += '</tr>';
        }
        tmphtml += '</tbody>';
    }
    document.getElementById("datatable").innerHTML = tmphtml;
}

function deletebutton(taskid){
    console.log(taskid);
    if(confirm('是否确认删除该任务？')){
        $.ajax({
            url: history_url,
            type: "POST",        //请求类型
            data: {'TaskID':taskid},
            // ConvertEmptyStringToNull: false,
            // dataType: "json",   // 这里指定了 dateType 为json后，服务端响应的内容为json.dumps(date)，下面 success 的callback 数据无需进行JSON.parse(callback)，已经是一个对象了，如果没有指定dateType则需要执行 JSON.parse(callback)
            success: function (returndata) {
                window.location.reload();
            },
            error: function () {
                //当请求错误之后，自动调用
            }
        });
    }
}
function contactbutton(taskid){
    console.log(taskid);
}
function exportbutton(taskid){
    window.location.href=download_url+'?TaskID='+taskid;
}
function continuebutton(taskid, batchid){
    window.open(label_url+'?TaskID='+taskid+'&BatchID='+batchid+'&DataNum=3');
}