from telnetlib import LOGOUT
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.contrib.auth import logout

# Create your views here.


def index(request):
    if request.method == 'GET':
        user = request.user
        if not user.is_authenticated:
            return HttpResponse("Log in please")
        else:
            return render(request, 'main_menu/index.html', {"UserName":user.username})
    try:
        ins = request.POST['instruction']
        print(ins)
        if ins == 'Logout':
            logout(request)
            return JsonResponse({'err':'None'})
    except:
        pass

def index_appactive(request, appname):
    if request.method == 'GET':
        user = request.user
        if not user.is_authenticated:
            return HttpResponse("Log in please")
        else:
            return render(request, 'main_menu/index.html', {"UserName":user.username, "APPName":appname, "Params":request.get_full_path()[len(request.path):]})
    try:
        ins = request.POST['instruction']
        print(ins)
        if ins == 'Logout':
            logout(request)
            return JsonResponse({'err':'None'})
    except:
        pass

