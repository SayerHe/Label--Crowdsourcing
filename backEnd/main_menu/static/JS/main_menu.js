var _active = null;
window.onload=function(){
    menu_init(null);
}

var urls = {
    "#Homepage":labeler_url,
    "#Publish":publisher_url,
    "#T_Doing":check_url,
    "#T_Finished":history_url,
    "#Center":Center_url,
    "#C":account_url,
    "#feedback":Feedback_url

};

$(document).ready(function(){
    window.addEventListener("popstate", menu_init, false);
    $(".menubt").click(function(event){
        event.preventDefault();
        // tmp = this.getBoundingClientRect();
        // mact = document.getElementById("menu_active").getBoundingClientRect();
        // matop = tmp.top-(mact.height-tmp.height)/2+"px";
        // $("#menu_active").animate({top:matop}, 300);
        $(_active).css("pointer-events", "auto");
        $(_active+' a').css("color", "#3a3a3a");
        $(_active+' svg').css("stroke", "#3a3a3a");
        _active = "#"+this.id;
        $(_active).css("pointer-events", "none");
        $(_active+' a').css("color", "darkcyan");
        $(_active+' svg').css("stroke", "darkcyan");
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
    if(!APPName) {APPName = 'Homepage';}
    document.getElementById("UserName").innerHTML = UserName;
    tmp = document.getElementById(APPName).getBoundingClientRect();
    // mact = document.getElementById("menu_active");
    // mact.style.top = tmp.top-(mact.getBoundingClientRect().height-tmp.height)/2+"px";
    if(_active){
        $(_active).css("pointer-events", "auto")
    }
    _active = "#"+APPName;
    $(_active).css("pointer-events", "none");
    $(_active+' a').css("color", "darkcyan");
    $(_active+' svg').css("stroke", "darkcyan");
    $("#SUBHTML").attr("src", urls[_active]+Params);
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

function manage_acc(){
     $("#SUBHTML").attr("src", account_url);
}