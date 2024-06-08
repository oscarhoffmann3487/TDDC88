from rest_framework import serializers
from .models import Activity, Assignee, Improvment_work, Keyword,Team, Comment, Answer, Assignee
from user.serializers import UserSerializer, CenterSerializer, UnitSerializer, PlaceSerializer

class Improvment_workSerializer(serializers.ModelSerializer):
    #responsible_user = UserSerializer(read_only=True)
    class Meta:
        model = Improvment_work
        fields = '__all__'

# Serializers for Improvment_work and Team
class Improvment_workSerializer_get(serializers.ModelSerializer):
    responsible_user = UserSerializer(read_only=True)
    class Meta:
        model = Improvment_work        
        fields = '__all__'

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = '__all__'

class KeyWordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Keyword
        fields = '__all__'

class AssigneeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignee
        fields = '__all__'

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = '__all__'

class AssigneeSerializerGet(serializers.ModelSerializer):
    users =  UserSerializer(many=True, read_only=True)
    activity =  ActivitySerializer(read_only=True)
    class Meta:
        model = Assignee
        fields = '__all__'
   
class User_improvementSerializer(serializers.ModelSerializer):
    responsible_user = UserSerializer()  # Include all user fields
    team = TeamSerializer(many=True, source='team_set')  # Include all user fields for team members
    center = CenterSerializer(source='responsible_user.center')
    unit = UnitSerializer(source='responsible_user.unit')
    place = PlaceSerializer(source='responsible_user.place')
    class Meta:
        model = Improvment_work
        fields = '__all__'


class Improvment_commentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = '__all__'

class Improvment_commentgetSerializer(serializers.ModelSerializer):
    User = UserSerializer()  # Include all user fields
    class Meta:
        model = Comment
        fields = '__all__'

class AnswerSerializerGet(serializers.ModelSerializer):
    User = UserSerializer()  # Include all user fields
    class Meta:
        model = Answer
        fields = '__all__'


