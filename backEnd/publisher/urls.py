from django.urls import path
import sys
from publisher import views

app_name = "publisher"

urlpatterns = [
    path('', views.load_task_info, name="load_info")
]