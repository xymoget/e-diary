# diary_app/views.py

from rest_framework import viewsets, permissions, generics
from rest_framework.exceptions import PermissionDenied
from .models import Period, Lesson, Schedule, Mark, HomeTask
from .serializers import (
    PeriodSerializer, LessonSerializer, ScheduleSerializer, ScheduleCreateUpdateSerializer,
    MarkSerializer, HomeTaskSerializer
)
from .permissions import IsTeacher
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend



class PeriodViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Period.objects.all()
    serializer_class = PeriodSerializer
    permission_classes = [permissions.IsAuthenticated]

class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

    def get_queryset(self):
        return Lesson.objects.filter(teacher=self.request.user)

class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

    def get_queryset(self):
        return Schedule.objects.filter(lesson__teacher=self.request.user)

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return ScheduleSerializer
        return ScheduleCreateUpdateSerializer

    def perform_create(self, serializer):
        lesson = serializer.validated_data['lesson']
        if lesson.teacher != self.request.user:
            raise PermissionDenied("You can only create schedules for your own lessons.")
        serializer.save()

class MarkViewSet(viewsets.ModelViewSet):
    queryset = Mark.objects.all()
    serializer_class = MarkSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

    def get_queryset(self):
        return Mark.objects.filter(schedule__lesson__teacher=self.request.user)

class HomeTaskViewSet(viewsets.ModelViewSet):
    queryset = HomeTask.objects.all()
    serializer_class = HomeTaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

    def get_queryset(self):
        return HomeTask.objects.filter(schedule__lesson__teacher=self.request.user)
    
class StudentScheduleView(generics.ListAPIView):
    serializer_class = ScheduleSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['date']
    ordering_fields = ['period__number']
    ordering = ['period__number']

    def get_queryset(self):
        return Schedule.objects.all()

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
