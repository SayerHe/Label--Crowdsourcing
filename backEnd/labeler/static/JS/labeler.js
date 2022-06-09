$(document).ready(function(){
    $(".checkboxclass").click(function(){
        askfordata(getsss(1));
    });
    $("#searchsubmit").click(function(){
        askfordata(getsss(1));
    })
    $("input").keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13')
        {
            askfordata(getsss(1));
        }
    })
});

window.onload=function(){
    askfordata(StringToData(document.location.search));
    // document.getElementById("UserName").innerHTML = UserName;
}

function changepage(page){
    askfordata(getsss(page));
    $("html,body").animate({
        scrollTop: "0px"
    }, 100);
}

const DTC = {
    "text":"文本",
    "table":"表格",
    "image":"图像",
    "audio":"音频",
    "video":"视频",
},
LTC = {
    "describe":"描述",
    "choose":"选择",
    "frame":"框选",
},
TDC = {
    "easy":"简单",
    "medium":"中等",
    "difficult":"复杂",
};
var Tasks = [],
    Page = 1;
const CN = true;

function askfordata(data){
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
    const TaskNumOnOnePage = 10;
    // 将data分页
    pagedata = Math.max(1, Math.ceil(data["DataNumber"]/TaskNumOnOnePage));
    taskdata = data['DataList'];
    var tasks = [];
    for(var i = 0; i < taskdata.length; i ++){
        tasks.push(totaskclass(taskdata[i]));
    }
    //更新页码
    if(pagedata != document.getElementById("pagination").getAttribute("size")){
        pagination = document.getElementById("pagination");
        pagination.setAttribute("size", pagedata);
        pagination.setAttribute("page", Page);
        Pagination_init();
    }
    showhtml(tasks);
}

function showhtml(tasks){
    tmphtml = '';
    for(var i = 0; i < tasks.length; i ++){
        if(tasks[i].RuleText.length > 200){
            tasks[i].RuleText = tasks[i].RuleText.substring(0, 200) + '...';
        }
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
                                '<button type="button" class="dotaskbutton" onclick="dotaskbt('+tasks[i].TaskID+','+tasks[i].BatchID+')">开始标注</p>'+
                            '</div>'+
                        '</div>'+
                    '</details>';
    }
    tasklist = document.getElementById("tasks");
    tasklist.innerHTML = tmphtml;
    tasklist_init(tasklist);
}

function dotaskbt(taskid, batchid){
    // console.log(taskid);
    // window.open(label_url+'?TaskID='+taskid+'&DataNum=3');
    $.ajax({
        url: labeler_url,
        type: "POST",        //请求类型
        data: {'TaskID':taskid, 'BatchID':batchid},
        // ConvertEmptyStringToNull: false,
        dataType: "json",   // 这里指定了 dateType 为json后，服务端响应的内容为json.dumps(date)，下面 success 的callback 数据无需进行JSON.parse(callback)，已经是一个对象了，如果没有指定dateType则需要执行 JSON.parse(callback)
        success: function (returndata) {
            console.log(returndata)
        },
        error: function () {
            //当请求错误之后，自动调用
        }
    });
}

function getsss(page){
    var keyword = $("#searchinput").val(),
        datatype = 0,
        marktype = 0,
        taskdifficulty = 0,
        dtc = document.getElementsByName("datatype"),
        mtc = document.getElementsByName("marktype"),
        tdc = document.getElementsByName("taskdifficulty");
    for(var i = 0; i < dtc.length; i ++){
        if(dtc[i].checked){
            datatype |= (1<<i);
        }
    }
    for(var i = 0; i < mtc.length; i ++){
        if(mtc[i].checked){
            marktype |= (1<<i);
        }
    }
    for(var i = 0; i < tdc.length; i ++){
        if(tdc[i].checked){
            taskdifficulty |= (1<<i);
        }
    }
    page &= (1<<8)-1;
    Page = page;
    select = ('00000000'+((page<<24) | (taskdifficulty<<16) | (marktype<<8) | datatype).toString(16)).slice(-8);
    var data = {'RequestData':true};
    if(select != '01000000'){
        data['Select'] = select;
    }
    if(keyword != ''){
        data['Keyword'] = keyword;
    }
    return data;
}
function initsss(data){
    if('Keyword' in data){
        $("#searchinput").val(data['Keyword']);
    }
    if('Select' in data){
        t = parseInt(data['Select'], 16);
        datatype = t & ((1<<8)-1);
        t >>= 8;
        marktype = t & ((1<<8)-1);
        t >>= 8;
        taskdifficulty = t & ((1<<8)-1);
        t >>= 8;
        Page = t & ((1<<8)-1);
        dtc = document.getElementsByName("datatype"),
        mtc = document.getElementsByName("marktype"),
        tdc = document.getElementsByName("taskdifficulty");
        for(var i = 0; i < dtc.length; i ++){
            if(datatype & (1<<i)){
                dtc[i].checked = true;
            }
        }
        for(var i = 0; i < mtc.length; i ++){
            if(marktype & (1<<i)){
                mtc[i].checked = true;
            }
        }
        for(var i = 0; i < tdc.length; i ++){
            if(taskdifficulty & (1<<i)){
                tdc[i].checked = true;
            }
        }
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
    tmpdata.BatchID = data["BatchID"];
    return tmpdata;
}

function toprice(num){
    num_int = parseInt(num);
    num_float = parseInt((num-num_int+0.001)*100);
    num_float = ('0'+num_float).slice(-2);
    return num_int+'<span class="lower">.'+num_float+'</span>';
}

function StringToData(urlString){
    var data = {'RequestData':true};
    if (urlString && urlString != '?=') {
        params = urlString.substring(1).split('&amp;');
        for(var x in params){
            k = params[x].indexOf('=');
            data[params[x].substring(0, k)] = params[x].substring(k+1);
        }
    }
    initsss(data);
    return data;
}
function DataToString(data){
    var datastring = '?',
        keys = Object.keys(data),
        len_1 = keys.length-1;
    if(len_1 <= 0){
        return '';
    }
    // console.log(data)
    for(var i = 1; i < len_1; i ++){
        datastring += keys[i]+'='+data[keys[i]]+'&';
    }
    datastring += keys[len_1]+'='+data[keys[len_1]];
    return datastring;
}

function Logout(){
    if(confirm('确认退出登录？')){
        console.log(1)
        $.ajax({
            url: main_menu_url,
            type: "POST",
            data: {"instruction":"Logout"},
            dataType: "json",
            success: function (callback) {
                if(callback['err'] == 'None'){
                    window.location.href = login_url;
                }
            },
            error: function () {
                //当请求错误之后，自动调用
            }
        });
    }
}