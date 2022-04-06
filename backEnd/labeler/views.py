from django.shortcuts import render
from matplotlib.font_manager import json_dump
from publisher.models import LabelTasksBaseInfo
from django.http import HttpResponse, JsonResponse
import json
# from datetime
# Create your views here.

# def change_tz(ddl):

def show_tasks(request):
    DATA_ON_ONE_PAGE = 10
    if request.method == 'GET':
        try:
            select = request.GET['select']
            t=int(select, base=16)
            datatype = t & (1 << 8 - 1)
            t >>= 8
            label_type = t & (1 << 8 - 1)
            t >>= 8
            TaskDifficulty = t & (1 << 8 - 1)
            t >>= 8
            page = t & (1 << 8 - 1)
        except:
            datatype=label_type=TaskDifficulty = None
            page=0
        try:
            keyword = request.GET['keyword']
        except:
            keyword = None

        tasks = LabelTasksBaseInfo.objects.all()

        datatypelist = []
        if datatype and datatype & (1 << 0):
            datatypelist.append('text')
        if datatype and datatype & (1 << 1):
            datatypelist.append('image')
        if datatype and datatype & (1 << 2):
            datatypelist.append('audio')
        if datatype and datatype & (1 << 3):
            datatypelist.append('video')

        labeltypelist = []
        if label_type and label_type & (1 << 0):
            labeltypelist.append('score')
        if label_type and label_type & (1 << 1):
            labeltypelist.append('classify')
        if label_type and label_type & (1 << 2):
            labeltypelist.append('describe')

        TaskDifficultyList = []
        if TaskDifficulty and TaskDifficulty & (1 << 0):
            TaskDifficultyList.append('easy')
        if TaskDifficulty and TaskDifficulty & (1 << 1):
            TaskDifficultyList.append('medium')
        if TaskDifficulty and TaskDifficulty & (1 << 2):
            TaskDifficultyList.append('difficult')
        try:
            if keyword:
                tasks = tasks.filter(task_name__icontains=keyword)
            if datatype:
                # print(type(datatype))
                tasks = tasks.filter(data_type__in=datatypelist)
            if label_type:
                tasks = tasks.filter(label_type__in=labeltypelist)
            if TaskDifficulty:
                tasks = tasks.filter(task_difficulty__in=TaskDifficultyList)
        except:
            pass

        dataList = [{   "TaskName": i.task_name,
                        "DataType": i.data_type,
                        "LabelType": i.label_type,
                        "Payment": "%.2f"%(i.task_payment),
                        "TaskDifficulty": i.task_difficulty,
                        "TaskDeadline": i.task_deadline.astimezone().strftime("%Y/%m/%d"),
                        "RuleText": json.dumps(i.rule_file).replace('\"', '\\"'),
                        "TaskID": i.id
                        } for i in tasks[len(tasks)-1:len(tasks)]]
        tasks_info = {"DataNumber": len(tasks), "DataList": json.dumps(dataList)}
        print(json.dumps(dataList))
        return render(request, 'labeler/index.html', tasks_info)
