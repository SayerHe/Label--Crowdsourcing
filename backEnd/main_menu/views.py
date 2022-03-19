from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.


def index(request):
    user = request.user
    if not user.is_authenticated:
        return HttpResponse("Log in please")
    else:
        return render(request, 'main_menu/index.html', {"UserName":user.username})

