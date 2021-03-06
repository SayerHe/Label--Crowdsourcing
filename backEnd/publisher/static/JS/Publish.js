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
    $("#choicesfiletext").click(function(){
        $("#choicesfile").trigger('click');
    });
    $("#choicesfile").change(function(){
        $("#choicesfiletext").val($(this).val());
    });
    // $("#answerfiletext").click(function(){
    //     $("#answerfile").trigger('click');
    // });
    // $("#answerfile").change(function(){
    //     $("#answerfiletext").val($(this).val());
    // });
    $("input[name='datatype']").change(function(){
        if(this.value == 'text' || this.value == 'image'){
            $("#label_frame").css('display', 'flex');
        }
        else{
            if($("input[name='marktype']:checked").val() == 'frame'){
                document.getElementById("label-0").checked = true;
            }
            $("#label_frame").css('display', 'none');
        }
    })
    $("input[name='marktype']").change(function(){
        if(this.value == 'choose'){
            $("#choices_div").css('display', 'block');
        }
        else{
            $("#choices_div").css('display', 'none');
        }
    })
    // $("input[name='checktype']").change(function(){
    //     if(this.value == 'sampling'){
    //         $("#answer_div").css('display', 'block');
    //     }
    //     else{
    //         $("#answer_div").css('display', 'none');
    //     }
    // })
});

function calc_recommended_payment(days){
    return Math.max(0.5, 100/days/days).toFixed(2)
}

function btsubmit(){
    if(1/*check*/){
        var form_data = new FormData();
        form_data.append('TaskName'         ,$("#taskname").val());
        form_data.append('DataType'         ,$("input[name='datatype']:checked").val());
        form_data.append('LabelType'        ,$("input[name='marktype']:checked").val());
        form_data.append('TaskDeadline'     ,$("#deadline")[0].value);
        form_data.append('InspectionMethod' ,$("input[name='checktype']:checked").val());
        form_data.append('DataFile'         ,$('#datafile')[0].files[0]);
        form_data.append('RuleText'         ,$('#markrules').val());
        if($("input[name='marktype']:checked").val() == 'choose'){
            form_data.append('ChoiceFile', $('#choicesfile')[0].files[0]);
        }
        // form_data.append('RuleFile'     ,$('#markfile')[0].files[0]);
        $.ajax({
            url: publish_url,
            type: "POST",        //????????????
            data: form_data,
            processData: false,
            datatype: "json",
            contentType: false,
            success: function (data) {
                if(data['err'] == 'None'){
                    alert('???????????????');
                }
                else{
                    alert(data['err']);
                }
            },
            error: function () {
                //????????????????????????????????????
            }
        });
    }
    else{
        //????????????
    }
}


/**
* ????????????????????????????????????
* arg1 inputObject
**/
function amount(th){
    var regStrs = [
        ['^0(\\d+)$', '$1'], //???????????????????????????????????????????????????0
        ['[^\\d\\.]+$', ''], //?????????????????????????????????
        ['\\.(\\d?)\\.+', '.$1'], //??????????????????????????????
        ['^(\\d+\\.\\d{2}).+', '$1'] //????????????????????????????????????
    ];
    for(var i=0; i<regStrs.length; i++){
        var reg = new RegExp(regStrs[i][0]);
        th.value = th.value.replace(reg, regStrs[i][1]);
    }
}
 
/**
* ?????????????????????????????????????????????????????????????????????????????????????????????????????????0??????
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
