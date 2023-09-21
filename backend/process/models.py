from django.db import models
from sector.models import Sector
from dispatch.models import Dispatch
from django.core.exceptions import ValidationError
from users.models import User


class CreationNotAllowedException(ValidationError):
    pass

class Process(models.Model):
    process_number = models.CharField("Numero do Processo", max_length=255)
    object = models.CharField("Objeto", max_length=255)
    sector = models.ForeignKey(Sector, verbose_name="Setor", on_delete=models.CASCADE, related_name="actual_sector")
    status = models.BooleanField("Recebido pela unidade?", default=False)
    active = models.BooleanField("Processo Ativo?", default=True)
    _previous_sector = models.ForeignKey(Sector, on_delete=models.SET_NULL, null=True, blank=True,  related_name="previous_sector")
    _user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True,  related_name="user_fake")
    _obs = models.CharField(max_length=500, null=True, blank=True)

    def set_user(self, user):
            self.created_by = user

    def save(self, *args, **kwargs):
        obj_save = False
        obs = ""
        if not self._user:
            raise CreationNotAllowedException("O usuário não foi informado")

        if not self.id:
            obj_save = True
            obs = f"Criação do processo {self.process_number} e encaminhado para o setor {self.sector.name}"

        if self._obs:
             obs = self._obs

        if self._previous_sector != self.sector:
             obj_save = True
             self.status = False

        if obj_save:
             self._previous_sector = self.sector
        
        super().save(*args, **kwargs)
        
        if obj_save:
            Dispatch(process=self, from_sector=self._user.sector, to_sector=self.sector, observation=obs).save()
        

    def __str__(self) -> str:
        return self.process_number