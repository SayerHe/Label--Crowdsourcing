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
        print(request.POST)
    except:
        return JsonResponse({'err': 'DataLost'})

    tasks = LabelTasksBaseInfo.objects.all()
    try:
        keyword = request.POST["Keyword"]
        datatype = eval(request.POST["DataType"])
        labeltype = eval(request.POST["LabelType"])
        taskdifficulty = eval(request.POST["TaskDifficulty"])
    except:
        pass
    try:
        if keyword:
            tasks = tasks.filter(task_name__icontains=keyword)
        if datatype:
            # print(type(datatype))
            tasks = tasks.filter(data_type__in=datatype)
        if labeltype:
            tasks = tasks.filter(label_type__in=labeltype)
        if taskdifficulty:
            tasks = tasks.filter(task_difficulty__in=taskdifficulty)
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
