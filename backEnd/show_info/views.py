from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from login.models import UserInfo
import pandas as pd
# Create your views here.

def Center(request):
    user_info = UserInfo.objects.get(user=request.user)
    salary_log = pd.DataFrame(eval(user_info.salary_log))
    # task_log = pd.DataFrame(eval(user_info.task_log))
    item_num = salary_log.shape[0]
    item_success = salary_log.loc[salary_log["State"] == "Success"].shape[0]
    item_fail = salary_log.loc[salary_log["State"] == "Fail"].shape[0]
    try:
        rate = item_success/(item_success+item_fail)
    except:
        rate = "Nan"
    payment = user_info.salary
    undetermined = user_info.undetermined
    Data = {
        "ItemNum": item_num,
        "Rate": rate,
        "Payment": payment,
        "Undetermined": undetermined
    }
    return render(request, "show_info/example.html", {'UserName': request.user.username, "Data": Data})


def account(request):
    return render(request, "show_info/account.html", {'UserName': request.user.username})