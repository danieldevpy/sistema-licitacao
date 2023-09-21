from django.test import TestCase
from process.models import Process, CreationNotAllowedException
from sector.models import Sector
from users.models import User
from dispatch.models import Dispatch
from unittest.mock import patch

class TestModel(TestCase):
    number_process = 123456789

    def setUp(self):
        self.recepcao = Sector.objects.create(name="Recepção")
        self.ti = Sector.objects.create(name="Ti")
        self.licitacao = Sector.objects.create(name="Licitacao")
        self.financeiro = Sector.objects.create(name="Financeiro")
        self.user = User.objects.create(username="teste", password="123", sector=self.recepcao)
        Process.objects.create(
            process_number=self.number_process,
            object="process test",
            sector=self.ti,
            _user = self.user
            )

    def test_infos_create(self):
        process = Process.objects.get(process_number=self.number_process)
        self.assertIsNotNone(process)
        self.assertEqual(process._user, self.user)
        self.assertEqual(process.sector, self.ti)
        self.assertEqual(process._previous_sector, self.ti)
        self.assertEqual(process._obs, f"Criação do processo {process.process_number} e encaminhado para o setor {process.sector.name}")

    def test_create_dispatch(self):
        process = Process.objects.get(process_number=self.number_process)
        dispatchs = Dispatch.objects.filter(process=process).all()
        self.assertEqual(len(dispatchs), 1)
        dispatch = dispatchs[0]
        self.assertEqual(dispatch.from_sector, self.recepcao)
        self.assertEqual(dispatch.to_sector, self.ti)

    def test_create_process_error_not_user(self):
        with self.assertRaises(CreationNotAllowedException):
            Process.objects.create(
                process_number=self.number_process,
                object="process test",
                sector=self.ti,
                )
        