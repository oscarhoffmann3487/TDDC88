from tkinter import Place
from django.db import models
from user.models import User
from django.utils import timezone

# Create your models here.

class Improvment_work(models.Model): 
    name = models.CharField(max_length=50, null=True)
    description = models.CharField(max_length=1000, null=True)
    pdsa_tag = models.CharField(max_length=1, null=True)
    upvotes = models.IntegerField(null=True)
    problem = models.CharField(max_length=1000, null=True)
    goal = models.CharField(max_length=1000, null=True)
    how = models.CharField(max_length=1000, null=True)
    ideas = models.CharField(max_length=1000, null=True)
    how_goal = models.CharField(max_length= 1000, null=True)
    plan = models.CharField(max_length=1000, null=True)
    planned_time = models.CharField(max_length=1000, null=True)
    improvment = models.CharField(max_length=1000, null=True)
    time = models.CharField(max_length= 1000, null=True)
    trends = models.CharField(max_length=1000, null=True)
    effects = models.CharField(max_length=1000, null=True)
    evaluate_changes = models.CharField(max_length=1000, null=True)
    teachings = models.CharField(max_length= 1000, null=True)
    evaluate_plan = models.CharField(max_length=1000, null=True)
    improvment_plan = models.CharField(max_length=1000, null=True)
    evaluate_do = models.CharField(max_length= 1000, null=True)
    next_step = models.CharField(max_length=1000, null=True)
    spreading = models.CharField(max_length=1000, null=True)
    maintain = models.CharField(max_length=1000, null=True)
    future = models.CharField(max_length=1000, null=True)
    archive = models.CharField(max_length=1000, null=True)
    archive_date = models.CharField(max_length=1000, null=True)

    ###############Forigen keys####################33
    responsible_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='Owned_projects')
    created_at = models.DateTimeField(default=timezone.now)
    finished = models.BooleanField(default=False)
    published = models.BooleanField(default=True)
    liked_by_users = models.ManyToManyField(User, related_name='liked_improvement_works', blank=True)

class Team(models.Model): 
    Improvment_work = models.ForeignKey(Improvment_work, on_delete=models.CASCADE)
    members = models.ManyToManyField(User, related_name='teams')

class Keyword(models.Model):
    keyword = models.CharField(max_length=255, primary_key=True)
    Improvment_work = models.ManyToManyField(Improvment_work, related_name='improvment_work')

class Activity(models.Model):
    title = models.CharField(max_length=50)
    description = models.CharField(max_length=300)
    priority_level = models.CharField(max_length=1)
    pdsa_tag = models.CharField(max_length=1)
    finished = models.BooleanField(default=False)

    ##################### Forigen Key######################
    Improvment_work = models.ForeignKey(Improvment_work, on_delete=models.SET_NULL, null=True, related_name='Activitys_to_projects')

class Assignee(models.Model): 
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE, related_name='activity_for_team')
    users = models.ManyToManyField(User, related_name='teams_activity')
    
class Comment(models.Model):
    comment = models.CharField(max_length=1000, null=False)
    created_at = models.DateTimeField(default=timezone.now)
    ### Foreign keys ###
    User = models.ForeignKey(User, on_delete=models.CASCADE)
    Improvment_work = models.ForeignKey(Improvment_work, on_delete=models.CASCADE)

class Answer(models.Model):
    answer = models.CharField(max_length=1000, null=False)
    created_at = models.DateTimeField(default=timezone.now)
    ### Foreign keys ###
    Comment = models.ForeignKey(Comment, on_delete=models.CASCADE)
    User = models.ForeignKey(User, on_delete=models.CASCADE)


