from django.db import models
# from Improvment.models import Improvment_work
from django.utils import timezone

# Database models for Center, Unit, Place and User
class Center(models.Model):
    name = models.CharField(max_length=50)

class Unit(models.Model):
    name = models.CharField(max_length=50)

class Place(models.Model):
    name = models.CharField(max_length=50)    

class User(models.Model):
    has_id = models.AutoField(primary_key=True)
    profession = models.CharField(max_length=50)
    email = models.EmailField()
    last_name = models.CharField(max_length=50)
    first_name = models.CharField(max_length=50)
    auth_lvl = models.IntegerField(blank=False, null=False)

    ########## Foregin key references ########
    center = models.ForeignKey(Center, on_delete=models.CASCADE)
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE)
    place = models.ForeignKey(Place, on_delete=models.CASCADE)

class Notification(models.Model):
    read=models.BooleanField(default=False)
    notification_content=models.CharField(max_length=300)
    date=models.DateTimeField(default=timezone.now)
    ########## Foregin key references ##########
    user_has_id = models.ManyToManyField(User, related_name='user_has_id', blank=True)
