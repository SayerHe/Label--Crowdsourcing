from django.shortcuts import render, redirect
from django.contrib import auth
from django.contrib.auth.models import User
from django.urls import reverse
from django.http import HttpResponse,JsonResponse
from login.models import UserInfo

def index(request):
    # 页面初次渲染
    if request.method == "GET":
        if request.user.is_authenticated:
            auth.login(request, request.user)
            return redirect(reverse('main_menu:index'))
        else:
            return render(request, "login/index.html")
    try:
        user_name = request.POST["username"]
        password = request.POST["password"]
    except:
        return JsonResponse({'err':'DataLost'})
    if '@' in user_name:
        try :
            user_name = User.objects.get(email=user_name).username
        except User.DoesNotExist:
            return JsonResponse({'err':'UserDoesNotExist'})
    else:
        try :
            User.objects.get(username=user_name)
        except User.DoesNotExist:
            return JsonResponse({'err':'UserDoesNotExist'})
    user = auth.authenticate(username=user_name, password=password)
    # 如果用户不存在，提示不存在用户，并返回登录界面
    # 如果用户存在，跳转到主界面，并附加session信息
    if not user:
        return JsonResponse({'err':'Password_wrong'})
    else:
        user_type=UserInfo.objects.get(user=user).user_type
        if user_type=='publisher':
            auth.login(request, user)
            return redirect(reverse('main_menu:index'))
        elif user_type=='labeler':
            auth.login(request, user)
            return redirect(reverse('main_menu:index'))
            return redirect(reverse('labeler:show_tasks'))
        else:
            pass
        return JsonResponse({'err':'None'})

def register(request):
    if request.method == "GET":
        return render(request, 'login/register.html')
    # 若已存在用户名，显示相关提示（未实现）并返回登录界面
    # 若不存在用户名，创建用户并返回登录界面
    # 前端的错误提示方式需要改一下
    print(request.POST)
    try:
        Email = request.POST["email"]
        UserName = request.POST["username"]
        Password = request.POST["password"]
        Usertype = request.POST["usertype"]
    except:
        return JsonResponse({'err':'DataLost'})

    if User.objects.filter(email=Email):
        return JsonResponse({'err':'Email_repeat'})
    elif User.objects.filter(username=UserName):
        return JsonResponse({'err':'Username_repeat'})
    else:
        user = User.objects.create_user(username=UserName, email=Email, password=Password)
        user_info = UserInfo(user=user, salary=0, ability=4, user_type=Usertype)
        user.save()
        user_info.save()
        print(user_info.user)
        return JsonResponse({'err':'None'})


