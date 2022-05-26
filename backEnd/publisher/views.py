import numpy as np
from django.shortcuts import render
from django.http import JsonResponse,JsonResponse
from django.shortcuts import render, redirect
from django.urls import reverse
import pandas as pd
from publisher.models import LabelTasksBaseInfo, LabelTaskFile
import datetime
import zipfile
import rarfile
from django.utils import datastructures
from io import StringIO
import json
from pathlib import Path

# Create your views here.

def transform_text_file(table_data):

    table_data["__Label__"] = ["" for i in range(len(table_data))]
    table_data["__ID__"] = list(table_data.index)
    table_data["__Labelers__"] = ""
    table_data["__Times__"] = 0
    table_data = table_data.dropna(axis=0, how='all')
    table_data = table_data.dropna(axis=1, how='all')
    # print(table_data.to_string())
    return table_data

def transform_zip_file(task_file, new_task, request):
    # 将传入的zip解压到服务器，并将相对路径存入数据库
    now_dir = Path.cwd()
    file_dir = now_dir.parent / "zip_tasks"
    if not Path(file_dir / str(request.user.id)).exists():
        Path(file_dir / str(request.user.id)).mkdir(parents=True)
    new_task_dir = file_dir/ str(request.user.id) / str(new_task.pk)
    new_task_dir.mkdir()
    task_file.extractall(str(new_task_dir))
    task_file.close()
    files = [str(i.relative_to(new_task_dir)) for i in new_task_dir.iterdir()]
    table_data = pd.DataFrame({"files": files})
    table_data["__Label__"] = ["" for i in range(len(table_data))]
    table_data["__ID__"] = list(table_data.index)
    table_data["__Labelers__"] = ""
    table_data["__Times__"] = 0
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
        # print(request.POST)
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
        except KeyError:
            rule_text = request.POST["RuleText"]
            if rule_text:
                newTask_param["rule_file"] = rule_text
            else:
                return JsonResponse({"err": "Rule File Missing !"})
        if newTask_param["label_type"] == "choose":
            try:
                # choices = request.POST["ChoiceFile"]
                choices = r"C:\Users\10526\PycharmProjects\Label--Crowdsourcing\dataTest\choices.xlsx"
                choices = pd.read_excel(choices)
                choices = choices.to_dict()
                choices_drop_na = {}
                for question in choices.items():
                    choices_drop_na[question[0]] = []
                    for choice in question[1].items():
                        if choice[1] is not np.nan:
                            choices_drop_na[question[0]].append(choice[1])
                newTask_param["choices"] = str(choices_drop_na)

            except KeyError:
                return JsonResponse({"err": "Choices File Missing !"})
        else:
            newTask_param["choices"] = ""

        if newTask_param["data_type"] == "text":
            return create_text_task(request, **newTask_param)
        elif newTask_param["data_type"] == "image":
            return create_zip_task(request, **newTask_param)
        elif newTask_param["data_type"] == "audio":
            return create_zip_task(request, **newTask_param)

        return JsonResponse({'err': 'None'})

def create_zip_task(request, inspect_method, publisher, task_name, data_type, rule_file,
                          label_type, task_deadline, task_payment, choices):
    try:
        task_file = request.FILES["DataFile"]
    except:
        return JsonResponse({'err': "Task File missing! "})

    file_type = str(task_file).split(".")[-1]
    if file_type not in ["zip", "rar"]:
        return JsonResponse({'err': "Task File wrong! (Support zip, rar only)"})

    task_difficulty = "Easy"
    new_task = LabelTasksBaseInfo(inspect_method=inspect_method, publisher=publisher, task_name=task_name,
                                  data_type=data_type, rule_file=rule_file,
                                  label_type=label_type, task_deadline=task_deadline, task_payment=task_payment,
                                  task_difficulty=task_difficulty, choices=choices)
    new_task.save()
    if file_type == "zip":
        task_file = zipfile.ZipFile(task_file)
    elif file_type == "rar":
        task_file = rarfile.RarFile(task_file)

    task_file_table = transform_zip_file(task_file, new_task, request)
    if data_type == "audio":
        audio_type = task_file_table.apply(lambda x: x[0].split(".")[-1] in ["mp3", "mp4"], axis=1)
        if not audio_type.all():
            return JsonResponse({"err": "Support MP3, MP4 only! "})

    if data_type == "image":
        audio_type = task_file_table.apply(lambda x: x[0].split(".")[-1] in ["jpg", "png"], axis=1)
        if not audio_type.all():
            return JsonResponse({"err": "Support JPG, PNG only! "})

    task_file_string = str(task_file_table.to_dict())
    new_task_file = LabelTaskFile(task_id=new_task, data_file=task_file_string)
    new_task_file.save()
    return JsonResponse({'err': 'None'})

def create_text_task(request, inspect_method, publisher, task_name, data_type, rule_file,
                          label_type, task_deadline, task_payment, choices):

    try:
        task_file = request.FILES["DataFile"]
    except KeyError:
        return JsonResponse({'err': "Task File Missing! "})

    table_format_permit = ["csv", "xls", "xlsx", "xlsm"]
    file_type = str(task_file).split(".")[1]
    if file_type not in table_format_permit:
        return JsonResponse({'err': "FileType Wrong! (Support csv, xlsx, xls, xlsm only)"})
    if file_type == "csv":
        task_file_table = pd.read_csv(task_file)
    elif file_type in ["xls", "xlsx", "xlsm"]:
        task_file_table = pd.read_excel(task_file)
    task_file_table = transform_text_file(task_file_table)
    task_difficulty = estimate_text_difficulty(task_file_table)
    task_file_string = str(task_file_table.to_dict())

    new_task = LabelTasksBaseInfo(inspect_method=inspect_method, publisher=publisher, task_name=task_name,
                                  data_type=data_type,rule_file=rule_file,
                                  label_type=label_type, task_deadline=task_deadline,
                                  task_payment=task_payment,task_difficulty=task_difficulty, choices=choices)
    new_task.save()
    new_task_file = LabelTaskFile(task_id = new_task, data_file=task_file_string)
    new_task_file.save()
    return JsonResponse({'err': 'None'})

