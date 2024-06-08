from django.db import models

# Create your models here.

class Placeholder(models.Model): 
    PlacerholderId = models.AutoField(primary_key=True) 
    PlaceholderNumber = models.CharField(max_length=255, default=0)