from django.contrib import admin
from .models import Process
# Register your models here.


class ProcessAdmin(admin.ModelAdmin):
    pass


admin.site.register(Process, ProcessAdmin)
