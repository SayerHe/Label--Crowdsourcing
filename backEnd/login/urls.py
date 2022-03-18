from django.urls import path
import sys
from login import views
from backEnd import settings

app_name = "login"

urlpatterns = [
    path('', views.index, name="index"),
    path('register/', views.register, name="register")
]