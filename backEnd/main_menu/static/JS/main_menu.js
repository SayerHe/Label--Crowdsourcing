const mini_width = 60, menu_width = 240;
window.onload=function(){
}

var urls = {
    "TaskList":labeler_url,
    "Publish":publisher_url,
    "History":history_url,
    "Center":Center_url,
    "Check":check_url,
    "Account":account_url,
    "Feedback":feedback_url,
    "FHistory":fhistory_url,
    "Doing":history_url,
    "Detail":detail_url,
};

$(document).ready(function(){
    window.addEventListener("popstate", menu_init, false);
    menu_init(null);
    // $('.lsm-sidebar a').click(function(){
    //     $("#SUBHTML").attr("src", urls[this.getAttribute('id')]);
    // });
    // $(".menubt").click(function(event){
    //     event.preventDefault();
    //     // tmp = this.getBoundingClientRect();
    //     // mact = document.getElementById("menu_active").getBoundingClientRect();
    //     // matop = tmp.top-(mact.height-tmp.height)/2+"px";
    //     // $("#menu_active").animate({top:matop}, 300);
    //     $(_active).css("pointer-events", "auto");
    //     $(_active+' a').css("color", "#3a3a3a");
    //     $(_active+' svg').css("stroke", "#3a3a3a");
    //     _active = "#"+this.id;
    //     $(_active).css("pointer-events", "none");
    //     $(_active+' a').css("color", "darkcyan");
    //     $(_active+' svg').css("stroke", "darkcyan");
    //     $("#SUBHTML").attr("src", urls[_active]);
    //     window.history.pushState(
    //         {'active':this.id},
    //         document.title,
    //         main_menu_url+this.id+'/'
    //     );
    // });
});

$(function(){
    var mini_icon = null;
    $('.lsm-container ul ul').css("display", "none");

    $('.lsm-sidebar a').on('click',a_onclick);

    function a_onclick(){
        if (!$('.left-side-menu').hasClass('lsm-mini')) {
            $(this).parent("li").siblings("li.lsm-sidebar-item").children('ul').slideUp(200);
            if($(this).next().length > 0){
                if($(this).next().css('display') == "none") {
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
            else{
                tmp = $(this).parent("li").siblings("li.lsm-sidebar-show");
                if(tmp.length>0 && ($(this).parent().parent().parent('li').length==0 || tmp[0] != $(this).parent().parent().parent('li')[0])){
                    tmp.removeClass('lsm-sidebar-show');
                    tmp.children('ul').slideUp(200);
                }
                $('.active').removeClass('active');
                $(this).addClass('active');
                switchpage(this.id);
            }
        }
        else{
            if($(this).next().length == 0){
                $('.lsm-sidebar-show').removeClass('lsm-sidebar-show');
                mini_icon.addClass('lsm-sidebar-show');
                switchpage(this.id);
            }
        }
    }

    //lsm-mini
    $('.lsm-mini-btn svg').on('click',function(){
        if ($('.lsm-mini-btn input[type="checkbox"]').prop("checked")) {
            $('.lsm-sidebar-item.lsm-sidebar-show').removeClass('lsm-sidebar-show');
            $('.lsm-container ul').removeAttr('style');
            $('.left-side-menu').addClass('lsm-mini');
            $('.left-side-menu').stop().animate({width : mini_width},200);
            $('#SUBHTML').addClass('minimenu');
            tmp = $('.active').parent().parent().parent('li');
            if(tmp.length > 0){
                tmp.addClass('lsm-sidebar-show');
            }
            else{
                $('.active').parent('li').addClass('lsm-sidebar-show');
            }
            $('.active').removeClass('active');
        }else{
            $('.left-side-menu').removeClass('lsm-mini');
            $('.lsm-container ul ul').css("display", "none");
            $('.left-side-menu').stop().animate({width: menu_width},200);
            $('#SUBHTML').removeClass('minimenu');
        }

    });

    $(document).on('mouseover','.lsm-mini .lsm-container ul:first>li',function(){
        // $(".lsm-popup.second").length == 0 && (console.log(11));
        mini_icon = $(this);
        $(".lsm-popup.second").length == 0 && ($(".lsm-container").append("<div class='second lsm-popup lsm-sidebar'><div></div></div>"));
        $(".lsm-popup.second>div").html($(this).html());
        var top = $(this).offset().top - 72;
        var d = $(window).height() - $(".lsm-popup.second>div").height();
        if(d - top <= 0 ){
            top  = d >= 0 ?  d - 8 : 0;
        }
        $(".lsm-popup.second").stop().animate({"top":top}, 100);
        $(".lsm-popup.second").show();
        $('.lsm-popup.second>div a').on('click',a_onclick);
    });

    $(document).on('mouseleave','.lsm-mini .lsm-container ul:first, .lsm-mini .slimScrollBar,.second.lsm-popup ,.third.lsm-popup',function(){
        $(".lsm-popup.second").hide();
    });

    $(document).on('mouseover','.lsm-mini .slimScrollBar,.second.lsm-popup',function(){
        $(".lsm-popup.second").show();
    });
});

function menu_init(e){
    if(e && e.state && e.state.hasOwnProperty('active')){
        APPName = e.state.active;
    }
    if(!APPName) {APPName = HOMEPAGE;}
    document.getElementById("UserName").innerHTML = UserName;
    $('.active').removeClass('active');
    $('#'+APPName).addClass('active');
    if(APPName == 'History'){
        $("#SUBHTML").attr("src", urls[APPName]+'?TaskState=Finished');
    }
    else if(APPName == 'Doing'){
        $("#SUBHTML").attr("src", urls[APPName]+'?TaskState=Unfinished');
    }
    else{
        $("#SUBHTML").attr("src", urls[APPName]);
    }
}

function switchpage(pagename){
    if(pagename == 'History'){
        $("#SUBHTML").attr("src", urls[pagename]+'?TaskState=Finished');
    }
    else if(pagename == 'Doing'){
        $("#SUBHTML").attr("src", urls[pagename]+'?TaskState=Unfinished');
    }
    else{
        $("#SUBHTML").attr("src", urls[pagename]);
    }
    window.history.pushState(
        {'active':pagename},
        document.title,
        main_menu_url+pagename+'/'
    );
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
    $('.active').removeClass('active');
    switchpage('Account');
}