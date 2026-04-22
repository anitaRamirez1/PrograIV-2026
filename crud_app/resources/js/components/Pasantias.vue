<template>
    <div class="card">
        <div class="card-header bg-wine text-white d-flex justify-content-between align-items-center">
            <h5 class="mb-0 fw-bold"><i class="fas fa-briefcase me-2"></i> Oferta de Pasantías</h5>
            <button class="btn btn-blue btn-sm shadow-sm px-3" @click="openModal()">
                <i class="fas fa-plus-circle me-1"></i> Añadir Oportunidad
            </button>
        </div>
        <div class="card-body p-4 bg-white">
            <div class="row align-items-center mb-4">
                <div class="col-md-9">
                    <div class="input-group">
                        <span class="input-group-text bg-light border-end-0 text-wine"><i class="fas fa-search"></i></span>
                        <input type="text" class="form-control border-start-0 bg-light" placeholder="Explorar por título de oportunidad o detalles..." v-model="searchQuery" @keyup.enter="fetchData">
                    </div>
                </div>
                <div class="col-md-3">
                    <button class="btn btn-wine w-100 shadow-sm" @click="fetchData">Explorar <i class="fas fa-arrow-right ms-1"></i></button>
                </div>
            </div>

            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="text-secondary" style="border-bottom: 2px solid #722f37;">
                        <tr>
                            <th class="py-3">CÓD</th>
                            <th>OFERENTE</th>
                            <th>PUESTO/TÍTULO</th>
                            <th>PERFIL/HABILIDADES</th>
                            <th>PERIODO</th>
                            <th>VACANTES</th>
                            <th class="text-center">OPCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="pas in pasantias" :key="pas.Id" style="border-bottom: 1px solid #eee;">
                            <td class="text-muted fw-bold">#{{ pas.Id }}</td>
                            <td><span class="badge bg-blue shadow-sm py-2 px-3"><i class="fas fa-building me-1"></i> {{ pas.empresa ? pas.empresa.nombre_empresa : 'N/A' }}</span></td>
                            <td class="fw-bold text-wine fs-6">{{ pas.titulo }}</td>
                            <td>{{ pas.habilidades_requeridas }}</td>
                            <td class="text-muted"><i class="far fa-clock me-1"></i> {{ pas.duracion_meses }}</td>
                            <td><span class="badge bg-light text-dark border px-3"><i class="fas fa-user-friends me-1 text-blue"></i> {{ pas.num_plazas }}</span></td>
                            <td class="text-center">
                                <button class="btn btn-outline-wine btn-sm mx-1 rounded-circle" @click="openModal(pas)" title="Editar"><i class="fas fa-pen"></i></button>
                                <button class="btn btn-outline-blue btn-sm rounded-circle" @click="deleteItem(pas.Id)" title="Eliminar"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                        <tr v-if="pasantias.length === 0">
                            <td colspan="7" class="text-center text-muted py-5">
                                <i class="fas fa-file-invoice fa-3x mb-3 text-light"></i><br>
                                No hay oportunidades registradas todavía.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Modal -->
        <div class="modal fade" id="pasantiaModal" tabindex="-1" ref="modalVue">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content border-0 shadow">
                    <div class="modal-header bg-wine text-white border-0">
                        <h5 class="modal-title fw-bold"><i class="fas fa-briefcase me-2"></i> {{ editMode ? 'Ajustar Pasantía' : 'Nueva Oferta de Pasantía' }}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body p-4 bg-light">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label text-muted fw-semibold small">Empresa Oferente</label>
                                <select class="form-select" v-model="form.empresa_id" :class="{'is-invalid': errors.empresa_id}">
                                    <option value="" disabled>-- Seleccionar origen --</option>
                                    <option v-for="e in empresasLista" :key="e.Id" :value="e.Id">{{ e.nombre_empresa }}</option>
                                </select>
                                <div class="invalid-feedback" v-if="errors.empresa_id">{{ errors.empresa_id[0] }}</div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label text-muted fw-semibold small">Denominación / Título</label>
                                <input type="text" v-model="form.titulo" class="form-control" :class="{'is-invalid': errors.titulo}">
                                <div class="invalid-feedback" v-if="errors.titulo">{{ errors.titulo[0] }}</div>
                            </div>
                            <div class="col-md-12">
                                <label class="form-label text-muted fw-semibold small">Cualidades o Habilidades Requeridas</label>
                                <input type="text" v-model="form.habilidades_requeridas" class="form-control" placeholder="Ej: React JS, Bases de Datos, Inglés Avanzado..." :class="{'is-invalid': errors.habilidades_requeridas}">
                                <div class="invalid-feedback" v-if="errors.habilidades_requeridas">{{ errors.habilidades_requeridas[0] }}</div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label text-muted fw-semibold small">Periodo (Meses)</label>
                                <input type="text" v-model="form.duracion_meses" class="form-control" placeholder="Ej: 6 meses" :class="{'is-invalid': errors.duracion_meses}">
                                <div class="invalid-feedback" v-if="errors.duracion_meses">{{ errors.duracion_meses[0] }}</div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label text-muted fw-semibold small">Plazas Abiertas</label>
                                <input type="number" v-model="form.num_plazas" min="1" class="form-control" :class="{'is-invalid': errors.num_plazas}">
                                <div class="invalid-feedback" v-if="errors.num_plazas">{{ errors.num_plazas[0] }}</div>
                            </div>
                            <div class="col-md-12">
                                <label class="form-label text-muted fw-semibold small">Pliego de Condiciones / Descripción Amplia</label>
                                <textarea v-model="form.descripcion" class="form-control" :class="{'is-invalid': errors.descripcion}" rows="4" placeholder="Describa a profundidad el alcance y beneficios..."></textarea>
                                <div class="invalid-feedback" v-if="errors.descripcion">{{ errors.descripcion[0] }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer bg-white border-0">
                        <button type="button" class="btn btn-light" data-bs-dismiss="modal">Abandonar</button>
                        <button type="button" class="btn btn-blue px-4" @click="save"><i class="fas fa-check me-1"></i> Someter</button>
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
            pasantias: [],
            empresasLista: [],
            searchQuery: '',
            editMode: false,
            form: { Id: null, empresa_id: '', titulo: '', descripcion: '', habilidades_requeridas: '', duracion_meses: '', num_plazas: 1 },
            errors: {},
            modalInstance: null
        }
    },
    mounted() {
        this.fetchData();
        this.fetchEmpresas();
        this.modalInstance = new window.bootstrap.Modal(this.$refs.modalVue);
    },
    methods: {
        async fetchData() {
            try {
                const res = await axios.get('/api/pasantias', { params: { search: this.searchQuery } });
                this.pasantias = res.data;
            } catch(e) { console.error(e); }
        },
        async fetchEmpresas() {
            try {
                const res = await axios.get('/api/empresas');
                this.empresasLista = res.data;
            } catch(e) { console.error(e); }
        },
        openModal(pasantia = null) {
            this.errors = {};
            if (pasantia) {
                this.editMode = true;
                this.form = { ...pasantia };
            } else {
                this.editMode = false;
                this.form = { Id: null, empresa_id: '', titulo: '', descripcion: '', habilidades_requeridas: '', duracion_meses: '', num_plazas: 1 };
            }
            this.modalInstance.show();
        },
        async save() {
            this.errors = {};
            const payload = { ...this.form };
            if (!this.editMode) {
                delete payload.Id; // Fix save prevent conflict
            }

            try {
                if (this.editMode) {
                    await axios.put('/api/pasantias/' + this.form.Id, payload);
                    Swal.fire({ title: 'Actualizado', text: 'La oferta ha sudo ajustada exitosamente.', icon: 'success', confirmButtonColor: '#722f37' });
                } else {
                    await axios.post('/api/pasantias', payload);
                    Swal.fire({ title: 'Publicado', text: 'La oferta está al aire.', icon: 'success', confirmButtonColor: '#722f37' });
                }
                this.modalInstance.hide();
                this.fetchData();
            } catch (error) {
                if (error.response && error.response.status === 422) {
                    this.errors = error.response.data.errors;
                    Swal.fire({ title: 'Advertencia', text: 'Información faltante o inválida', icon: 'error', confirmButtonColor: '#0047AB' });
                } else {
                    Swal.fire({ title: 'Error', text: 'No se pudo comunicar con el servidor.', icon: 'error' });
                }
            }
        },
        async deleteItem(id) {
            const res = await Swal.fire({
                title: '¿Confirmar destrucción?',
                text: "Esto removerá la oferta definitivamente.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#0047AB',
                cancelButtonColor: '#adb5bd',
                confirmButtonText: 'Sí, retirar',
                cancelButtonText: 'Mantener'
            });
            if (res.isConfirmed) {
                try {
                    await axios.delete('/api/pasantias/' + id);
                    this.fetchData();
                    Swal.fire({ title: 'Terminado', text: 'Operación ejecutada con éxito.', icon: 'success', confirmButtonColor: '#722f37' });
                } catch(e) {
                    Swal.fire('Error', 'No se pudo eliminar', 'error');
                }
            }
        }
    }
}
</script>
