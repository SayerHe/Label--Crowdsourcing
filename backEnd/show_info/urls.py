from django.urls import path
import sys
from show_info import views

app_name = "show_info"

urlpatterns = [
    path('', views.show_info, name="show_info"),

]