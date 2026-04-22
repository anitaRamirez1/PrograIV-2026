<template>
    <div class="card">
        <div class="card-header bg-blue text-white d-flex justify-content-between align-items-center">
            <h5 class="mb-0 fw-bold"><i class="fas fa-building me-2"></i> Directorio de Empresas</h5>
            <button class="btn btn-wine btn-sm shadow-sm px-3" @click="openModal()">
                <i class="fas fa-plus-circle me-1"></i> Registrar Empresa
            </button>
        </div>
        <div class="card-body p-4 bg-white">
            <div class="row align-items-center mb-4">
                <div class="col-md-9">
                    <div class="input-group">
                        <span class="input-group-text bg-light border-end-0 text-blue"><i class="fas fa-search"></i></span>
                        <input type="text" class="form-control border-start-0 bg-light" placeholder="Búsqueda interactiva por Nombre o NIT..." v-model="searchQuery" @keyup.enter="fetchData">
                    </div>
                </div>
                <div class="col-md-3">
                    <button class="btn btn-blue w-100 shadow-sm" @click="fetchData">Buscar <i class="fas fa-arrow-right ms-1"></i></button>
                </div>
            </div>

            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="text-secondary" style="border-bottom: 2px solid #0047AB;">
                        <tr>
                            <th class="py-3">CÓDIGO</th>
                            <th>EMPRESA</th>
                            <th>NIT</th>
                            <th>CORREO INFO</th>
                            <th>TELÉFONO</th>
                            <th>SECTOR</th>
                            <th class="text-center">OPCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="emp in empresas" :key="emp.Id" style="border-bottom: 1px solid #eee;">
                            <td class="text-muted fw-bold">#{{ emp.Id }}</td>
                            <td class="fw-bold text-wine fs-6">{{ emp.nombre_empresa }}</td>
                            <td><span class="badge bg-light text-dark border">{{ emp.nit }}</span></td>
                            <td class="text-muted"><i class="fas fa-envelope me-1"></i> {{ emp.correo_contacto }}</td>
                            <td class="text-muted"><i class="fas fa-phone me-1"></i> {{ emp.telefono }}</td>
                            <td>{{ emp.soctor }}</td>
                            <td class="text-center">
                                <button class="btn btn-outline-blue btn-sm mx-1 rounded-circle" @click="openModal(emp)" title="Editar"><i class="fas fa-pen"></i></button>
                                <button class="btn btn-outline-wine btn-sm rounded-circle" @click="deleteItem(emp.Id)" title="Eliminar"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                        <tr v-if="empresas.length === 0">
                            <td colspan="7" class="text-center text-muted py-5">
                                <i class="fas fa-box-open fa-3x mb-3 text-light"></i><br>
                                No se hallaron resultados para mostrar.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Modal -->
        <div class="modal fade" id="empresaModal" tabindex="-1" ref="modalVue">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow">
                    <div class="modal-header bg-blue text-white border-0">
                        <h5 class="modal-title fw-bold"><i class="fas fa-building me-2"></i> {{ editMode ? 'Modificar Empresa' : 'Alta de Empresa' }}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body p-4 bg-light">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label text-muted fw-semibold small">Nombre Empresa</label>
                                <input type="text" v-model="form.nombre_empresa" class="form-control" :class="{'is-invalid': errors.nombre_empresa}">
                                <div class="invalid-feedback" v-if="errors.nombre_empresa">{{ errors.nombre_empresa[0] }}</div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label text-muted fw-semibold small">NIT</label>
                                <input type="text" v-model="form.nit" class="form-control" :class="{'is-invalid': errors.nit}">
                                <div class="invalid-feedback" v-if="errors.nit">{{ errors.nit[0] }}</div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label text-muted fw-semibold small">Correo Contacto</label>
                                <input type="email" v-model="form.correo_contacto" class="form-control" :class="{'is-invalid': errors.correo_contacto}">
                                <div class="invalid-feedback" v-if="errors.correo_contacto">{{ errors.correo_contacto[0] }}</div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label text-muted fw-semibold small">Teléfono</label>
                                <input type="text" v-model="form.telefono" class="form-control" :class="{'is-invalid': errors.telefono}">
                                <div class="invalid-feedback" v-if="errors.telefono">{{ errors.telefono[0] }}</div>
                            </div>
                            <div class="col-md-12">
                                <label class="form-label text-muted fw-semibold small">Sector Comercial</label>
                                <input type="text" v-model="form.soctor" class="form-control" :class="{'is-invalid': errors.soctor}">
                                <div class="invalid-feedback" v-if="errors.soctor">{{ errors.soctor[0] }}</div>
                            </div>
                            <div class="col-md-12">
                                <label class="form-label text-muted fw-semibold small">Dirección Física</label>
                                <input type="text" v-model="form.direccion" class="form-control" :class="{'is-invalid': errors.direccion}">
                                <div class="invalid-feedback" v-if="errors.direccion">{{ errors.direccion[0] }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer bg-white border-0">
                        <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-wine px-4" @click="save"><i class="fas fa-save me-1"></i> Confirmar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
    data() {
        return {
            empresas: [],
            searchQuery: '',
            editMode: false,
            form: { Id: null, nombre_empresa: '', nit: '', correo_contacto: '', telefono: '', soctor: '', direccion: '' },
            errors: {},
            modalInstance: null
        }
    },
    mounted() {
        this.fetchData();
        this.modalInstance = new window.bootstrap.Modal(this.$refs.modalVue);
    },
    methods: {
        async fetchData() {
            try {
                const res = await axios.get('/api/empresas', { params: { search: this.searchQuery } });
                this.empresas = res.data;
            } catch(e) {
                console.error(e);
            }
        },
        openModal(empresa = null) {
            this.errors = {};
            if (empresa) {
                this.editMode = true;
                this.form = { ...empresa };
            } else {
                this.editMode = false;
                this.form = { Id: null, nombre_empresa: '', nit: '', correo_contacto: '', telefono: '', soctor: '', direccion: '' };
            }
            this.modalInstance.show();
        },
        async save() {
            this.errors = {};
            const payload = { ...this.form };
            if (!this.editMode) {
                delete payload.Id; // Fix para evitar conflictos de insert de ID nulo
            }

            try {
                if (this.editMode) {
                    await axios.put('/api/empresas/' + this.form.Id, payload);
                    Swal.fire({ title: 'Actualizado', text: 'Datos guardados', icon: 'success', confirmButtonColor: '#0047AB' });
                } else {
                    await axios.post('/api/empresas', payload);
                    Swal.fire({ title: 'Creado', text: 'Operación exitosa', icon: 'success', confirmButtonColor: '#0047AB' });
                }
                this.modalInstance.hide();
                this.fetchData();
            } catch (error) {
                if (error.response && error.response.status === 422) {
                    this.errors = error.response.data.errors;
                    Swal.fire({ title: 'Error', text: 'Revisa los campos', icon: 'error', confirmButtonColor: '#722f37' });
                } else {
                    Swal.fire({ title: 'Error', text: 'Sucedió un error...', icon: 'error' });
                }
            }
        },
        async deleteItem(id) {
            const res = await Swal.fire({
                title: '¿Continuar?',
                text: "Se borrará de forma irreversible",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#722f37',
                cancelButtonColor: '#adb5bd',
                confirmButtonText: 'Sí, borrar!',
                cancelButtonText: 'No'
            });
            if (res.isConfirmed) {
                try {
                    await axios.delete('/api/empresas/' + id);
                    this.fetchData();
                    Swal.fire({ title: 'Borrado!', text: 'Acción completada.', icon: 'success', confirmButtonColor: '#0047AB' });
                } catch(e) {
                    Swal.fire('Error', 'No se pudo eliminar', 'error');
                }
            }
        }
    }
}
</script>
