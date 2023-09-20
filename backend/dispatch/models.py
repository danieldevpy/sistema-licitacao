from django.db import models
from datetime import datetime
from sector.models import Sector
# Create your models here.

class Dispatch(models.Model):
    process = models.ForeignKey('process.Process', on_delete=models.CASCADE,null=True, verbose_name="Processo")
    from_sector = models.ForeignKey(Sector, on_delete=models.SET_NULL, null=True, related_name="dispatches_from_sector", verbose_name="Setor que enviou o processo")
    to_sector = models.ForeignKey(Sector, on_delete=models.SET_NULL, null=True, related_name="dispatches_to_sector",  verbose_name="Setor que recebeu o processo")
    observation = models.CharField(max_length=500, verbose_name="Observação do despacho", null=True, blank=True)
    date = models.DateTimeField(default=datetime.now, null=True, verbose_name="Data de despache")


    def __str__(self) -> str:
        return f"{self.process.process_number} - De: {self.from_sector.name} para: {self.to_sector.name}"