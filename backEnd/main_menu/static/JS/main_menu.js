var _active
window.onload=function(){
    document.getElementById("UserName").innerHTML = UserName;
    tmp = document.getElementById("Publish").getBoundingClientRect();
    mact = document.getElementById("menu_active");
    mact.style.top = tmp.top-(mact.getBoundingClientRect().height-tmp.height)/2+"px";
    _active = "#Publish"
    $(_active).css("pointer-events", "none")
}

var urls={
    "#Publish":publish_url,
    "#T_Doing":user_url,
    "#T_Finished":user_url,
    "#Annotation":user_url,
    "#Account":user_url,
}

$(document).ready(function(){
    $(".menubt").click(function(){
        tmp = this.getBoundingClientRect();
        mact = document.getElementById("menu_active").getBoundingClientRect();
        matop = tmp.top-(mact.height-tmp.height)/2+"px";
        $("#menu_active").animate({top:matop}, 300);
        $(_active).css("pointer-events", "auto")
        _active = "#"+this.id
        $(_active).css("pointer-events", "none")
        $("#SUBHTML").attr("src", urls[_active])
    });
});
