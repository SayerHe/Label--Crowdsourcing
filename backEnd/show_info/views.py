from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from login.models import UserInfo
# Create your views here.

def Center(request):
    user_info = UserInfo.objects.get(user=request.user)
    # task_num =
    return render(request, "show_info/example.html", {'UserName': request.user.username})
def account(request):
    return render(request, "show_info/account.html", {'UserName': request.user.username})