from django.urls import path
from .views import ActivityByUserId, ImprovmentWorkLikedBy, Improvment_workAPI, ImprovmentWorkByKeyword, ImprovmentWorkByMember,ImprovmentWorkByOwner,ImprovmentWorkByTitle,CombinedImprovmentWork,LikeImprovementWork,Improvment_comment,AnswerAPI,TeamAPI,ActivitiesByImprovementWork, ImprovementWorkById, ImprovmentWorkLikedByUser, ActivitiesByUser, UpdateActivity

# URLs for /Improvment
urlpatterns = [
    path('improvment_work',Improvment_workAPI.as_view()),
    path('improvment_work/<int:pk>/', Improvment_workAPI.as_view()),
    path('improvmentKeywords',ImprovmentWorkByKeyword.as_view()),
    path('memberImprovmentWork',ImprovmentWorkByMember.as_view()),
    path('ownerImprovmentWork',ImprovmentWorkByOwner.as_view()),
    path('ImprovmentWorkByTitle',ImprovmentWorkByTitle.as_view()),
    path('CombinedImprovmentWork',CombinedImprovmentWork.as_view()),
    path('activitiesByImprovementWork', ActivitiesByImprovementWork.as_view()),
    path('activitiesByUserId', ActivityByUserId.as_view()),
    path('updateActivity/<int:pk>/', UpdateActivity.as_view()),
    path('like',LikeImprovementWork.as_view()),
    path('comment', Improvment_comment.as_view()),
    path('Answer', AnswerAPI.as_view()),
    path('participantsOnImprovmentWork',TeamAPI.as_view()),
    path('idImprovmentWork', ImprovementWorkById.as_view()),
    path('likedImprovment', ImprovmentWorkLikedByUser.as_view()),
    path('likedImprov', ImprovmentWorkLikedBy.as_view())
    
]