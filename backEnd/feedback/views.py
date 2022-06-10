from django.shortcuts import render
from login.models import UserInfo
from django.http import  JsonResponse
import pandas as pd
import time
from publisher.models import LabelTasksBaseInfo, LabelTaskFile
# Create your views here.

# def get_feedback(request):
#
#     return 0
def feedback(request):
    if request.method == "GET":
        return render(request, "feedback/feedback.html", {'UserName': request.user.username,'Email':request.user.email})
    else:
        try:
            user=request.user
            task_id = request.POST["TaskID"]
            problem_description=request.POST["ProblemDescription"]
            problem_type=request.POST["ProblemType"]
            priority=request.POST["Priority"]
        except:
            return JsonResponse({"err": "err !"})
        try:
            problem_details=request.POST["ProblemDetails"]
        except:
            problem_details=None
        print(task_id)
        print(type(task_id))
        user_info = UserInfo.objects.get(user=user)
        task = LabelTasksBaseInfo.objects.get(pk=int(task_id))
        task_log = pd.DataFrame(eval(user_info.task_log))
        state=task_log.loc[task_log["TaskID"] == task_id]["TaskState"]

        feedback_file= pd.DataFrame(eval(user_info.feedback_file))
        feedback_file["TaskID"]=task_id
        feedback_file["TaskName"] = task.task_name
        feedback_file["State"] = state
        feedback_file["ProblemDescription"] = problem_description
        feedback_file["ProblemType"] = problem_type
        feedback_file["Priority"] = priority
        feedback_file["ProblemDetails"]=problem_details
        feedback_file["UpdatedTime"]=time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        user_info.feedback_file = str(feedback_file.to_dict())
        print(user_info.feedback_file)
        user_info.save()

def show_feedback(request):
    pass
def history(request):
    return render(request, "feedback/fhistory.html", {'UserName': request.user.username});