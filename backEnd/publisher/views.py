from django.shortcuts import render
from django.http import JsonResponse,JsonResponse
from django.shortcuts import render, redirect
from django.urls import reverse
import pandas as pd
from publisher.models import LabelTasksBaseInfo, LabelTaskFile
import datetime
from io import StringIO
import json

#pd.read_csv(StringIO(dfstr), sep='\s+')
# Create your views here.

def transform_text_file(task_file):
    # 将传入的excel文件转为pd.DataFrame
    table_data = task_file.read().decode("utf8").split("\n")
    table_data = [i.strip().split(",") for i in table_data]
    columns = table_data[0]
    table_data = table_data[1:]
    table_data = pd.DataFrame(table_data)
    table_data.columns = columns
    print(table_data.to_string())
    return table_data

def estimate_text_difficulty(table_data):
    # 估测文本类任务的困难度
    # 瞎写的，有时间再改
    length_col = len(table_data.columns)
    if length_col <= 5:
        return "Easy"
    elif 15 >= length_col > 5:
        return "Medium"
    else:
        return "Difficult"

def determine_payment(*args):
    # 后面加
    return 1

def create_task(request):
    if request.method == 'GET':
        return render(request, "Publisher/index.html")
    else:
        newTask_param = dict()
        try:
            # print(json.loads(request.body))
            newTask_param["publisher"] = request.user
            newTask_param["task_name"] = request.POST["TaskName"]
            newTask_param["data_type"] = request.POST["DataType"]
            newTask_param["label_type"] = request.POST["LabelType"]
            task_deadline = request.POST["TaskDeadline"]
            task_deadline = [int(i) for i in task_deadline.split('/')]
            newTask_param["task_deadline"] = datetime.date(*task_deadline)
            newTask_param["inspect_method"] = request.POST["InspectionMethod"]
            newTask_param["task_payment"] = determine_payment()
        except KeyError:
            return JsonResponse({'err': "Basic Info Missing"})

        try:
            newTask_param["rule_file"] = request.FILES["RuleFile"].read().decode("utf8")
            print(request.FILES["RuleFile"].read().decode("utf8"))
        except KeyError:
            return JsonResponse({'err': "Rule File Missing"})

        print(newTask_param)

        if newTask_param["data_type"] == "text":
            return create_text_task(request, **newTask_param)

        return JsonResponse({'err': 'None'})

def create_text_task(request, inspect_method, publisher, task_name, data_type, rule_file,
                          label_type, task_deadline, task_payment):

    try:
        task_file = request.FILES["DataFile"]
        task_file_table = transform_text_file(task_file)
        task_difficulty = estimate_text_difficulty(task_file_table)
        task_file_string = task_file_table.to_string()
    except KeyError:
        return JsonResponse({'err': "Task File Missing"})

    table_format_permit = ["csv", "xls", "xlsx"]
    if str(task_file).split(".")[1] not in table_format_permit:
        return JsonResponse({'err': "FileType Error"})

    new_task = LabelTasksBaseInfo(inspect_method=inspect_method, publisher=publisher, task_name=task_name, data_type=data_type,rule_file=rule_file,
                                  label_type=label_type, task_deadline=task_deadline, task_payment=task_payment,task_difficulty=task_difficulty)
    new_task.save()
    new_task_file = LabelTaskFile(task_id = new_task, data_file=task_file_string)
    new_task_file.save()
    return JsonResponse({'err': 'None'})

