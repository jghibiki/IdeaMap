from django.shortcuts import render, get_object_or_404, get_list_or_404
from django.views import generic
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
