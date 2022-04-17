from django.urls import path
import sys
from labeler import views

app_name = "labeler"

urlpatterns = [
    path('', views.show_tasks, name="show_tasks"),
    path('', views.label_task, name="label_task"),

]