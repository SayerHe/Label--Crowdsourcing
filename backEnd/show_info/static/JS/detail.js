
var
    tempdata=[
    {'TaskID':'1', 'TaskName':'task-1', "Type":"文本", 'Finish_time':'2022-6-3', 'TaskState':'成功完成',"Salary":"100"},
    {'TaskID':'2', 'TaskNa':'task-2', "Type":"文本", 'Finish_time':'2022-6-3', 'TaskState':'待审核',"Salary":"0"},
    {'TaskID':'3', 'TaskName':'task-3', "Type":"文本", 'Finish_time':'2022-6-3', 'TaskState':'无效完成',"Salary":"0"},
    {'TaskID':'4', 'TaskName':'task-4', "Type":"文本", 'Finish_time':'2022-6-3', 'TaskState':'待审核',"Salary":"0"},
]

const tableTitle={
    'TaskID':'任务ID',
    'TaskName':'任务名称',
    "Type":"任务类型",
    'Finish_time':'完成日期',
    'TaskState':'任务状态',
    "Salary":"已结收入"
},
DTC = {
    "text":"文本",
    "table":"表格",
    "image":"图像",
    "audio":"音频",
    "video":"视频",
};


$(document).ready(function(){
    if(UserType == 'publisher'){
        showhtml_publisher(tempdata);
    }
    else if(UserType == 'labeler'){
        showhtml_labeler(Data);
    }
    $('.skillbar').skillbar({
        speed: 800,
    });
});

window.onload=function(){
}

function changepage(page){
    askfordata(getsss(page));
    $("html,body").animate({
        scrollTop: "0px"
    }, 100);
}

var Tasks = [],
    Page = 1;
const CN = true;

function askfordata(data){
    return;
    window.parent.history.pushState(
        data,
        document.title,
        window.parent.location.pathname+DataToString(data)
    );
    $.ajax({
        url: labeler_url,
        type: "GET",        //请求类型
        data: data,
        // ConvertEmptyStringToNull: false,
        dataType: "json",   // 这里指定了 dateType 为json后，服务端响应的内容为json.dumps(date)，下面 success 的callback 数据无需进行JSON.parse(callback)，已经是一个对象了，如果没有指定dateType则需要执行 JSON.parse(callback)
        success: function (returndata) {
            data_callback(returndata)
        },
        error: function () {
            //当请求错误之后，自动调用
        }
    });
}

function data_callback(data){
    //更新页码
    const TaskNumOnOnePage = 10;
    pagedata = Math.max(1, Math.ceil(data.length/TaskNumOnOnePage));
    if(pagedata != document.getElementById("pagination").getAttribute("size")){
        pagination = document.getElementById("pagination");
        pagination.setAttribute("size", pagedata);
        pagination.setAttribute("page", Page);
        Pagination_init();
    }
    showhtml(data);
}


function showhtml_labeler(tasks){
    var tmphtml = '';
    tmphtml += '<thead><tr><th>任务ID</th><th>任务名称</th><th>任务类型</th><th>完成时间</th><th>审核状态</th><th>已结收入</th></thead>';
    if(tasks.length > 0){
        tmphtml += '<tbody>';
        for(var i in tasks){
            tmphtml += '<tr>';
            for(var t in tasks[i]){
                if(t == 'DataType'){
                    tmphtml += '<td>'+DTC[tasks[i][t]]+'</td>';
                }
                else{
                    tmphtml += '<td>'+tasks[i][t]+'</td>';
                }
            }
            tmphtml += '<td>';
            tmphtml += '</tr>';
        }
        tmphtml += '</tbody>';
    }
    document.getElementById("datatable").innerHTML = tmphtml;
}