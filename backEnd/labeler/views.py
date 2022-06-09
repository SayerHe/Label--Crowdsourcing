from django.shortcuts import render
from publisher.models import LabelTasksBaseInfo, LabelTaskFile
from login.models import UserInfo
from django.http import  JsonResponse
# import numpy as np
import pandas as pd
from pathlib import Path
import datetime
import json
import time
import base64
from pytz import timezone
import ast

ZIP_FILES = "zip_tasks"

def show_tasks(request):
    DATA_ON_ONE_PAGE = 10
    CrossNum=10
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

        task_bases = LabelTasksBaseInfo.objects.all()
        tasks = []
        batch_id = []
        for task_base in task_bases:
            batches = LabelTaskFile.objects.filter(task_id=task_base)
            if task_base.inspect_method == "sampling":
                for batch in batches:
                    if request.user.id in eval(batch.labelers):
                        break
                    if len(eval(batch.labelers))==0:
                        batch_id.append(batch.batch_id)
                        tasks.append(task_base)
                        break
            elif task_base.inspect_method == "cross":
                for batch in batches:
                    if request.user.id in eval(batch.labelers):
                        break
                    if len(eval(batch.labelers))!=CrossNum:
                        batch_id.append(batch.batch_id)
                        tasks.append(task_base)
                        break

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

        dataList = []

        for i in range(page*DATA_ON_ONE_PAGE, page*DATA_ON_ONE_PAGE+DATA_ON_ONE_PAGE):
            try:
                dataList.append({'TaskName': tasks[i].task_name,
                             'DataType': tasks[i].data_type,
                             'LabelType': tasks[i].label_type,
                             'Payment': tasks[i].task_payment,
                             'TaskDifficulty': tasks[i].task_difficulty,
                             'TaskDeadline': tasks[i].task_deadline.astimezone().strftime("%Y/%m/%d"),
                             'RuleText': tasks[i].rule_file,
                             "TaskID": tasks[i].id,
                             "BatchID": batch_id[i]
                             })
            except:
                break

        tasks_info = {"DataNumber": len(tasks), "DataList": dataList}

        return JsonResponse(tasks_info)

    elif request.method == "POST":
        try:
            batch_id = request.POST["BatchID"]
            task_id = request.POST["TaskID"]
        except:
            return JsonResponse({"err": "Missing task info"})

        task = LabelTasksBaseInfo.objects.get(id= task_id)
        task_content = LabelTaskFile.objects.get(task_id=task, batch_id=batch_id).data_file
        task_content = pd.DataFrame(eval(task_content))
        ddl = task.task_deadline
        tzchina = timezone('Asia/Shanghai')
        ddl = ddl.astimezone(tzchina).strftime("%Y-%m-%d")
        user_info = UserInfo.objects.get(user=request.user)

        # user_info.task_log = str(pd.DataFrame(columns=["TaskID", "BatchID", "TaskName", "DataType", "Progress", "LastTime", "Deadline", "TaskState"]).to_dict())
        # user_info.save()

        task_log = pd.DataFrame(eval(user_info.task_log))
        # "TaskID", "BatchID", "TaskName", "DataType", "ItemNum", "LastTime", "TaskState"
        task_log.loc[task_log.shape[0]] = [task_id, batch_id, task.task_name, task.data_type, [0, task_content.shape[0]],
                                           datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"), ddl, "进行中"]
        user_info.task_log = str(task_log.to_dict())
        user_info.save()
        return JsonResponse({"err": "none"})



def pack_data(request, task_content, task_data_type, task_id, task, label_type, finished):
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
        "Finished": finished,
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
        finished = False
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
        if forward_task.shape[0] == 0:
            finished = True
        else:
            finished = False
        task_content = [
            dict(forward_task.iloc[i, :]) for i in range(forward_task.shape[0])
        ]


    for i in task_content:
        if i["__Label__"]:
            try:
                i["__Label__"] = eval(i["__Label__"])
            except:
                pass
    return task_content, finished

def show_label_page(request, CrossNum, PageSize, rollback, current_item_id):
    try:
        task_id = request.GET["TaskID"]
        batch_id = request.GET["BatchID"]
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
    task_content_all = LabelTaskFile.objects.get(task_id=task, batch_id=batch_id).data_file
    task_content_all = pd.DataFrame(eval(task_content_all), dtype="str")
    # print(task_content_all)
    task_data_type = str(task.data_type)
    label_type = str(task.label_type)
    if label_type == "frame":
        PageSize = 1
    if LabelTasksBaseInfo.objects.get(pk=int(task_id)).inspect_method == "sampling":
        if rollback is False:
            task_content_not_labeled = task_content_all[task_content_all["__Label__"] == ""][:PageSize]
            if task_content_not_labeled.shape[0] == 0:
                finished = True
            else:
                finished = False
            task_content_not_labeled = task_content_not_labeled.drop(columns=["__Labelers__", "__Times__"])
            task_content = [
                dict(task_content_not_labeled.iloc[i, :]) for i in range(task_content_not_labeled.shape[0])
            ]
        else:
            task_content, finished = find_rollback(request, task_content_all, current_item_id, PageSize)
            if len(task_content) == 0:
                task_content = task_content_all[:PageSize].to_dict("records")
        Data = pack_data(request, task_content, task_data_type, task_id, task, label_type, finished)
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
                finished = False
            else:
                task_content_not_labeled = pd.DataFrame()
                finished = True

            task_content = [
                dict(task_content_not_labeled.iloc[i, :]) for i in range(task_content_not_labeled.shape[0])
            ]

        else:
            task_content, finished = find_rollback(request, task_content_all, current_item_id, PageSize)
            if len(task_content) == 0:
                task_content = task_content_all[:PageSize].to_dict("records")

        Data = pack_data(request, task_content, task_data_type, task_id, task, label_type, finished)

        return render(request, "labeler/label.html", Data)


def salary_log_sample(user_info, task, label, payment, state, method="new"):
    if method == "new":
        if state == "Success":
            user_info.salary = user_info.salary + payment
        salary_log = pd.DataFrame(eval(user_info.salary_log))
        salary_log.loc[salary_log.shape[0]] = [task.id, task.task_name, label["id"], time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()),
                                               payment, state]
    else:
        salary_log = pd.DataFrame(eval(user_info.salary_log))
        old_state = salary_log.loc[(salary_log["TaskID"] == task.id) & (salary_log["ItemID"]==label["id"]), "State"].values[0]
        if old_state == "Fail" and state == "Success":
            user_info.salary = user_info.salary + payment
        elif old_state == "Success" and state == "Fail":
            user_info.salary = user_info.salary - payment

        salary_log.loc[(salary_log["TaskID"] == task.id) & (salary_log["ItemID"]==label["id"]), ["Time", "State"]] = [time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()),state]
    user_info.salary_log = str(salary_log.to_dict())
    user_info.save()

def salary_log_cross(user_info, task, label, payment, state, cross_finish, method="new"):
    if method == "new":
        if not cross_finish:
            salary_log = pd.DataFrame(eval(user_info.salary_log))
            salary_log.loc[salary_log.shape[0]] = [task.id, task.task_name, label["id"],time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()),payment, state]
            user_info.salary_log = str(salary_log.to_dict())
            user_info.undetermined = user_info.undetermined + payment
        else:
            user_info.undetermined = user_info.undetermined - payment
            if state == "Success":
                user_info.payment = user_info.salary + payment
            salary_log = pd.DataFrame(eval(user_info.salary_log))
            salary_log.loc[(salary_log["TaskID"] == task.id) & (salary_log["ItemID"] == label["id"]), "State"] = state

    else:
        if not cross_finish:
            salary_log = pd.DataFrame(eval(user_info.salary_log))
            salary_log.loc[(salary_log["TaskID"] == task.id) & (salary_log["ItemID"] == label["id"]), "Time"] = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        else:
            salary_log = pd.DataFrame(eval(user_info.salary_log))
            old_state = salary_log.loc[(salary_log["TaskID"] == task.id) & (salary_log["ItemID"]==label["id"]), "State"].values[0]
            if old_state == "Fail" and state == "Success":
                user_info.salary = user_info.salary + payment
            elif old_state == "Success" and state == "Fail":
                user_info.salary = user_info.salary - payment
            salary_log.loc[(salary_log["TaskID"] == task.id) & (salary_log["ItemID"] == label["id"]), ["Time", "State"]] = [time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()),state]
    # print(salary_log)
    user_info.salary_log = str(salary_log.to_dict())
    user_info.save()

def submit_label(request, CrossNum):
    try:
        task_id = request.POST["TaskID"]
        batch_id = request.POST["BatchID"]
        labels = request.POST["Labels"]
        labels = eval(labels)
    except KeyError:
        return JsonResponse({"err": "err !"})
    task = LabelTasksBaseInfo.objects.get(pk=int(task_id))
    payment = task.task_payment
    inspect_method = task.inspect_method
    label_type = task.label_type
    user_info = UserInfo.objects.get(user=request.user)

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
    table_db = LabelTaskFile.objects.get(task_id__id=int(task_id), batch_id=batch_id)
    table = table_db.data_file
    table = pd.DataFrame(eval(table), dtype="str")
    if inspect_method == "sampling":
        for label in labels:
            if table.loc[table["__ID__"] == label["id"], "__Labelers__"].values[0] == "":
                table.loc[table["__ID__"] == label["id"], "__Label__"] = str([label["label"]])
                table.loc[table["__ID__"] == label["id"], "__Labelers__"] = str([request.user.id])
                salary_log_sample(user_info, task, label, payment, "Success", method="new")
            else:
                old_label = eval(table.loc[table["__ID__"] == label["id"], "__Label__"].values[0])
                old_label[0] = str(label["label"])
                table.loc[table["__ID__"] == label["id"], "__Label__"] = str(old_label)
                salary_log_sample(user_info, task, label, payment, "Success", method="update")

    elif inspect_method == "cross":
        for label in labels:
            if table.loc[table["__ID__"] == label["id"], "__Label__"].values[0] == "":
                table.loc[table["__ID__"] == label["id"], "__Label__"] = str([label["label"]])
                table.loc[table["__ID__"] == label["id"], "__Times__"] = str(1)
                table.loc[table["__ID__"] == label["id"], "__Labelers__"] = str([request.user.id])
                # 记录历史行为
                salary_log_cross(user_info, task, label, payment, "Undetermined", cross_finish=False, method="new")
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
                    # 记录历史行为
                    times = table.loc[table["__ID__"] == label["id"], "__Times__"].values[0]
                    salary_log_cross(user_info, task, label, payment, "Undetermined", cross_finish=False, method="new")
                    if int(times) == int(CrossNum):
                        labelers_log = eval(table.loc[table["__ID__"] == label["id"], "__Labelers__"].values[0])
                        right_label = table.loc[table["__ID__"] == label["id"], "__Label__"].value_counts().index[0]
                        for i in range(len(labelers_log)):
                            user_info_i = UserInfo.objects.get(user__id=labelers_log[i])
                            user_label = eval(table.loc[table["__ID__"] == label["id"], "__Label__"].values[0])[i]
                            # 用户是否成功的的判断   --好nmd复杂
                            if user_label == right_label:
                                state = "Success"
                            else:
                                state = "Fail"
                            salary_log_cross(user_info_i, task, label, payment, state, cross_finish=True, method="new")

                else:
                    old_labels = eval(table.loc[table["__ID__"] == label["id"], "__Label__"].values[0])
                    old_labelers = eval(table.loc[table["__ID__"] == label["id"], "__Labelers__"].values[0])
                    user_index = old_labelers.index(request.user.id)
                    old_labels[user_index] = label["label"]
                    table.loc[table["__ID__"] == label["id"], "__Label__"] = str(old_labels)
                    if table.loc[table["__ID__"] == label["id"], "__Times__"].values[0] == CrossNum:
                        labelers_log = table.loc[table["__ID__"] == label["id"], "__Labelers__"].tolist()
                        right_label = table.loc[table["__ID__"] == label["id"], "__Label__"].value_counts().index[0]
                        for i in range(len(labelers_log)):
                            user_info_i = UserInfo.objects.get(user__id=labelers_log[i])
                            user_label = table.loc[table["__ID__"] == label["id"], "__Label__"][i]
                            # 用户是否成功的的判断   --好nmd复杂
                            if user_label == right_label:
                                state = "Success"
                            else:
                                state = "Fail"
                            salary_log_cross(user_info_i, task, label, payment, state, cross_finish=True, method="update")
                    else:
                        salary_log_cross(user_info, task, label, payment, "Undetermined", cross_finish=False, method="update")
    table_db.data_file = str(table.to_dict())
    table_db.save()

    # 记录task的历史信息
    task_log = pd.DataFrame(eval(user_info.task_log))
    # ["TaskID", "BatchID", "TaskName", "DataType", "Progress", "LastTime", "TaskState"]
    task_content = LabelTaskFile.objects.get(task_id=task, batch_id=batch_id).data_file
    task_content = pd.DataFrame(eval(task_content))
    process = []
    if inspect_method == "cross":
        for i in range(task_content.shape[0]):
            try:
                labelers = eval(task_content.iloc[i, :]["__Labelers__"])
            except:
                labelers = []
            if str(request.user.id) in labelers:
                process.append(True)
            else:
                process.append(False)
        process = [sum(process), len(process)]

    elif inspect_method == "sampling":
        labeled = task_content.loc[task_content["__Label__"] != ""]
        process = [labeled.shape[0], task_content.shape[0]]

    if process[0]/process[1] == 1:
        state = "Finished"
    else:
        state ="Unfinished"

    new_log = [task.id, batch_id, task.task_name, task.data_type, process,
               time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()), task.task_deadline, state]

    task_log.loc[task_log["TaskID"] == task.id] = new_log
    user_info.task_log = str(task_log.to_dict())
    user_info.save()

    return JsonResponse({"err": "none"})

def label_page(request):
    CrossNum = 5
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
        return submit_label(request, CrossNum)

def Center(request):
    return render(request, "labeler/example.html", {'UserName':request.user.username})
