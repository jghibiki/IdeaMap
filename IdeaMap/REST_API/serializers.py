from django.contrib.auth.models import User, Group
from rest_framework import serializers, models
from Core.models import Tweet, ProcessedTweet, County, Filter

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'groups')

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('id', 'name')

class FilterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Filter
        fields = ('id', 'name', 'pattern', 'owner')

class ProcessedTweetSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProcessedTweet
        fields = (
            'id',
            'text',
            'processed_date',
            'created_date',
            'entities',
            'original', 
            'rating',
            'classification',
            'point')

class CountySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = County
        fields = (
            'statefp',
            'countyfp',
            'countyns',
            'geoid',
            'name',
            'namelsad',
            'lsad',
            'classfp',
            'mtfcc',
            'csafp',
            'cbsafp',
            'metdivfp',
            'funcstat',
            'aland',
            'awater',
            'intptlat',
            'intptlon',
            'geom'
        )
