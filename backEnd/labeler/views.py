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
                datatypelist.append('table')
            if datatype & (1 << 2):
                datatypelist.append('image')
            if datatype & (1 << 3):
                datatypelist.append('audio')
            if datatype & (1 << 4):
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
        for i in task_content:
            file_name = i["files"]
            file_path = Path.cwd().parent / ZIP_FILES / task_id / file_name
            with open(file_path, "r", encoding="utf8") as f:
                text_content = f.read()

            i["files"] = text_content
            i["file_type"] = file_name.split(".")[-1]

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

def filter_label_rollback(x, request):
    if x["__Labelers__"] == "":
        return False
    else:
        if request.user.id in eval(x["__Labelers__"]):
            return True
        else:
            return False

def filter_label_forward(x, request):
    if x["__Labelers__"] == "":
        return True
    else:
        if request.user.id in eval(x["__Labelers__"]):
            return True
        else:
            return False

def forward_index(x, request):
    if x["__Labelers__"] == "":
        return None
    else:
        return eval(x["__Labelers__"]).index(request.user.id)

def find_rollback(request, task_content_all, current_item_id, PageSize):
    if current_item_id < 0:
        current_item_id = abs(current_item_id)
        if current_item_id > PageSize:
            rollback_task = task_content_all[:current_item_id - 1]
            rollback_bool = rollback_task.apply(filter_label_rollback, axis=1, request=request)
            rollback_task = rollback_task[rollback_bool][-PageSize:]
        else:
            # 当回退到头、且最前页不够PageSize条数据时
            rollback_task = task_content_all
            rollback_bool = rollback_task.apply(filter_label_rollback, axis=1, request=request)
            rollback_task = rollback_task[rollback_bool][:PageSize]

        user_index = rollback_task.apply(lambda x: eval(x["__Labelers__"]).index(request.user.id), axis=1)
        for i in rollback_task.index:
            rollback_task.loc[i, "__Label__"] = str(eval(rollback_task.loc[i, "__Label__"])[user_index[i]])
        rollback_task = rollback_task.drop(columns=["__Labelers__", "__Times__"])
        task_content = [
            dict(rollback_task.iloc[i, :]) for i in range(rollback_task.shape[0])
        ]

    else:
        forward_task = task_content_all[current_item_id: ]
        forward_bool = forward_task.apply(filter_label_forward, axis=1, request=request)
        forward_task = forward_task[forward_bool][:PageSize]
        user_index = forward_task.apply(forward_index, axis=1, request=request)

        for i in forward_task.index:
            if not pd.isna(user_index[i]):
                forward_task.loc[i, "__Label__"] = str(eval(forward_task.loc[i, "__Label__"])[int(user_index[i])])
        forward_task = forward_task.drop(columns=["__Labelers__", "__Times__"])
        task_content = [
            dict(forward_task.iloc[i, :]) for i in range(forward_task.shape[0])
        ]

    for i in task_content:
        if i["__Label__"]:
            i["__Label__"] = eval(i["__Label__"])

    return task_content

def show_label_page(request, CrossNum, PageSize, rollback, current_item_id):
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
    if label_type == "frame":
        PageSize = 1
    if LabelTasksBaseInfo.objects.get(pk=int(task_id)).inspect_method == "sampling":
        if rollback is False:
            task_content_not_labeled = task_content_all[task_content_all["__Label__"] == ""][:PageSize]
            task_content_not_labeled = task_content_not_labeled.drop(columns=["__Labelers__", "__Times__"])
            task_content = [
                dict(task_content_not_labeled.iloc[i, :]) for i in range(task_content_not_labeled.shape[0])
            ]
        else:
            task_content = find_rollback(request, task_content_all, current_item_id, PageSize)

        Data = pack_data(request, task_content, task_data_type, task_id, task, label_type)
        return render(request, "labeler/label.html", Data)

    elif LabelTasksBaseInfo.objects.get(pk=int(task_id)).inspect_method == "cross":
        if rollback is False:
            task_content_all = task_content_all[task_content_all["__Times__"].astype(int) < CrossNum]
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
                task_content_not_labeled = pd.DataFrame(task_content_not_labeled).drop(
                    columns=["__Labelers__", "__Times__"])
            else:
                task_content_not_labeled = pd.DataFrame()
            task_content = [
                dict(task_content_not_labeled.iloc[i, :]) for i in range(task_content_not_labeled.shape[0])
            ]
        else:
            task_content= find_rollback(request, task_content_all, current_item_id, PageSize)

        Data = pack_data(request, task_content, task_data_type, task_id, task, label_type)

        return render(request, "labeler/label.html", Data)

def submit_label(request):
    try:
        task_id = request.POST["TaskID"]
        labels = request.POST["Labels"]
        labels = eval(labels)
    except KeyError:
        return JsonResponse({"err": "err !"})
    task = LabelTasksBaseInfo.objects.get(pk=int(task_id))
    payment = task.task_payment
    inspect_method = task.inspect_method
    label_type = task.label_type
    user = request.user
    if label_type == "choose":
        choices = list(json.loads(task.choices).items())
        labels_choose = []
        counter = 0
        item_choose = {}
        for label in labels:
            question = choices[int(label["question_id"])][0]
            user_choose = label["label"]
            item_choose[question] = user_choose
            counter += 1
            if counter == len(choices):
                labels_choose.append({"id": label["id"], "label": item_choose})
                item_choose = {}
                counter = 0
        labels = labels_choose

    # 标签更新
    table_db = LabelTaskFile.objects.get(task_id__id=int(task_id))
    table = table_db.data_file
    table = pd.DataFrame(eval(table), dtype="str")
    if inspect_method == "sampling":
        # 薪酬增加
        old_salary = UserInfo.objects.get(user=user).salary
        UserInfo.objects.get(user=user).salary = old_salary + payment
        for label in labels:
            if request.user.id not in eval(table.loc[table["__ID__"] == label["id"], "__Labelers__"].values[0]):
                table.loc[table["__ID__"] == label["id"], ["__Label__"]] = str([label["label"]])
                table.loc[table["__ID__"] == label["id"], ["__Labelers__"]] = str([int(request.user.id)])
            else:
                old_label = eval(table.loc[table["__ID__"] == label["id"], ["__Label__"]].values[0])
                old_label[0] = str(label["label"])
                table.loc[table["__ID__"] == label["id"], ["__Label__"]] = str(old_label)

    elif inspect_method == "cross":
        for label in labels:
            if table.loc[table["__ID__"] == label["id"], "__Label__"].values[0] == "":
                table.loc[table["__ID__"] == label["id"], "__Label__"] = str([label["label"]])
                table.loc[table["__ID__"] == label["id"], "__Times__"] = str(1)
                table.loc[table["__ID__"] == label["id"], "__Labelers__"] = str([int(request.user.id)])

            else:
                if request.user.id not in eval(table.loc[table["__ID__"] == label["id"], "__Labelers__"].values[0]):
                    old_labels = eval(table.loc[table["__ID__"] == label["id"], "__Label__"].values[0])
                    old_labels.append(label["label"])
                    table.loc[table["__ID__"] == label["id"], "__Label__"] = str(old_labels)
                    old_times = table.loc[table["__ID__"] == label["id"], "__Times__"]
                    table.loc[table["__ID__"] == label["id"], "__Times__"] = str(int(old_times) + 1)
                    old_labelers = eval(table.loc[table["__ID__"] == label["id"], "__Labelers__"].values[0])
                    old_labelers.append(request.user.id)
                    table.loc[table["__ID__"] == label["id"], "__Labelers__"] = str(old_labelers)
                else:
                    old_labels = eval(table.loc[table["__ID__"] == label["id"], "__Label__"].values[0])
                    old_labelers = eval(table.loc[table["__ID__"] == label["id"], "__Labelers__"].values[0])
                    user_index = old_labelers.index(request.user.id)
                    old_labels[user_index] = label["label"]
                    table.loc[table["__ID__"] == label["id"], "__Label__"] = str(old_labels)

    # print(table)
    table_db.data_file = str(table.to_dict())
    table_db.save()

    return JsonResponse({"err": "none"})

def label_page(request):
    CrossNum = 10
    PageSize = 3
    rollback = False
    current_item_id = None
    if request.method == "GET":
        try:
            current_item_id = int(request.GET["CurrentItem"])
            rollback = True
        except KeyError:
            pass
        return show_label_page(request, CrossNum, PageSize, rollback, current_item_id)

    elif request.method == "POST":
        return submit_label(request)


def Center(request):
    return render(request, "labeler/example.html", {'UserName':request.user.username})
