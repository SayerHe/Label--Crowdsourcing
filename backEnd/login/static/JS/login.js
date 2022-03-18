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
function check_userform()
{
    var temp=document.createElement("form");
    temp.method="post";
    temp.style.display="none";
    
    var usn = document.createElement("textarea");
    usn.name = 'username';
    usn.value = $("#username").val();
    var psd = document.createElement("textarea");
    psd.name = 'password';
    psd.value = $("#password").val();
    temp.appendChild(usn);
    temp.appendChild(psd);

    document.body.appendChild(temp);
    //temp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    temp.submit();
    return temp;
}