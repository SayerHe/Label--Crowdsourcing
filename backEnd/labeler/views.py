from django.shortcuts import render
from publisher.models import LabelTasksBaseInfo
from django.http import HttpResponse, JsonResponse
# Create your views here.

def show_tasks(request):
    if request.method == 'GET':
        return render(request, "labeler/index.html")
    else:
        tasks = LabelTasksBaseInfo.objects.all()[:10]
        dataList = [{'TaskName': i.task_name,
                      'DataType': i.data_type,
                      'LabelType': i.label_type,
                      'Payment': i.task_reward,
                      'TaskDifficulty': i.task_difficulty,
                      } for i in tasks]
        tasks_info = {"DataList":dataList}

        return JsonResponse(tasks_info)

