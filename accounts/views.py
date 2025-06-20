import os
import requests
from dotenv import load_dotenv
from rest_framework import generics, permissions, status, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count

from .models import WorkoutPlan, WorkoutRoutine, WorkoutExercise, Exercise, WorkoutLog, Follow, WorkoutCompletion, Activity, CustomUser, WorkoutLogLike, WorkoutLogComment, VoiceNote
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

User = get_user_model()
EXERCISE_DB_API_KEY = os.getenv('EXERCISE_DB_API_KEY')
EXERCISE_DB_HOST = os.getenv('EXERCISE_DB_HOST', 'exercisedb.p.rapidapi.com')
YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY')

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
        url = f"https://{EXERCISE_DB_HOST}/exercises/target/{muscle_group}"
        headers = {
            "X-RapidAPI-Key": EXERCISE_DB_API_KEY,
            "X-RapidAPI-Host": EXERCISE_DB_HOST
        }
        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            return response.json()[:3]
        except requests.exceptions.RequestException:
            fallback = {
                'chest': [{'name': 'Push-up', 'target': 'chest'}],
                'back': [{'name': 'Pull-up', 'target': 'back'}],
                'legs': [{'name': 'Squat', 'target': 'quadriceps'}],
                'shoulders': [{'name': 'Shoulder Press', 'target': 'delts'}],
                'arms': [{'name': 'Bicep Curl', 'target': 'biceps'}]
            }
            return fallback.get(muscle_group, [])

    def post(self, request):
        try:
            goal = request.data.get('goal', 'general_fitness')
            level = request.data.get('level', 'beginner')
            days = int(request.data.get('days', 3))

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

            goal_muscles = {
                'build_muscle': ['chest', 'back', 'legs', 'shoulders', 'arms'],
                'lose_fat': ['chest', 'back', 'legs'],
                'increase_strength': ['chest', 'back', 'legs'],
                'general_fitness': ['chest', 'back', 'legs', 'shoulders']
            }
            muscle_groups = goal_muscles.get(goal, ['chest', 'back', 'legs'])

            for i, day in enumerate(workout_days):
                routine = WorkoutRoutine.objects.create(
                    plan=plan,
                    day=day,
                    order=i
                )
                muscle = muscle_groups[i % len(muscle_groups)]
                exercises = self.get_exercises_from_api(muscle)
                for j, exercise in enumerate(exercises):
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
            return Response(
                {'error': f"Failed to create workout plan: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

    def get(self, request):
        try:
            plan = WorkoutPlan.objects.filter(user=request.user).latest('created_at')
            serializer = WorkoutPlanSerializer(plan)
            return Response(serializer.data)
        except WorkoutPlan.DoesNotExist:
            return Response(
                {'message': 'No workout plan found'},
                status=status.HTTP_404_NOT_FOUND
            )

class CurrentWorkoutPlanView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            plan = WorkoutPlan.objects.filter(user=request.user).latest('created_at')
            serializer = WorkoutPlanSerializer(plan)
            return Response(serializer.data)
        except WorkoutPlan.DoesNotExist:
            return Response(
                {"message": "No current workout plan"},
                status=status.HTTP_404_NOT_FOUND
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
                {"username": "user1", "workouts": 15},
                {"username": "user2", "workouts": 12}
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
        serializer.save(user=self.request.user)

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
        # Log activity
        Activity.objects.create(
            user=self.request.user,
            action=f"completed a workout routine",
            routine_id=completion.routine_id
        )

class ActivityFeedView(generics.ListAPIView):
    serializer_class = ActivitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Activity.objects.order_by('-time')[:50]

class LeaderboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Top 5 users with most completed workouts
        users = CustomUser.objects.annotate(
            workouts=Count('workoutcompletion')
        ).order_by('-workouts')[:5]
        data = [
            {
                "id": user.id,
                "username": user.username,
                "workouts": user.workouts,
                "avatar": "🏋️",
            }
            for user in users
        ]
        return Response(data)

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