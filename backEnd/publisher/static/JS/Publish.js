window.onload=function(){
    var date = new Date(Date.now() + 1*24*60*60*1000);
    mindate = date.getFullYear()+'-'+String(date.getMonth()+1).padStart(2, '0')+'-'+date.getDate()
    var date = new Date(Date.now() + 90*24*60*60*1000);
    maxdate = date.getFullYear()+'-'+String(date.getMonth()+1).padStart(2, '0')+'-'+date.getDate()
    var date = new Date(Date.now() + 7*24*60*60*1000);
    middate = date.getFullYear()+'-'+String(date.getMonth()+1).padStart(2, '0')+'-'+date.getDate()
    ddl = document.getElementById("deadline")
    ddl.setAttribute("min",mindate);
    ddl.setAttribute("max",maxdate);
    ddl.setAttribute("value",middate);
    $("#payment").val(Math.max(1, Math.round(100/7/7)));
}

$(document).ready(function(){
    $("#deadline").change(function(){
        date = new Date($("#deadline").val());
        days = Math.floor((date.valueOf() - Date.now())/(24*60*60*1000)+1);
        $("#payment").val(Math.max(1, Math.round(100/days/days)));
    });

    $("#datafiletext").click(function(){
        $("#datafile").trigger('click');
    });
    $("#datafile").change(function(){
        $("#datafiletext").val($(this).val());
    });
    $("#markfiletext").click(function(){
        $("#markfile").trigger('click');
    });
    $("#markfile").change(function(){
        $("#markfiletext").val($(this).val());
    });

});

function btsubmit(){
    if(1/*check*/){
    $.ajax({
            url: publish_url,
            type: "POST",        //请求类型
            data: {
                "TaskName" : $("#taskname").val(),
                "DataType" : $("input[name='datatype']:checked").val(),
                "LabelType" : $("input[name='marktype']:checked").val(),
                "TaskDeadline" : $("#deadline").val(),
                "Payment"  : $("#payment").val(),
                "DataFile" : $('#datafile')[0].files[0],
                "RuleFile" : $('#markfile')[0].files[0],
            },
            dataType: "json",   // 这里指定了 dateType 为json后，服务端响应的内容为json.dumps(date)，下面 success 的callback 数据无需进行JSON.parse(callback)，已经是一个对象了，如果没有指定dateType则需要执行 JSON.parse(callback)
            success: function (data) {
                console.log(data)
            },
            error: function () {
                //当请求错误之后，自动调用
            }
        });
    }
    else{
        //提示错误
    }
}
