var tempdata=[
    {'TaskID':'1', 'TaskName':'task-1', 'PublishDate':'2022-6-3', 'Deadline':'2022-6-3', 'Progress':'100'},
    {'TaskID':'2', 'TaskName':'task-2', 'PublishDate':'2022-6-3', 'Deadline':'2022-6-3', 'Progress':'28' },
    {'TaskID':'3', 'TaskName':'task-3', 'PublishDate':'2022-6-3', 'Deadline':'2022-6-3', 'Progress':'38' },
    {'TaskID':'4', 'TaskName':'task-4', 'PublishDate':'2022-6-3', 'Deadline':'2022-6-3', 'Progress':'48' },
    {'TaskID':'5', 'TaskName':'task-5', 'PublishDate':'2022-6-3', 'Deadline':'2022-6-3', 'Progress':'58' },
    {'TaskID':'6', 'TaskName':'task-6', 'PublishDate':'2022-6-3', 'Deadline':'2022-6-3', 'Progress':'68' },
    {'TaskID':'7', 'TaskName':'task-7', 'PublishDate':'2022-6-3', 'Deadline':'2022-6-3', 'Progress':'78' },
    {'TaskID':'8', 'TaskName':'task-8', 'PublishDate':'2022-6-3', 'Deadline':'2022-6-3', 'Progress':'88' },
];
$(document).ready(function(){
    showhtml(TaskList);
    $('.skillbar').skillbar({
        speed: 1000,
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

function showhtml(tasks){
    var tmphtml = '';
    tmphtml += '<thead><tr><th>任务ID</th><th>任务名称</th><th>发布日期</th><th>截止日期</th><th>完成度</th><th>操作</th></tr></thead>';
    tmphtml += '<tbody>';
    for(var i in tasks){
        tmphtml += '<tr>';
        for(var t in tasks[i]){
            if(t == 'Progress'){
                tmphtml += '<td><div class="skillbar html"><div class="filled" data-width="'+tasks[i][t]+'%"></div></div><span class="percent">'+tasks[i][t]+'%</span></td>'
            }
            else{
                tmphtml += '<td>'+tasks[i][t]+'</td>';
            }
        }
        tmphtml += '<td>'+'<button class="operation-button" id="contact-button" onclick="contactbutton('+tasks[i]['TaskID']+')">客服</button>'+'<button class="operation-button" id="delete-button" onclick="deletebutton('+tasks[i]['TaskID']+')">删除</button>'+'</td>';
        tmphtml += '</tr>';
    }
    tmphtml += '</tbody>';
    document.getElementById("datatable").innerHTML = tmphtml;
    // tasklist_init(tasklist);
}

function deletebutton(taskid){
    console.log(taskid);
}
function contactbutton(taskid){
    console.log(taskid);
}
