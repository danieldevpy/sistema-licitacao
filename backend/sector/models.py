from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class Sector(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self) -> str:
        return self.name
    


class CustomUser(AbstractUser):
    sector = models.ForeignKey(Sector, on_delete=models.SET_NULL, null=True, blank=True)

    # Fornecer related_name exclusivo para evitar colisões
    groups = models.ManyToManyField(
        "auth.Group",
        verbose_name="Groups",
        blank=True,
        related_name="custom_users"
    )

    user_permissions = models.ManyToManyField(
        "auth.Permission",
        verbose_name="User permissions",
        blank=True,
        related_name="custom_users"
    )

    def __str__(self):
        return self.username