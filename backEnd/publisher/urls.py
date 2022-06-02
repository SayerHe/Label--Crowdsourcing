from django.urls import path
import sys
from publisher import views

app_name = "publisher"

urlpatterns = [
    path('', views.create_task, name="create_task"),
    path('check/', views.check, name="check")
]