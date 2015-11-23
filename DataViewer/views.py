from django.shortcuts import render, redirect
from django.conf import settings

# Create your views here.


def index(request):
    return render(
        request,
        "DataViewer/index.html",
        {}
    )


def map(request):
    if not request.user.is_authenticated():
        return redirect('%s?next=%s' % (settings.LOGIN_URL, request.path))
    return render(
        request,
        "DataViewer/map.html",
        {}
    )


