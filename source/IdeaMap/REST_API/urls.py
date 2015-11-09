from django.conf.urls import url, include
from . import views

urlpatterns = [
    # ex: /api/filters/
    url(r'^filters/$', 
        views.Filter_List.as_view())
]
