from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import Profile, Period, Lesson, Schedule, Mark, HomeTask


class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'Profile'

class UserAdmin(BaseUserAdmin):
    inlines = (ProfileInline,)

admin.site.unregister(User)

admin.site.register(User, UserAdmin)

admin.site.register(Period)
admin.site.register(Lesson)
admin.site.register(Schedule)
admin.site.register(Mark)
admin.site.register(HomeTask)
