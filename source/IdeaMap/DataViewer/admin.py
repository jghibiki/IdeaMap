from django.contrib import admin

# Register your models here.
from .models import Tweet, ProcessedTweet, Frame


admin.site.register(Frame)
admin.site.register(Tweet)

class ProcessedTweetAdmin(admin.ModelAdmin):
    list_display = ('id', 'frame', 'rating', 'classification', 'created_date', 'processed_date')

admin.site.register(ProcessedTweet, ProcessedTweetAdmin)

