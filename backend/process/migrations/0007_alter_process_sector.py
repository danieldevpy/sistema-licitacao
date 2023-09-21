# Generated by Django 4.2.5 on 2023-09-20 19:55

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('sector', '0001_initial'),
        ('process', '0006_process__obs'),
    ]

    operations = [
        migrations.AlterField(
            model_name='process',
            name='sector',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='actual_sector', to='sector.sector', verbose_name='Setor'),
            preserve_default=False,
        ),
    ]