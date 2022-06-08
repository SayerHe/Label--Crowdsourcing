from django.shortcuts import render
from publisher.models import LabelTasksBaseInfo, LabelTaskFile
from login.models import UserInfo
from django.http import HttpResponse, JsonResponse,FileResponse,Http404
import numpy as np
import pandas as pd
from collections import Counter
import json
import pytz
import os
from backEnd import settings
import random
import ast
# Create your views here.

def get_publisher_history(request):
    # 任务号，任务名称，任务类型（图片），完成度，准确度，操作（删除+联系客服）
    CrossNum = 5
    tasks = LabelTasksBaseInfo.objects.filter(publisher=request.user)
    taskID = [i.pk for i in tasks]
    taskName = [i.task_name for i in tasks]
    tz = pytz.timezone('Asia/Shanghai')
    taskDDL = [i.task_deadline.astimezone(tz).strftime('%Y-%m-%d') for i in tasks]
    taskPublishTime = [i.publish_time.astimezone(tz).strftime('%Y-%m-%d') for i in tasks]
    completeDegree = []
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
            single_completeDegree = total_times/(CrossNum*task_situation.shape[0])
        completeDegree.append(single_completeDegree)
    data = {'TaskID': taskID,
            'TaskName': taskName,
            'PublishDate': taskPublishTime,
            'Deadline': taskDDL,
            'Progress': completeDegree,}
    # print(data["Progress"])
    data = pd.DataFrame(data).to_dict('records')
    return data

def get_labeler_history(request):
    user_info = UserInfo.objects.get(user=request.user)
    task_log = user_info.task_log
    task_log = pd.DataFrame(eval(task_log)).to_dict("records")
    return task_log

def get_history(request):
    if request.method == "GET":
        user = request.user
        user_type = UserInfo.objects.get(user=user).user_type
        if user_type == "labeler":
            data = get_labeler_history(request)
        elif user_type == "publisher":
            data = get_publisher_history(request)
        return render(request, "history/index.html", {'UserType': UserInfo.objects.get(user=user).user_type, 'TaskList':json.dumps(data)})

    if request.method == "POST":
        try:
            task_id = request.POST["TaskID"]
            LabelTasksBaseInfo.objects.get(pk=task_id).delete()
            return JsonResponse({"err": "none"})
        except:
            return JsonResponse({"err": "TaskID Missing !"})

def download(request):
    try:
        task_id=request.GET['TaskID']
    except KeyError:
        return JsonResponse({"err": "ERROR !"})
    data = LabelTaskFile.objects.get(task_id=task_id).data_file
    data = pd.DataFrame(eval(data), dtype=str)
    labels=list(data['__Label__'])
    task = LabelTasksBaseInfo.objects.get(pk=int(task_id))
    new_data=pd.DataFrame()
    new_data['文件名或ID']=data.iloc[:,0]
    CrossNum = 5
    if task.label_type == 'describe':
        new_labels = []
        if task.inspect_method == 'sampling':
            for label in labels:
                label=ast.literal_eval(label)
                new_labels.append(label[0])
        elif task.inspect_method == 'cross':
            for label in labels:
                label = ast.literal_eval(label)
                i=random.randint(0,CrossNum-1)
                new_labels.append(label[i])
        new_data['label']=new_labels
    elif task.label_type == 'choose':
        if task.inspect_method == 'sampling':
            for key, value in ast.literal_eval(labels[0])[0].items():
                label_list = []
                for label in labels:
                    label = ast.literal_eval(label)
                    label_list.append(label[0][str(key)])
                new_data[key] = label_list
        elif task.inspect_method == 'cross':
            for key, value in ast.literal_eval(labels[0])[0].items():
                label_list = []
                for label in labels:
                    draft_list = []
                    label = ast.literal_eval(label)
                    for i in range(CrossNum):
                        draft_list.append(label[i][str(key)])
                    dic=dict(Counter(draft_list))
                    result=list(dic.keys())[0]
                    label_list.append(result)
                new_data[key] = label_list
    elif task.label_type == 'frame':
        new_labels = []
        if task.inspect_method == 'sampling':
            if task.data_type == 'text':
                for label in labels:
                    label = ast.literal_eval(label)
                    new_labels.append(label[0])
            elif task.data_type == 'image':
                for label in labels:
                    label = ast.literal_eval(label)
                    dic= ast.literal_eval(label[0])[0]
                    new_labels.append(dic)
        elif task.inspect_method == 'cross':
            if task.data_type == 'text':
                for label in labels:
                    label = ast.literal_eval(label)
                    i = random.randint(0, CrossNum - 1)
                    new_labels.append(label[i])
            elif task.data_type == 'image':
                for label in labels:
                    label = ast.literal_eval(label)
                    x1=[]
                    x2=[]
                    y1=[]
                    y2=[]
                    for i in range(CrossNum):
                        dic = ast.literal_eval(label[i])[0]
                        x1.append(dic['x1'])
                        x2.append(dic['x2'])
                        y1.append(dic['y1'])
                        y2.append(dic['y2'])
                    new_x1 = np.mean(x1)
                    new_x2 = np.mean(x2)
                    new_y1 = np.mean(y1)
                    new_y2 = np.mean(y2)
                    new_labels.append({'x1':new_x1,'x2':new_x2,'y1':new_y1,'y2':new_y2})
        new_data['label'] = new_labels
    excel_name = os.path.join(settings.MEDIA_ROOT, str(task_id) + '.csv')
    new_data.to_csv(excel_name, index=False, encoding='utf_8_sig')
    try:
        response = FileResponse(open(excel_name, 'rb'))
        response['content_type'] = "application/octet-stream"
        response['Content-Disposition'] = 'attachment; filename=' + os.path.basename(excel_name)
        return response
    except Exception:
        raise Http404
    
