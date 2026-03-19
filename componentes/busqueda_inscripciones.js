const busqueda_inscripciones = {
    props: ['forms'],
    data() {
        return {
            buscar: '',
            inscripciones: [],
            alumnos: {},
            materias: {}
        }
    },
    methods: {
        async obtenerDatosRelacionados() {
            const [listaAlumnos, listaMaterias] = await Promise.all([
                db.alumnos.toArray(),
                db.materias.toArray()
            ]);
            
            // Mapeamos los arrays a objetos para búsqueda rápida por ID
            this.alumnos = Object.fromEntries(listaAlumnos.map(a => [a.idAlumno, a.nombre]));
            this.materias = Object.fromEntries(listaMaterias.map(m => [m.idMateria, m.nombre]));
        },
        async obtenerInscripciones() {
            await this.obtenerDatosRelacionados();
            let todas = await db.inscripciones.toArray();
            
            this.inscripciones = todas.filter(i => {
                const nombreAlumno = (this.alumnos[i.idAlumno] || '').toLowerCase();
                const nombreMateria = (this.materias[i.idMateria] || '').toLowerCase();
                const busqueda = this.buscar.toLowerCase();
                
                return nombreAlumno.includes(busqueda) || nombreMateria.includes(busqueda);
            });
        },
        async editarInscripcion(inscripcion) {
            // Enviamos los datos al formulario principal
            this.$emit('modificar', inscripcion);
            this.cerrar();
        },
        async eliminarInscripcion(inscripcion) {
            alertify.confirm('Eliminar Inscripción', 
                `¿Desea eliminar la inscripción de ${this.alumnos[inscripcion.idAlumno]} en ${this.materias[inscripcion.idMateria]}?`, 
                async () => {
                    await db.inscripciones.delete(inscripcion.idInscripcion);
                    
                    // Sincronización con PHP
                    fetch(`private/modulos/inscripciones/inscripciones.php?accion=eliminar&inscripciones=${JSON.stringify(inscripcion)}`);
                    
                    this.obtenerInscripciones();
                    alertify.success('Registro eliminado');
                }, () => {});
        },
        cerrar() {
            this.forms.busqueda_inscripciones.mostrar = false;
        }
    },
    mounted() {
        this.obtenerInscripciones();
    },
    template: `
        <div v-if="forms.busqueda_inscripciones.mostrar" v-draggable class="position-absolute top-50 start-50 translate-middle" style="z-index: 1100; width: 90%; max-width: 800px; cursor: move;">
            <div class="card text-bg-dark mb-3 shadow-lg">
                <div class="card-header d-flex justify-content-between">
                    <span class="fw-bold text-uppercase">Búsqueda de Inscripciones</span>
                    <button type="button" class="btn-close btn-close-white" @click="cerrar"></button>
                </div>
                <div class="card-body">
                    <div class="input-group mb-3">
                        <input type="search" v-model="buscar" @keyup="obtenerInscripciones" 
                               placeholder="Buscar por alumno o materia..." class="form-control bg-dark text-white border-secondary">
                        <button class="btn btn-outline-light" @click="obtenerInscripciones">BUSCAR</button>
                    </div>
                    <div class="table-responsive" style="max-height: 400px;">
                        <table class="table table-dark table-striped table-hover align-middle">
                            <thead>
                                <tr>
                                    <th>ALUMNO</th>
                                    <th>MATERIA</th>
                                    <th>FECHA</th>
                                    <th class="text-center">ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="i in inscripciones" :key="i.idInscripcion">
                                    <td>{{ alumnos[i.idAlumno] || 'Desconocido' }}</td>
                                    <td>{{ materias[i.idMateria] || 'Desconocida' }}</td>
                                    <td>{{ i.fecha }}</td>
                                    <td class="text-center">
                                        <button class="btn btn-warning btn-sm me-1" @click="editarInscripcion(i)">EDITAR</button>
                                        <button class="btn btn-danger btn-sm" @click="eliminarInscripcion(i)">ELIMINAR</button>
                                    </td>
                                </tr>
                                <tr v-if="inscripciones.length === 0">
                                    <td colspan="4" class="text-center text-muted">No se encontraron registros</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `
};