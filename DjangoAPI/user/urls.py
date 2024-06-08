from django.urls import path
from .views import NotificationIWApi, UserApi, CenterApi, UnitApi, PlaceApi, UserFromEmailApi, UserGetByName

# URLs for /user
urlpatterns = [
    path('user', UserApi.as_view()),
    path('center', CenterApi.as_view()),
    path('unit', UnitApi.as_view()),
    path('place', PlaceApi.as_view()),
    path('userfromemail', UserFromEmailApi.as_view()),
    path('userName', UserGetByName.as_view()),
    path('iwNotification', NotificationIWApi.as_view())
]
