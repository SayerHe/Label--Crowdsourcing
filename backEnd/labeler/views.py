from django.shortcuts import render
from matplotlib.font_manager import json_dump
from publisher.models import LabelTasksBaseInfo, LabelTaskFile
from django.http import JsonResponse
from io import StringIO
import pandas as pd
import json
# from datetime
# Create your views here.

# def change_tz(ddl):

def show_tasks(request):
    DATA_ON_ONE_PAGE = 10
    # print(request.GET)
    if request.method == 'GET':
        if 'RequestData' not in request.GET:
            return render(request, "labeler/index.html")
        try:
            select = request.GET['Select']
            t=int(select, base=16)
            # print(select)
            datatype = t & ((1<<8) - 1)
            t >>= 8
            label_type = t & ((1<<8) - 1)
            t >>= 8
            TaskDifficulty = t & ((1<<8) - 1)
            t >>= 8
            page = (t & ((1<<8) - 1)) - 1
        except:
            datatype=label_type=TaskDifficulty=None
            page=0
        try:
            keyword = request.GET['Keyword']
        except:
            keyword = None

        tasks = LabelTasksBaseInfo.objects.all()

        datatypelist = []
        if datatype:
            if datatype & (1 << 0):
                datatypelist.append('text')
            if datatype & (1 << 1):
                datatypelist.append('image')
            if datatype & (1 << 2):
                datatypelist.append('audio')
            if datatype & (1 << 3):
                datatypelist.append('video')

        labeltypelist = []
        if label_type:
            if label_type & (1 << 0):
                labeltypelist.append('score')
            if label_type & (1 << 1):
                labeltypelist.append('classify')
            if label_type & (1 << 2):
                labeltypelist.append('describe')

        TaskDifficultyList = []
        if TaskDifficulty:
            if TaskDifficulty & (1 << 0):
                TaskDifficultyList.append('easy')
            if TaskDifficulty & (1 << 1):
                TaskDifficultyList.append('medium')
            if TaskDifficulty & (1 << 2):
                TaskDifficultyList.append('difficult')

        try:
            if keyword:
                tasks = tasks.filter(task_name__icontains=keyword)
            if datatype:
                tasks = tasks.filter(data_type__in=datatypelist)
            if label_type:
                tasks = tasks.filter(label_type__in=labeltypelist)
            if TaskDifficulty:
                tasks = tasks.filter(task_difficulty__in=TaskDifficultyList)
        except:
            pass

        dataList = [{'TaskName': i.task_name,
                        'DataType': i.data_type,
                        'LabelType': i.label_type,
                        'Payment': i.task_payment,
                        'TaskDifficulty': i.task_difficulty,
                        'TaskDeadline': i.task_deadline.astimezone().strftime("%Y/%m/%d"),
                        'RuleText': i.rule_file,
                        "TaskID": i.id
                        } for i in tasks[page*DATA_ON_ONE_PAGE :page*DATA_ON_ONE_PAGE+DATA_ON_ONE_PAGE]]
        tasks_info = {"DataNumber": len(tasks), "DataList": dataList}
        return JsonResponse(tasks_info)


def label_task(request):
    if request.method == "GET":
        try:
            task_id = request.GET["TaskID"]
        except:
            return JsonResponse({"err": "err !"})
        task = LabelTasksBaseInfo.objects.get(pk=int(task_id))
        task_rule = task.rule_file
        task_content_all = LabelTaskFile.objects.get(task_id__id=int(task_id)).data_file
        task_content_all = pd.read_csv(StringIO(task_content_all), sep='\s+')
        task_content_not_labeled = task_content_all[task_content_all["Label"]!=None][:3]
        task_content = [
            dict(task_content_not_labeled.iloc[i,:]) for i in range(3)
        ]
        Data = {
            "RuleText":task_rule,
            "TaskContent":json.dumps(task_content),
        }
        return render(request, "labeler/label.html", Data)

    elif request.method == "POST":
        try:
            task_id = request.POST["TaskID"]
            labels = request.POST["Labels"]
        except KeyError:
            return JsonResponse({"err" : "err !"})

        table = LabelTaskFile.objects.get(task_id__id=int(task_id)).data_file
        table = pd.read_csv(StringIO(table), sep='\s+')
        for label in labels:
            table[table["id"] == label["id"]].label = label["label"]

        return JsonResponse({"err": "none"})





