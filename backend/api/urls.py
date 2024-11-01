from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ScheduleViewSet, MarkViewSet, HomeTaskViewSet, StudentScheduleView, StudentMarkView, StudentHomeTaskView

router = DefaultRouter()
router.register(r'schedules', ScheduleViewSet)
router.register(r'marks', MarkViewSet)
router.register(r'hometasks', HomeTaskViewSet)

urlpatterns = [
    path('teacher/', include(router.urls)),
    path('student/schedules/', StudentScheduleView.as_view(), name='student-schedules'),
    path('student/marks/', StudentMarkView.as_view(), name='student-marks'),
    path('student/hometasks/', StudentHomeTaskView.as_view(), name='student-hometasks'),
]