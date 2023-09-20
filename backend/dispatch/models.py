from django.db import models
from datetime import datetime
from sector.models import Sector
from process.models import Process
# Create your models here.

class Dispatch(models.Model):
    process = models.ForeignKey(Process, on_delete=models.CASCADE,null=True, verbose_name="Processo")
    from_sector = models.ForeignKey(Sector, on_delete=models.SET_NULL, null=True, verbose_name="Setor que enviou o proesso")
    to_sector = models.ForeignKey(Sector, on_delete=models.SET_NULL, null=True, verbose_name="Setor que recebeu o processo")
    observation = models.CharField(max_length=500, verbose_name="Observação do despacho")
    date = models.DateTimeField(default=datetime.now, null=True, verbose_name="Data de despache")


    def __str__(self) -> str:
        return self.process.process_number