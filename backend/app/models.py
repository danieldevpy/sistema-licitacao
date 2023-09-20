from django.db import models
from django.contrib.auth.models import AbstractUser
from sector.models import Sector  # Substitua 'your_app_name' pelo nome do seu aplicativo

class CustomUser(AbstractUser):
    sector = models.ForeignKey(Sector, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.username