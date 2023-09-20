from django.contrib import admin
from .models import Dispatch
# Register your models here.


class AdminDispatch(admin.ModelAdmin):
    pass


admin.site.register(Dispatch, AdminDispatch)
