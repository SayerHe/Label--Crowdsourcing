from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.


def index(request):
    user = request.user
    if not user.is_authenticated:
        return HttpResponse("Log in please")
    else:
        return render(request, 'main_menu/index.html', {"UserName":user.username})

def index_appactive(request, appname):
    user = request.user
    if not user.is_authenticated:
        return HttpResponse("Log in please")
    else:
        return render(request, 'main_menu/index.html', {"UserName":user.username, "APPName":appname, "Params":request.get_full_path()[len(request.path):]})
    

