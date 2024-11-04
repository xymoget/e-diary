from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'teacher/students', StudentViewSet, basename='teacher-students')
router.register(r'teacher/lessons', LessonViewSet, basename='teacher-lessons')
router.register(r'teacher/schedules', ScheduleViewSet, basename='teacher-schedule')
router.register(r'teacher/periods', PeriodViewSet, basename='periods')
router.register(r'teacher/marks', MarkViewSet, basename='mark')

urlpatterns = [
    path('', include(router.urls)),
    path('teacher/students/', StudentListView.as_view(), name='student-list'),
    path('student/schedule/', StudentScheduleView.as_view(), name='student-schedule'),
    path('student/marks/', StudentMarkView.as_view(), name='student-marks'),
    path('student/hometasks/', StudentHomeTaskView.as_view(), name='student-hometasks'),
    path('teacher/students/<int:student_id>/marks/', StudentMarksView.as_view(), name='student-marks'),
]