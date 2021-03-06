var urls = {
    "Feedback":feedback_url,
};



const tableTitle_publisher={'Finished': {
    'TaskID':'任务ID',
    'TaskName':'任务名称',
    'PublishDate':'发布日期',
    'Deadline':'截止日期',
    'Accuracy':'准确度',
},
'Unfinished':{
    'TaskID':'任务ID',
    'TaskName':'任务名称',
    'PublishDate':'发布日期',
    'Deadline':'截止日期',
    'Percentage':'完成度',
}},
tableTitle_labeler={
    'TaskName':'任务名称',
    'DataType':'任务类型',
    'Progress':'已完成条数',
    'LastTime':'最近标注时间',
    'Deadline':'截止日期',
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
    // console.log([2,2]>[2,1])
    Tasks = TaskList;
    page_init(Math.max(1, Math.ceil(Tasks.length/TaskNumOnOnePage)));
    var tmphtml = '';
    tmphtml += '<tr>';
    if(UserType == 'publisher'){
        for(t in tableTitle_publisher[TaskState]){
            tmphtml += '<th name="'+t+'" class="sorting">'+tableTitle_publisher[TaskState][t]+'</th>';
        }
    }
    else if(UserType == 'labeler'){
        for(t in tableTitle_labeler){
            tmphtml += '<th name="'+t+'" class="sorting">'+tableTitle_labeler[t]+'</th>';
        }
    }
    tmphtml += '<th>操作</th>';
    tmphtml += '</tr>';
    document.getElementById("table-head").innerHTML = tmphtml;
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
    $('.sorting').click(function(){
        let key = $(this).attr('name');
        if($(this).hasClass('sort-up')){
            $(this).removeClass('sort-up');
            $(this).addClass('sort-down');
            Tasks.sort((t1, t2) => {
                if(t1[key] <= t2[key]) {return 1;}
                else {return -1;}
            })
        }
        else if($(this).hasClass('sort-down')){
            $(this).removeClass('sort-down');
            $(this).addClass('sort-up');
            Tasks.sort((t1, t2) => {
                if(t1[key] >= t2[key]) {return 1;}
                else {return -1;}
            })
        }
        else{
            $('.sort-up').removeClass('sort-up');
            $('.sort-down').removeClass('sort-down');
            $(this).addClass('sort-down');
            Tasks.sort((t1, t2) => {
                if(t1[key] <= t2[key]) {return 1;}
                else {return -1;}
            })
        }
        changepage(1);
    })
});

window.onload=function(){
}

function tasksortcmp(t1, t2){

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
    // tmphtml += '<thead><tr>';
    // for(t in tableTitle_publisher[TaskState]){
    //     tmphtml += '<th name="'+t+'" class="sorting">'+tableTitle_publisher[TaskState][t]+'</th>';
    // }
    // tmphtml += '<th>操作</th>';
    // tmphtml += '</tr></thead>';
    if(tasks.length > 0){
        // tmphtml += '<tbody>';
        for(var i in tasks){
            tmphtml += '<tr>';
            for(var t in tableTitle_publisher[TaskState]){
                if(t == 'Percentage'){
                    tmphtml += '<td><div class="skillbar html"><div class="filled" data-width="'+tasks[i][t]*100+'%"></div></div><span class="percent">'+Math.floor(tasks[i][t]*100)+'%</span></td>';
                }
                else{
                    tmphtml += '<td>'+tasks[i][t]+'</td>';
                }
            }
            tmphtml += '<td>';
            if(TaskState == 'Finished'){
                tmphtml += '<button class="operation-button export-button" onclick="exportbutton('+tasks[i]['TaskID']+')">导出结果</button>';
            }
            else{
                tmphtml += '<button class="operation-button contact-button" onclick="contactbutton('+tasks[i]['TaskID']+')">联系客服</button>';
                // tmphtml += '<button class="operation-button delete-button" onclick="deletebutton('+tasks[i]['TaskID']+')">申请退款</button>';
            }
            tmphtml += '</td>';
            tmphtml += '</tr>';
        }
        // tmphtml += '</tbody>';
    }
    document.getElementById("table-body").innerHTML = tmphtml;
    $('.skillbar').skillbar({
        speed: 800,
    });
}

function showhtml_labeler(tasks){
    var tmphtml = '';
    // tmphtml += '<thead><tr><th>任务名称</th><th>任务类型</th><th>已完成条数</th><th>最近标注时间</th><th>任务状态</th><th>操作</th></tr></thead>';
    // tmphtml += '<thead><tr>';
    // for(t in tableTitle_labeler){
    //     tmphtml += '<th name="'+t+'" class="sorting">'+tableTitle_labeler[t]+'</th>';
    // }
    // tmphtml += '<th>操作</th>';
    // tmphtml += '</tr></thead>';
    if(tasks.length > 0){
        // tmphtml += '<tbody>';
        for(var i in tasks){
            tmphtml += '<tr>';
            for(var t in tableTitle_labeler){
                if(t == 'DataType'){
                    tmphtml += '<td>'+DTC[tasks[i][t]]+'</td>';
                }
                else if(t == 'Progress'){
                    tmphtml += '<td>'+tasks[i][t][0]+'/'+tasks[i][t][1]+'</td>';
                }
                else if(t == 'Deadline'){
                    tmphtml += '<td>'+tasks[i][t]+'</td>';
                }
                else{
                    tmphtml += '<td>'+tasks[i][t]+'</td>';
                }
            }
            tmphtml += '<td>';

            if(tasks[i]["Progress"][0] < tasks[i]["Progress"][1]){
                tmphtml += '<button class="operation-button continue-button" onclick="continuebutton('+tasks[i]['TaskID']+','+tasks[i]['BatchID']+')">继续标注</button>';
            }
            else{
                tmphtml += '<button class="operation-button">继续标注</button>';
            }
            tmphtml += '</td>';
            tmphtml += '</tr>';
        }
        // tmphtml += '</tbody>';
    }
    document.getElementById("table-body").innerHTML = tmphtml;
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
    window.parent.location.href = main_menu_url+'Feedback/?TaskID='+taskid;
}
function exportbutton(taskid){
    window.location.href=download_url+'?TaskID='+taskid;
}
function continuebutton(taskid, batchid){
    window.open(label_url+'?TaskID='+taskid+'&BatchID='+batchid+'&DataNum=3');
}