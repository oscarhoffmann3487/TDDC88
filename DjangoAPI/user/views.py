from .serializers import UserSerializerForTest, NotificationSerializer, UserSerializer, CenterSerializer,PlaceSerializer,UnitSerializer,UserEmailSerializer, UserSerializerGet
from user.models import User, Center, Place, Unit, Notification
from rest_framework.response import Response
from Improvment.models import Improvment_work
from django.core.exceptions import ObjectDoesNotExist

from rest_framework.views import APIView
from rest_framework import status


 

# View for User, Centewer, Place, Unit

# Accecced from /user/user
class UserApi(APIView): 
    def post(self, request): 
        serializer = UserSerializerForTest(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many = True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
#Accecced from /user/UserGetByName
class UserGetByName(APIView):
    def get(self, request):
         member_name = request.query_params.get('name')
         name_parts =  member_name.split()
         
         if len(name_parts) == 2:
             member_first_name, member_last_name = name_parts
             queryset = User.objects.filter(first_name=member_first_name, last_name=member_last_name)
         elif len(name_parts) == 1:
             member_name = request.query_params.get('name')
             queryset_first = User.objects.filter(first_name=member_name)
             queryset_last = queryset = User.objects.filter(last_name=member_name)
             queryset = queryset_first.union(queryset_last)
         else :
             return Response("No name")
         serializer =  UserSerializerGet(queryset, many = True)
         if serializer.data != []:
            return Response(serializer.data)
         else:
             return Response("No match")
        


# Accecced from /user/center        
class CenterApi(APIView): 
    def post(self,request): 
        serializer = CenterSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
    
    def get(self, request):
        centers = Center.objects.all()
        serializer = CenterSerializer(centers, many = True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# Accecced from /user/place     
class PlaceApi(APIView): 
    def post(self,request): 
        serializer = PlaceSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        places = Place.objects.all()
        serializer = CenterSerializer(places, many = True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

# Accecced from /user/unit  
class UnitApi(APIView): 
    def post(self,request): 
        serializer = UnitSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        unit = request.query_params.get('id')
        serializer = UnitSerializer(unit, many = True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
# Accecced from /user/userfromemail
class UserFromEmailApi(APIView):
    def get(self, request):
        email = request.query_params.get('email')

        try:
            user = User.objects.get(email=email)
            serializer = UserEmailSerializer(user, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"message": f"User with email {email} does not exist."}, status=status.HTTP_404_NOT_FOUND)
        

###########Notifications#################
class NotificationIWApi(APIView):
    def post(self, request):
        users_id = None
        if "users_id" in request.data:
            users = request.data["users_id"]
            request.data.pop("users_id")
            users_id = [m['id'] for m in users]

        serializer = NotificationSerializer(data = request.data)
        if serializer.is_valid():
            instance = serializer.save()
            if users_id:
                users = User.objects.filter(pk__in=users_id)
                for user in users:
                    instance.user_has_id.add(user)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request):
        try:
            user_id = request.data.get('id')
            notifications = Notification.objects.filter(user_has_id=user_id)
        except Notification.DoesNotExist:
            return Response({"error": "Notifications not found"}, status=status.HTTP_404_NOT_FOUND)
        
        for notification in notifications:
            notification.read = True
            notification.save()

        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)
    
    def get(self, request):
        user_id = request.query_params.get('id')
        if not user_id:
            return Response({"message": "User ID parameter is missing."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            notifications = Notification.objects.filter(user_has_id=user_id)

        except ObjectDoesNotExist: 
            return Response({"message": f"No Improvement Works found for member with ID '{user_id}'."}, status=status.HTTP_404_NOT_FOUND)
        
        # Serialize the queryset and return the data
        notifications_serializer = NotificationSerializer(notifications, many=True)
        
        return Response(notifications_serializer.data)