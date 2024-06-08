import random
import django
import os
import json
import requests
import time
import random 
from datetime import datetime, timedelta

from django.core.management import call_command
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'DjangoAPI.settings')

def populate_db():

    # Make Django migrations for the Improvment app
    call_command('makemigrations', 'Improvment')
    call_command('makemigrations', 'user')
    call_command('makemigrations')
    call_command('migrate')
    
    from user.models import Center, Unit, Place, User
    from Improvment.models import Improvment_work, Comment, Answer,Team
    confirmation = input("This will wipe your database. Are you sure you want to proceed? (yes/no): ")
    if confirmation.lower() == "yes":
        # Use Django's management commands to wipe the database
        call_command('flush', '--noinput')  # Use 'reset' instead of 'flush' if you want to reset database sequences

        print("Database wiped successfully.")
    else:
        print("Database wipe cancelled.")

        
    def randomint():
            return random.randint(3, 15)
    # Function to generate random last name
    def generate_random_first_name():
        with open('descriptions.txt', 'r') as file:
            data = json.load(file)
            first_names = data["first_names"]
        return random.choice(first_names)
    # Function to generate random first name
    def generate_random_last_name():
        with open('descriptions.txt', 'r') as file:
            data = json.load(file)
            last_names = data["last_names"]
        return random.choice(last_names)

    # Function to generate a random email
    def generate_random_email(first_name,last_name):
        return f"{first_name.lower()}.{last_name.lower()}@{'regionostergotland.se'}"

    units = [
        "Barn- och kvinnocentrum",
        "Centrum för kirurgi, ortopedi och cancervård",
        "Diagnostikcentrum",
        "Hjärtcentrum",
        "Medicincentrum",
        "Primärvårdscentrum",
        "Psykriatricentrum",
        "Sinnescentrum"
    ]

    professions = [
        "Sjuksköterska",
        "Läkare",
        "Kirurg",
        "Psykiater",
        "Ortoped",
        "Kardiolog",
        "Neurolog",
        "Endokrinolog",
        "Reumatolog",
        "Geriatrisk specialist",
        "Dermatolog",
        "Pediatrisk specialist",
        "Obstetriker",
        "Gynekolog",
        "Urolog",
        "Intensivvårdsspecialist",
        "Akutsjuksköterska",
        "Onkolog"
        "Barnmorska",
        "Psykiater",
        "Fysioterapeut",
        "Apotekare",
        "Psykolog",
        "Dietist",
        "Logoped",
        "Biomedicinsk analytiker",
        "Röntgensjuksköterska",
    ]

    center = [
       "Akutavdelningen, Universitetssjukhuset",
        "Kirurgen, Universitetssjukhuset",
        "Mödraravdelningen, Universitetssjukhuset"
    ]

    place = [
        "Linköping",
        "Norrköping",
        "Motala"
    ]

    PGSA = [
        "P",
        "G",
        "S",
        "A"
    ]

    Priority = [
        "h",
        "l",
    ]


    def random_timestamp_2023(after):
        current_date = datetime.now()
        random_date = after + (current_date - after) * random.random()
        return random_date
    
    def random_boolean():
        return bool(random.getrandbits(1))
    
    def randomComment():
        with open('descriptions.txt', 'r') as file:
            data = json.load(file)
            comments = data["Comments"]
        return random.choice(comments)

    def randomAnswer(): 
        with open('descriptions.txt', 'r') as file:
            data = json.load(file)
            Answers = data["Answers"]
        return random.choice(Answers)
    
    def randomActivity(): 
        with open('descriptions.txt', 'r') as file:
            data = json.load(file)
            Activities = data["Activities"]
        return random.choice(Activities)


    # Create or get Center, Unit, and Place. Note that center=klinik and units=center
    centers = [Center.objects.get_or_create(name=center_name)[0] for center_name in center]
    units = [Unit.objects.get_or_create(name=unit_name)[0] for unit_name in units]
    places = [Place.objects.get_or_create(name=place_name)[0] for place_name in place]


    selected_center = random.choice(centers)
    selected_place = random.choice(places)  
    profession = random.choice(professions)

    first_name = "erik"
    last_name = "holm"
    email = generate_random_email("erik","holm")
    selected_center = random.choice(centers)
    selected_place = random.choice(places)  
    selected_PGSA = random.choice(PGSA)  
    profession = random.choice(professions)
    user = User.objects.create(
        profession=profession,
        email=email,
        last_name=last_name,
        first_name=first_name,
        auth_lvl=1,
        center=selected_center,
        unit=units[1],
        place=selected_place,
    )

    # Change the for loop for a smaller number of users and improvment work
    for unit in units:
        for i in range(10):
            first_name = generate_random_first_name()
            last_name = generate_random_last_name()
            email = generate_random_email(first_name,last_name)
            selected_center = random.choice(centers)
            selected_place = random.choice(places)  
            selected_PGSA = random.choice(PGSA)  
            profession = random.choice(professions)
            user = User.objects.create(
                profession=profession,
                email=email,
                last_name=last_name,
                first_name=first_name,
                auth_lvl=1,
                center=selected_center,
                unit=unit,
                place=selected_place,
            )


            activities = []
            for _ in range(3):
                activity = randomActivity()
                activity_data = {
                    'title': activity['title'],
                    'description': activity['description'],
                    'priority_level': random.choice(Priority)  ,
                    'pdsa_tag': random.choice(PGSA)  ,
                    'finished': False,
                    'Improvment_work': '1' if not Improvment_work.objects.exists() else str(Improvment_work.objects.latest('id').id + 1)
                }
                activities.append(activity_data)

            start_of_year = datetime(datetime.now().year, 1, 1)
            IW_time = random_timestamp_2023(start_of_year).isoformat()
            # Loadin the descriptions file. 
            with open('descriptions.txt', 'r') as file:
                description = json.load(file)
            # Make a POST request to the Improvment_workAPI view
            url = "http://localhost:8000/Improvment/improvment_work"  # Replace with your actual URL
            data = {
                "name": description[unit.name][i]["ImprovementWorkName"],
                "description": description[unit.name][i]["ImprovementWorkDescription"],
                "pdsa_tag": selected_PGSA,
                "responsible_user": user.has_id,
                "created_at" : IW_time,
                "finished" : random_boolean(),
                "published" : True,
                "activities" : activities
                
            }

            response = requests.post(url, json=data)
            if response.status_code != 201:
                print(f"Failed to create Improvement Work for user {user.has_id}")
            else:
                print(f"Successfully created Improvement Work for user {user.has_id}")
            

            if response.status_code != 201:
                print(f"Failed to create Improvement Work for user {user.has_id}")
            else:
                print(f"Successfully created Improvement Work for user {user.has_id}")
            

            



            team_members = []
            for i in range(3):
                random_user = User.objects.order_by('?').first()
                team_members.append(random_user.has_id)
            team_url = "http://127.0.0.1:8000/Improvment/participantsOnImprovmentWork"
            latest_Team = Team.objects.latest('id').id
                
            team_data = {
                "team_id": latest_Team,
                "members": team_members
            }

            print(team_data)
            team_response = requests.post(team_url, data=team_data)
            if team_response.status_code != 200:
                print(f"Failed to add users to the team")
            else:
                print(f"Successfully added users to the team")


            for _ in range(3):
                random_user = User.objects.order_by('?').first()
                activity_url = "http://127.0.0.1:8000/Improvment/activitiesByUserId"
                activity_data = {
                    "activity_id": Improvment_work.objects.latest('id').id,
                    "user_id": random_user.has_id
                }
                activity_response = requests.post(activity_url, data=activity_data)
                if activity_response.status_code != 201:
                    print(f"Failed to assign activity to user {random_user.has_id}")
                else:
                    print(f"Successfully assigned activity to user {random_user.has_id}")



            for i in range(randomint()):

                comment_time = random_timestamp_2023(datetime.fromisoformat(IW_time)).isoformat()
                random_user = User.objects.order_by('?').first()
                # Make a POST request to the Improvment_commentAPI view
                comment_url = "http://127.0.0.1:8000/Improvment/comment"  
                comment_data = {
                    "User": random_user.has_id,
                    "Improvment_work": Improvment_work.objects.latest('id').id,
                    "comment": randomComment(),
                    "created_at": comment_time
                }

                comment_response = requests.post(comment_url, data=comment_data)
                if comment_response.status_code != 201:
                    print(f"Failed to create comment for user {random_user.has_id}")
                else:
                    print(f"Successfully created comment for user {random_user.has_id}")
                
                for i in range(3): 
                    random_user = User.objects.order_by('?').first()
                    Answer_url = "http://127.0.0.1:8000/Improvment/Answer"  
                    Answer_data = {
                        "User": random_user.has_id,
                        "Comment": Comment.objects.latest('id').id,
                        "answer": randomAnswer(),
                        "created_at": random_timestamp_2023(datetime.fromisoformat(comment_time)).isoformat()
                    }

                    comment_response = requests.post(Answer_url, data=Answer_data)
                    if comment_response.status_code != 201:
                        print(f"Failed to create Answer for user {random_user.has_id}")
                    else:
                        print(f"Successfully created Answer for user {random_user.has_id}")


            
            # Get all Improvement Works
            all_improvement_works = Improvment_work.objects.all()
            
            # User likes 10 random Improvement Works
            for _ in range(10):
                selected_improvement_work = random.choice(all_improvement_works)
                like_url = "http://localhost:8000/Improvment/like"  # Replace with your actual URL
                like_data = {
                    "improvement_work": selected_improvement_work.id,
                    "has_id": user.has_id,
                    "created_at": random_timestamp_2023(datetime.fromisoformat(IW_time)).isoformat()
                }
                like_response = requests.post(like_url, data=like_data)
                if like_response.status_code != 200:
                    print(f"Failed to like Improvement Work {selected_improvement_work.id} for user {user.has_id}")
                else:
                    print(f"Successfully liked Improvement Work {selected_improvement_work.id} for user {user.has_id}")
        
if __name__ == "__main__":
    django.setup()
    populate_db()


 