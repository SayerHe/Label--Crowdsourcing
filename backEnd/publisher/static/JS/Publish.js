window.onload=function(){
    $("#payment").val(calc_recommended_payment(7));
}

$(document).ready(function(){
    $("#deadline").change(function(){
        date = new Date(this.value)
        days = Math.floor((date.getTime() - Date.now())/(24*60*60*1000)+1);
        $("#payment").val(calc_recommended_payment(days));
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

function calc_recommended_payment(days){
    return Math.max(0.5, 100/days/days).toFixed(2)
}

function btsubmit(){
    if(1/*check*/){
        var form_data = new FormData();
        form_data.append('TaskName'     ,$("#taskname").val());
        form_data.append('DataType'     ,$("input[name='datatype']:checked").val());
        form_data.append('LabelType'    ,$("input[name='marktype']:checked").val());
        form_data.append('TaskDeadline' ,$("#deadline")[0].value);
        form_data.append('InspectionMethod'      ,$("input[name='checktype']:checked").val());
        form_data.append('DataFile'     ,$('#datafile')[0].files[0]);
        form_data.append('RuleText'     ,$('#markrules').val());
        // form_data.append('RuleFile'     ,$('#markfile')[0].files[0]);
        $.ajax({
            url: publish_url,
            type: "POST",        //请求类型
            data: form_data,
            processData: false,
            datatype: "json",
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


/**
* 实时动态强制更改用户录入
* arg1 inputObject
**/
function amount(th){
    var regStrs = [
        ['^0(\\d+)$', '$1'], //禁止录入整数部分两位以上，但首位为0
        ['[^\\d\\.]+$', ''], //禁止录入任何非数字和点
        ['\\.(\\d?)\\.+', '.$1'], //禁止录入两个以上的点
        ['^(\\d+\\.\\d{2}).+', '$1'] //禁止录入小数点后两位以上
    ];
    for(var i=0; i<regStrs.length; i++){
        var reg = new RegExp(regStrs[i][0]);
        th.value = th.value.replace(reg, regStrs[i][1]);
    }
}
 
/**
* 录入完成后，输入模式失去焦点后对录入进行判断并强制更改，并对小数点进行0补全
* arg1 inputObject
**/
function overFormat(th){
    var v = th.value;
    if(v === ''){
        v = '0.00';
    }else if(v === '0'){
        v = '0.00';
    }else if(v === '0.'){
        v = '0.00';
    }else if(/^0+\d+\.?\d*.*$/.test(v)){
        v = v.replace(/^0+(\d+\.?\d*).*$/, '$1');
        v = inp.getRightPriceFormat(v).val;
    }else if(/^0\.\d$/.test(v)){
        v = v + '0';
    }else if(!/^\d+\.\d{2}$/.test(v)){
        if(/^\d+\.\d{2}.+/.test(v)){
            v = v.replace(/^(\d+\.\d{2}).*$/, '$1');
        }else if(/^\d+$/.test(v)){
            v = v + '.00';
        }else if(/^\d+\.$/.test(v)){
            v = v + '00';
        }else if(/^\d+\.\d$/.test(v)){
            v = v + '0';
        }else if(/^[^\d]+\d+\.?\d*$/.test(v)){
            v = v.replace(/^[^\d]+(\d+\.?\d*)$/, '$1');
        }else if(/\d+/.test(v)){
            v = v.replace(/^[^\d]*(\d+\.?\d*).*$/, '$1');
            ty = false;
        }else if(/^0+\d+\.?\d*$/.test(v)){
            v = v.replace(/^0+(\d+\.?\d*)$/, '$1');
            ty = false;
        }else{
            v = '0.00';
        }
    }
    th.value = v; 
}
