# Generated by Django 3.1.6 on 2021-06-02 16:12

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Organismo',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombrecientifico', models.CharField(max_length=50)),
                ('ph', models.FloatField(max_length=10)),
                ('genero', models.CharField(max_length=50)),
            ],
            options={
                'verbose_name': 'organismo',
                'verbose_name_plural': 'organismos',
                'ordering': ['nombrecientifico'],
            },
        ),
        migrations.CreateModel(
            name='TipoReactor',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('descripcion', models.CharField(max_length=200)),
                ('especificaciontecnica', models.TextField(max_length=300)),
                ('tiporeactor', models.CharField(max_length=200)),
            ],
            options={
                'verbose_name': 'tiporeactor',
                'verbose_name_plural': 'tiporeactores',
                'ordering': ['tiporeactor'],
            },
        ),
        migrations.CreateModel(
            name='Reactor',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('marca', models.CharField(max_length=50)),
                ('modelo', models.CharField(max_length=50)),
                ('especificaciontecnica', models.TextField(max_length=200)),
                ('foto1', models.ImageField(blank=True, null=True, upload_to='img/', verbose_name='Imagen')),
                ('foto2', models.ImageField(blank=True, null=True, upload_to='img/', verbose_name='Imagen')),
                ('foto3', models.ImageField(blank=True, null=True, upload_to='img/', verbose_name='Imagen')),
                ('foto4', models.ImageField(blank=True, null=True, upload_to='img/', verbose_name='Imagen')),
                ('estado', models.BooleanField(default=True)),
                ('tiporeactor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ProsPyApp.tiporeactor')),
            ],
            options={
                'verbose_name': 'reactor',
                'verbose_name_plural': 'reatores',
                'ordering': ['marca'],
            },
        ),
        migrations.CreateModel(
            name='CaPrediccion',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('titulo', models.CharField(max_length=20)),
                ('descripcion', models.TextField(max_length=200)),
                ('x', models.FloatField(max_length=10)),
                ('v', models.FloatField(max_length=10)),
                ('so', models.FloatField(max_length=10)),
                ('umax', models.FloatField(max_length=10)),
                ('y', models.FloatField(max_length=10)),
                ('sf', models.FloatField(max_length=10)),
                ('tb', models.FloatField(max_length=10)),
                ('organismo', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ProsPyApp.organismo')),
                ('reactor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ProsPyApp.reactor')),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'caprediccion',
                'verbose_name_plural': 'caprediccions',
                'ordering': ['titulo'],
            },
        ),
        migrations.CreateModel(
            name='CaBatch',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('titulo', models.CharField(max_length=20)),
                ('descripcion', models.TextField(max_length=200)),
                ('y', models.FloatField(max_length=10)),
                ('ks', models.FloatField(max_length=10)),
                ('umax', models.FloatField(max_length=10)),
                ('ms', models.FloatField(max_length=10)),
                ('f', models.FloatField(max_length=10)),
                ('t', models.FloatField(max_length=10)),
                ('v0', models.FloatField(max_length=10)),
                ('v', models.FloatField(max_length=10)),
                ('vf', models.FloatField(max_length=10)),
                ('so', models.FloatField(max_length=10)),
                ('n', models.FloatField(max_length=10)),
                ('x', models.FloatField(max_length=10)),
                ('organismo', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ProsPyApp.organismo')),
                ('reactor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ProsPyApp.reactor')),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'cabatch',
                'verbose_name_plural': 'cabatchs',
                'ordering': ['titulo'],
            },
        ),
    ]