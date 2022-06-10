
var
    tempdata=[
    {'FBID':'001', 'TaskID':'1', "Taskname":"AA", "FBtype":"加急",'Subtime':'2022-6-3', 'TaskState':'审核中',"finishtime":" "},
    {'FBID':'002', 'TaskID':'2', "Taskname":"BB", "FBtype":"申诉",'Subtime':'2022-6-3', 'TaskState':'审核完成',"finishtime":"审核通过"},
    {'FBID':'003', 'TaskID':'1', "Taskname":"AA", "FBtype":"修改",'Subtime':'2022-6-4', 'TaskState':'审核中',"finishtime":" "},
    {'FBID':'004', 'TaskID':'4', "Taskname":"DD", "FBtype":"加急",'Subtime':'2022-6-4', 'TaskState':'审核完成',"finishtime":"审核未通过"},


]

const tableTitle={
    "FBID":"申请ID",
    'TaskID':'任务ID',
    'TaskName':'任务名称',
    "FBtype":"申请类别",
    'Subtime':'提交时间',
    'TaskState':'状态',
    "finishtime":"反馈完成时间"
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
    tmphtml += '<thead><tr><th>申请ID</th><th>任务ID</th><th>任务名称</th><th>申请类别</th><th>提交时间</th><th>审核状态</th><th>审核结果</th><th></th></thead>';
    if(tasks.length > 0){
        tmphtml += '<tbody>';
        for(var i in tasks){
            tmphtml += '<tr>';
            tmphtml += '<td>'+0+i+'</td>';
            for(let j=0;j<7;j++){
                if (j==0){
                    tmphtml += '<td>'+tasks[i]["TaskID"]+'</td>';
                }
                else if (j==1){
                    tmphtml += '<td>'+tasks[i]["TaskName"]+'</td>';
                }
                else if (j==2){
                    tmphtml += '<td>'+tasks[i]["ProblemType"]+'</td>';
                }
                else if (j==3){
                    tmphtml += '<td>'+tasks[i]["UpdatedTime"]+'</td>';
                }
                else if (j==4){
                    tmphtml += '<td>'+tasks[i]["State"]+'</td>';
                }
            }
            tmphtml += '<td>';
            tmphtml += '</tr>';
        }
        tmphtml += '</tbody>';
    }
    document.getElementById("datatable").innerHTML = tmphtml;
}