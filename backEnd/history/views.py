from django.shortcuts import render
from publisher.models import LabelTasksBaseInfo, LabelTaskFile
from login.models import UserInfo
from django.http import HttpResponse, JsonResponse
import numpy as np
import pandas as pd
from collections import Counter
import json
import pytz


# Create your views here.

def get_publisher_history(request):
    # 任务号，任务名称，任务类型（图片），完成度，准确度，操作（删除+联系客服）
    tasks = LabelTasksBaseInfo.objects.filter(publisher=request.user)
    taskID = [i.pk for i in tasks]
    taskName = [i.task_name for i in tasks]
    tz = pytz.timezone('Asia/Shanghai')
    taskDDL = [i.task_deadline.astimezone(tz).strftime('%Y-%m-%d') for i in tasks]
    taskPublishTime = [i.publish_time.astimezone(tz).strftime('%Y-%m-%d') for i in tasks]
    completeDegree = []
    completeAcc = []
    for task in tasks:
        inspect_method = task.inspect_method
        task_situation = LabelTaskFile.objects.get(task_id=task).data_file
        task_situation = pd.DataFrame(eval(task_situation), dtype=str)
        single_completeDegree = 0
        if inspect_method == "sampling":
            single_completeDegree = task_situation[task_situation["__Label__"] != ""].shape[0]/task_situation.shape[0]
        elif inspect_method == "cross":
            total_times = task_situation["__Times__"]
            total_times = pd.to_numeric(total_times).sum()
            single_completeDegree = total_times/(10*task_situation.shape[0])
        completeDegree.append(single_completeDegree)
    data = {'TaskID': taskID,
            'TaskName': taskName,
            'PublishDate': taskPublishTime,
            'Deadline': taskDDL,
            'Progress': completeDegree,}
    data = pd.DataFrame(data).to_dict('records')
    return data

def get_labeler_history(request):
    pass

def get_history(request):
    if request.method == "GET":
        user = request.user
        user_type = UserInfo.objects.get(user=user).user_type
        if user_type == "labeler":
            data = get_labeler_history(request)
        elif user_type == "publisher":
            data = get_publisher_history(request)
        print(type(data))
        return render(request, "history/index.html", {'TaskList':json.dumps(data)})