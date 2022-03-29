from django.urls import path
import sys
from labeler import views

app_name = "labeler"

urlpatterns = [
    path('', views.show_tasks, name="show_tasks")
]