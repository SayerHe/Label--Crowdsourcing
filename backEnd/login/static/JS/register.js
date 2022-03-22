$(document).ready(function(){
    $("#submit").click(function(){
        check_userform()
    });
    $("input").keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13')
        {
            check_userform()
        }
    })
    $("#eyes").click(function(){
        var input = document.getElementById('password')
        var imgs = document.getElementById('eyes');
        console.log(1)
        //下面是一个判断每次点击的效果
        if (input.type == 'password') {
            input.type = 'text';
            imgs.src = show_img;//睁眼图
        } else {
            input.type = 'password';
            imgs.src = hide_img;//闭眼图
        }
    });
});
function userform_callback(err)
{
    //console.log(err)
    if(err == "None"){
        alert("Successfully Registered");
        window.location.href = login_url;
    }
    else if(err == "Email_repeat"){
        alert("Email Repeat");
    }
    else if(err == "Username_repeat"){
        alert("UserName Repeat");
    }
    else if(err == "Email_empty"){
        alert("Email cannot be empty");
    }
    else if(err == "Username_empty"){
        alert("UserName cannot be empty");
    }
    else if(err == "Username_format"){
        alert("UserName can only contain Chinese and English, numbers and '_'");
    }
    else if(err == "Password_wrong"){
        alert("Password and confirm password do not match");
    }
}
function check_userform()
{
    if($("#Email").val() == ''){
        userform_callback("Email_empty")
    }
    else if($("#UserName").val() == ''){
        userform_callback("Username_empty")
    }
    else if($("#UserName").val().indexOf("@") != -1){
        userform_callback("Username_format")
    }
    else if($("#Password").val() != $("#confirm_password").val()){    
        userform_callback("Password_wrong")
    }
    else{
        $.ajax({
            url: userform_url,
            type: "POST",        //请求类型
            data: {"username":$("#UserName").val(), "email":$("#Email").val(), "password":$("#Password").val()},
            dataType: "json",   // 这里指定了 dateType 为json后，服务端响应的内容为json.dumps(date)，下面 success 的callback 数据无需进行JSON.parse(callback)，已经是一个对象了，如果没有指定dateType则需要执行 JSON.parse(callback)
            success: function (callback) {
                userform_callback(callback['err'])
            },
            error: function () {
                //当请求错误之后，自动调用
            }
        });
    }
}