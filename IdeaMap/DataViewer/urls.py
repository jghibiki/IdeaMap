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
]
