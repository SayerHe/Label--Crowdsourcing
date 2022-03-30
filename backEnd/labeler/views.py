from django.shortcuts import render
from publisher.models import LabelTasksBaseInfo
from django.http import HttpResponse, JsonResponse
# from datetime
# Create your views here.

# def change_tz(ddl):


def show_tasks(request):
    global tasks
    global num
    if request.method == 'GET':
        return render(request, "labeler/index.html")
    else:
        try:
            page = request.POST["Page"]
            keyword = request.POST["Keyword"]
            datatype = request.POST["Datatype"]
            labeltype = request.POST["Labeltype"]
            taskdifficulty = request.POST["TaskDifficulty"]
        except:
            return JsonResponse({'err': 'DataLost'})


        if page==-1:
            tasks = LabelTasksBaseInfo.objects.all().filter(TaskName__contain=keyword) \
                .filter(DataType__contain=datatype).filter(LabelType__contain=labeltype) \
                .filter(TaskDifficulty__contain=taskdifficulty)
            dataList = [{'TaskName': i.task_name,
                         'DataType': i.data_type,
                         'LabelType': i.label_type,
                         'Payment': i.task_payment,
                         'TaskDifficulty': i.task_difficulty,
                         'TaskDeadline': i.task_deadline.astimezone().strftime("%Y/%m/%d"),
                         'RuleText': i.rule_file,
                         "TaskID": i.id
                         } for i in tasks]
            num=len(dataList)
            new_datalist=dataList[0:10]
            tasks_info = {"DataNumber":num,"DataList":new_datalist}
            return JsonResponse(tasks_info)
        else:
            dataList = [{'TaskName': i.task_name,
                         'DataType': i.data_type,
                         'LabelType': i.label_type,
                         'Payment': i.task_payment,
                         'TaskDifficulty': i.task_difficulty,
                         'TaskDeadline': i.task_deadline.astimezone().strftime("%Y/%m/%d"),
                         'RuleText': i.rule_file,
                         "TaskID": i.id
                         } for i in tasks]
            new_datalist=dataList[page*10:page*10+10]
            tasks_info = {"DataNumber": num, "DataList": new_datalist}
            return JsonResponse(tasks_info)

