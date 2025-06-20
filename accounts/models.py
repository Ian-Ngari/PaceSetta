from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _

class CustomUser(AbstractUser):
    FITNESS_GOALS = [
        ('build_muscle', 'Build Muscle'),
        ('lose_fat', 'Lose Fat'),
        ('increase_strength', 'Increase Strength'),
        ('general_fitness', 'General Fitness')
    ]
    EXPERIENCE_LEVELS = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced')
    ]
    email = models.EmailField(_('email address'), unique=True)
    fitness_goal = models.CharField(
        max_length=20,
        choices=FITNESS_GOALS,
        default='general_fitness'
    )
    experience_level = models.CharField(
        max_length=20,
        choices=EXPERIENCE_LEVELS,
        default='beginner'
    )

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.username

class WorkoutPlan(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='workout_plans')
    name = models.CharField(max_length=100)
    goal = models.CharField(max_length=100)
    level = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s {self.name}"

class WorkoutRoutine(models.Model):
    plan = models.ForeignKey(WorkoutPlan, on_delete=models.CASCADE, related_name='routines')
    day = models.CharField(max_length=20)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.plan.name} - {self.day}"

class WorkoutExercise(models.Model):
    routine = models.ForeignKey(WorkoutRoutine, on_delete=models.CASCADE, related_name='exercises')
    name = models.CharField(max_length=100)
    sets = models.PositiveIntegerField()
    reps = models.CharField(max_length=20)
    weight = models.FloatField(null=True, blank=True)
    notes = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.name} ({self.sets}x{self.reps})"

class Exercise(models.Model):
    name = models.CharField(max_length=100)
    muscle_group = models.CharField(max_length=50)
    difficulty = models.CharField(max_length=20)
    equipment = models.CharField(max_length=50)
    video_url = models.URLField(blank=True, null=True)  # YouTube demo

    def __str__(self):
        return self.name
    
class WorkoutLog(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    exercise = models.CharField(max_length=100)
    sets = models.PositiveIntegerField()
    reps = models.PositiveIntegerField()
    weight = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.exercise} on {self.date}"
    

    
class Follow(models.Model):
    follower = models.ForeignKey(CustomUser, related_name='following', on_delete=models.CASCADE)
    following = models.ForeignKey(CustomUser, related_name='followers', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('follower', 'following')

class WorkoutLogLike(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    workout_log = models.ForeignKey(WorkoutLog, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'workout_log')

class WorkoutLogComment(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    workout_log = models.ForeignKey(WorkoutLog, on_delete=models.CASCADE, related_name='comments')
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)


class WorkoutCompletion(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    routine_id = models.IntegerField()  
    date = models.DateField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'routine_id', 'date')

class Activity(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    action = models.CharField(max_length=255)
    time = models.DateTimeField(auto_now_add=True)
    routine_id = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.action} at {self.time}"