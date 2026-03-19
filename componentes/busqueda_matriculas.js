const busqueda_matriculas = {
    props: ['forms'],
    data() {
        return {
            buscar: '',
            matriculas: [],
            alumnos: {},
            materias: {},
            docentes: {}
        }
    },
    methods: {
        async obtenerDatosRelacionados() {
            const [listaAlumnos, listaMaterias, listaDocentes] = await Promise.all([
                db.alumnos.toArray(),
                db.materias.toArray(),
                db.docentes.toArray()
            ]);
            
            this.alumnos = Object.fromEntries(listaAlumnos.map(a => [a.idAlumno, a.nombre]));
            this.materias = Object.fromEntries(listaMaterias.map(m => [m.idMateria, m.nombre]));
            this.docentes = Object.fromEntries(listaDocentes.map(d => [d.idDocente, d.nombre]));
        },
        async obtenerMatriculas() {
            await this.obtenerDatosRelacionados();
            let todas = await db.matriculas.toArray();
            this.matriculas = todas.filter(m => {
                const nombreAlumno = (this.alumnos[m.idAlumno] || '').toLowerCase();
                const periodo = (m.periodo || '').toLowerCase();
                const busqueda = this.buscar.toLowerCase();
                return nombreAlumno.includes(busqueda) || periodo.includes(busqueda);
            });
        },
        editarMatricula(matricula) {
            this.$emit('modificar', matricula);
            this.forms.busqueda_matriculas.mostrar = false;
        },
        async eliminarMatricula(matricula) {
            alertify.confirm('Eliminar Matrícula', `¿Desea eliminar la matrícula del alumno ${this.alumnos[matricula.idAlumno]}?`, 
            async () => {
                // Eliminar de Dexie
                await db.matriculas.delete(matricula.idMatricula);
                
                // Eliminar de MySQL
                let formData = new FormData();
                formData.append('accion', 'eliminar');
                formData.append('matriculas', JSON.stringify(matricula));

                fetch(`private/modulos/matriculas/matriculas.php`, {
                    method: 'POST',
                    body: formData
                }).then(() => {
                    this.obtenerMatriculas();
                    alertify.success('Registro eliminado');
                });
                
            }, () => {});
        },
        cerrar() {
            this.forms.busqueda_matriculas.mostrar = false;
        }
    },
    mounted() {
        this.obtenerMatriculas();
    },
    template: `
        <div v-if="forms.busqueda_matriculas.mostrar" v-draggable class="position-absolute top-50 start-50 translate-middle" style="z-index: 1100; width: 95%; max-width: 1000px; cursor: move;">
            <div class="card text-bg-dark mb-3 shadow-lg">
                <div class="card-header d-flex justify-content-between">
                    <span class="fw-bold">BÚSQUEDA DE MATRÍCULAS</span>
                    <button type="button" class="btn-close btn-close-white" @click="cerrar"></button>
                </div>
                <div class="card-body">
                    <div class="input-group mb-3">
                        <input type="search" v-model="buscar" @keyup="obtenerMatriculas" 
                               placeholder="Buscar por alumno o periodo..." class="form-control bg-dark text-white border-secondary">
                        <button class="btn btn-outline-light" @click="obtenerMatriculas">BUSCAR</button>
                    </div>
                    <div class="table-responsive" style="max-height: 400px;">
                        <table class="table table-dark table-striped table-hover align-middle">
                            <thead>
                                <tr>
                                    <th>ALUMNO</th>
                                    <th>MATERIA</th>
                                    <th>DOCENTE</th>
                                    <th>FECHA</th>
                                    <th>PERIODO</th>
                                    <th>GESTIÓN</th>
                                    <th class="text-center">ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="m in matriculas" :key="m.idMatricula">
                                    <td>{{ alumnos[m.idAlumno] || 'Desconocido' }}</td>
                                    <td>{{ materias[m.idMateria] || 'Desconocida' }}</td>
                                    <td>{{ docentes[m.idDocente] || 'Desconocido' }}</td>
                                    <td>{{ m.fecha }}</td>
                                    <td>{{ m.periodo }}</td>
                                    <td>{{ m.gestion }}</td>
                                    <td class="text-center">
                                        <button class="btn btn-warning btn-sm me-1" @click="editarMatricula(m)">EDITAR</button>
                                        <button class="btn btn-danger btn-sm" @click="eliminarMatricula(m)">ELIMINAR</button>
                                    </td>
                                </tr>
                                <tr v-if="matriculas.length === 0">
                                    <td colspan="7" class="text-center text-muted">No hay registros</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `
};