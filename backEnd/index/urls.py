from django.urls import path
import sys
from index import views
from backEnd import settings

app_name = "index"

urlpatterns = [
    path('', views.index, name="index"),
    
]