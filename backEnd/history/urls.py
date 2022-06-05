from django.urls import path
import sys
from history import views

app_name = "history"

urlpatterns = [
    path('', views.get_history, name="get_history"),
]