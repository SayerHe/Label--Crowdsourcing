from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

# Create your views here.

def show_info(request):
    return HttpResponse("Hello, world. You're at the polls index.")
