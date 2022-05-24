$(document).ready(function(){
    $("#submit").click(function(){
        check_userform();
    });
    $("input").keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13')
        {
            check_userform();
        }
    })
    $("#eyes").click(function(){
        var input = document.getElementById("Password")
        var imgs = document.getElementById('eyes');
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
function userform_callback(res)
{
    console.log(res)
    if(res == "None"){
        window.location.href = main_menu_url;
    }
    else if(res == "publisher"){
        //alert("Successfully Login");
        window.location.href = main_menu_url;
    }
    else if(res == "labeler"){
        window.location.href = labeler_url;
    }
    else if(res == "Username_empty"){
        alert("UserName Cannot Be Empty");
    }
    else if(res == "Password_wrong"){
        alert("Wrong Password");
    }
    else if(res == "UserDoesNotExist"){
        alert("User Does Not Exist");
    }
}
function check_userform()
{
    if($("#UserName").val() == ''){
        userform_callback("Username_empty");
    }
    else{
        $.ajax({
            url: login_url,
            type: "POST",        //请求类型
            data: {"username":$("#UserName").val(), "password":$("#Password").val()},
            // dataType: "json",   // 这里指定了 dateType 为json后，服务端响应的内容为json.dumps(date)，下面 success 的callback 数据无需进行JSON.parse(callback)，已经是一个对象了，如果没有指定dateType则需要执行 JSON.parse(callback)
            success: function (callback) {
                userform_callback(callback["res"])
            },
            error: function () {
                //当请求错误之后，自动调用
            }
        });
    }
}