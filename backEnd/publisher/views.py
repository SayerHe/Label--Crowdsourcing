from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
from django.shortcuts import render, redirect
from django.urls import reverse
import pandas as pd
from publisher.models import LabelTasksBaseInfo, LabelTaskFile
from io import StringIO

# Create your views here.

def transform_table_file(task_file):
    table_data = task_file.read().decode("utf8").split("\n")
    table_data = [i.strip().split(",") for i in table_data]
    columns = table_data[0]
    table_data = table_data[1:]
    table_data = pd.DataFrame(table_data)
    table_data.columns = columns
    return table_data

def estimate_difficulty(table_data):
    length_col = len(table_data.columns)
    if length_col <= 5:
        return "Easy"
    elif 15 >= length_col > 5:
        return "Medium"
    else:
        return "Difficult"

def create_new_task(request):
    if request.method == 'GET':
        return render(request, "publisher/index.html")
    else:
        try:
            publisher_id = request.user.id
            task_name = request.POST["TaskName"]
            data_type = request.POST["TaskType"]
            label_type = request.POST["LabelType"]
            task_deadline = request.POST["TaskDeadline"]
            task_reward = request.POST["Reward"]
        except KeyError:
            return JsonResponse({'err': "Basic task information is missing !"})
        try:
            task_file = request.FILES["TaskFile"]
            task_file_table = transform_table_file(task_file)
            task_difficulty = estimate_difficulty(task_file_table)
            task_file_string = task_file_table.to_string()
        except KeyError:
            return JsonResponse({'err': "Task file is missing!"})
        try:
            rule_file = request.FILES["RuleFile"]
        except KeyError:
            return JsonResponse({'err': "Rule file is missing!"})

        new_task = LabelTasksBaseInfo(publisher_id=publisher_id, task_name=task_name, data_type=data_type,rule_file=rule_file,
                                      label_type=label_type, task_deadline=task_deadline, task_reward=task_reward,task_difficulty=task_difficulty)
        new_task.save()
        new_task_file = LabelTaskFile(task_id = new_task, task_file=task_file_string)
        new_task_file.save()

        return JsonResponse({'err': "None"})
