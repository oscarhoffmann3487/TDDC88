from django.urls import path
from .views import PlaceholderApi

urlpatterns = [
    path('data',PlaceholderApi.as_view())
]