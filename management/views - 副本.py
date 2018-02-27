from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.contrib.auth.decorators import user_passes_test, login_required
from django.contrib.auth.models import User
from django.contrib import auth
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from management.models import MyUser,Parameter
from django.core.urlresolvers import reverse
from management.utils import permission_check
from django.db.models import Q


def index(request):
    user = request.user if request.user.is_authenticated() else None
    content = {
        'active_menu': 'homepage',
        'user': user,
    }
    return render(request, 'management/index.html', content)


def signup(request):
    if request.user.is_authenticated():
        return HttpResponseRedirect(reverse('homepage'))
    state = None
    if request.method == 'POST':
        password = request.POST.get('password', '')
        repeat_password = request.POST.get('repeat_password', '')
        if password == '' or repeat_password == '':
            state = 'empty'
        elif password != repeat_password:
            state = 'repeat_error'
        else:
            username = request.POST.get('username', '')
            if User.objects.filter(username=username):
                state = 'user_exist'
            else:
                new_user = User.objects.create_user(username=username, password=password,
                                                    email=request.POST.get('email', ''))
                new_user.save()
                new_my_user = MyUser(user=new_user, nickname=request.POST.get('nickname', ''))
                new_my_user.save()
                state = 'success'
    content = {
        'active_menu': 'homepage',
        'state': state,
        'user': None,
    }
    return render(request, 'management/signup.html', content)


def login(request):
    if request.user.is_authenticated():
        return HttpResponseRedirect(reverse('homepage'))
    state = None
    if request.method == 'POST':
        username = request.POST.get('username', '')
        password = request.POST.get('password', '')
        user = auth.authenticate(username=username, password=password)
        if user is not None:
            auth.login(request, user)
            return HttpResponseRedirect(reverse('homepage'))
        else:
            state = 'not_exist_or_password_error'
    content = {
        'active_menu': 'homepage',
        'state': state,
        'user': None
    }
    return render(request, 'management/login.html', content)


def logout(request):
    auth.logout(request)
    return HttpResponseRedirect(reverse('homepage'))


@login_required
def set_password(request):
    user = request.user
    state = None
    if request.method == 'POST':
        old_password = request.POST.get('old_password', '')
        new_password = request.POST.get('new_password', '')
        repeat_password = request.POST.get('repeat_password', '')
        if user.check_password(old_password):
            if not new_password:
                state = 'empty'
            elif new_password != repeat_password:
                state = 'repeat_error'
            else:
                user.set_password(new_password)
                user.save()
                state = 'success'
        else:
            state = 'password_error'
    content = {
        'user': user,
        'active_menu': 'homepage',
        'state': state,
    }
    return render(request, 'management/set_password.html', content)


@user_passes_test(permission_check)
def add_parameter_bus(request):
    user = request.user
    pass
    return render(request, 'management/add_parameter_bus.html')

def view_parameters_list(request):
    user = request.user if request.user.is_authenticated() else None
    query_category  = request.GET.get('category','analog')
    if(query_category == "analog"):
        parameter_list = Parameter.objects.all()
    else:
         query_category = "analog"
         parameter_list = Parameter.objects.all()

    if request.method =="POST":
        keyword = request.POST.get('keyword', '')
        parameter_list = Parameter.objects.filter(Q(name__contains=keyword) | Q(identifier__contains=keyword)|Q(name_output__contains=keyword))
        query_category = 'analog'

    paginator = Paginator(parameter_list, 5)
    page = request.GET.get('page')
    try:
        parameter_list = paginator.page(page)
    except PageNotAnInteger:
        parameter_list = paginator.page(1)
    except EmptyPage:
        parameter_list = paginator.page(paginator.num_pages)
    content = {
        'user': user,
        'active_menu': 'view_goods',
        'query_category': query_category,
        'parameter_list': parameter_list,
    }
    return render(request, 'management/view_parameters_list.html', content)



def detail(request):
    user = request.user if request.user.is_authenticated() else None
    book_id = request.GET.get('id', '')
    if book_id == '':
        return HttpResponseRedirect(reverse('view_book_list'))
    try:
        book = Book.objects.get(pk=book_id)
    except Book.DoesNotExist:
        return HttpResponseRedirect(reverse('view_book_list'))
    content = {
        'user': user,
        'active_menu': 'view_book',
        'book': book,
    }
    return render(request, 'management/detail.html', content)


@user_passes_test(permission_check)
def add_parameter(request):
    user = request.user
    state = None
    if request.method == 'POST':
        try:
            new_parameter = Parameter(
                    name = request.POST.get('name', ''),
                    identifier = request.POST.get('identifier', ''),
                    name_output = request.POST.get('name_output', ''),
                    range_min = request.POST.get('range_min', ''),
                    range_max = request.POST.get('range_max', ''),
                    unit = request.POST.get('unit', ''),
                    accuracy = request.POST.get('accuracy', ''),
                    samplerate = request.POST.get('samplerate', ''),
                    type = request.POST.get('type', ''),
                    source = request.POST.get('source', ''),
                    ground_monitor = request.POST.get('ground_monitor', ''),
                    airborne_monitor = request.POST.get('airborne_monitor', ''),
                    system = request.POST.get('system', ''),
                    responsibility = request.POST.get('responsibility', '')
            )
            new_parameter.save()
        except Book.DoesNotExist as e:
            state = 'error'
            print(e)
        else:
            state = 'success'
    content = {
        'user': user,
        'state': state,
        'active_menu': 'add_img',
    }
    return render(request, 'management/add_parameter.html', content)

