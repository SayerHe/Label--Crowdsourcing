from django.shortcuts import render
from publisher.models import LabelTasksBaseInfo
from django.http import HttpResponse, JsonResponse
# from datetime
# Create your views here.

# def change_tz(ddl):


def show_tasks(request):
    DATA_ON_ONE_PAGE = 10
    if request.method == 'GET':
        return render(request, "labeler/index.html")
        
    try:
        page = int(request.POST["Page"])
    except:
        return JsonResponse({'err': 'DataLost'})

    tasks = LabelTasksBaseInfo.objects.all()
    try:
        keyword = request.POST["Keyword"]
        tasks = tasks.filter(TaskName__contains=keyword)
    except:
        pass
    try:
        datatype = request.POST["DataType"]
        tasks = tasks.filter(DataType__in=datatype)
    except:
        pass
    try:
        labeltype = request.POST["LabelType"]
        tasks = tasks.filter(LabelType__in=labeltype)
    except:
        pass
    try:
        taskdifficulty = request.POST["TaskDifficulty"]
        tasks = tasks.filter(TaskDifficulty__in=taskdifficulty)
    except:
        pass
    if page==-1:
        page=0

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
