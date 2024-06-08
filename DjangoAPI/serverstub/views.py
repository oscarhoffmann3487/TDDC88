from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt 
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse
from rest_framework.views import APIView
from serverstub.models import ImprovementWork
from serverstub.serializers import serverstubSerializer
from rest_framework import status
from rest_framework.response import Response

class PlaceholderApi(APIView):

# This method to get and post data to the serverstub
    def get(self):
        testData = ImprovementWork.get_all_projects()
        serializedTestData = serverstubSerializer(testData)
        return Response(serializedTestData)
