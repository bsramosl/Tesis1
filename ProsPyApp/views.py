from datetime import date
import json
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.core.serializers import serialize
from django.http import HttpResponseRedirect, request, HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.urls import reverse_lazy
from django.views.generic import TemplateView, ListView, UpdateView, CreateView, DeleteView, RedirectView
from django.contrib.auth.models import User
from .forms import *
from django.views.generic.edit import FormView
from django.utils.decorators import method_decorator
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_protect, csrf_exempt
from django.contrib.auth import login, logout, update_session_auth_hash
from .models import *


class Inicio(TemplateView):
    template_name = 'inicio.html'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'search_reactor':
                data = []
                for i in Reactor.objects.all():
                    data.append({'id': i.id, 'modelo': i.modelo})
            else:
                if action == 'search_organismos':
                    data = []
                    for i in Organismo.objects.all():
                        data.append({'id': i.id, 'nombre': i.nombrecientifico, 'genero': i.genero})
                else:
                    if action == 'search_batch':
                        data = []
                        for i in CaBatch.objects.all():
                            data.append({'id': i.id, 'titulo': i.titulo})
                    else:
                        data['error'] = 'Ha ocurrido un error'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)


def busqueda(request):
    if request.is_ajax():
        queryset = request.GET.get('nombre')
        actio = request.GET.get('action')
        if actio == 'organismo':
            if queryset != 0:
                if Organismo.objects.filter(nombrecientifico__icontains=queryset):
                    data = Organismo.objects.filter(nombrecientifico__icontains=queryset).values(
                        'nombrecientifico', 'genero')
        else:
            if actio == 'reactor':
                if Reactor.objects.filter(modelo__icontains=request.GET['nombre']):
                    data = Reactor.objects.filter(modelo__icontains=request.GET['nombre']).values(
                        'modelo', 'marca', 'especificaciontecnica', 'foto1')
            else:
                if actio == 'batch':
                    if CaBatch.objects.filter(titulo__icontains=request.GET['nombre']):
                        data = CaBatch.objects.filter(titulo__icontains=request.GET['nombre']).values(
                            'titulo', 'descripcion', 'y', 'ks', 'umax', 'ms', 'f', 't', 'v0', 'v', 'vf', 'so', 'n', 'x')

        return HttpResponse(json.dumps(list(data)), content_type='application/json')
    else:
        return HttpResponse("Solo Ajax");


class ModeloReact(TemplateView):
    template_name = 'modelo_reactor.html'


class TiempoCultivo(TemplateView):
    template_name = 'tiempo_cultivo.html'


class Admin(TemplateView):
    template_name = 'admin.html'

    def get_context_data(self, **kwargs):
        activo = User.objects.filter(is_active=True).count()
        inactivo = User.objects.filter(is_active=False).count()
        organismo = Organismo.objects.count()
        tiporeact = TipoReactor.objects.count()
        reactor = Reactor.objects.count()
        context = super().get_context_data(**kwargs)
        context['activos'] = activo
        context['inactivos'] = inactivo
        context['usuarios'] = activo + inactivo
        context['organismo'] = organismo
        context['tiporeact'] = tiporeact
        context['reactor'] = reactor
        return context


class Login(FormView):
    template_name = 'login.html'
    form_class = LoginForm
    success_url = reverse_lazy('ProsPy:Inicio')

    @method_decorator(csrf_protect)
    @method_decorator(never_cache)
    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return HttpResponseRedirect(self.get_success_url())
        else:
            return super(Login, self).dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        login(self.request, form.get_user())
        messages.success(self.request, 'Bienvenido')
        return super(Login, self).form_valid(form)

    def form_invalid(self, form):
        messages.error(self.request, form.errors)
        return self.render_to_response(
            self.get_context_data(request=self.request, form=form))


class LogoutUsuario(RedirectView):
    pattern_name = 'ProsPy:Login'

    def dispatch(self, request, *args, **kwargs):
        logout(request)
        return super().dispatch(request, *args, **kwargs)


class LUsuarioLista(TemplateView):
    template_name = 'Usuario_Admin.html'


class UsuarioLista(ListView):
    model = User
    context_object_name = 'usuarios'

    def get_queryset(self):
        return self.model.objects.filter(is_active=True)

    def get(self, request, *args, **kwargs):
        if request.is_ajax():
            return HttpResponse(serialize('json', self.get_queryset()), 'aplication/json')
        else:
            return redirect('ProsPy:LUsuarioLista')


class CrearUsuario(CreateView):
    model = User
    form_class = UsuarioForm
    template_name = 'registro.html'
    success_url = reverse_lazy('ProsPy:Login')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Registrar Usuario'
        return context

    def form_invalid(self, form):
        messages.error(self.request, form.errors)
        return self.render_to_response(
            self.get_context_data(request=self.request, form=form))

    def form_valid(self, form):
        response = super().form_valid(form)
        messages.success(self.request, 'Se ha registrado con exito')
        return response


def CambiarContraseña(request):
    if request.method == 'POST':
        form = ContraseñaForm(request.user, request.POST)
        if form.is_valid():
            user = form.save()
            update_session_auth_hash(request, user)
            messages.success(request, 'Tu contraseña ha sido cambiada.')
            return redirect('ProsPy:CambiarContraseña')
        else:
            messages.error(request, form.errors)
    else:
        form = ContraseñaForm(request.user)
    return render(request, "config_usu.html", {'form': form})


class EditarUsuario(UpdateView):
    model = User
    form_class = UsuForm
    template_name = 'editar_modal.html'

    def post(self, request, *args, **kwargs):
        if request.is_ajax():
            form = self.form_class(request.POST, instance=self.get_object())
            if form.is_valid():
                form.save()
                mensaje = f'{self.model.__name__} actualizado correctamente'
                error = 'No hay error'
                response = JsonResponse({'mensaje': mensaje, 'error': error})
                response.status_code = 201
                return response
            else:
                mensaje = f'{self.model.__name__} no se pudo actualizar correctamente'
                error = form.errors
                response = JsonResponse({'mensaje': mensaje, 'error': error})
                response.status_code = 400
                return response
        else:
            return redirect('ProsPy:LUsuarioLista')


class EliminarUsuario(DeleteView):
    model = User
    template_name = 'eliminar_modal.html'

    def delete(self, request, *args, **kwargs):
        if request.is_ajax():
            user = self.get_object()
            user.is_active = False
            user.save()
            mensaje = f'{self.model.__name__} Eliminado correctamente'
            error = 'No hay error'
            response = JsonResponse({'mensaje': mensaje, 'error': error})
            response.status_code = 201
            return response
        else:
            return redirect('ProsPy:LUsuarioLista')


class LUTipoReactor(TemplateView):
    template_name = 'tabla_tiporeactor.html'


class TipoReactorlista(ListView):
    model = TipoReactor
    context_object_name = 'tiporeactor'

    def get(self, request, *args, **kwargs):
        if request.is_ajax():
            return HttpResponse(serialize('json', self.model.objects.all()), 'aplication/json')
        else:
            return redirect('ProsPy:LUTipoReactor')


class GuardarTipo(CreateView):
    model = TipoReactor
    form_class = TipoReactorForm
    template_name = 'registro_modal_tipo.html'

    def post(self, request, *args, **kwargs):
        if request.is_ajax():
            form = self.form_class(request.POST)
            if form.is_valid():
                form.save()
                mensaje = f'{self.model.__name__} guardado correctamente'
                error = 'No hay error'
                response = JsonResponse({'mensaje': mensaje, 'error': error})
                response.status_code = 201
                return response
            else:
                mensaje = f'{self.model.__name__} no se pudo guardar correctamente'
                error = 'no se pudo guardar'
                response = JsonResponse({'mensaje': mensaje, 'error': error})
                response.status_code = 400
                return response
        else:
            return redirect('ProsPy:LUTipoReactor')


class EditarTipo(UpdateView):
    model = TipoReactor
    form_class = TipoReactorForm
    template_name = 'editar_tiporeactor_modal.html'

    def post(self, request, *args, **kwargs):
        if request.is_ajax():
            form = self.form_class(request.POST, instance=self.get_object())
            if form.is_valid():
                form.save()
                mensaje = f'{self.model.__name__} actualizado correctamente'
                error = 'No hay error'
                response = JsonResponse({'mensaje': mensaje, 'error': error})
                response.status_code = 201
                return response
            else:
                mensaje = f'{self.model.__name__} no se pudo actualizar correctamente'
                error = form.errors
                response = JsonResponse({'mensaje': mensaje, 'error': error})
                response.status_code = 400
                return response
        else:
            return redirect('ProsPy:LUTipoReactor')


class EliminarTipo(DeleteView):
    model = TipoReactor
    template_name = 'eliminar_tipo_modal.html'

    def delete(self, request, pk):
        if request.is_ajax():
            dat = TipoReactor.objects.get(id=pk)
            dat.delete()
            mensaje = f'{self.model.__name__} Eliminado correctamente'
            error = 'No hay error'
            response = JsonResponse({'mensaje': mensaje, 'error': error})
            response.status_code = 201
            return response
        else:
            return redirect('ProsPy:LUTipoReactor')


class LUOrganismo(TemplateView):
    template_name = 'tabla_organismo.html'


class Organismolista(ListView):
    model = Organismo
    context_object_name = 'organismo'

    def get(self, request, *args, **kwargs):
        if request.is_ajax():
            return HttpResponse(serialize('json', self.model.objects.all()), 'aplication/json')
        else:
            return redirect('ProsPy:LUOrganismo')


class GuardarOrganismo(CreateView):
    model = Organismo
    form_class = OrganismoForm
    template_name = 'registro_modal_organismo.html'

    def post(self, request, *args, **kwargs):
        if request.is_ajax():
            form = self.form_class(request.POST)
            if form.is_valid():
                form.save()
                mensaje = f'{self.model.__name__} guardado correctamente'
                error = 'No hay error'
                response = JsonResponse({'mensaje': mensaje, 'error': error})
                response.status_code = 201
                return response
            else:
                mensaje = f'{self.model.__name__} no se pudo guardar correctamente'
                error = 'no se pudo guardar'
                response = JsonResponse({'mensaje': mensaje, 'error': error})
                response.status_code = 400
                return response
        else:
            return redirect('ProsPy:LUOrganismo')


class EditarOrganismo(UpdateView):
    model = Organismo
    form_class = OrganismoForm
    template_name = 'editar_organismo_modal.html'

    def post(self, request, *args, **kwargs):
        if request.is_ajax():
            form = self.form_class(request.POST, instance=self.get_object())
            if form.is_valid():
                form.save()
                mensaje = f'{self.model.__name__} actualizado correctamente'
                error = 'No hay error'
                response = JsonResponse({'mensaje': mensaje, 'error': error})
                response.status_code = 201
                return response
            else:
                mensaje = f'{self.model.__name__} no se pudo actualizar correctamente'
                error = form.errors
                response = JsonResponse({'mensaje': mensaje, 'error': error})
                response.status_code = 400
                return response
        else:
            return redirect('ProsPy:LUOrganismo')


class EliminarOrganismo(DeleteView):
    model = Organismo
    template_name = 'eliminar_organismo_modal.html'

    def delete(self, request, pk):
        if request.is_ajax():
            dat = Organismo.objects.get(id=pk)
            dat.delete()
            mensaje = f'{self.model.__name__} Eliminado correctamente'
            error = 'No hay error'
            response = JsonResponse({'mensaje': mensaje, 'error': error})
            response.status_code = 201
            return response
        else:
            return redirect('ProsPy:LUOrganismo')


class LUReactor(TemplateView):
    template_name = 'tabla_reactor.html'


class Reactorlista(ListView):
    model = Reactor
    context_object_name = 'reactor'

    def get(self, request, *args, **kwargs):
        if request.is_ajax():
            return HttpResponse(serialize('json', self.model.objects.all()), 'aplication/json')
        else:
            return redirect('ProsPy:LUReactor')


class GuardarReactor(CreateView):
    model = Reactor
    form_class = ReactorForm
    template_name = 'registro_modal_reactor.html'

    def post(self, request, *args, **kwargs):
        if request.is_ajax():
            form = self.form_class(request.POST, request.FILES)
            if form.is_valid():
                form.save()
                mensaje = f'{self.model.__name__} guardado correctamente'
                error = 'No hay error'
                response = JsonResponse({'mensaje': mensaje, 'error': error})
                response.status_code = 201
                return response
            else:
                mensaje = f'{self.model.__name__} no se pudo guardar correctamente'
                error = 'no se pudo guardar'
                response = JsonResponse({'mensaje': mensaje, 'error': error})
                response.status_code = 400
                return response
        else:
            return redirect('ProsPy:LUOrganismo')


class EditarReactor(UpdateView):
    model = Reactor
    form_class = ReactorForm
    template_name = 'editar_reactor_modal.html'

    def post(self, request, *args, **kwargs):
        if request.is_ajax():
            form = self.form_class(request.POST, request.FILES, instance=self.get_object())
            if form.is_valid():
                form.save()
                mensaje = f'{self.model.__name__} actualizado correctamente'
                error = 'No hay error'
                response = JsonResponse({'mensaje': mensaje, 'error': error})
                response.status_code = 201
                return response
            else:
                mensaje = f'{self.model.__name__} no se pudo actualizar correctamente'
                error = 'No se pudo editar'
                response = JsonResponse({'mensaje': mensaje, 'error': error})
                response.status_code = 400
                return response
        else:
            return redirect('ProsPy:LUReactor')


class EliminarReactor(DeleteView):
    model = Reactor
    template_name = 'eliminar_reactor_modal.html'

    def delete(self, request, pk):
        if request.is_ajax():
            dat = Reactor.objects.get(id=pk)
            dat.delete()
            mensaje = f'{self.model.__name__} Eliminado correctamente'
            error = 'No hay error'
            response = JsonResponse({'mensaje': mensaje, 'error': error})
            response.status_code = 201
            return response
        else:
            return redirect('ProsPy:LUReactor')


class LUCaBatch(TemplateView):
    template_name = 'tabla_careactor.html'


class CaBatchlista(ListView):
    model = CaBatch
    context_object_name = 'reactor'

    def get(self, request, *args, **kwargs):
        if request.is_ajax():
            return HttpResponse(serialize('json', self.model.objects.all()), 'aplication/json')
        else:
            return redirect('ProsPy:LUCaBatch')


class GuardarCaBatch(CreateView):
    model = CaBatch
    form_class = CaBatchForm
    template_name = 'registro_cabatch_modal.html'

    def post(self, request, *args, **kwargs):
        if request.is_ajax():
            form = self.form_class(request.POST)
            if form.is_valid():
                form.save()
                mensaje = f'{self.model.__name__} guardado correctamente'
                error = 'No hay error'
                response = JsonResponse({'mensaje': mensaje, 'error': error})
                response.status_code = 201
                return response
            else:
                mensaje = f'{self.model.__name__} no se pudo guardar correctamente'
                error = 'no se pudo guardar'
                response = JsonResponse({'mensaje': mensaje, 'error': error})
                response.status_code = 400
                return response
        else:
            return redirect('PosPy:ModeloReact')


class EditarCaCaBatch(UpdateView):
    model = CaBatch
    form_class = CaBatchForm
    template_name = 'editar_cabatch_modal.html'

    def post(self, request, *args, **kwargs):
        if request.is_ajax():
            form = self.form_class(request.POST, instance=self.get_object())
            if form.is_valid():
                form.save()
                mensaje = f'{self.model.__name__} actualizado correctamente'
                error = 'No hay error'
                response = JsonResponse({'mensaje': mensaje, 'error': error})
                response.status_code = 201
                return response
            else:
                mensaje = f'{self.model.__name__} no se pudo actualizar correctamente'
                error = form.errors
                response = JsonResponse({'mensaje': mensaje, 'error': error})
                response.status_code = 400
                return response
        else:
            return redirect('ProsPy:LUCaBatch')


class EliminarCaCaBatch(DeleteView):
    model = CaBatch
    template_name = 'eliminar_cabatch_modal.html'

    def delete(self, request, pk):
        if request.is_ajax():
            dat = CaBatch.objects.get(id=pk)
            dat.delete()
            mensaje = f'{self.model.__name__} Eliminado correctamente'
            error = 'No hay error'
            response = JsonResponse({'mensaje': mensaje, 'error': error})
            response.status_code = 201
            return response
        else:
            return redirect('ProsPy:LUCaBatch')


class LUCaPrediccion(TemplateView):
    template_name = 'tabla_caprediccion.html'


class CaPrediccionlista(ListView):
    model = CaPrediccion
    context_object_name = 'caprediccion'

    def get(self, request, *args, **kwargs):
        if request.is_ajax():
            return HttpResponse(serialize('json', self.model.objects.all()), 'aplication/json')
        else:
            return redirect('ProsPy:LUCaPrediccion')


class GuardarCaPrediccion(CreateView):
    model = CaPrediccion
    form_class = CaPrediccionForm
    template_name = 'registro_caprediccion_modal.html'

    def post(self, request, *args, **kwargs):
        if request.is_ajax():
            form = self.form_class(request.POST)
            if form.is_valid():
                form.save()
                mensaje = f'{self.model.__name__} guardado correctamente'
                error = 'No hay error'
                response = JsonResponse({'mensaje': mensaje, 'error': error})
                response.status_code = 201
                return response
            else:
                mensaje = f'{self.model.__name__} no se pudo guardar correctamente'
                error = 'no se pudo guardar'
                response = JsonResponse({'mensaje': mensaje, 'error': error})
                response.status_code = 400
                return response
        else:
            return redirect('ProsPy:TiempoCultivo')


class EditarCaPrediccion(UpdateView):
    model = CaPrediccion
    form_class = CaPrediccionForm
    template_name = 'editar_caprediccion_modal.html'

    def post(self, request, *args, **kwargs):
        if request.is_ajax():
            form = self.form_class(request.POST, instance=self.get_object())
            if form.is_valid():
                form.save()
                mensaje = f'{self.model.__name__} actualizado correctamente'
                error = 'No hay error'
                response = JsonResponse({'mensaje': mensaje, 'error': error})
                response.status_code = 201
                return response
            else:
                mensaje = f'{self.model.__name__} no se pudo actualizar correctamente'
                error = form.errors
                response = JsonResponse({'mensaje': mensaje, 'error': error})
                response.status_code = 400
                return response
        else:
            return redirect('ProsPy:LUCaPrediccion')


class EliminarCaPrediccion(DeleteView):
    model = CaPrediccion
    template_name = 'eliminar_caprediccion_modal.html'

    def delete(self, request, pk):
        if request.is_ajax():
            dat = CaPrediccion.objects.get(id=pk)
            dat.delete()
            mensaje = f'{self.model.__name__} Eliminado correctamente'
            error = 'No hay error'
            response = JsonResponse({'mensaje': mensaje, 'error': error})
            response.status_code = 201
            return response
        else:
            return redirect('ProsPy:LUCaPrediccion')


class ActualizarCaBatch(UpdateView):
    model = CaBatch
    form_class = CaBatchForm
    template_name = 'editar_cabatch_modal.html'
    success_url = reverse_lazy('ProsPy:EjerciciosLista')


class EliminarCaBatch(DeleteView):
    model = CaBatch
    template_name = 'eliminar_cabatch_modal.html'
    success_url = reverse_lazy('ProsPy:EjerciciosLista')


class ActualizarPrediccion(UpdateView):
    model = CaPrediccion
    form_class = CaPrediccionForm
    template_name = 'editar_caprediccion_modal.html'
    success_url = reverse_lazy('ProsPy:EjerciciosLista')


class EliminarPrediccion(DeleteView):
    model = CaPrediccion
    template_name = 'eliminar_caprediccion_modal.html'
    success_url = reverse_lazy('ProsPy:EjerciciosLista')


class EjerciciosLista(TemplateView):
    template_name = 'ejercicios.html'

    def get_context_data(self, *args, **kwargs):
        prediccion = CaPrediccion.objects.filter(usuario=self.request.user)
        batch = CaBatch.objects.filter(usuario=self.request.user)
        return {'prediccion': prediccion, 'batch': batch}


class CompararBatch(TemplateView):
    template_name = 'comparar_ejercicios_batch.html'

    def get_context_data(self, *args, **kwargs):
        prediccion = CaPrediccion.objects.filter(usuario=self.request.user)
        batch = CaBatch.objects.filter(usuario=self.request.user)
        return {'prediccion': prediccion, 'batch': batch}


class CompararTiempo(TemplateView):
    template_name = 'comparar_ejercicios_tiempo.html'

    def get_context_data(self, *args, **kwargs):
        prediccion = CaPrediccion.objects.filter(usuario=self.request.user)
        return {'prediccion': prediccion}
