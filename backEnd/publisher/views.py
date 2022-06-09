import numpy as np
from django.shortcuts import render
from django.http import JsonResponse,JsonResponse
from django.shortcuts import render, redirect
import pandas as pd
from publisher.models import LabelTasksBaseInfo, LabelTaskFile
from django.db.models import Max
import datetime
import zipfile
import rarfile
import json
import shutil
from pathlib import Path

# Create your views here.

def transform_table_file(table_data):

    table_data["__Label__"] = ["" for i in range(len(table_data))]
    table_data["__ID__"] = [i+1 for i in list(table_data.index)]
    table_data["__Labelers__"] = ""
    table_data["__Times__"] = 0
    table_data = table_data.dropna(axis=0, how='all')
    table_data = table_data.dropna(axis=1, how='all')
    # print(table_data.to_string())
    return table_data

def transform_zip_file(task_file, new_task_id, request):
    # 将传入的zip解压到服务器，并将相对路径存入数据库
    now_dir = Path.cwd()
    file_dir = now_dir.parent / "zip_tasks"
    if not file_dir.exists():
        Path(file_dir).mkdir(parents=True)
    new_task_dir = file_dir / str(new_task_id)
    new_task_dir.mkdir()
    task_file.extractall(str(new_task_dir))
    task_file.close()
    files = [str(i.relative_to(new_task_dir)) for i in new_task_dir.iterdir()]
    table_data = pd.DataFrame({"files": files})
    table_data["__Label__"] = ["" for i in range(len(table_data))]
    table_data["__ID__"] = [i+1 for i in list(table_data.index)]
    table_data["__Labelers__"] = ""
    table_data["__Times__"] = 0
    return table_data, new_task_dir


def estimate_table_difficulty(table_data):
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
    return 0.01

def split_task(task_content):
    batch_size = 5
    total_round = task_content.shape[0]//batch_size
    for i in range(total_round-1):
        yield task_content[i*50:(i+1)*50]
    yield task_content[(total_round-1)*50: ]

def create_zip_task(request, inspect_method, publisher, task_name, data_type, rule_file,
                          label_type, task_deadline, task_payment, choices, sample):
    try:
        task_file = request.FILES["DataFile"]
    except:
        return JsonResponse({'err': "Task File missing! "})

    file_type = str(task_file).split(".")[-1]
    if file_type not in ["zip", "rar"]:
        return JsonResponse({'err': "Task File wrong! (Support zip, rar only)"})

    task_difficulty = "Easy"
    # 查询下一个任务的 pk
    new_task = LabelTasksBaseInfo(inspect_method=inspect_method, publisher=publisher, task_name=task_name,
                                  data_type=data_type, rule_file=rule_file,
                                  label_type=label_type, task_deadline=task_deadline, task_payment=task_payment,
                                  task_difficulty=task_difficulty, choices=choices)
    new_task.save()
    new_task_id = new_task.pk
    LabelTasksBaseInfo.objects.get(pk=new_task_id).delete()

    if file_type == "zip":
        task_file = zipfile.ZipFile(task_file)
    elif file_type == "rar":
        try:
            task_file = rarfile.RarFile(task_file)
        except:
            return JsonResponse({"err": "winRAR environment path error !"})

    task_file_table, new_task_dir = transform_zip_file(task_file, new_task_id, request)
    if data_type == "audio":
        audio_type = task_file_table.apply(lambda x: x[0].split(".")[-1] in ["mp3", "mp4"], axis=1)
        if not audio_type.all():
            shutil.rmtree(new_task_dir)
            return JsonResponse({"err": "Support MP3, MP4 only! "})

    if data_type == "image":
        image_type = task_file_table.apply(lambda x: x[0].split(".")[-1] in ["jpg", "png", "JPEG"], axis=1)
        if not image_type.all():
            shutil.rmtree(new_task_dir)
            return JsonResponse({"err": "Support JPG, PNG, JPEG only! "})

    if data_type == "text":
        image_type = task_file_table.apply(lambda x: x[0].split(".")[-1] in ["txt"], axis=1)
        if not image_type.all():
            shutil.rmtree(new_task_dir)
            return JsonResponse({"err": "Support txt only! "})

    new_task = LabelTasksBaseInfo(inspect_method=inspect_method, publisher=publisher, task_name=task_name,
                                  data_type=data_type, rule_file=rule_file,
                                  label_type=label_type, task_deadline=task_deadline, task_payment=task_payment,
                                  task_difficulty=task_difficulty, choices=choices, sample=sample)
    new_task.save()
    batch_id = 0

    for batch in split_task(task_file_table):
        batch = str(batch.to_dict())
        new_task_file = LabelTaskFile(task_id=new_task, data_file=batch,batch_id=batch_id)
        batch_id += 1
        new_task_file.save()

    return JsonResponse({'err': 'None'})

def create_table_task(request, inspect_method, publisher, task_name, data_type, rule_file,
                          label_type, task_deadline, task_payment, choices, sample):

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
    task_file_table = transform_table_file(task_file_table)
    task_difficulty = estimate_table_difficulty(task_file_table)

    new_task = LabelTasksBaseInfo(inspect_method=inspect_method, publisher=publisher, task_name=task_name,
                                  data_type=data_type,rule_file=rule_file,
                                  label_type=label_type, task_deadline=task_deadline,
                                  task_payment=task_payment,task_difficulty=task_difficulty, choices=choices, sample=sample)
    new_task.save()
    batch_id = 0
    for batch in split_task(task_file_table):
        batch = str(batch.to_dict())
        new_task_file = LabelTaskFile(task_id = new_task, batch_id=batch_id, data_file=batch)
        batch_id += 1
        new_task_file.save()

    return JsonResponse({'err': 'None'})

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
            newTask_param["rule_file"] = rule_text

        if newTask_param["inspect_method"] == "sampling":
            try:
                sample = request.FILE["SampleFile"]
                sample_format = str(sample).split(".")[-1]
                if sample_format == "csv":
                    sample = pd.read_csv(sample_format)
                elif sample_format in ["xls", "xlsx", "xlsm"]:
                    sample = pd.read_excel(sample_format)
                else:
                    return JsonResponse({"err": "Sample file format error! (csv, xls, xlsx, xlsm)"})
                newTask_param["sample"] = sample

            except KeyError:
                return JsonResponse({"err": "Please provide some samples"})
        else:
            sample = ""
            newTask_param["sample"] = sample

        if newTask_param["label_type"] == "choose":
            try:
                choices = request.FILES["ChoiceFile"]
                table_format_permit = ["csv", "xls", "xlsx", "xlsm"]
                choices_file_type = str(choices).split(".")[1]
                if choices_file_type not in table_format_permit:
                    return JsonResponse({'err': "Choices File Wrong! (Support csv, xlsx, xls, xlsm only)"})
                if choices_file_type in ["xls", "xlsx", "xlsm"]:
                    choices = pd.read_excel(choices)
                elif choices_file_type == "csv":
                    choices = pd.read_csv(choices)
                choices = choices.to_dict()
                choices_drop_na = {}
                for question in choices.items():
                    choices_drop_na[question[0]] = []
                    for choice in question[1].items():
                        if choice[1] is not np.nan:
                            choices_drop_na[question[0]].append(choice[1])
                newTask_param["choices"] = json.dumps(choices_drop_na)

            except KeyError:
                return JsonResponse({"err": "Choices File Missing !"})
        else:
            newTask_param["choices"] = ""

        if newTask_param["data_type"] == "table":
            return create_table_task(request, **newTask_param)
        elif newTask_param["data_type"] == "image":
            return create_zip_task(request, **newTask_param)
        elif newTask_param["data_type"] == "audio":
            return create_zip_task(request, **newTask_param)
        elif newTask_param["data_type"] == "text":
            return create_zip_task(request, **newTask_param)


        return JsonResponse({'err': 'None'})

def check(request):
    return render(request, "publisher/check.html", {'UserName': request.user.username})
def finish(request):
    return render(request, "publisher/finish.html", {'UserName': request.user.username})
