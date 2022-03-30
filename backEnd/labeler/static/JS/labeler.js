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
    askfordata({
        "Page": -1,
        "Datatype": [],
        "Labeltype": [],
        "TaskDifficulty": [],
        "Keyword": '',
    });
    $(".checkboxclass").click(function(){
        askfordata(getsss(-1));
    });
});

window.onload=function(){
}

function changepage(page){
    Page = page;
    askfordata(getsss(page));
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
var Tasks = [],
    Page = 0;
const CN = true;

function askfordata(data){
    console.log(data)
    $.ajax({
        url: labeler_url,
        type: "POST",        //请求类型
        data: data,
        // ConvertEmptyStringToNull: false,
        dataType: "json",   // 这里指定了 dateType 为json后，服务端响应的内容为json.dumps(date)，下面 success 的callback 数据无需进行JSON.parse(callback)，已经是一个对象了，如果没有指定dateType则需要执行 JSON.parse(callback)
        success: function (returndata) {
            data_callback(returndata, data["Page"])
        },
        error: function () {
            //当请求错误之后，自动调用
        }
    });
}

function data_callback(data, page){
    const TaskNumOnOnePage = 10;
    // 将data分页
    pagedata = data["DataNumber"];
    taskdata = data['DataList'];
    var tasks = [];
    for(var i = 0; i < taskdata.length; i ++){
        tasks.push(totaskclass(taskdata[i]));
    }
    //更新页码
    if(page == -1){
        pagination = document.getElementById("pagination");
        pagination.setAttribute("size", String(Math.max(1, Math.ceil(pagedata/TaskNumOnOnePage))));
        Page = 0;
        Pagination_init();
    }
    showhtml(tasks);
}

function showhtml(tasks){
    tmphtml = '';
    for(var i = 0; i < tasks.length; i ++){
        tmphtml +=  '<details>'+
                        '<summary>'+
                            '<h3>'+tasks[i].TaskName+'</h3>'+
                            '<span class="tasklabel">'+tasks[i].DataType+'</span>'+
                            '<span class="tasklabel">'+tasks[i].LabelType+'</span>'+
                            '<span class="tasklabel">'+tasks[i].TaskDifficulty+'</span>'+
                            '<span class="taskdeadline">'+String(CN?'截止日期：':'Deadline: ')+tasks[i].TaskDeadline+'</span>'+
                            '<span class="taskpayment">'+'￥'+toprice(tasks[i].Payment)+'</span>'+
                        '</summary>'+
                        '<div class="details-wrapper">'+
                            '<div class="details-styling">'+
                                '<p class="detailtitle">任务类型</p>'+
                                '<p class="detailcontent">'+tasks[i].DataType+'</p>'+
                            '</div>'+
                            '<div class="details-styling">'+
                                '<p class="detailtitle">标注类型</p>'+
                                '<p class="detailcontent">'+tasks[i].LabelType+'</p>'+
                            '</div>'+
                            '<div class="details-styling">'+
                                '<p class="detailtitle">任务难度</p>'+
                                '<p class="detailcontent">'+tasks[i].TaskDifficulty+'</p>'+
                            '</div>'+
                            '<div class="details-styling">'+
                                '<p class="detailtitle">截止日期</p>'+
                                '<p class="detailcontent">'+tasks[i].TaskDeadline+'</p>'+
                            '</div>'+
                            '<div class="details-styling">'+
                                '<p class="detailtitle">薪酬</p>'+
                                '<p class="detailcontent">'+'￥'+tasks[i].Payment+'</p>'+
                            '</div>'+
                            '<div class="details-styling">'+
                                '<p class="detailtitle">标注规则</p>'+
                                '<p class="detailcontent">'+tasks[i].RuleText+'</p>'+
                            '</div>'+
                            '<div class="details-styling">'+
                                '<button type="button" class="dotaskbutton" onclick="dotaskbt('+tasks[i].TaskID+')">开始标注</p>'+
                            '</div>'+
                        '</div>'+
                    '</details>';
    }
    tasklist = document.getElementById("tasks");
    tasklist.innerHTML = tmphtml;
    tasklist_init(tasklist);
}

function dotaskbt(taskid){
    console.log(taskid);
}

function getsss(page){
    var keyword = $("#searchinput").val(),
        datatype = [],
        marktype = [],
        taskdifficulty = [],
        dtc = document.getElementsByName("datatype"),
        mtc = document.getElementsByName("marktype"),
        tdc = document.getElementsByName("taskdifficulty");
    for(var i = 0; i < dtc.length; i ++){
        if(dtc[i].checked){
            datatype.push(dtc[i].value);
        }
    }
    for(var i = 0; i < mtc.length; i ++){
        if(mtc[i].checked){
            marktype.push(mtc[i].value);
        }
    }
    for(var i = 0; i < tdc.length; i ++){
        if(tdc[i].checked){
            taskdifficulty.push(tdc[i].value);
        }
    }
    return {
        "Page": page,
        "Datatype": datatype,
        "Labeltype": marktype,
        "TaskDifficulty": taskdifficulty,
        "Keyword": keyword,
    }
}

function totaskclass(data){
    tmpdata = {};
    tmpdata.TaskID = data["TaskID"];
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
