from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from login.models import UserInfo
import pandas as pd
import json
import datetime
import math
# Create your views here.

def cal_level(item_num, rate):
    if item_num <= 1 or rate == 0 or rate == "Nan":
        return "无评级", "Nan"
    if rate >= 0.9:
        base = 3
    elif 0.8 <= rate < 0.9:
        base = 3.5
    elif 0.7 <= rate < 0.8:
        base = 4
    elif 0.5 <= rate < 0.7:
        base = 6
    else:
        base = 8
    re = math.log(item_num, base)
    if re > 5:
        level = "S"
        if re > 6.5:
            percentage = 1
        else: percentage = (re-5)/1.5
    elif 4.2 <= re < 5:
        level = "A"
        percentage = (re-4.2)/1.8
    elif 3 <= re < 4.2:
        level = "B"
        percentage = (re-3)/1.2
    elif 2 <= re < 3:
        level = "C"
        percentage = (re-2)/1
    else:
        level = "D"
        percentage = (re-0)/2
    return level, percentage

def to_time(x):
    x["Time"] = pd.Timestamp(x["Time"])
    return x

def Center(request):
    user_info = UserInfo.objects.get(user=request.user)
    salary_log = pd.DataFrame(eval(user_info.salary_log))
    # task_log = pd.DataFrame(eval(user_info.task_log))
    item_num = salary_log.shape[0]
    item_success = salary_log.loc[salary_log["State"] == "Success"].shape[0]
    item_fail = salary_log.loc[salary_log["State"] == "Fail"].shape[0]
    try:
        rate = item_success/(item_success+item_fail)
        rate = str(round(rate*100,2))+" %"
    except:
        rate = "Nan"
    level, percentage = cal_level(item_num, rate)
    payment = user_info.salary
    undetermined = user_info.undetermined
    salary_log = salary_log.apply(to_time, axis=1)
    last_seven_days = []
    for i in range(-1, 7):
        without_hour = datetime.date.today()+datetime.timedelta(days=-i)
        with_hour = datetime.datetime(without_hour.year, without_hour.month, without_hour.day)
        last_seven_days.append(with_hour)
    last_seven_days.reverse()
    active = []
    for i in range(len(last_seven_days)-1):
        valid_salary = salary_log[(last_seven_days[i]<=salary_log["Time"]) & (salary_log["Time"]<last_seven_days[i+1])]
        active.append(valid_salary.shape[0])

    Data = {
        "ItemNum": item_num,
        "Rate": rate,
        "Payment": payment,
        "Undetermined": undetermined,
        "Level":{"percentage": percentage, "level": level},
        "Active": active
    }
    return render(request, "show_info/example.html", {'UserName': request.user.username, "Data": json.dumps(Data)})


def account(request):
    return render(request, "show_info/account.html", {'UserName': request.user.username})

def detail(request):
    user_info = UserInfo.objects.get(user=request.user)
    salary_log = user_info.salary_log
    salary_log = salary_log.to_dict("records")
    return render(request, "show_info/detail.html", {'UserName': request.user.username, "Data":json.dumps(salary_log)})