# diary_app/views.py

from rest_framework import viewsets, permissions, generics
from rest_framework.exceptions import PermissionDenied
from .models import Period, Lesson, Schedule, Mark, HomeTask
from .serializers import *
from .permissions import IsTeacher
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework_simplejwt.views import TokenObtainPairView


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    permission_classes = [IsTeacher]

class StudentListView(generics.ListAPIView):
    queryset = User.objects.filter(profile__role='student')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

class LessonListView(generics.ListAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [IsTeacher]

class PeriodListView(generics.ListAPIView):
    queryset = Period.objects.all()
    serializer_class = PeriodSerializer
    permission_classes = [IsTeacher]

class PeriodViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Period.objects.all()
    serializer_class = PeriodSerializer
    permission_classes = [permissions.IsAuthenticated]

class StudentViewSet(viewsets.ModelViewSet):
    queryset = User.objects.filter(profile__role='student')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

class MarkViewSet(viewsets.ModelViewSet):
    queryset = Mark.objects.all()
    serializer_class = MarkSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

class HomeTaskViewSet(viewsets.ModelViewSet):
    queryset = HomeTask.objects.all()
    serializer_class = HomeTaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacher]
    
class StudentMarksView(generics.ListAPIView):
    serializer_class = MarkSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['schedule__date', 'lesson__name']
    ordering_fields = ['schedule__date', 'lesson__name', 'mark']
    ordering = ['schedule__date']

    def get_queryset(self):
        return Mark.objects.filter(student=self.request.user).select_related('lesson', 'schedule__period').order_by('schedule__date', 'lesson__name')
    
class StudentScheduleView(generics.ListAPIView):
    serializer_class = StudentScheduleSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['date']

    def get_queryset(self):
        user = self.request.user
        date = self.request.query_params.get('date', None)
        if date:
            return Schedule.objects.filter(mark__student=user, date=date).distinct().order_by('period__number')
        else:
            # If no date is provided, default to today
            from datetime import date as dt_date
            return Schedule.objects.filter(mark__student=user, date=dt_date.today()).distinct().order_by('period__number')

class StudentMarkView(generics.ListAPIView):
    serializer_class = MarkSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Mark.objects.filter(student=self.request.user)

class StudentHomeTaskView(generics.ListAPIView):
    serializer_class = HomeTaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['schedule__date']

    def get_queryset(self):
        return HomeTask.objects.filter(schedule__date__gte=self.request.query_params.get('date', None))
