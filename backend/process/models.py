from django.db import models
from sector.models import Sector

# Create your models here.

class Process(models.Model):
    process_number = models.CharField("Numero do Processo", max_length=255)
    object = models.CharField("Objeto", max_length=255)
    sector = models.ForeignKey(verbose_name="Setor", to=Sector, on_delete=models.SET_NULL, null=True)
    status = models.BooleanField("Recebido pela unidade?", bool, default=False)

    def __str__(self) -> str:
        return self.process_number