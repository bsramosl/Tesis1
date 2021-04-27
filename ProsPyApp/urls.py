from django.urls import path
from ProsPyApp import views
from django.contrib.auth.decorators import login_required

app_name = 'ProsPy'

urlpatterns = [

    path('Inicio/', login_required(views.Inicio.as_view()), name='Inicio'),
    path('Login/', views.Login.as_view(), name='Login'),
    path('Salir/', login_required(views.LogoutUsuario.as_view()), name='Salir'),

    path('ModeloReact/', login_required(views.ModeloReact.as_view()), name='ModeloReact'),
    path('TiempoCultivo/', login_required(views.TiempoCultivo.as_view()), name='TiempoCultivo'),

    path('Admin/', login_required(views.Admin.as_view()), name='Admin'),

    path('LUsuarioLista/', login_required(views.LUsuarioLista.as_view()), name='LUsuarioLista'),
    path('UsuarioLista/', login_required(views.UsuarioLista.as_view()), name='UsuarioLista'),

    path('LUTipoReactor/', login_required(views.LUTipoReactor.as_view()), name='LUTipoReactor'),
    path('TipoReactorlista/', login_required(views.TipoReactorlista.as_view()), name='TipoReactorlista'),
    path('GuardarTipo/', login_required(views.GuardarTipo.as_view()), name='GuardarTipo'),
    path('EditarTipo/<int:pk>/', login_required(views.EditarTipo.as_view()), name='EditarTipo'),
    path('EliminarTipo/<int:pk>/', login_required(views.EliminarTipo.as_view()), name='EliminarTipo'),

    path('LUOrganismo/', login_required(views.LUOrganismo.as_view()), name='LUOrganismo'),
    path('Organismolista/', login_required(views.Organismolista.as_view()), name='Organismolista'),
    path('GuardarOrganismo/', login_required(views.GuardarOrganismo.as_view()), name='GuardarOrganismo'),
    path('EditarOrganismo/<int:pk>/', login_required(views.EditarOrganismo.as_view()), name='EditarOrganismo'),
    path('EliminarOrganismo/<int:pk>/', login_required(views.EliminarOrganismo.as_view()), name='EliminarOrganismo'),

    path('LUReactor/', login_required(views.LUReactor.as_view()), name='LUReactor'),
    path('Reactorlista/', login_required(views.Reactorlista.as_view()), name='Reactorlista'),
    path('GuardarReactor/', login_required(views.GuardarReactor.as_view()), name='GuardarReactor'),
    path('EditarReactor/<int:pk>/', login_required(views.EditarReactor.as_view()), name='EditarReactor'),
    path('EliminarReactor/<int:pk>/', login_required(views.EliminarReactor.as_view()), name='EliminarReactor'),

    path('LUCaBatch/', login_required(views.LUCaBatch.as_view()), name='LUCaBatch'),
    path('CaBatchlista/', login_required(views.CaBatchlista.as_view()), name='CaBatchlista'),
    path('GuardarCaBatch/', login_required(views.GuardarCaBatch.as_view()), name='GuardarCaBatch'),
    path('EditarCaCaBatch/<int:pk>/', login_required(views.EditarCaCaBatch.as_view()), name='EditarCaCaBatch'),
    path('EliminarCaCaBatch/<int:pk>/', login_required(views.EliminarCaCaBatch.as_view()), name='EliminarCaCaBatch'),

    path('LUCaPrediccion/', login_required(views.LUCaPrediccion.as_view()), name='LUCaPrediccion'),
    path('CaPrediccionlista/', login_required(views.CaPrediccionlista.as_view()), name='CaPrediccionlista'),
    path('GuardarCaPrediccion/', login_required(views.GuardarCaPrediccion.as_view()), name='GuardarCaPrediccion'),
    path('EditarCaPrediccion/<int:pk>/', login_required(views.EditarCaPrediccion.as_view()), name='EditarCaPrediccion'),
    path('EliminarCaPrediccion/<int:pk>/', login_required(views.EliminarCaPrediccion.as_view()),
         name='EliminarCaPrediccion'),

    path('CrearUsuario/', views.CrearUsuario.as_view(), name=' CrearUsuario'),
    path('CambiarContraseña', login_required(views.CambiarContraseña), name='CambiarContraseña'),
    path('EditarUsuario/<int:pk>/', login_required(views.EditarUsuario.as_view()), name='EditarUsuario'),
    path('EliminarUsuario/<int:pk>/', login_required(views.EliminarUsuario.as_view()), name='EliminarUsuario'),

    path('EjerciciosLista/', login_required(views.EjerciciosLista.as_view()), name='EjerciciosLista'),
    path('ActualizarCaBatch/<int:pk>', login_required(views.ActualizarCaBatch.as_view()), name='ActualizarCaBatch'),
    path('EliminarCaBatch/<int:pk>', login_required(views.EliminarCaBatch.as_view()), name='EliminarCaBatch'),

    path('ActualizarPrediccion/<int:pk>', login_required(views.ActualizarPrediccion.as_view()), name='ActualizarPrediccion'),
    path('EliminarPrediccion/<int:pk>', login_required(views.EliminarPrediccion.as_view()), name='EliminarPrediccion'),

    path('Comparar/', login_required(views.Comparar.as_view()), name='Comparar'),

]
