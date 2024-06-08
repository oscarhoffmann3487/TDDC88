from rest_framework import serializers
from PlaceholderApp.models import Placeholder

class PlaceholderSerializer (serializers.ModelSerializer): 
    class Meta: 
        model = Placeholder
        fields = ['PlacerholderId', 'PlaceholderNumber']
      