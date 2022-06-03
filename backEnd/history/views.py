from django.shortcuts import render

# Create your views here.

def get_history(request):
    return render(request, 'history/index.html')