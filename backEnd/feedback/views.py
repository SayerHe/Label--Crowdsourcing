from django.shortcuts import render
from login.models import UserInfo
from django.http import  JsonResponse
import pandas as pd
import time
from publisher.models import LabelTasksBaseInfo, LabelTaskFile
import json
# Create your views here.

# def get_feedback(request):
#
#     return 0
def feedback(request):
    if request.method == "GET":
        try:
            task_id = request.GET["TaskID"]
        except:
            task_id = ""
        return render(request, "feedback/feedback.html", {'UserName': request.user.username,'Email':request.user.email, "TaskID": task_id})
    else:
        try:
            user=request.user
            task_id = request.POST["TaskID"]
            problem_description=request.POST["ProblemDescription"]
            problem_type=request.POST["ProblemType"]
            priority=request.POST["Priority"]
            problem_details = request.POST["ProblemDetails"]
        except:
            return JsonResponse({"err": "err !"})


        print(problem_type)
        print(priority)
        user_info = UserInfo.objects.get(user=user)
        task = LabelTasksBaseInfo.objects.get(pk=int(task_id))

        feedback_file= pd.DataFrame(eval(user_info.feedback_file))
        feedback_log = [str(task_id),  task.task_name,"未解决", problem_description,problem_type,
                   priority,problem_details, time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())]
        feedback_file.loc[feedback_file.shape[0]]=feedback_log
        user_info.feedback_file = str(feedback_file.to_dict())
        user_info.save()
        print(user_info.feedback_file)
        return JsonResponse({"err": "提交成功!"})


def history(request):
    user_info = UserInfo.objects.get(user=request.user)
    feedback_file = pd.DataFrame(eval(user_info.feedback_file))
    feedback_file = feedback_file.to_dict("records")
    print(feedback_file)
    return render(request, "feedback/fhistory.html", {'UserName': request.user.username, "Data": json.dumps(feedback_file)})