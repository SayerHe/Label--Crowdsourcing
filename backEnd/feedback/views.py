from django.shortcuts import render

# Create your views here.

# def get_feedback(request):
#
#     return 0
def feedback(request):
    if request.method == "GET":
        return render(request, "feedback/feedback.html", {'UserName': request.user.username})

