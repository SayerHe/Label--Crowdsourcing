from django.shortcuts import render
from publisher.models import LabelTasksBaseInfo
from django.http import HttpResponse, JsonResponse
# from datetime
# Create your views here.

# def change_tz(ddl):


def show_tasks(request):
    if request.method == 'GET':
        return render(request, "labeler/index.html")
    else:
        tasks = LabelTasksBaseInfo.objects.all()[:]
        dataList = [{'TaskName': i.task_name,
                      'DataType': i.data_type,
                      'LabelType': i.label_type,
                      'Payment': i.task_payment,
                      'TaskDifficulty': i.task_difficulty,
                     'TaskDeadline':i.task_deadline.astimezone().strftime("%Y/%m/%d"),
                     'RuleText': i.rule_file,
                     "TaskID": i.id
                      } for i in tasks]

        print(dataList)
        tasks_info = {"DataList":dataList}

        return JsonResponse(tasks_info)

