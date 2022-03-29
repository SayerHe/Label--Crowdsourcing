var verylongstring = "helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld "
+"helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld "
var testdata = [
    {"TaskName":"标注任务a标注任务a标注任务a标注任务a", "TaskDifficulty":"easy",        "DataType":"text",    "LabelType":"score",      "TaskDeadline":"2022/04/01", "Payment":10.35,   "RuleText":verylongstring},
    {"TaskName":"标注任务b标注任务b标注任务b标注任务b", "TaskDifficulty":"medium",      "DataType":"image",   "LabelType":"classify",   "TaskDeadline":"2022/04/01", "Payment":5.99,    "RuleText":"helloworld"},
    {"TaskName":"标注任务c标注任务c标注任务c标注任务c", "TaskDifficulty":"difficult",   "DataType":"audio",   "LabelType":"describe",   "TaskDeadline":"2022/04/01", "Payment":20,      "RuleText":"helloworld"},
    {"TaskName":"标注任务d标注任务d标注任务d标注任务d", "TaskDifficulty":"easy",        "DataType":"video",   "LabelType":"score",      "TaskDeadline":"2022/04/01", "Payment":10,      "RuleText":"helloworld"},
    {"TaskName":"标注任务e标注任务e标注任务e标注任务e", "TaskDifficulty":"easy",        "DataType":"text",    "LabelType":"score",      "TaskDeadline":"2022/04/01", "Payment":10,      "RuleText":"helloworld"},
    {"TaskName":"标注任务f标注任务f标注任务f标注任务f", "TaskDifficulty":"easy",        "DataType":"text",    "LabelType":"score",      "TaskDeadline":"2022/04/01", "Payment":10,      "RuleText":"helloworld"},
    {"TaskName":"标注任务g标注任务g标注任务g标注任务g", "TaskDifficulty":"easy",        "DataType":"text",    "LabelType":"score",      "TaskDeadline":"2022/04/01", "Payment":10,      "RuleText":"helloworld"},
    {"TaskName":"标注任务h标注任务h标注任务h标注任务h", "TaskDifficulty":"easy",        "DataType":"text",    "LabelType":"score",      "TaskDeadline":"2022/04/01", "Payment":10,      "RuleText":"helloworld"},
    {"TaskName":"标注任务a标注任务a标注任务a标注任务a", "TaskDifficulty":"easy",        "DataType":"text",    "LabelType":"score",      "TaskDeadline":"2022/04/01", "Payment":10,      "RuleText":"helloworld"},
    {"TaskName":"标注任务b标注任务b标注任务b标注任务b", "TaskDifficulty":"easy",        "DataType":"image",   "LabelType":"classify",   "TaskDeadline":"2022/04/01", "Payment":5,       "RuleText":"helloworld"},
    {"TaskName":"标注任务c标注任务c标注任务c标注任务c", "TaskDifficulty":"easy",        "DataType":"audio",   "LabelType":"describe",   "TaskDeadline":"2022/04/01", "Payment":20,      "RuleText":"helloworld"},
    {"TaskName":"标注任务d标注任务d标注任务d标注任务d", "TaskDifficulty":"easy",        "DataType":"video",   "LabelType":"score",      "TaskDeadline":"2022/04/01", "Payment":10,      "RuleText":"helloworld"},
    {"TaskName":"标注任务e标注任务e标注任务e标注任务e", "TaskDifficulty":"easy",        "DataType":"text",    "LabelType":"score",      "TaskDeadline":"2022/04/01", "Payment":10,      "RuleText":"helloworld"},
    {"TaskName":"标注任务f标注任务f标注任务f标注任务f", "TaskDifficulty":"easy",        "DataType":"text",    "LabelType":"score",      "TaskDeadline":"2022/04/01", "Payment":10,      "RuleText":"helloworld"},
    {"TaskName":"标注任务g标注任务g标注任务g标注任务g", "TaskDifficulty":"easy",        "DataType":"text",    "LabelType":"score",      "TaskDeadline":"2022/04/01", "Payment":10,      "RuleText":"helloworld"},
    {"TaskName":"标注任务h标注任务h标注任务h标注任务h", "TaskDifficulty":"easy",        "DataType":"text",    "LabelType":"score",      "TaskDeadline":"2022/04/01", "Payment":10,      "RuleText":"helloworld"},
    {"TaskName":"标注任务a标注任务a标注任务a标注任务a", "TaskDifficulty":"easy",        "DataType":"text",    "LabelType":"score",      "TaskDeadline":"2022/04/01", "Payment":10,      "RuleText":"helloworld"},
    {"TaskName":"标注任务b标注任务b标注任务b标注任务b", "TaskDifficulty":"easy",        "DataType":"image",   "LabelType":"classify",   "TaskDeadline":"2022/04/01", "Payment":5,       "RuleText":"helloworld"},
    {"TaskName":"标注任务c标注任务c标注任务c标注任务c", "TaskDifficulty":"easy",        "DataType":"audio",   "LabelType":"describe",   "TaskDeadline":"2022/04/01", "Payment":20,      "RuleText":"helloworld"},
    {"TaskName":"标注任务d标注任务d标注任务d标注任务d", "TaskDifficulty":"easy",        "DataType":"video",   "LabelType":"score",      "TaskDeadline":"2022/04/01", "Payment":10,      "RuleText":"helloworld"},
    {"TaskName":"标注任务e标注任务e标注任务e标注任务e", "TaskDifficulty":"easy",        "DataType":"text",    "LabelType":"score",      "TaskDeadline":"2022/04/01", "Payment":10,      "RuleText":"helloworld"},
    {"TaskName":"标注任务f标注任务f标注任务f标注任务f", "TaskDifficulty":"easy",        "DataType":"text",    "LabelType":"score",      "TaskDeadline":"2022/04/01", "Payment":10,      "RuleText":"helloworld"},
    {"TaskName":"标注任务g标注任务g标注任务g标注任务g", "TaskDifficulty":"easy",        "DataType":"text",    "LabelType":"score",      "TaskDeadline":"2022/04/01", "Payment":10,      "RuleText":"helloworld"},
    {"TaskName":"标注任务h标注任务h标注任务h标注任务h", "TaskDifficulty":"easy",        "DataType":"text",    "LabelType":"score",      "TaskDeadline":"2022/04/01", "Payment":10,      "RuleText":"helloworld"},
    {"TaskName":"标注任务h标注任务h标注任务h标注任务h", "TaskDifficulty":"easy",        "DataType":"text",    "LabelType":"score",      "TaskDeadline":"2022/04/01", "Payment":10,      "RuleText":"helloworld"},
]

$(document).ready(function(){
    askfordata();
    //data_callback(testdata);
});

window.onload=function(){
}
const DTC = {
    "text":"文本",
    "image":"图像",
    "audio":"音频",
    "video":"视频",
},
LTC = {
    "score":"打分",
    "classify":"分类",
    "describe":"描述",
},
TDC = {
    "easy":"简单",
    "medium":"中等",
    "difficult":"复杂",
};
var AllTasks = [], 
    CN = true;
function data_callback(data){
    // 将data分页
    const TaskNumOnOnePage = 10;
    for(var i = 0, t = 0; t < data.length; i ++){
        AllTasks.push([]);
        for(var j = 0; j < TaskNumOnOnePage && t < data.length; j ++, t ++){
            AllTasks[i].push(totaskclass(data[t]));
        }
    }
    //设置页码模块页数
    pagination = document.getElementById("pagination");
    pagination.setAttribute("size", String(AllTasks.length));
    changepage(1);
    Pagination_init()
    //显示第一页内容
}

function askfordata(){
    $.ajax({
        url: labeler_url,
        type: "POST",        //请求类型
        data: {"data":"data"},
        dataType: "json",   // 这里指定了 dateType 为json后，服务端响应的内容为json.dumps(date)，下面 success 的callback 数据无需进行JSON.parse(callback)，已经是一个对象了，如果没有指定dateType则需要执行 JSON.parse(callback)
        success: function (data) {
            data_callback(data["DataList"])
        },
        error: function () {
            //当请求错误之后，自动调用
        }
    });
}

function changepage(page){
    var Tasks = AllTasks[page - 1],
        tmphtml = '';
    for(var i = 0; i < Tasks.length; i ++){
        tmphtml +=  '<details>'+
                        '<summary>'+
                            '<h3>'+Tasks[i].TaskName+'</h3>'+
                            '<span class="tasklabel">'+Tasks[i].DataType+'</span>'+
                            '<span class="tasklabel">'+Tasks[i].LabelType+'</span>'+
                            '<span class="tasklabel">'+Tasks[i].TaskDifficulty+'</span>'+
                            '<span class="taskdeadline">'+String(CN?'截止日期：':'Deadline: ')+Tasks[i].TaskDeadline+'</span>'+
                            '<span class="taskpayment">'+'￥'+toprice(Tasks[i].Payment)+'</span>'+
                        '</summary>'+
                        '<div class="details-wrapper">'+
                            '<div class="details-styling">'+
                                '<p class="detailtitle">任务类型</p>'+
                                '<p class="detailcontent">'+Tasks[i].DataType+'</p>'+
                            '</div>'+
                            '<div class="details-styling">'+
                                '<p class="detailtitle">标注类型</p>'+
                                '<p class="detailcontent">'+Tasks[i].LabelType+'</p>'+
                            '</div>'+
                            '<div class="details-styling">'+
                                '<p class="detailtitle">任务复杂度</p>'+
                                '<p class="detailcontent">'+Tasks[i].TaskDifficulty+'</p>'+
                            '</div>'+
                            '<div class="details-styling">'+
                                '<p class="detailtitle">截止日期</p>'+
                                '<p class="detailcontent">'+Tasks[i].TaskDeadline+'</p>'+
                            '</div>'+
                            '<div class="details-styling">'+
                                '<p class="detailtitle">薪酬</p>'+
                                '<p class="detailcontent">'+'￥'+Tasks[i].Payment+'</p>'+
                            '</div>'+
                            '<div class="details-styling">'+
                                '<p class="detailtitle">标注规则</p>'+
                                '<p class="detailcontent">'+Tasks[i].RuleText+'</p>'+
                            '</div>'+
                            '<div class="details-styling">'+
                                '<button type="button" class="dotaskbutton" onclick="dotaskbt()">标注规则</p>'+
                            '</div>'+
                        '</div>'+
                    '</details>';
    }
    tasklist = document.getElementById("tasks");
    tasklist.innerHTML = tmphtml;
    tasklist_init(tasklist);
}

function dotaskbt(){
    
}

function totaskclass(data){
    tmpdata = {};
    tmpdata.TaskName = data["TaskName"];
    tmpdata.DataType = String(CN?DTC[data["DataType"].toLowerCase()]:data["DataType"]);
    tmpdata.LabelType = String(CN?LTC[data["LabelType"].toLowerCase()]:data["LabelType"]);
    tmpdata.TaskDifficulty = String(CN?TDC[data["TaskDifficulty"].toLowerCase()]:data["TaskDifficulty"]);
    tmpdata.TaskDeadline = data["TaskDeadline"];
    tmpdata.Payment = data["Payment"];
    tmpdata.RuleText = data["RuleText"];
    return tmpdata;
}

function toprice(num){
    num_int = parseInt(num);
    num_float = parseInt((num-num_int+0.001)*100);
    num_float = ('0'+num_float).slice(-2);
    return num_int+'<span class="lower">.'+num_float+'</span>';
}
