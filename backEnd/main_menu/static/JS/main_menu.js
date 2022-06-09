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
    "#feedback":Feedback_url,
    "#fhistory":fhistory_url,

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

$(function(){
    $('.lsm-scroll').slimscroll({
        height: 'auto',
        position: 'right',
        railOpacity: 1,
        size: "5px",
        opacity: .4,
        color: '#fffafa',
        wheelStep: 5,
        touchScrollStep: 50
    });
    $('.lsm-container ul ul').css("display", "none");
    // lsm-sidebar收缩展开
    $('.lsm-sidebar a').on('click',function(){
        $('.lsm-scroll').slimscroll({
            height: 'auto',
            position: 'right',
            size: "8px",
            color: '#9ea5ab',
            wheelStep: 5,
            touchScrollStep: 50
        });
        if (!$('.left-side-menu').hasClass('lsm-mini')) {
            $(this).parent("li").siblings("li.lsm-sidebar-item").children('ul').slideUp(200);
            if ($(this).next().css('display') == "none") {
                //展开未展开
                // $('.lsm-sidebar-item').children('ul').slideUp(300);
                $(this).next('ul').slideDown(200);
                $(this).parent('li').addClass('lsm-sidebar-show').siblings('li').removeClass('lsm-sidebar-show');
            }else{
                //收缩已展开
                $(this).next('ul').slideUp(200);
                //$('.lsm-sidebar-item.lsm-sidebar-show').removeClass('lsm-sidebar-show');
                $(this).parent('li').removeClass('lsm-sidebar-show');
            }
        }
    });
    //lsm-mini
    $('.lsm-mini-btn svg').on('click',function(){
        if ($('.lsm-mini-btn input[type="checkbox"]').prop("checked")) {
            $('.lsm-sidebar-item.lsm-sidebar-show').removeClass('lsm-sidebar-show');
            $('.lsm-container ul').removeAttr('style');
            $('.left-side-menu').addClass('lsm-mini');
            $('.left-side-menu').stop().animate({width : 60},200);
        }else{
            $('.left-side-menu').removeClass('lsm-mini');
            $('.lsm-container ul ul').css("display", "none");
            $('.left-side-menu').stop().animate({width: 240},200);
        }

    });

    $(document).on('mouseover','.lsm-mini .lsm-container ul:first>li',function(){
        $(".lsm-popup.third").hide();
        $(".lsm-popup.second").length == 0 && ($(".lsm-container").append("<div class='second lsm-popup lsm-sidebar'><div></div></div>"));
        $(".lsm-popup.second>div").html($(this).html());
        $(".lsm-popup.second").show();
        $(".lsm-popup.third").hide();
        var top = $(this).offset().top;
        var d = $(window).height() - $(".lsm-popup.second>div").height();
        if(d - top <= 0 ){
            top  = d >= 0 ?  d - 8 : 0;
        }
        $(".lsm-popup.second").stop().animate({"top":top}, 100);
    });

    $(document).on('mouseover','.second.lsm-popup.lsm-sidebar > div > ul > li',function(){
        if(!$(this).hasClass("lsm-sidebar-item")){
            $(".lsm-popup.third").hide();
            return;
        }
        $(".lsm-popup.third").length == 0 && ($(".lsm-container").append("<div class='third lsm-popup lsm-sidebar'><div></div></div>"));
        $(".lsm-popup.third>div").html($(this).html());
        $(".lsm-popup.third").show();
        var top = $(this).offset().top;
        var d = $(window).height() - $(".lsm-popup.third").height();
        if(d - top <= 0 ){
            top  = d >= 0 ?  d - 8 : 0;
        }
        $(".lsm-popup.third").stop().animate({"top":top}, 100);
    });

    $(document).on('mouseleave','.lsm-mini .lsm-container ul:first, .lsm-mini .slimScrollBar,.second.lsm-popup ,.third.lsm-popup',function(){
        $(".lsm-popup.second").hide();
        $(".lsm-popup.third").hide();
    });

    $(document).on('mouseover','.lsm-mini .slimScrollBar,.second.lsm-popup',function(){
        $(".lsm-popup.second").show();
    });
    $(document).on('mouseover','.third.lsm-popup',function(){
        $(".lsm-popup.second").show();
        $(".lsm-popup.third").show();
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