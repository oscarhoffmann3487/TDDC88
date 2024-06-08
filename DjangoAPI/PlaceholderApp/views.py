from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt 
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse
from rest_framework.views import APIView
from PlaceholderApp.models import Placeholder
from PlaceholderApp.serializers import PlaceholderSerializer
from rest_framework import status
from rest_framework.response import Response

class PlaceholderApi(APIView):
# This method is used to create stock database objects in the database. 
    def get(self, request):
        placeholder = Placeholder.objects.all()
        placeholder_serializer = PlaceholderSerializer(placeholder, many = True)
        return Response(placeholder_serializer.data)
       
    def post(self, request):
        placeholder_data = JSONParser().parse(request)
        print(placeholder_data)
        placeholder_serializer = PlaceholderSerializer(data = placeholder_data)
        if placeholder_serializer.is_valid(): 
            placeholder_serializer.save()
            return JsonResponse({"message": "Added Successfully"}, status=status.HTTP_201_CREATED)
        else:
            return JsonResponse(placeholder_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        




