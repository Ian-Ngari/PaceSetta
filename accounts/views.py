import os
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import WorkoutPlan, WorkoutRoutine, WorkoutExercise
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from dotenv import load_dotenv
import requests

# Load environment variables
load_dotenv()

User = get_user_model()

from .serializers import (
    UserSerializer,
    CustomTokenObtainPairSerializer,
    WorkoutPlanSerializer,
    WorkoutRoutineSerializer,
    WorkoutExerciseSerializer
)

EXERCISE_DB_API_KEY = os.getenv('EXERCISE_DB_API_KEY')
EXERCISE_DB_HOST = os.getenv('EXERCISE_DB_HOST', 'exercisedb.p.rapidapi.com')

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

class ExerciseListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        url = f"https://{EXERCISE_DB_HOST}/exercises"
        headers = {
            "X-RapidAPI-Key": EXERCISE_DB_API_KEY,
            "X-RapidAPI-Host": EXERCISE_DB_HOST
        }
        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            return Response(response.json())
        except Exception:
            fallback = [
                {"name": "Push-up", "target": "chest", "equipment": "body weight"},
                {"name": "Pull-up", "target": "back", "equipment": "pull-up bar"},
                {"name": "Squat", "target": "quadriceps", "equipment": "body weight"}
            ]
            return Response(fallback)

class WorkoutHistoryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Return an empty list or sample data for now
        return Response([])

class ProgressView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Return sample progress data
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