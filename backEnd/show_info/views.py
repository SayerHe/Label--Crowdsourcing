from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

# Create your views here.

def show_info(request):
    return HttpResponse("Hello, world. You're at the polls index.")
def Center(request):
    return render(request, "show_info/example.html", {'UserName': request.user.username})
def account(request):
    return render(request, "show_info/account.html", {'UserName': request.user.username})