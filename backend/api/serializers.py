from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Period, Lesson, Schedule, Mark, HomeTask, Profile

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        try:
            token['role'] = user.profile.role
        except Profile.DoesNotExist:
            token['role'] = None
        return token

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'name']

class PeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Period
        fields = ['id', 'number', 'start_time', 'end_time']

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
        fields = ['id', 'date', 'lesson', 'lesson_id', 'period', 'period_id']

class ScheduleCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = ['id', 'lesson', 'date', 'period']

    def validate(self, data):
        date = data['date']
        period = data['period']

        existing_schedule = Schedule.objects.filter(
            date=date,
            period=period
        ).exclude(id=self.instance.id if self.instance else None)

        if existing_schedule.exists():
            raise serializers.ValidationError("A schedule already exists for this date and period.")

        # Remove validation related to teacher
        # Since all lessons are taught by the same teacher, and there's no teacher field
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

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['role', 'date_of_birth', 'address']
        read_only_fields = ['role']  # We'll set role automatically

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name', 'profile']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        user = User.objects.create_user(**validated_data)
        Profile.objects.create(user=user, role='student', **profile_data)
        return user

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        profile = instance.profile

        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        if 'password' in validated_data:
            instance.set_password(validated_data['password'])
        instance.save()

        profile.date_of_birth = profile_data.get('date_of_birth', profile.date_of_birth)
        profile.address = profile_data.get('address', profile.address)
        profile.save()

        return instance

class MarkSerializer(serializers.ModelSerializer):
    student = UserSerializer(read_only=True)
    schedule = ScheduleSerializer(read_only=True)
    student_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(profile__role='student'),
        source='student',
        write_only=True
    )
    schedule_id = serializers.PrimaryKeyRelatedField(
        queryset=Schedule.objects.all(),
        source='schedule',
        write_only=True
    )

    class Meta:
        model = Mark
        fields = ['id', 'mark', 'student', 'student_id', 'schedule', 'schedule_id']

    def validate(self, data):
        return data

class StudentScheduleSerializer(serializers.ModelSerializer):
    lesson = LessonSerializer(read_only=True)
    period = PeriodSerializer(read_only=True)
    mark = serializers.SerializerMethodField()

    class Meta:
        model = Schedule
        fields = ['id', 'date', 'period', 'lesson', 'mark']

    def get_mark(self, obj):
        user = self.context['request'].user
        try:
            mark = Mark.objects.get(schedule=obj, student=user)
            return mark.mark
        except Mark.DoesNotExist:
            return None