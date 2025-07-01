from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import WorkoutPlan, WorkoutRoutine, WorkoutExercise, Exercise, WorkoutLog, Follow, WorkoutCompletion, Activity, WorkoutLogLike, WorkoutLogComment, VoiceNote, AIChat

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password2 = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'password2', 
                  'fitness_goal', 'experience_level')
        extra_kwargs = {
            'username': {'required': True},
            'email': {'required': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )
        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            fitness_goal=validated_data.get('fitness_goal', 'general_fitness'),
            experience_level=validated_data.get('experience_level', 'beginner')
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = User.USERNAME_FIELD  

    def validate(self, attrs):
        data = super().validate(attrs)
        data.update({
            'user': {
                'id': self.user.id,
                'username': self.user.username,
                'email': self.user.email,
                'fitness_goal': self.user.fitness_goal,
                'experience_level': self.user.experience_level
            }
        })
        return data

class WorkoutExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkoutExercise
        fields = ['id', 'name', 'sets', 'reps', 'weight', 'notes', 'order']

class WorkoutRoutineSerializer(serializers.ModelSerializer):
    exercises = WorkoutExerciseSerializer(many=True, read_only=True)
    class Meta:
        model = WorkoutRoutine
        fields = ['id', 'day', 'order', 'exercises']

class WorkoutPlanSerializer(serializers.ModelSerializer):
    routines = WorkoutRoutineSerializer(many=True, read_only=True)
    class Meta:
        model = WorkoutPlan
        fields = ['id', 'name', 'goal', 'level', 'created_at', 'updated_at', 'routines']

class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ['id', 'name', 'muscle_group', 'difficulty', 'equipment', 'video_url']

from .models import WorkoutLog


class WorkoutLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkoutLog
        fields = ['id', 'exercise', 'sets', 'reps', 'calories', 'duration', 'date']
        read_only_fields = ['id', 'date', 'user']

class WorkoutLogLikeSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = WorkoutLogLike
        fields = ['id', 'user', 'workout_log', 'created_at']



class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follow
        fields = ['id', 'follower', 'following', 'created_at']
        read_only_fields = ['follower', 'created_at']

class FollowSerializer(serializers.ModelSerializer):
    follower = serializers.CharField(source='follower.username', read_only=True)
    following = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    class Meta:
        model = Follow
        fields = ['id', 'follower', 'following', 'created_at']


class WorkoutCompletionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkoutCompletion
        fields = ['id', 'user', 'routine_id', 'date']
        read_only_fields = ['user', 'date']

class ActivitySerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = Activity
        fields = ['id', 'user', 'username', 'action', 'time', 'routine_id']


class WorkoutLogCommentSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = WorkoutLogComment
        fields = ['id', 'user', 'workout_log', 'text', 'created_at']

class VoiceNoteSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = VoiceNote
        fields = ['id', 'username', 'audio', 'created_at']

class AIChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIChat
        fields = ['id', 'message', 'response', 'created_at']