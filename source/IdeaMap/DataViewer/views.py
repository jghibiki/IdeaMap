from django.shortcuts import render, get_object_or_404, get_list_or_404
from django.contrib.auth.models import User, Group
from django.views import generic
from rest_framework import viewsets
from .serializers import UserSerializer, GroupSerializer
from .models import ProcessedTweet

# Create your views here.


def index(request):
    return render(
        request,
        "DataViewer/index.html",
        {}
    )


class TweetView(generic.ListView):
    template_name = "DataViewer/tweets.html"
    context_object_name = "latest_tweets_list"

    def get_queryset(self):
        """Return last 5 tweets"""
        return ProcessedTweet.objects.order_by('-processed_date')[:5]


class TweetDetailView(generic.DetailView):
    model = ProcessedTweet
    template_name = "DataViewer/detail.html"
    context_object_name = "tweet"

def map(request):
    return render(
        request,
        "DataViewer/map.html",
        {}
    )


# REST API Views
class UserViewSet(viewsets.ModelViewSet):
    """
    API Endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

class GroupViewSet(viewsets.ModelViewSet):
    """
    API Endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
