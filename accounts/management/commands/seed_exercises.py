from django.core.management.base import BaseCommand
from accounts.models import Exercise

class Command(BaseCommand):
    help = 'Seed the Exercise table with demo data'

    def handle(self, *args, **kwargs):
        demo_exercises = [
            # Chest
            {"name": "Push-up", "muscle_group": "chest", "difficulty": "beginner", "equipment": "bodyweight", "video_url": "https://www.youtube.com/watch?v=_l3ySVKYVJ8"},
            {"name": "Bench Press", "muscle_group": "chest", "difficulty": "intermediate", "equipment": "barbell", "video_url": "https://www.youtube.com/watch?v=rT7DgCr-3pg"},
            {"name": "Chest Fly", "muscle_group": "chest", "difficulty": "beginner", "equipment": "dumbbells", "video_url": "https://www.youtube.com/watch?v=IODxDxX7oi4"},
           
            {"name": "Decline Push-up", "muscle_group": "chest", "difficulty": "intermediate", "equipment": "bodyweight", "video_url": "https://www.youtube.com/watch?v=J0DnG1_S92I"},
            # Back
            {"name": "Pull-up", "muscle_group": "back", "difficulty": "intermediate", "equipment": "pull-up bar", "video_url": "https://www.youtube.com/watch?v=eGo4IYlbE5g"},
            {"name": "Bent Over Row", "muscle_group": "back", "difficulty": "intermediate", "equipment": "barbell", "video_url": "https://www.youtube.com/watch?v=vT2GjY_Umpw"},
            {"name": "Lat Pulldown", "muscle_group": "back", "difficulty": "beginner", "equipment": "cable machine", "video_url": "https://www.youtube.com/watch?v=GZbfZ033f74"},
            {"name": "Seated Cable Row", "muscle_group": "back", "difficulty": "beginner", "equipment": "cable machine", "video_url": "https://www.youtube.com/watch?v=6TSP1TRMUzs"},
          
            # Legs
            {"name": "Squat", "muscle_group": "legs", "difficulty": "beginner", "equipment": "bodyweight", "video_url": "https://www.youtube.com/watch?v=aclHkVaku9U"},
            {"name": "Lunge", "muscle_group": "legs", "difficulty": "beginner", "equipment": "bodyweight", "video_url": "https://www.youtube.com/watch?v=QOVaHwm-Q6U"},
            {"name": "Leg Press", "muscle_group": "legs", "difficulty": "intermediate", "equipment": "machine", "video_url": "https://www.youtube.com/watch?v=2SHsk9AzdjA"},
            {"name": "Leg Extension", "muscle_group": "legs", "difficulty": "beginner", "equipment": "machine", "video_url": "https://www.youtube.com/watch?v=ykJmrZ5v0Oo"},
            {"name": "Romanian Deadlift", "muscle_group": "legs", "difficulty": "intermediate", "equipment": "barbell", "video_url": "https://www.youtube.com/watch?v=1oed-UmAxFs"},
            # Arms
            {"name": "Bicep Curl", "muscle_group": "arms", "difficulty": "beginner", "equipment": "dumbbells", "video_url": "https://www.youtube.com/watch?v=ykJmrZ5v0Oo"},
            
            {"name": "Hammer Curl", "muscle_group": "arms", "difficulty": "beginner", "equipment": "dumbbells", "video_url": "https://www.youtube.com/watch?v=6kALZikXxLc"},
            {"name": "Tricep Dips", "muscle_group": "arms", "difficulty": "intermediate", "equipment": "bodyweight", "video_url": "https://www.youtube.com/watch?v=6kALZikXxLc"},
            {"name": "Overhead Tricep Extension", "muscle_group": "arms", "difficulty": "intermediate", "equipment": "dumbbells", "video_url": "https://www.youtube.com/watch?v=6kALZikXxLc"},
            # Shoulders
            {"name": "Shoulder Press", "muscle_group": "shoulders", "difficulty": "intermediate", "equipment": "dumbbells", "video_url": "https://www.youtube.com/watch?v=B-aVuyhvLHU"},
            {"name": "Lateral Raise", "muscle_group": "shoulders", "difficulty": "beginner", "equipment": "dumbbells", "video_url": "https://www.youtube.com/watch?v=3VcKaXpzqRo"},
            {"name": "Front Raise", "muscle_group": "shoulders", "difficulty": "beginner", "equipment": "dumbbells", "video_url": "https://www.youtube.com/watch?v=6drMZqmyXQc"},
            {"name": "Rear Delt Fly", "muscle_group": "shoulders", "difficulty": "intermediate", "equipment": "dumbbells", "video_url": "https://www.youtube.com/watch?v=0JfYxMRsUCQ"},
            {"name": "Arnold Press", "muscle_group": "shoulders", "difficulty": "advanced", "equipment": "dumbbells", "video_url": "https://www.youtube.com/watch?v=2yjwXTZQDDI"},
            # Core
            {"name": "Plank", "muscle_group": "core", "difficulty": "beginner", "equipment": "bodyweight", "video_url": "https://www.youtube.com/watch?v=AnYl6Nk9GOA"},
            {"name": "Crunch", "muscle_group": "core", "difficulty": "beginner", "equipment": "bodyweight", "video_url": "https://www.youtube.com/watch?v=1fbU_MkV7NE"},
            {"name": "Russian Twist", "muscle_group": "core", "difficulty": "beginner", "equipment": "bodyweight", "video_url": "https://www.youtube.com/watch?v=JB2oyawG9KI"},
            
            {"name": "Bicycle Crunch", "muscle_group": "core", "difficulty": "beginner", "equipment": "bodyweight", "video_url": "https://www.youtube.com/watch?v=1919eTCoESo"},
        ]

        for ex in demo_exercises:
            Exercise.objects.get_or_create(
                name=ex["name"],
                defaults={
                    "muscle_group": ex["muscle_group"],
                    "difficulty": ex["difficulty"],
                    "equipment": ex["equipment"],
                    "video_url": ex["video_url"],
                }
            )
        self.stdout.write(self.style.SUCCESS('Demo exercises added!'))