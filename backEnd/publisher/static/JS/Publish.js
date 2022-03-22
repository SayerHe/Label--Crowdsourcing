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
        var form_data = new FormData();
        form_data.append('TaskName'     ,$("#taskname").val());
        form_data.append('DataType'     ,$("input[name='datatype']:checked").val());
        form_data.append('LabelType'    ,$("input[name='marktype']:checked").val());
        form_data.append('TaskDeadline' ,$("#deadline").val());
        form_data.append('Payment'      ,$("#payment").val());
        form_data.append('DataFile'     ,$('#datafile')[0].files[0]);
        form_data.append('RuleFile'     ,$('#markfile')[0].files[0]);
        $.ajax({
            url: publish_url,
            type: "POST",        //请求类型
            data: form_data,
            // processData: false,
            contentType: false,
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
