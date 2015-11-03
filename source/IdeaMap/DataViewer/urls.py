from django.conf.urls import url

from . import views

urlpatterns = [
    #ex: /viewer/
    url(r'^$', views.index, name='index'),

    #ex: /viewer/tweets/
    url(r'^tweet?s/$', views.TweetView.as_view(), name='tweets'),

    #ex: /viwer/<tweet id>
    url(r'^tweet?s/(?P<pk>[0-9]+)/$', views.TweetDetailView.as_view(), name='tweetDetail'),
]
