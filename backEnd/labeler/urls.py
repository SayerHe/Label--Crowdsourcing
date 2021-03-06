from django.urls import path
import sys
from labeler import views

app_name = "labeler"

urlpatterns = [
    path('', views.show_tasks, name="show_tasks"),
    path('label_task/', views.label_page, name="label_task"),
    path('try_task/', views.try_task, name="try_task"),
]