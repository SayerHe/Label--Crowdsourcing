from django.shortcuts import render
from matplotlib.font_manager import json_dump
from publisher.models import LabelTasksBaseInfo, LabelTaskFile
from login.models import UserInfo
from django.http import HttpResponse, JsonResponse
from io import StringIO
import numpy as np
import pandas as pd
from pathlib import Path
import json
import base64


ZIP_FILES = "zip_tasks"

def show_tasks(request):
    # 筛选任务  eg：只选图片
    DATA_ON_ONE_PAGE = 10
    if request.method == 'GET':
        if 'RequestData' not in request.GET:
            return render(request, "labeler/index.html", {'UserName':request.user.username})
        try:
            select = request.GET['Select']
            t=int(select, base=16)
            datatype = t & ((1<<8) - 1)
            t >>= 8
            label_type = t & ((1<<8) - 1)
            t >>= 8
            TaskDifficulty = t & ((1<<8) - 1)
            t >>= 8
            page = (t & ((1<<8) - 1)) - 1
        except:
            datatype=label_type=TaskDifficulty=None
            page=0
        try:
            keyword = request.GET['Keyword']
        except:
            keyword = None

        tasks = LabelTasksBaseInfo.objects.all()

        datatypelist = []
        if datatype:
            if datatype & (1 << 0):
                datatypelist.append('text')
            if datatype & (1 << 1):
                datatypelist.append('image')
            if datatype & (1 << 2):
                datatypelist.append('audio')
            if datatype & (1 << 3):
                datatypelist.append('video')

        labeltypelist = []
        if label_type:
            if label_type & (1 << 0):
                labeltypelist.append('describe')
            if label_type & (1 << 1):
                labeltypelist.append('choose')
            if label_type & (1 << 2):
                labeltypelist.append('frame')

        TaskDifficultyList = []
        if TaskDifficulty:
            if TaskDifficulty & (1 << 0):
                TaskDifficultyList.append('easy')
            if TaskDifficulty & (1 << 1):
                TaskDifficultyList.append('medium')
            if TaskDifficulty & (1 << 2):
                TaskDifficultyList.append('difficult')

        try:
            if keyword:
                tasks = tasks.filter(task_name__icontains=keyword)
            if datatype:
                tasks = tasks.filter(data_type__in=datatypelist)
            if label_type:
                tasks = tasks.filter(label_type__in=labeltypelist)
            if TaskDifficulty:
                tasks = tasks.filter(task_difficulty__in=TaskDifficultyList)
        except:
            pass

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

def pack_data(request, task_content, task_data_type, task_id, task, label_type):
    task_rule = task.rule_file
    task_choices = ""
    if label_type == "choose":
        task_choices = json.loads(task.choices)
    if task_data_type == "text":
        pass
    elif task_data_type in ["image", "audio"]:
        for i in task_content:
            file_name = i["files"]
            file_path = Path.cwd().parent / ZIP_FILES / task_id / file_name
            with open(file_path, 'rb') as file_file:
                file_data = file_file.read()
                file_base64 = base64.b64encode(file_data)
                file_base64 = str(file_base64, "utf-8")
            i["files"] = file_base64
            i["file_type"] = file_name.split(".")[-1]

    Data = {
        "RuleText": json.dumps(task_rule),
        "TaskContent": json.dumps(task_content),
        "DataType": task_data_type,
        "LabelType": label_type,
        "ChoicesText": json.dumps(task_choices),
    }
    return Data

def label_task(request):
    CrossNum = 10
    PageSize = 3
    if request.method == "GET":
        try:
            task_id = request.GET["TaskID"]
        except KeyError:
            return JsonResponse({"err": "Task info missing !"})
        try:
            PageSize = int(request.GET["DataNum"])
        except KeyError:
            pass
        try:
            task = LabelTasksBaseInfo.objects.get(pk=int(task_id))
        except:
            return JsonResponse({"err": "Task not exist !"})
        task_content_all = LabelTaskFile.objects.get(task_id__id=int(task_id)).data_file
        task_content_all = pd.DataFrame(eval(str(task_content_all)), dtype="str")
        task_data_type = str(task.data_type)
        label_type = str(task.label_type)
        if LabelTasksBaseInfo.objects.get(pk=int(task_id)).inspect_method == "sampling":
            task_content_not_labeled = task_content_all[task_content_all["__Label__"] == ""][:PageSize]
            task_content_not_labeled = task_content_not_labeled.drop(columns=["__Labelers__", "__Times__"])
            task_content = [
                dict(task_content_not_labeled.iloc[i, :]) for i in range(task_content_not_labeled.shape[0])
            ]
            Data = pack_data(request, task_content, task_data_type, task_id, task, label_type)
            return render(request, "labeler/label.html", Data)

        elif LabelTasksBaseInfo.objects.get(pk=int(task_id)).inspect_method == "cross":
            task_content_all = task_content_all[task_content_all["__Times__"].astype(int)<CrossNum]
            task_content_not_labeled = []
            for i in range(task_content_all.shape[0]):
                line = task_content_all.iloc[i, :]
                labelers = task_content_all["__Labelers__"].tolist()[i]
                if labelers == "":
                    task_content_not_labeled.append(line)
                else:
                    labelers = eval(labelers)
                    if request.user.id not in labelers:
                        task_content_not_labeled.append(line)
                if len(task_content_not_labeled) == PageSize:
                    break
            if task_content_not_labeled:
                task_content_not_labeled = pd.DataFrame(task_content_not_labeled).drop(columns=["__Labelers__", "__Times__"])
            else:
                task_content_not_labeled = pd.DataFrame()
            task_content = [
                dict(task_content_not_labeled.iloc[i, :]) for i in range(task_content_not_labeled.shape[0])
            ]
            Data = pack_data(request, task_content, task_data_type, task_id, task, label_type)

            return render(request, "labeler/label.html", Data)

    elif request.method == "POST":
        try:
            task_id = request.POST["TaskID"]
            labels = request.POST["Labels"]
            labels = eval(labels)
        except KeyError:
            return JsonResponse({"err" : "err !"})
        task = LabelTasksBaseInfo.objects.get(pk=int(task_id))
        payment = task.task_payment
        inspect_method = task.inspect_method
        label_type = task.label_type
        user = request.user
        if label_type == "choose":
            choices = list(json.loads(task.choices).items())
            labels_choose = []
            counter = 0
            item_choose = []
            for label in labels:
                question = choices[int(label["question_id"])][0]
                user_choose = label["label"]
                item_choose.append({question: user_choose})
                counter += 1
                if counter == len(choices):
                    labels_choose.append({"id": label["id"], "label": item_choose})
                    item_choose = []
                    counter = 0
            labels = labels_choose

        # 薪酬增加
        old_salary = UserInfo.objects.get(user=user).salary
        UserInfo.objects.get(user=user).salary = old_salary + payment
        # 标签更新
        # 现在一个任务只有一个标签，后续如果需要交叉验证要改为多标签  -- 5.21 done
        table_db = LabelTaskFile.objects.get(task_id__id=int(task_id))
        table = table_db.data_file
        table = pd.DataFrame(eval(table), dtype="str")
        if inspect_method == "sampling":
            for label in labels:
                table.loc[table["__ID__"]==label["id"], ["__Label__"]] = str(label["label"])

        elif inspect_method == "cross":
            for label in labels:
                if table.loc[table["__ID__"]==label["id"], "__Label__"].values[0] == "":
                    table.loc[table["__ID__"]==label["id"], "__Label__"] = str([label["label"]])
                    table.loc[table["__ID__"] == label["id"], "__Times__"] = str(1)
                    table.loc[table["__ID__"] == label["id"], "__Labelers__"] = str([request.user.id])

                else:
                    old_labels = eval(table.loc[table["__ID__"]==label["id"], "__Label__"].values[0])
                    old_labels.append(label["label"])
                    table.loc[table["__ID__"] == label["id"], "__Label__"] = str(old_labels)
                    old_times = table.loc[table["__ID__"] == label["id"], "__Times__"]
                    table.loc[table["__ID__"] == label["id"], "__Times__"] = str(int(old_times) + 1)
                    old_labelers = eval(table.loc[table["__ID__"] == label["id"], "__Labelers__"].values[0])
                    old_labelers.append(request.user.id)
                    table.loc[table["__ID__"] == label["id"], "__Labelers__"] = str(old_labelers)
        table_db.data_file = str(table.to_dict())
        table_db.save()

        return JsonResponse({"err": "none"})

def Center(request):
    return render(request, "labeler/example.html", {'UserName':request.user.username})
