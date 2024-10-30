from django.contrib.auth.models import User
from django.db import models

class Profile(models.Model):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('teacher', 'Teacher'),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=7, choices=ROLE_CHOICES)

    def __str__(self):
        return f"{self.user.username} - {self.role}"
    
class Lesson(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Period(models.Model):
    number = models.PositiveIntegerField(unique=True)
    start_time = models.TimeField()
    end_time = models.TimeField()

    def __str__(self):
        return f"Period {self.number}: {self.start_time} - {self.end_time}"
    
class Schedule(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    date = models.DateField()
    period = models.ForeignKey(Period, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('date', 'period')

    def __str__(self):
        return f"{self.lesson.name} on {self.date} during Period {self.period.number}"

class Mark(models.Model):
    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        limit_choices_to={'profile__role': 'student'}
    )
    schedule = models.ForeignKey(Schedule, on_delete=models.CASCADE)
    mark = models.IntegerField()

    def __str__(self):
        return f"{self.student.username} - {self.mark} for {self.schedule}"

class HomeTask(models.Model):
    schedule = models.ForeignKey(Schedule, on_delete=models.CASCADE)
    description = models.TextField()

    def __str__(self):
        return f"Hometask for {self.schedule}"  