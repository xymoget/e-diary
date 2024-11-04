from rest_framework import serializers
from .models import Period, Lesson, Schedule, Mark, HomeTask, Profile
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth.models import User

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        try:
            token['role'] = user.profile.role
        except Profile.DoesNotExist:
            token['role'] = None

        return token

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['role']

class PeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Period
        fields = ['id', 'number', 'start_time', 'end_time']

class LessonSerializer(serializers.ModelSerializer):
    teacher = UserSerializer(read_only=True)

    class Meta:
        model = Lesson
        fields = ['id', 'name', 'teacher']

    def create(self, validated_data):
        teacher = self.context['request'].user
        return Lesson.objects.create(teacher=teacher, **validated_data)

class ScheduleSerializer(serializers.ModelSerializer):
    lesson = LessonSerializer(read_only=True)
    lesson_id = serializers.PrimaryKeyRelatedField(
        queryset=Lesson.objects.all(), source='lesson', write_only=True
    )
    period = PeriodSerializer(read_only=True)
    period_id = serializers.PrimaryKeyRelatedField(
        queryset=Period.objects.all(), source='period', write_only=True
    )

    class Meta:
        model = Schedule
        fields = ['id', 'lesson', 'lesson_id', 'date', 'period', 'period_id']

class ScheduleCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = ['id', 'lesson', 'date', 'period']

    def validate(self, data):
        date = data['date']
        period = data['period']
        lesson = data['lesson']

        existing_schedule = Schedule.objects.filter(
            date=date,
            period=period
        ).exclude(id=self.instance.id if self.instance else None)

        if existing_schedule.exists():
            raise serializers.ValidationError("A schedule already exists for this date and period.")

        teacher = self.context['request'].user
        existing_teacher_schedule = Schedule.objects.filter(
            date=date,
            period=period,
            lesson__teacher=teacher
        ).exclude(id=self.instance.id if self.instance else None)

        if existing_teacher_schedule.exists():
            raise serializers.ValidationError("You already have a lesson scheduled at this time.")

        return data

class MarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mark
        fields = ['id', 'student', 'schedule', 'mark']

    def validate(self, data):
        teacher = self.context['request'].user
        schedule = data['schedule']
        if schedule.lesson.teacher != teacher:
            raise serializers.ValidationError("You can only assign marks for your own lessons.")
        return data

class HomeTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeTask
        fields = ['id', 'schedule', 'description']

    def validate(self, data):
        teacher = self.context['request'].user
        schedule = data['schedule']
        if schedule.lesson.teacher != teacher:
            raise serializers.ValidationError("You can only assign hometasks for your own lessons.")
        return data
