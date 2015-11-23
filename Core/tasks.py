from django_db_geventpool.utils import close_connection
from Core.models import County, State, StateAverage, CountyAverage
from celery import shared_task
from Core.utils import queryset_iterator
from datetime import datetime, timedelta
from django.utils import timezone
from django.db.models import Avg

@shared_task
@close_connection
def generate_averages(time_difference, avg_type):
    now = timezone.now()
    earlier = now - timedelta(minutes=time_difference)
    countyAvgs = []
    for county in queryset_iterator(County.objects.all()):
        avg = county.tweets.filter(created_date__range=[earlier, now]).aggregate(Avg("rating"))["rating__avg"] or 0
        newAverage = CountyAverage(county=county, rating=avg, timestamp=now, type=avg_type)                                     
        countyAvgs.append(newAverage)
    CountyAverage.objects.bulk_create(countyAvgs)

    stateAvgs = []
    for state in State.objects.all():
        avg = CountyAverage.objects.filter(county__state_id=state.pk).aggregate(Avg("rating"))["rating__avg"] 
        newAverage = StateAverage(state=state, rating=avg, timestamp=now, type=avg_type) 
        stateAvgs.append(newAverage)
    StateAverage.objects.bulk_create(stateAvgs)
    return
