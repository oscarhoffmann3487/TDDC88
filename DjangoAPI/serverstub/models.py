from django.db import models

# Create your models here.

from datetime import date
from typing import List

class ImprovementWork:
    def __init__(self, id: int, department: str, name: str, owner: str, description: str, participants: List[str], date: date, stage: int, priority: int, comments: List[str], upvote: int, downvote: int):
        self.id = id
        self.name = name
        self.department = department
        #user senare
        self.owner = owner
        self.description = description
        #users egen klass
        self.participants = participants
        self.date = date
        self.stage = stage
        #1-5
        self.priority = priority
        #comments egen klass senare
        self.comments = comments
        self.upvote = upvote
        self.downvote = downvote
    
    def get_all_projects():
        # Replace this with actual data retrieval logic when you integrate the real database
        return [
            (1, 'Akuten', 'Schemaläggning av jour', 'Jens T', 'Nya rutiner vid schemaläggning av jour för att sprida ut obekväma tider', 
            ['Karin F', 'John D', 'Jane D'], "23-09-28", 1, 3,["Bra ide Jens!", "Gå vidare med detta Jens! Jag backar dig"], 7, 2),
            (2, 'Förlossningen', 'Fler raster', 'Per P', 'Skapa fler raster för att kunna öka fokus vid arbetstid och minska utbränning', 
            ['Ramina F', 'Anna D', 'Ellen D'], "23-08-29", 3, 2, ["Detta skulle vara bra!", "Känns som detta inte är något vi behöver prioritera."], 5, 3)
        ]

    

