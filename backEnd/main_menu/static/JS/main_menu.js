var _active = null;
window.onload=function(){
    menu_init(null);
}

var urls = {
    "#Publish":publish_url,
    "#T_Doing":user_url,
    "#T_Finished":user_url,
    "#Annotation":user_url,
    "#Account":user_url,
};

$(document).ready(function(){
    window.addEventListener("popstate", menu_init, false);
    $(".menubt").click(function(event){
        event.preventDefault();
        tmp = this.getBoundingClientRect();
        mact = document.getElementById("menu_active").getBoundingClientRect();
        matop = tmp.top-(mact.height-tmp.height)/2+"px";
        $("#menu_active").animate({top:matop}, 300);
        $(_active).css("pointer-events", "auto");
        $(_active+' a').css("color", "black");
        _active = "#"+this.id;
        $(_active).css("pointer-events", "none");
        $(_active+' a').css("color", "darkcyan");
        $("#SUBHTML").attr("src", urls[_active]);
        window.history.pushState(
            {'active':this.id},
            document.title,
            main_menu_url+this.id+'/'
        );
    });
});

function menu_init(e){
    if(e && e.state && e.state.hasOwnProperty('active')){
        APPName = e.state.active;
    }
    if(!APPName) {APPName = 'Publish';}
    document.getElementById("UserName").innerHTML = UserName;
    tmp = document.getElementById(APPName).getBoundingClientRect();
    mact = document.getElementById("menu_active");
    mact.style.top = tmp.top-(mact.getBoundingClientRect().height-tmp.height)/2+"px";
    if(_active){
        $(_active).css("pointer-events", "auto")
    }
    _active = "#"+APPName;
    $(_active).css("pointer-events", "none");
    $(_active+' a').css("color", "darkcyan");
    $("#SUBHTML").attr("src", urls[_active]+Params);
}

function Logout(){
    if(confirm('确认退出登录？')){
        console.log(1)
        $.ajax({
            url: main_menu_url,
            type: "POST",        //请求类型
            data: {"instruction":"Logout"},
            dataType: "json",   // 这里指定了 dateType 为json后，服务端响应的内容为json.dumps(date)，下面 success 的callback 数据无需进行JSON.parse(callback)，已经是一个对象了，如果没有指定dateType则需要执行 JSON.parse(callback)
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