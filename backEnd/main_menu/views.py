from telnetlib import LOGOUT
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.contrib.auth import logout
from login.models import UserInfo

# Create your views here.


def index(request):
    if request.method == 'GET':
        user = request.user
        if not user.is_authenticated:
            return HttpResponse("Log in please")
        else:
            user_type = UserInfo.objects.get(user=user).user_type
            if user_type == 'labeler':
                return render(request, 'main_menu/index_labeler.html', {"UserName":user.username, "UserType":user_type})
            elif user_type == 'publisher':
                return render(request, 'main_menu/index.html', {"UserName":user.username, "UserType":user_type})
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
            user_type = UserInfo.objects.get(user=user).user_type
            if user_type == 'labeler':
                return render(request, 'main_menu/index_labeler.html', {"UserName":user.username, "UserType":user_type, "APPName":appname, "Params":request.get_full_path()[len(request.path):]})
            elif user_type == 'publisher':
                return render(request, 'main_menu/index.html', {"UserName":user.username, "UserType":user_type, "APPName":appname, "Params":request.get_full_path()[len(request.path):]})
    try:
        ins = request.POST['instruction']
        print(ins)
        if ins == 'Logout':
            logout(request)
            return JsonResponse({'err':'None'})
    except:
        pass
def inst(request):
    user = request.user
    return render(request, 'main_menu/instruction.html', {"UserName": user.username})