from django.urls import path
from .views import PlaceholderApi

urlpatterns = [
    path('item',PlaceholderApi.as_view())
]