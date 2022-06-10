
function btsubmit(){
    if(1){
        var radios = document.getElementsByName('colors')
        var form_data = new FormData();
        form_data.append("TaskID"         ,$("#ID0").val());
        form_data.append("ProblemDescription"     ,$("#topic0").val());
        for (var i = 0, length = radios.length; i < length; i++) {
                if (radios[i].checked) {
                    form_data.append("Priority"     ,radios[i].value);
                    break;
                }
            }
        form_data.append('ProblemType'       ,$("#type0").val());
        form_data.append("ProblemDetails"    ,$("#detail0").val());
    }
     $.ajax({
         url: feedback_url,
         type: "POST",        //请求类型
         data: form_data,
         processData: false,
         datatype: "json",
         contentType: false,
         success: function (data) {
             if (data['err'] == 'None') {
                 alert('提交成功！');
             } else {
                 alert(data['err']);
             }
         },
         error: function () {
             //当请求错误之后，自动调用
         }
     });
}

function show_his(){
    $("#SUBHTML").attr("src", fhistory_url);
}

