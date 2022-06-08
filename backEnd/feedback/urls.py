from django.urls import path
import sys
from feedback import views

app_name = "feedback"

urlpatterns = [
    path('', views.get_feedback, name="get_feedback"),
]