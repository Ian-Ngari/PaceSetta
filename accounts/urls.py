from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView,
    LoginView,
    LogoutView,
    UserDetailView,
    WorkoutPlanView,
    ExerciseListView,
    ExerciseCreateView,  # Make sure this exists in views.py!
    WorkoutHistoryView,
    ProgressView,
    SocialFeedView,
    CurrentWorkoutPlanView,
    WorkoutLogView,
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
    path('workout-plans/current/', CurrentWorkoutPlanView.as_view(), name='current-workout-plan'),
    path('exercises/', ExerciseListView.as_view(), name='exercise-list'),
    path('exercises/create/', ExerciseCreateView.as_view(), name='exercise-create'),
    path('workouts/history/', WorkoutHistoryView.as_view(), name='workout-history'),
     path('workouts/logs/', WorkoutLogView.as_view(), name='workout-log'),

    # Progress
    path('progress/', ProgressView.as_view(), name='progress'),

    # Social
    path('social/feed/', SocialFeedView.as_view(), name='social-feed'),
]