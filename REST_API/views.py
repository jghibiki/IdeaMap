from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from rest_framework import viewsets, status, permissions
from rest_framework.reverse import reverse
from rest_framework.decorators import detail_route, list_route
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User, Group
from .serializers import *
from Core.models import ProcessedTweet, Filter

class Filter_List(APIView):
    """
    List filters or create a new filter.

    GET requests are paginated with '?page=<page>'
    """

    def get(self, request):
        if request.user.is_authenticated():
            filters = Filter.objects.filter(owner=request.user)

            paginator = Paginator(filters, 100)
            page = request.GET.get('page')

            try:
                paginated_filters = paginator.page(page)
            except PageNotAnInteger:
                paginated_filters = paginator.page(1)
            except EmptyPage:
                paginated_filters = paginator.page(paginator.num_pages)

            serializer = FilterSerializer(paginated_filters, many=True)
            return Response(serializer.data)
        else:
            return Response(
                status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        if request.user.is_authenticated():
            data = request.data
            data["owner"] = request.user.pk
            serializer = FilterSerializer(data=data)

            if serializer.is_valid():
                serializer.save()
                return Response(
                    serializer.data,
                    status=status.HTTP_201_CREATED)
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST)


class Filter_Detail(APIView):
    """
    Retrieve, update, or delete a filter innstance.
    """
    def get(self, request, pk):
        try:
            filter = Filter.objects.get(pk=pk)
        except Filter.DoesNotExsist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = FilterSerializer(filter)
        return Response(serializer.data)

    def post(self, request):
        try:
            filter = Filter.objects.get(pk=pk)
        except Filter.DoesNotExsist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = FilterSerializer(filter)

        serializer = FilterSerializer(filter, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            filter = Filter.objects.get(pk=pk)
        except Filter.DoesNotExsist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        filter.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class Tweet_List(APIView):
    """
    List tweets

    GET requests paginated with '?page=<page>'
    """
    def get(self, request):
        tweets = ProcessedTweet.objects.all()
        paginator = Paginator(tweets, 2000)
        page = request.GET.get('page')

        try:
            paginated_tweets = paginator.page(page)
        except PageNotAnInteger:
            paginated_tweets = paginator.page(1)
        except EmptyPage:
            paginated_tweets = paginator.page(paginator.num_pages)

        serializer = ProcessedTweetSerializer(paginated_tweets, many=True)
        return Response(serializer.data)
