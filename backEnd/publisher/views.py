from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
from django.shortcuts import render, redirect
from django.urls import reverse
import pandas as pd

# Create your views here.

def extract_table_info(data_file):
    table_data = data_file.read().decode("utf8").split("\n")
    table_data = [i.strip().split(",") for i in table_data]
    columns = table_data[0]
    table_data = table_data[1:]
    table_data = pd.DataFrame(table_data)
    table_data.columns = columns
    return table_data

def load_task_info(request):
    if request.method == 'GET':
        return render(request, "publisher/index.html")
    else:
        data_file = request.FILES.get('data_source')

        print(data_file.read())
        # table_data = extract_table_info(data_file)
        # print(table_data)
        return HttpResponse("Successfully upload! ")
        # return redirect(reverse("main_menu:index"))




