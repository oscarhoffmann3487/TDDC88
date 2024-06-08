from rest_framework import serializers
from .models import Notification, User,Center,Place,Unit

# Serializer for User, Center, Place and Unit

class CenterSerializer(serializers.ModelSerializer):

    class Meta:
        model = Center
        fields = '__all__'

class PlaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Place
        fields = '__all__'

class UnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    unit = UnitSerializer()
    class Meta:
        model = User
        fields = '__all__'

class UserSerializerForTest(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class UserEmailSerializer(serializers.ModelSerializer):
    center = CenterSerializer()
    unit = UnitSerializer()
    place = PlaceSerializer()
    class Meta:
        model = User
        fields = '__all__'

class UserSerializerGet(serializers.ModelSerializer):
    center = CenterSerializer()
    unit = UnitSerializer()
    place = PlaceSerializer()
    class Meta:
        model = User
        fields = '__all__'

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

