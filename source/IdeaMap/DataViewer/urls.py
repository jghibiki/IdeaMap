from django.conf.urls import url, include
from . import views

urlpatterns = [
    # ex: /viewer/
    url(r'^$',
        views.index,
        name='index'),

    # ex: /viewer/map/
    url(r'^map/$',
        views.map,
        name="map"),

    # ex: /viewer/api/auth
    url(r'^api/auth/',
        include(
            'rest_framework.urls',
            namespace='rest_framework')),

    url(r'^api/filters/$', 
        views.Filter_List.as_view())
]
