from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView,
    LoginView,
    LogoutView,
    UserDetailView,
    WorkoutPlanView,
    ExerciseListView,
    ExerciseCreateView,  
    # WorkoutHistoryView,
    ProgressView,
    SocialFeedView,
    # CurrentWorkoutPlanView,  # <-- REMOVE or keep commented out
    WorkoutLogView,
    FollowUserView,
    WorkoutCompletionView,
    ActivityFeedView,
    LeaderboardView,
    VoiceNoteListCreateView,
    VoiceNoteDeleteView,
    UserStatsView,
    UserUpdateView,
    AIChatView,
    PremiumStatusView,
)

urlpatterns = [
    # Authentication
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # User
    path('user/', UserDetailView.as_view(), name='user-detail'),

    # Workouts
    path('workout-plans/', WorkoutPlanView.as_view(), name='workout-plans'),
    # path('workout-plans/current/', CurrentWorkoutPlanView.as_view(), name='current-workout-plan'),  # <-- REMOVE or comment out
    path('exercises/', ExerciseListView.as_view(), name='exercise-list'),
    path('exercises/create/', ExerciseCreateView.as_view(), name='exercise-create'),
    # path('workouts/history/', WorkoutHistoryView.as_view(), name='workout-history'),
    path('workouts/logs/', WorkoutLogView.as_view(), name='workout-log'),
    path('workouts/completed/', WorkoutCompletionView.as_view(), name='workout-completed'),
   
    # Progress
    path('progress/', ProgressView.as_view(), name='progress'),

    # Social
    path('social/feed/', SocialFeedView.as_view(), name='social-feed'),
    path('social/activity/', ActivityFeedView.as_view(), name='activity-feed'),
    path('social/leaderboard/', LeaderboardView.as_view(), name='leaderboard'),

    path('tools/voice-notes/', VoiceNoteListCreateView.as_view(), name='voice-notes'),
    path('tools/voice-notes/<int:pk>/', VoiceNoteDeleteView.as_view(), name='voice-note-delete'),
    path('api/payments/', include('payments.urls')),
    path('user/stats/', UserStatsView.as_view(), name='user-stats'),
    path('user/update/', UserUpdateView.as_view(), name='user-update'),
    path('api/ai-chat/', AIChatView.as_view(), name='ai-chat'),
  path('account/status/', PremiumStatusView.as_view(), name='premium-status'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)