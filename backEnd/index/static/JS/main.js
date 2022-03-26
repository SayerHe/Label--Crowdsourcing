function roll(){
    var bg=document.getElementById("bg");
    var moon=document.getElementById("moon");
    var mountain=document.getElementById("mountain");
    var road=document.getElementById("road");
    var text=document.getElementById("text");
    window.addEventListener('scroll',function(){
        var value=window.scrollY;
        bg.style.top=value*0.5+'px';
        moon.style.left=-value*0.5+'px';
        mountain.style.top=-value*0.15+'px';
        road.style.top=value*0.15+'px';
        text.style.top=value*1+'px';
    })
}

window.onload=function(){
    roll();

}

$(document).ready(function(){
    $("#navbar a").click(function() {
        var bt = $(this).attr("href")
        var navbarhight = $("#navbar").outerHeight()
        //console.log(navbarhight)
        if(bt == "#Home"){
            console.log(bt)
            $("html,body").animate({
                scrollTop: "0px"
            }, 500);
        }
        else{
            bt += "_div"
            $("html, body").animate({
                scrollTop:  $(bt).offset().top- navbarhight + "px"
            }, 500);
        }
    });
    SetNavbar()

    $(window).scroll(function(){
        SetNavbar()
    })
});

function SetNavbar()
{
    var x = window.scrollY
    var wh = document.documentElement.clientHeight
    var bar = document.getElementById("navbar")
    //console.log([x, wh])
    if(x <= wh/3)
    {
        bar.style.top = Math.floor(30-x/(wh/3)*30).toString()+"px";
        bar.style.backgroundColor = "#0a2a4300";
    }
    else if(x <= wh-140)
    {
        bar.style.top = "0"
        bar.style.backgroundColor = "#0a2a4300";
    }
    else if(x <= wh-70)
    {
        bar.style.top = "0"
        alp = Math.floor((x-wh+140)/(70)*255)
        bar.style.backgroundColor = "#0a2a43"+alp.toString(16);
    }
    else
    {
        bar.style.top = "0"
        bar.style.backgroundColor = "#0a2a43";
    }
}