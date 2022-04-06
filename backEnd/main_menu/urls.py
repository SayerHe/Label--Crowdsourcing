from django.urls import path
import sys
from main_menu import views

app_name = "main_menu"

urlpatterns = [
    path('', views.index, name="index")
]