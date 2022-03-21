from django.shortcuts import render
from publisher.models import LabelTasksBaseInfo
from django.http import HttpResponse, JsonResponse
# Create your views here.

def show_tasks(request):
    tasks = LabelTasksBaseInfo.objects.all()[:10]
    tasks_info = {'task_name': [i.task_name for i in tasks],
                  'data_type': [i.data_type for i in tasks],
                  'label_type': [i.label_type for i in tasks],
                  'task_reward': [i.task_reward for i in tasks],
                  'difficulty': [i.task_difficulty for i in tasks],
                  }

    return JsonResponse(tasks_info)

