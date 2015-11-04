from django.conf.urls import url, include
from rest_framework import routers
from . import views

# REST Framework Router Setup
router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)

urlpatterns = [
    #ex: /viewer/
    url(r'^$', views.index, name='index'),

    #ex: /viewer/tweets/
    url(r'^tweets/$', views.TweetView.as_view(), name='tweets'),

    #ex: /viewer/<tweet id>
    url(r'^tweet/(?P<pk>[0-9]+)/$', views.TweetDetailView.as_view(), name='tweetDetail'),

    #ex: /viewer/map/
    url(r'^map/$', views.map, name="map"),

    #ex: /viewer/api/auth
    url(r'^api/auth/', include('rest_framework.urls', namespace='rest_framework')),

    url(r'^api/', include(router.urls)),
]
