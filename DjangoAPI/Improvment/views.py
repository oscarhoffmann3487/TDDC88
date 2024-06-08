from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.db.models import Prefetch
from rest_framework import status
from rest_framework.response import Response
from .serializers import AssigneeSerializer, AnswerSerializerGet, AssigneeSerializerGet, Improvment_commentgetSerializer, ActivitySerializer, Improvment_workSerializer,TeamSerializer, KeyWordSerializer, Improvment_workSerializer_get, User_improvementSerializer,Improvment_commentSerializer, AnswerSerializer
from user.serializers import UserSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from user.models import User,Center
from .models import Team, Improvment_work, Activity, Comment, Answer, Assignee
from .models import Keyword
from nltk.tokenize import word_tokenize 
from nltk.corpus import stopwords  
from nltk import pos_tag  
from nltk.corpus import wordnet  
from nltk.corpus.reader.wordnet import WordNetError  
from collections import Counter
from django.core.exceptions import ObjectDoesNotExist
from django.utils.dateparse import parse_datetime
from django.utils import timezone
from django.db.models import Prefetch
from datetime import timedelta
import nltk
import ssl

try:
    _create_unverified_https_context = ssl._create_unverified_context
except AttributeError:
    pass
else:
    ssl._create_default_https_context = _create_unverified_https_context

nltk.download('punkt')
nltk.download('stopwords')
nltk.download('averaged_perceptron_tagger')
nltk.download('wordnet')
from translate import Translator
from django.db.models import Prefetch

# View for improvment_work. Accessed from path /improvment/improvment_work
class Improvment_workAPI(APIView): 
    def createKeywords(self, description, title, improvment_work, user: User):

        translator = Translator(to_lang="en", from_lang="sv")

        #max len per translation request is 500 characters
        if len(description) < 500:
            #translates swedish text into english
            translation = translator.translate(description)
        else:
           res_first, res_second = description[:len(description)//2], description[len(description)//2:]
           translation = translator.translate(res_first) + translator.translate(res_second)

        header = word_tokenize(title)
        words = word_tokenize(translation)
        stop_words = set(stopwords.words('english'))
        filtered_words = [word for word in words if word.lower() not in stop_words]
        tagged_words = pos_tag(filtered_words)
        nouns = [word for word, pos in tagged_words if pos in ['NN', 'NNS']]
        noun_counts = Counter(nouns)
        top_nouns = [noun for noun, _ in noun_counts.most_common(10)]
        synonyms_list = []
        synonyms_list.extend(top_nouns)
        synonyms_list.extend(header)
        
        similarity_threshold = 0.5  
        synonyms = []
        for noun in synonyms_list:
            
            try:
                for syn in wordnet.synsets(noun, pos='n'):
                    for lemma in syn.lemmas():
                        synonym = lemma.name()
                        # Calculate similarity between the original noun and the synonym
                        similarity = syn.path_similarity(wordnet.synset(f"{noun}.n.01"))
                        if similarity is not None and similarity >= similarity_threshold:
                            synonyms.append(synonym)
            except WordNetError:
                continue  # Continue processing other keywords
 
        synonyms = list(set(synonyms))  # Removing duplicates
        synonyms_list.extend(synonyms)
        synonyms = list(set(synonyms_list))  
        synonyms_list.extend(synonyms_list)
        
        synonyms_list.append(user.first_name + ' ' + user.last_name)
        synonyms_list.append(user.email)
        synonyms_list.append(title)
        synonyms_list.append(description)

        for synonym in synonyms:
            # Translates english keywords (synonym) into swedish
            translator = Translator(to_lang="sv", from_lang="en")
            translated_synonym = translator.translate(synonym)

            # Check if the keyword already exists in the database
            keyword, created = Keyword.objects.get_or_create(keyword=translated_synonym)

            # Add the current Improvment_work to the keyword's Improvment_work field
            keyword.Improvment_work.add(improvment_work)
            
            # Save the keyword object
            keyword.save()

        for synonym in synonyms_list: 

            keyword, created = Keyword.objects.get_or_create(keyword=synonym)

            # Add the current Improvment_work to the keyword's Improvment_work field
            keyword.Improvment_work.add(improvment_work)

            keyword.save()



    def post(self, request):
        data_copy = request.data.copy()
        activities = data_copy.pop("activities", [])
        team = data_copy.pop("team", None)

        team_id = [m['id'] for m in team] if team else None

        improv_serializer = Improvment_workSerializer(data=data_copy)
        if improv_serializer.is_valid():
            improv_work = improv_serializer.save()

            responsible_user_id = data_copy.get("responsible_user")
            try:
                responsible_user = User.objects.get(has_id=responsible_user_id)
            except User.DoesNotExist:
                return Response({"message": f"User with ID {responsible_user_id} does not exist."}, status=status.HTTP_404_NOT_FOUND)

            #Team
            if team:
                team_data = {"Improvment_work": improv_work.id, "members": [responsible_user.has_id]+team_id} 
            else:
                team_data = {"Improvment_work": improv_work.id, "members": [responsible_user.has_id]} 

            team_serializer = TeamSerializer(data=team_data)

            if team_serializer.is_valid():
                team_serializer.save()

            #Activity
            if activities:
                for activity in activities:

                    responsible_activity_users = None
                    if "responsible_users" in activity:
                        responsible_activity_users =  activity["responsible_users"]
                        responsible_activity_users = [m['id'] for m in responsible_activity_users]
                        activity.pop("responsible_users")

                    activity_serializer = ActivitySerializer(data = activity)

                    if activity_serializer.is_valid():
                        saved_activity = activity_serializer.save()
                        #add responisble user
                        if responsible_activity_users:
                            responsible_users_data = {"activity": saved_activity.id, "users": responsible_activity_users}
                        else:
                            responsible_users_data = {"activity": saved_activity.id, "users": [responsible_user.has_id] + (team_id if team_id else [])}

                        responsible_users_serializer = AssigneeSerializer(data=responsible_users_data)
                        if responsible_users_serializer.is_valid():
                            responsible_users_serializer.save()

        #Check if there is a description in the IW
                if data_copy.get("description"):
                    self.createKeywords(data_copy.get("description"), data_copy.get("name"), improv_work, responsible_user)
                return Response(improv_serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(improv_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def get(self, request):
        # Get all improvement works
        improvment_work = Improvment_work.objects.all()
        
        # Create a dictionary to store the recommendation scores
        recommendation_scores = {}
        
        # Calculate the recommendation score for each improvement work
        for work in improvment_work:
            # Calculate the score based on the number of users who liked the work and the number of comments related to the work
            score = work.liked_by_users.count() + 3 * work.comment_set.count()
            recommendation_scores[work.id] = score
        
        # Sort the improvement works in decreasing order of recommendation score
        sorted_improvment_work = sorted(improvment_work, key=lambda work: recommendation_scores[work.id], reverse=True)
        
        # Serialize the sorted improvement works
        improvment_work_serializer = Improvment_workSerializer_get(sorted_improvment_work, many=True)
        current_time = timezone.now()
        thirty_days_ago = current_time - timedelta(days=30)
        recent_improvment_work = []
        older_improvment_work = []

        for work in improvment_work:
            comments = Comment.objects.filter(Improvment_work=work)
            work.numberOfComments = comments.count() + Answer.objects.filter(Comment__in=comments).count()
            work.numberOfLikes = work.liked_by_users.count()
            # Check if the improvement work has been commented or answered in the last 30 days
            recent_comments = comments.filter(created_at__gte=thirty_days_ago)
            recent_answers = Answer.objects.filter(Comment__Improvment_work=work, created_at__gte=thirty_days_ago)

            if recent_comments.exists() and recent_answers.exists():
                recent_improvment_work.append(work)
            else:
                older_improvment_work.append(work)

        for work in recent_improvment_work:
            # Calculate the score based on the number of users who liked the work and the number of comments related to the work
            score = work.liked_by_users.count() + 3 * work.comment_set.count()
            recommendation_scores[work.id] = score

        recent_improvment_work = sorted(recent_improvment_work, key=lambda work: recommendation_scores[work.id], reverse=True)

        combined_improvment_work = recent_improvment_work + older_improvment_work
        improvment_work_serializer = Improvment_workSerializer_get(combined_improvment_work, many=True)


        new_data = []
        for work in improvment_work_serializer.data:
            improv_work = Improvment_work.objects.get(id=work['id'])
            comments = Comment.objects.filter(Improvment_work=improv_work)
            work['numberOfComments'] = comments.count() + Answer.objects.filter(Comment__in=comments).count()
            work['numberOfLikes'] = improv_work.liked_by_users.count()
            new_data.append(work)

        return Response(new_data, status=status.HTTP_200_OK)

#Put for updating improvement works
    def put(self, request, pk):

        iw_team = Team.objects.filter(Improvment_work=pk).first()
        if iw_team:
            iw_team = get_object_or_404(Team, Improvment_work=pk)
            iw_team.delete()

        iw_activity = Activity.objects.filter(Improvment_work=pk).first()
        if iw_activity:
            iw_activity = Activity.objects.filter(Improvment_work=pk)
            iw_activity.delete()

        try:
            improvment_work = Improvment_work.objects.get(pk=pk)
        except Improvment_work.DoesNotExist:
            return Response({"error": "Improvment Work not found"}, status=status.HTTP_404_NOT_FOUND)
        
        improv_serializer = Improvment_workSerializer(improvment_work, data=request.data)
        if improv_serializer.is_valid():
            improv_work = improv_serializer.save()
            
            responsible_user_id = request.data.get("responsible_user")
            try:
                responsible_user = User.objects.get(has_id=responsible_user_id)
            except User.DoesNotExist:
                return Response({"message": f"User with ID {responsible_user_id} does not exist."}, status=status.HTTP_404_NOT_FOUND)
        
        activities = None
        if "activities" in request.data:
            activities = request.data["activities"]
            request.data.pop("activities")

        team = None
        if "team" in request.data:
            team = request.data["team"]
            request.data.pop("team")
            team_id = [m['id'] for m in team]
            
            #Team
            if team:
                team_data = {"Improvment_work": improv_work.id, "members": [responsible_user.has_id]+team_id} 
            else:
                team_data = {"Improvment_work": improv_work.id, "members": [responsible_user.has_id]} 
                
            team_serializer = TeamSerializer(data=team_data)
            
            if team_serializer.is_valid():
                team_serializer.save()

            #Activity
            if activities:
                for activity in activities:
                    activity["Improvment_work"] = improv_work.id 
                    activity_serializer = ActivitySerializer(data = activity)
                    if activity_serializer.is_valid():
                        activity_serializer.save()
                        
            #Check if there is a description in the IW
            if request.data.get("description"):
                self.createKeywords(request.data.get("description"), request.data.get("name"), improv_work, responsible_user)
            return Response(improv_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(improv_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class ImprovmentWorkByKeyword(APIView):
    def get(self, request):
        keyword_param = request.query_params.get('keyword')

        if not keyword_param:
            return Response({"message": "Keyword parameter is missing."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            keyword_obj = Keyword.objects.get(keyword=keyword_param)
        except Keyword.DoesNotExist:
            return Response({"message": f"Keyword '{keyword_param}' does not exist."}, status=status.HTTP_404_NOT_FOUND)
        
        # Retrieve all Improvment_work objects associated with the keyword
        improvment_work = keyword_obj.Improvment_work.all()
        
        # Serialize the queryset and return the data
        improvment_work_serializer = Improvment_workSerializer(improvment_work, many=True)
        
        return Response(improvment_work_serializer.data)

class ImprovmentWorkByMember(APIView):
   def get(self, request):
        member_id = request.query_params.get('has_id')

        if not member_id:
            return Response({"message": "Member ID parameter is missing."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            teams = Team.objects.filter(members=member_id)

            improvment_work = Improvment_work.objects.filter(team__in=teams)
        except ObjectDoesNotExist: 
            return Response({"message": f"No Improvement Works found for member with ID '{member_id}'."}, status=status.HTTP_404_NOT_FOUND)
        
        # Serialize the queryset and return the data
        improvment_work_serializer = Improvment_workSerializer(improvment_work, many=True)
        
        return Response(improvment_work_serializer.data)

class ImprovmentWorkLikedByUser(APIView):
    def get(self, request):
        user_id = request.query_params.get('has_id')
        if not user_id:
            return Response({"message": "User ID parameter is missing."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(has_id=user_id)
        except User.DoesNotExist:
            return Response({"message": f"User with ID '{user_id}' does not exist."}, status=status.HTTP_404_NOT_FOUND)

        # Retrieve all Improvment_work objects liked by the user
        liked_improvment_work = Improvment_work.objects.filter(liked_by_users=user)

        for work in liked_improvment_work:
            comments = Comment.objects.filter(Improvment_work=work)
            work.numberOfComments = comments.count() + Answer.objects.filter(Comment__in=comments).count()
            work.numberOfLikes = work.liked_by_users.count()
        

        # Serialize the queryset and return the data
        liked_improvment_work_serializer = Improvment_workSerializer(liked_improvment_work, many=True)

        for work in liked_improvment_work_serializer.data:
            improv_work = Improvment_work.objects.get(id=work['id'])
            work['numberOfComments'] = Comment.objects.filter(Improvment_work=improv_work).count() + Answer.objects.filter(Comment__in=comments).count()
            work['numberOfLikes'] = improv_work.liked_by_users.count()
        return Response(liked_improvment_work_serializer.data)
    
class ImprovmentWorkLikedBy(APIView):
    def get(self, request):
        user_id = request.query_params.get('has_id')
        if not user_id:
            return Response({"message": "User ID parameter is missing."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(has_id=user_id)
        except User.DoesNotExist:
            return Response({"message": f"User with ID '{user_id}' does not exist."}, status=status.HTTP_404_NOT_FOUND)

        # Retrieve all Improvment_work objects liked by the user
        liked_improvment_work = Improvment_work.objects.filter(liked_by_users=user)

        for work in liked_improvment_work:
            comments = Comment.objects.filter(Improvment_work=work)
            work.numberOfComments = comments.count() + Answer.objects.filter(Comment__in=comments).count()
            work.numberOfLikes = work.liked_by_users.count()
        

        # Serialize the queryset and return the data
        liked_improvment_work_serializer = Improvment_workSerializer_get(liked_improvment_work, many=True)

        for work in liked_improvment_work_serializer.data:
            improv_work = Improvment_work.objects.get(id=work['id'])
            work['numberOfComments'] = Comment.objects.filter(Improvment_work=improv_work).count() + Answer.objects.filter(Comment__in=comments).count()
            work['numberOfLikes'] = improv_work.liked_by_users.count()
        return Response(liked_improvment_work_serializer.data)

class ImprovmentWorkByOwner(APIView):
   def get(self, request):
        member_id = request.query_params.get('has_id')

        if not member_id:
            return Response({"message": "Member ID parameter is missing."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            improvment_work = Improvment_work.objects.filter(responsible_user=member_id)

        except ObjectDoesNotExist: 
            return Response({"message": f"No Improvement Works found for member with ID '{member_id}'."}, status=status.HTTP_404_NOT_FOUND)
        

        
        # Serialize the queryset and return the data
        improvment_work_serializer = Improvment_workSerializer_get(improvment_work, many=True)

        for work in improvment_work:
            comments = Comment.objects.filter(Improvment_work=work)
            work.numberOfComments = comments.count() + Answer.objects.filter(Comment__in=comments).count()
            work.numberOfLikes = work.liked_by_users.count()
        

        # Serialize the queryset and return the data
        liked_improvment_work_serializer = Improvment_workSerializer_get(improvment_work, many=True)

        for work in liked_improvment_work_serializer.data:
            improv_work = Improvment_work.objects.get(id=work['id'])
            work['numberOfComments'] = Comment.objects.filter(Improvment_work=improv_work).count() + Answer.objects.filter(Comment__in=comments).count()
            work['numberOfLikes'] = improv_work.liked_by_users.count()

            print(work['numberOfComments'])
            print(work['numberOfLikes'])

        return Response(improvment_work_serializer.data)

class ImprovmentWorkByTitle(APIView):
   def get(self, request):
        title = request.query_params.get('title')

        if not title:
            return Response({"message": "Title is missing."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            improvment_work = Improvment_work.objects.filter(name=title)

        except ObjectDoesNotExist: 
            return Response({"message": f"No Improvement Works found title: '{title}'."}, status=status.HTTP_404_NOT_FOUND)
        
        # Serialize the queryset and return the data
        improvment_work_serializer = Improvment_workSerializer(improvment_work, many=True)
        
        return Response(improvment_work_serializer.data)

class CombinedImprovmentWork(APIView):
    def get(self, request):
        keyword = request.query_params.get('keyword')           #keywords to look for
        pdsa = request.query_params.get('pdsa')                 #which state in PDSA. 'P' = Plan etc.
        center_name = request.query_params.get('clinic_name')       #corresponds to (swedish): klinik
        unit_name = request.query_params.get('center_name')   #corresponds to (swedish): centrum
        place_name = request.query_params.get('place_name') 
        start_timestamp = request.query_params.get('start_timestamp')
        end_timestamp = request.query_params.get('end_timestamp')
        finished = request.query_params.get('finished')
        
           #corresponds to (swedish): plats
        # Initialize a queryset with all Improvment_work objects
        queryset = Improvment_work.objects.all()

        if finished is not None:
            if finished.lower() == 'true':
                queryset = queryset.filter(finished=True)
            elif finished.lower() == 'false':
                queryset = queryset.filter(finished=False)

        # Apply filters based on query parameters
        if keyword:
            # Using the icontains lookup to search for a substring
            matching_keywords = Keyword.objects.filter(keyword__icontains=keyword)
            queryset = queryset.filter(improvment_work__in=matching_keywords)

        if pdsa:
            queryset = queryset.filter(pdsa_tag=pdsa)
        
        if center_name: 
            users = User.objects.filter(center__name=center_name)
            queryset = queryset.filter(responsible_user__in=users)
        
        if place_name: 
            users = User.objects.filter(place__name=place_name)
            queryset = queryset.filter(responsible_user__in=users)
        
        if unit_name: 
            users = User.objects.filter(unit__name=unit_name)
            queryset = queryset.filter(responsible_user__in=users)


        if start_timestamp:
            # Parse the timestamp string into a datetime object
            start_timestamp = parse_datetime(start_timestamp)

            if start_timestamp is not None:
                # Filter the queryset based on the start_timestamp
                queryset = queryset.filter(created_at__gte=start_timestamp)

        if end_timestamp:
            # Parse the timestamp string into a datetime object
            end_timestamp = parse_datetime(end_timestamp)

            if end_timestamp is not None:
                # Filter the queryset based on the end_timestamp
                queryset = queryset.filter(created_at__lte=end_timestamp)
 
        queryset = queryset.distinct()
        queryset = queryset.order_by('-created_at')
        improvment_work_serializer = User_improvementSerializer(queryset, many=True)
        for work in improvment_work_serializer.data:
            improv_work = Improvment_work.objects.get(id=work['id'])
            comments = Comment.objects.filter(Improvment_work=improv_work)           
            work['numberOfComments'] = comments.count() + Answer.objects.filter(Comment__in=comments).count()
            work['numberOfLikes'] = improv_work.liked_by_users.count()

        

        return Response(improvment_work_serializer.data)   


class Improvment_comment(APIView):
    def post(self, request):
        comment_serializer = Improvment_commentSerializer(data=request.data)

        if comment_serializer.is_valid():
            comment_serializer.save()
            return Response(comment_serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(comment_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        Improvment = request.query_params.get('Improvment')

        if not Improvment:
            return Response({"message": "Improvment work is missing."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            improvment_work = Improvment_work.objects.filter(id=Improvment)

        except ObjectDoesNotExist: 
            return Response({"message": f"No Improvement Works found Improvment: '{Improvment}'."}, status=status.HTTP_404_NOT_FOUND)
        
        # Serialize the queryset and return the data

        comments = Comment.objects.filter(Improvment_work=Improvment).prefetch_related(
        Prefetch('answer_set', queryset=Answer.objects.all(), to_attr='fetched_answers'))

        # Initialize an empty list to store the serialized data
        data = []

        for comment in comments:
            # Serialize the comment
            comment_data = Improvment_commentgetSerializer(comment).data

            # Serialize the answers of the comment
            comment_data['answers'] = AnswerSerializerGet(comment.fetched_answers, many=True).data

            # Add the serialized comment data to the list
            data.append(comment_data)

        return Response(data)


class AnswerAPI(APIView):
    def post(self, request):
        Answer_serializer = AnswerSerializer(data=request.data)

        if Answer_serializer.is_valid():
            Answer_serializer.save()
            return Response(Answer_serializer.data, status=status.HTTP_201_CREATED)
        return Response(Answer_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LikeImprovementWork(APIView):
    def post(self, request):
        improvement_work = Improvment_work.objects.get(pk=request.data.get('improvement_work'))
        user = User.objects.get(pk=request.data.get('has_id'))

        if user in improvement_work.liked_by_users.all():
            improvement_work.liked_by_users.remove(user)
        else:
            improvement_work.liked_by_users.add(user)

        return Response({"likes_count": improvement_work.liked_by_users.count()})
    
    def get(self, request):
        improvement_work_id = request.query_params.get('improvement_work')
        user_id = request.query_params.get('has_id')
        try:
            improvment_work = Improvment_work.objects.get(id=improvement_work_id)
        except ObjectDoesNotExist:
            return Response({"message": "Improvment work is missing."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(has_id=user_id)
        except ObjectDoesNotExist:
            return Response({"message": "User is missing."}, status=status.HTTP_400_BAD_REQUEST)
        
        if user in improvment_work.liked_by_users.all():
            return Response(data={'message': True})
        else:
            return Response(data={'message': False})
    
class TeamAPI(APIView):
    def post(self, request):
        team_id = request.data.get('team_id')
        team = Team.objects.get(pk=team_id)
        members_to_add = User.objects.filter(pk__in=request.data.get('members'))

        # Check if the team exists
        if not team:
            return Response({"message": "Team does not exist."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the members exist
        if not members_to_add.exists():
            return Response({"message": "No valid members provided."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the members are already in the team
        for member in members_to_add:
            if member in team.members.all():
                return Response({"message": f"User {member.id} is already in the team."}, status=status.HTTP_400_BAD_REQUEST)

        # Add the members to the team
        team.members.add(*members_to_add)
        team.save()

        team_serializer = TeamSerializer(team)
        return Response(team_serializer.data, status=status.HTTP_200_OK)
    def get(self, request):
        team_id = request.query_params.get('team_id')
        iw_team = Team.objects.get(Improvment_work=team_id)
        print(iw_team.id)
        team = Team.objects.get(id=iw_team.id)
        members = team.members.all()
        member_serializer = UserSerializer(members, many=True)
        return Response(member_serializer.data)
        
class ActivitiesByImprovementWork(APIView):
    def get(self, request):
        iw_id = request.query_params.get('id')
        if not iw_id:
            return Response({"message": "Improvement work ID parameter is missing."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            activitys = Activity.objects.filter(Improvment_work_id=iw_id)

        except ObjectDoesNotExist: 
            return Response({"message": f"No activities found for improvement work with ID '{iw_id}'."}, status=status.HTTP_404_NOT_FOUND)
        
        # Serialize the queryset and return the data
        
        activity_serializer = ActivitySerializer(activitys, many=True)

        for activity in activity_serializer.data:
            responisple_users = Assignee.objects.filter(activity_id =activity["id"])
            responisple_users_serializer = AssigneeSerializerGet(responisple_users, many=True)
            activity["assignees"] = responisple_users_serializer.data

        return Response(activity_serializer.data)
    
class ActivityByUserId(APIView):
    def get(self, request):
        user_id = request.query_params.get('id')
        
        if not user_id:
            return Response({"message": "User ID parameter is missing."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            assignee_instance = Assignee.objects.filter(users=user_id)
        except ObjectDoesNotExist: 
            return Response({"message": f"No activities found for user with ID '{user_id}'."}, status=status.HTTP_404_NOT_FOUND)
        
        activity_serializer = AssigneeSerializerGet(assignee_instance, many=True)
        return Response(activity_serializer.data)

    def post(self, request):
        activity_id = request.data.get('activity_id')
        user_id = request.data.get('user_id')

        if not all([activity_id, user_id]):
            return Response({"message": "Activity ID and User ID are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            activity = Activity.objects.get(id=activity_id)
            user = User.objects.get(has_id=user_id)
        except ObjectDoesNotExist:
            return Response({"message": "Activity or User does not exist."}, status=status.HTTP_404_NOT_FOUND)

        # Check if the user is already an assignee for the activity
        if Assignee.objects.filter(activity=activity, users=user).exists():
            return Response({"message": "User is already an assignee for this activity."}, status=status.HTTP_400_BAD_REQUEST)

        assignee_data = {"activity": activity.id, "users": [user.has_id]}
        assignee_serializer = AssigneeSerializer(data=assignee_data)

        if assignee_serializer.is_valid():
            assignee_serializer.save()
            return Response(assignee_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(assignee_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ImprovementWorkById(APIView):
    def get(self, request):
        iw_id = request.query_params.get('id')

        if not iw_id:
            return Response({"message": "Improvement work ID parameter is missing."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            improvement_work = Improvment_work.objects.filter(id=iw_id)

        except ObjectDoesNotExist: 
            return Response({"message": f"No activities found for improvement work with ID '{iw_id}'."}, status=status.HTTP_404_NOT_FOUND)
        
        # Serialize the queryset and return the data
        iw_serializer = Improvment_workSerializer_get(improvement_work, many=True)
        
        return Response(iw_serializer.data)
    
class ActivitiesByUser(APIView):
    def get(self, request):
        
        userId = request.query_params.get('has_id')

        if not userId:
            return Response({"message": "User id parameter is missing."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            activity = Assignee.objects.filter(user=userId)
        
        except ObjectDoesNotExist: 
            return Response({"message": f"No activities found for user with ID '{userId}'."}, status=status.HTTP_404_NOT_FOUND)

        activity_serializer = ActivitySerializer(activity, many=True)

        return Response(activity_serializer.data)

class UpdateActivity(APIView):
    def put(self, request, pk):
        print("Hello")

        try:
             activity = Activity.objects.get(pk=pk)
        except ObjectDoesNotExist: 
            return Response({"message": f"No activities found"}, status=status.HTTP_404_NOT_FOUND)

        activity_serializer = ActivitySerializer(activity, data=request.data)
        if activity_serializer.is_valid():
            activity_serializer.save()
            return Response(activity_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(activity_serializer.errors, status=status.HTTP_400_BAD_REQUEST)