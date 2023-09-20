from django.contrib import admin
from .models import Sector
# Register your models here.

class SectorAdmin(admin.ModelAdmin):
    pass


admin.site.register(Sector, SectorAdmin)