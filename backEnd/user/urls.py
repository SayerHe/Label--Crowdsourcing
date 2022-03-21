from django.urls import path
import sys
from user import views

app_name = "user"

urlpatterns = [
    path('', views.show_tasks, name="show_tasks")
]