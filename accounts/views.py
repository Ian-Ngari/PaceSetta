import os
import requests
import random
from django.utils import timezone
from datetime import timedelta
from django.db.models import Sum, Count
from dotenv import load_dotenv
from rest_framework import generics, permissions, status, serializers, viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count
import cohere
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views import View
import logging

from .models import WorkoutPlan, WorkoutRoutine, WorkoutExercise, Exercise, WorkoutLog, Follow, WorkoutCompletion, Activity, CustomUser, WorkoutLogLike, WorkoutLogComment, VoiceNote, AIChat
from .serializers import (
    UserSerializer,
    CustomTokenObtainPairSerializer,
    WorkoutPlanSerializer,
    WorkoutRoutineSerializer,
    WorkoutExerciseSerializer,
    ExerciseSerializer,
    WorkoutLogSerializer,
    FollowSerializer,
    WorkoutCompletionSerializer,
    ActivitySerializer,
    WorkoutLogCommentSerializer,
    WorkoutLogLikeSerializer,
    VoiceNoteSerializer
)

load_dotenv()
logger = logging.getLogger(__name__)

User = get_user_model()
EXERCISE_DB_API_KEY = os.getenv('EXERCISE_DB_API_KEY')
EXERCISE_DB_HOST = os.getenv('EXERCISE_DB_HOST', 'exercisedb.p.rapidapi.com')
YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY')


class AIChatView(APIView):
    permission_classes = [IsAuthenticated]

    def __init__(self):
        self.co = cohere.Client(os.getenv('COHERE_API_KEY'))

    def post(self, request):
        try:
            print("[DEBUG] Received message:", request.data.get('message'))  # Debug log
            if not request.user.is_premium:
                return Response({'error': 'Premium feature'}, status=403)
                
            message = request.data.get('message')
            if not message:
                return Response({'error': 'Message required'}, status=400)

            print("[DEBUG] Calling Cohere API...")  # Debug log
            response = self.co.generate(
                model='command',
                prompt=f"""You are a professional fitness trainer. Answer this question:
                
                Question: {message}
                Answer:""",
                max_tokens=200,
                temperature=0.7
            )
            print("[DEBUG] Cohere response:", response)  # Debug log
            
            ai_response = response.generations[0].text
            return Response({'response': ai_response})
            
        except Exception as e:
            print("[ERROR] AI Chat Error:", str(e))  # Detailed error logging
            return Response(
                {'error': f'AI service error: {str(e)}'}, 
                status=500
            )
class RegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'fitness_goal': user.fitness_goal,
                'experience_level': user.experience_level
            },
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)

class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [permissions.AllowAny]

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({'detail': 'Successfully logged out.'}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UserDetailView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user



class WorkoutPlanView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_exercises_from_api(self, muscle_group):
        print(f"[DEBUG] Using API KEY: {EXERCISE_DB_API_KEY}")
        print(f"[DEBUG] Using API HOST: {EXERCISE_DB_HOST}")
        url = f"https://{EXERCISE_DB_HOST}/exercises/target/{muscle_group}"
        headers = {
            "X-RapidAPI-Key": EXERCISE_DB_API_KEY,
            "X-RapidAPI-Host": EXERCISE_DB_HOST
        }
        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            data = response.json()
            print(f"[DEBUG] API data for {muscle_group}: {data[:3]} ... total: {len(data)}")
            return data
        except requests.exceptions.RequestException as e:
            print(f"[DEBUG] API error for {muscle_group}: {e}")
            fallback = {
                'chest': [
                    {'name': 'Push-up', 'target': 'chest'},
                    {'name': 'Bench Press', 'target': 'chest'},
                    {'name': 'Chest Fly', 'target': 'chest'}
                ],
                'back': [
                    {'name': 'Pull-up', 'target': 'back'},
                    {'name': 'Bent-over Row', 'target': 'back'},
                    {'name': 'Lat Pulldown', 'target': 'back'}
                ],
                'legs': [
                    {'name': 'Squat', 'target': 'quadriceps'},
                    {'name': 'Lunge', 'target': 'quadriceps'},
                    {'name': 'Leg Press', 'target': 'quadriceps'}
                ],
                'shoulders': [
                    {'name': 'Shoulder Press', 'target': 'delts'},
                    {'name': 'Lateral Raise', 'target': 'delts'},
                    {'name': 'Front Raise', 'target': 'delts'}
                ],
                'arms': [
                    {'name': 'Bicep Curl', 'target': 'biceps'},
                    {'name': 'Tricep Extension', 'target': 'triceps'},
                    {'name': 'Hammer Curl', 'target': 'biceps'}
                ]
            }
            return fallback.get(muscle_group, [])

    def post(self, request):
        try:
            goal = request.data.get('goal', 'general_fitness')
            level = request.data.get('level', 'beginner')
            days = int(request.data.get('days', 3))
            body_parts = request.data.get('bodyParts', [])
            print(f"[DEBUG] Received bodyParts: {body_parts}")

            if not body_parts:
                goal_muscles = {
                    'build_muscle': ['chest', 'back', 'legs', 'shoulders', 'arms'],
                    'lose_fat': ['chest', 'back', 'legs'],
                    'increase_strength': ['chest', 'back', 'legs'],
                    'general_fitness': ['chest', 'back', 'legs', 'shoulders']
                }
                body_parts = goal_muscles.get(goal, ['chest', 'back', 'legs'])
                print(f"[DEBUG] Defaulted bodyParts: {body_parts}")

            plan = WorkoutPlan.objects.create(
                user=request.user,
                name=f"{goal.replace('_', ' ').title()} Plan",
                goal=goal,
                level=level
            )

            days_map = {
                2: ['Monday', 'Thursday'],
                3: ['Monday', 'Wednesday', 'Friday'],
                4: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
                5: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
            }
            workout_days = days_map.get(days, ['Monday', 'Wednesday', 'Friday'])
            exercises_per_day = 4 if level == 'beginner' else 6

            for i, day in enumerate(workout_days):
                routine = WorkoutRoutine.objects.create(
                    plan=plan,
                    day=day,
                    order=i
                )
                # Use modulo to cycle through body parts
                muscle = body_parts[i % len(body_parts)]
                exercises = self.get_exercises_from_api(muscle)
                print(f"[DEBUG] {day} - {muscle} - {len(exercises)} exercises fetched")
                if not exercises:
                    print(f"[DEBUG] No exercises found for {muscle} on {day}")
                    continue
                random.shuffle(exercises)
                selected_exercises = exercises[:exercises_per_day] if len(exercises) >= exercises_per_day else exercises
                print(f"[DEBUG] Selected for {day}: {[e['name'] for e in selected_exercises]}")
                for j, exercise in enumerate(selected_exercises):
                    WorkoutExercise.objects.create(
                        routine=routine,
                        name=exercise['name'],
                        sets=3 if level == 'beginner' else 4,
                        reps='8-12' if goal == 'build_muscle' else '12-15',
                        weight=None,
                        notes=f"Targets {exercise.get('target', muscle)}",
                        order=j
                    )

            serializer = WorkoutPlanSerializer(plan)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(f"[DEBUG] Exception in WorkoutPlanView.post: {e}")
            return Response(
                {'error': f"Failed to create workout plan: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

class ExerciseListView(generics.ListAPIView):
    serializer_class = ExerciseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Exercise.objects.all()
        muscle = self.request.query_params.get('muscle')
        equipment = self.request.query_params.get('equipment')
        if muscle and muscle != 'all':
            queryset = queryset.filter(muscle_group__iexact=muscle)
        if equipment and equipment != 'all':
            queryset = queryset.filter(equipment__iexact=equipment)
        return queryset

def fetch_youtube_demo(exercise_name):
    if not YOUTUBE_API_KEY:
        return ""
    search_url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "part": "snippet",
        "q": f"{exercise_name} exercise demo",
        "key": YOUTUBE_API_KEY,
        "maxResults": 1,
        "type": "video"
    }
    resp = requests.get(search_url, params=params)
    items = resp.json().get("items")
    if items:
        video_id = items[0]["id"]["videoId"]
        return f"https://www.youtube.com/watch?v={video_id}"
    return ""

class ExerciseCreateView(generics.CreateAPIView):
    serializer_class = ExerciseSerializer
    permission_classes = [permissions.IsAdminUser]

    def perform_create(self, serializer):
        name = self.request.data.get('name')
        video_url = fetch_youtube_demo(name)
        serializer.save(video_url=video_url)

class ProgressView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        sample_data = [
            {"date": "2023-01-01", "weight": 180, "body_fat": 22},
            {"date": "2023-03-01", "weight": 175, "body_fat": 20},
            {"date": "2023-05-01", "weight": 170, "body_fat": 18}
        ]
        return Response(sample_data)

class SocialFeedView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response({
            "leaderboard": [
                [
  { "id": 1, "username": "iano", "workoutsCompleted": 5 },
  { "id": 2, "username": "user2", "workoutsCompleted": 3 }
]
            ],
            "activity": [
                {"user": "user1", "action": "completed Chest Workout", "time": "2h ago"},
                {"user": "user2", "action": "achieved new PR in Deadlift", "time": "1d ago"}
            ]
        })

class WorkoutLogView(generics.ListCreateAPIView):
    serializer_class = WorkoutLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return WorkoutLog.objects.filter(user=self.request.user).order_by('-date')

    def perform_create(self, serializer):
        log = serializer.save(user=self.request.user)
        # Log activity without username field
        Activity.objects.create(
            user=self.request.user,
            action=f"logged {log.exercise} ({log.sets}x{log.reps})",
            routine_id=None
        )

class FollowUserView(generics.CreateAPIView):
    serializer_class = FollowSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        print("FollowUserView POST payload:", self.request.data)
        follower = self.request.user
        following = serializer.validated_data['following']
        if follower == following:
            raise serializers.ValidationError("You cannot follow yourself.")
        if Follow.objects.filter(follower=follower, following=following).exists():
            raise serializers.ValidationError("You are already following this user.")
        serializer.save(follower=follower)

class WorkoutCompletionView(generics.ListCreateAPIView):
    serializer_class = WorkoutCompletionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return WorkoutCompletion.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        completion = serializer.save(user=self.request.user)
        
        Activity.objects.create(
            user=self.request.user,
            username=self.request.user.username,
            action=f"completed workout routine {completion.routine_id}",
            routine_id=completion.routine_id
        )

class ActivityFeedView(generics.ListAPIView):
    serializer_class = ActivitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Activity.objects.order_by('-time')[:50]

class LeaderboardView(APIView):
    def get(self, request):
        users = CustomUser.objects.all()
        leaderboard = []
        for user in users:
            workouts_completed = WorkoutLog.objects.filter(user=user).count()
            leaderboard.append({
                'id': user.id,
                'username': user.username,
                'workoutsCompleted': workouts_completed,
            })
        leaderboard.sort(key=lambda x: x['workoutsCompleted'], reverse=True)
        return Response(leaderboard)

class WorkoutLogLikeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        print("WorkoutLogLikeView POST payload:", request.data)
        log_id = request.data.get('log_id')
        if not log_id:
            print("ERROR: Missing log_id")
            return Response({'error': 'log_id required'}, status=400)
        log = WorkoutLog.objects.filter(id=log_id).first()
        if not log:
            print(f"ERROR: WorkoutLog with id {log_id} not found")
            return Response({'error': 'WorkoutLog not found'}, status=404)
        like, created = WorkoutLogLike.objects.get_or_create(user=request.user, workout_log=log)
        print(f"Like created: {created}, Like object: {like}")
        serializer = WorkoutLogLikeSerializer(like)
        return Response(serializer.data, status=200)

class WorkoutLogCommentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        print("WorkoutLogCommentView POST payload:", request.data)
        log_id = request.data.get('log_id')
        comment = request.data.get('comment')
        if not log_id or not comment:
            print("ERROR: Missing log_id or comment")
            return Response({'error': 'log_id and comment required'}, status=400)
        log = WorkoutLog.objects.filter(id=log_id).first()
        if not log:
            print(f"ERROR: WorkoutLog with id {log_id} not found")
            return Response({'error': 'WorkoutLog not found'}, status=404)
        comment_obj = WorkoutLogComment.objects.create(user=request.user, workout_log=log, text=comment)
        print(f"Comment created: {comment_obj}")
        serializer = WorkoutLogCommentSerializer(comment_obj)
        return Response(serializer.data, status=200)
    
class VoiceNoteListCreateView(generics.ListCreateAPIView):
    serializer_class = VoiceNoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return VoiceNote.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class VoiceNoteDeleteView(generics.DestroyAPIView):
    serializer_class = VoiceNoteSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = VoiceNote.objects.all()

    def get_queryset(self):
        return VoiceNote.objects.filter(user=self.request.user)
    
class UserStatsView(APIView):
    def get(self, request):
        workouts_completed = WorkoutCompletion.objects.filter(user=request.user).count()
        total_calories = WorkoutLog.objects.filter(user=request.user).aggregate(
            total=Sum('calories')
        )['total'] or 0
        
        
        total_exercises = WorkoutLog.objects.filter(user=request.user).count()
        
        last_7_days = WorkoutCompletion.objects.filter(
            user=request.user,
            date__gte=timezone.now() - timedelta(days=7)
        )
        current_streak = last_7_days.count()
        
        return Response({
            'workoutsCompleted': workouts_completed,
            'totalCalories': total_calories,
            'currentStreak': current_streak,
            'totalExercises': total_exercises  
        })
    
class UserUpdateView(generics.UpdateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class WorkoutLogViewSet(viewsets.ModelViewSet):
    serializer_class = WorkoutLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.workout_logs.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)




class PremiumStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            'is_premium': request.user.is_premium,
            'premium_since': request.user.premium_since
        })