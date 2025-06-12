from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.hashers import make_password

class CustomUser(AbstractUser):
    email = models.EmailField(_('email address'), unique=True)
    fitness_goal = models.CharField(max_length=100, blank=True)
    experience_level = models.CharField(max_length=50, blank=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email

    def save(self, *args, **kwargs):
        if self.password and not self.password.startswith(('pbkdf2_sha256$', 'bcrypt$')):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)