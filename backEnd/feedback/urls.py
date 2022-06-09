from django.urls import path
import sys
from feedback import views

app_name = "feedback"

urlpatterns = [
    path('/feedback', views.feedback, name="feedback"),
    path('history/', views.history, name="fhistory"),
]