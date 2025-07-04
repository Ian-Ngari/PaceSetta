# Generated by Django 5.2.3 on 2025-06-18 09:31

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_exercise'),
    ]

    operations = [
        migrations.CreateModel(
            name='WorkoutLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(auto_now_add=True)),
                ('exercise', models.CharField(max_length=100)),
                ('sets', models.PositiveIntegerField()),
                ('reps', models.PositiveIntegerField()),
                ('weight', models.FloatField(blank=True, null=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
