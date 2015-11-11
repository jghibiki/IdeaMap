from django.contrib import admin

# Register your models here.
from .models import Tweet, ProcessedTweet


admin.site.register(Tweet)

class ProcessedTweetAdmin(admin.ModelAdmin):
    list_display = ('id', 'rating', 'classification', 'created_date', 'processed_date')

admin.site.register(ProcessedTweet, ProcessedTweetAdmin)

