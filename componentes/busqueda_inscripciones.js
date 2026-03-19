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
        async obtenerInscripciones() {
            try {
                const [listaAlumnos, listaMaterias, listaInscripciones] = await Promise.all([
                    db.alumnos.toArray(),
                    db.materias.toArray(),
                    db.inscripciones.toArray()
                ]);
                
                this.alumnos = Object.fromEntries(listaAlumnos.map(a => [a.idAlumno, a.nombre]));
                this.materias = Object.fromEntries(listaMaterias.map(m => [m.idMateria, m.nombre]));

                const filtro = this.buscar.toLowerCase();
                this.inscripciones = listaInscripciones.filter(i => {
                    const nombreAlumno = (this.alumnos[i.idAlumno] || '').toLowerCase();
                    const nombreMateria = (this.materias[i.idMateria] || '').toLowerCase();
                    return nombreAlumno.includes(filtro) || nombreMateria.includes(filtro);
                });
            } catch (error) {
                console.error('Error obteniendo inscripciones:', error);
                alertify.error('Error al cargar datos');
            }
        },
        editarInscripcion(i) {
            try {
                // Crear una copia segura del objeto
                const copiaSegura = JSON.parse(JSON.stringify(i));
                this.$emit('modificar', copiaSegura);
                this.forms.busqueda_inscripciones.mostrar = false;
            } catch (error) {
                console.error('Error al editar:', error);
                alertify.error('Error al preparar edición');
            }
        },
        async eliminarInscripcion(i) {
            alertify.confirm('Eliminar', '¿Desea eliminar este registro?', async () => {
                try {
                    // Eliminar de IndexedDB
                    await db.inscripciones.delete(i.idInscripcion);
                    
                    // Crear una copia segura del objeto antes de enviarlo al servidor
                    const copiaSegura = JSON.parse(JSON.stringify(i));
                    
                    // Enviar al servidor (no esperar respuesta)
                    fetch(`private/modulos/inscripciones/inscripciones.php?accion=eliminar&inscripciones=${JSON.stringify(copiaSegura)}`)
                        .catch(err => console.error('Error en fetch:', err));
                    
                    // Actualizar la lista
                    await this.obtenerInscripciones();
                    alertify.success('Eliminado correctamente');
                    
                } catch (error) {
                    console.error('Error al eliminar:', error);
                    alertify.error('Error al eliminar el registro');
                }
            }, () => {});
        }
    },
    mounted() {
        this.obtenerInscripciones();
    },
    template: `
        <div v-if="forms.busqueda_inscripciones.mostrar" v-draggable class="position-absolute top-50 start-50 translate-middle shadow-lg" style="z-index: 1100; width: 600px; cursor: move;">
            <div class="card text-bg-dark border-secondary">
                <div class="card-header d-flex justify-content-between">
                    <span class="fw-bold">BÚSQUEDA DE INSCRIPCIONES</span>
                    <button type="button" class="btn-close btn-close-white" @click="forms.busqueda_inscripciones.mostrar = false"></button>
                </div>
                <div class="card-body">
                    <input type="text" v-model="buscar" @keyup="obtenerInscripciones" placeholder="Buscar por alumno o materia..." class="form-control mb-3 bg-dark text-white border-secondary">
                    <div class="table-responsive" style="max-height: 300px;">
                        <table class="table table-dark table-hover border-secondary">
                            <thead>
                                <tr>
                                    <th>Alumno</th>
                                    <th>Materia</th>
                                    <th>Fecha</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="i in inscripciones" :key="i.idInscripcion">
                                    <td>{{ alumnos[i.idAlumno] || 'N/A' }}</td>
                                    <td>{{ materias[i.idMateria] || 'N/A' }}</td>
                                    <td>{{ i.fecha || 'N/A' }}</td>
                                    <td>
                                        <button @click="editarInscripcion(i)" class="btn btn-sm btn-warning me-1">Editar</button>
                                        <button @click="eliminarInscripcion(i)" class="btn btn-sm btn-danger">Eliminar</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `
};