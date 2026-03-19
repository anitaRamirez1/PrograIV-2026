// componentes/inscripciones.js
const inscripciones = {
    template: `
        <div class="inscripciones-container" v-draggable>
            <div class="card">
                <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">Gestión de Inscripciones</h5>
                    <button class="btn btn-sm btn-light" @click="cerrarVentana">×</button>
                </div>
                <div class="card-body">
                    <!-- Botones de acción -->
                    <div class="mb-3">
                        <button class="btn btn-success" @click="abrirModalNuevo">
                            <i class="fas fa-plus"></i> Nueva Inscripción
                        </button>
                        <button class="btn btn-info ms-2" @click="recargarDatos">
                            <i class="fas fa-sync-alt"></i> Recargar
                        </button>
                    </div>
                    
                    <!-- Modal -->
                    <div v-if="mostrarModal" class="modal fade show" style="display: block; background-color: rgba(0,0,0,0.5);">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">{{ modoEdicion ? 'Editar' : 'Nueva' }} Inscripción</h5>
                                    <button type="button" class="btn-close" @click="cerrarModal"></button>
                                </div>
                                <div class="modal-body">
                                    <form @submit.prevent="guardarInscripcion">
                                        <div class="mb-3">
                                            <label class="form-label">Alumno:</label>
                                            <select class="form-select" v-model="formData.idAlumno" required>
                                                <option value="">Seleccionar alumno</option>
                                                <option v-for="alumno in alumnos" :key="alumno.idAlumno" :value="alumno.idAlumno">
                                                    {{ alumno.nombre }}
                                                </option>
                                            </select>
                                        </div>
                                        
                                        <div class="mb-3">
                                            <label class="form-label">Materia:</label>
                                            <select class="form-select" v-model="formData.idMateria" required>
                                                <option value="">Seleccionar materia</option>
                                                <option v-for="materia in materias" :key="materia.idMateria" :value="materia.idMateria">
                                                    {{ materia.nombre }} ({{ materia.codigo }})
                                                </option>
                                            </select>
                                        </div>
                                        
                                        <div class="mb-3">
                                            <label class="form-label">Fecha:</label>
                                            <input type="date" class="form-control" v-model="formData.fecha" required>
                                        </div>
                                        
                                        <div class="text-end">
                                            <button type="button" class="btn btn-secondary me-2" @click="cerrarModal">Cancelar</button>
                                            <button type="submit" class="btn btn-primary">Guardar</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Filtro -->
                    <div class="mb-3">
                        <input type="search" v-model="buscar" @keyup="filtrarInscripciones" class="form-control" placeholder="Buscar inscripción por alumno, materia o fecha...">
                    </div>
                    
                    <!-- Tabla de inscripciones -->
                    <div class="table-responsive">
                        <table class="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Alumno</th>
                                    <th>Materia</th>
                                    <th>Fecha</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="inscripcion in inscripcionesFiltradas" :key="inscripcion.idInscripcion">
                                    <td>{{ inscripcion.idInscripcion }}</td>
                                    <td>{{ obtenerNombreAlumno(inscripcion.idAlumno) }}</td>
                                    <td>{{ obtenerNombreMateria(inscripcion.idMateria) }}</td>
                                    <td>{{ inscripcion.fecha }}</td>
                                    <td>
                                        <button class="btn btn-sm btn-warning" @click="editarInscripcion(inscripcion)">Editar</button>
                                        <button class="btn btn-sm btn-danger" @click="eliminarInscripcion(inscripcion.idInscripcion)">Eliminar</button>
                                    </td>
                                </tr>
                                <tr v-if="inscripcionesFiltradas.length === 0">
                                    <td colspan="5" class="text-center">No hay inscripciones</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `,
    
    props: {
        forms: {
            type: Object,
            required: true
        }
    },
    
    data() {
        return {
            buscar: '',
            inscripciones: [],
            inscripcionesFiltradas: [],
            alumnos: [],
            materias: [],
            mostrarModal: false,
            modoEdicion: false,
            formData: {
                idInscripcion: null,
                idAlumno: '',
                idMateria: '',
                fecha: new Date().toISOString().split('T')[0]
            }
        };
    },
    
    mounted() {
        console.log('Inscripciones montado');
        this.cargarAlumnos();
        this.cargarMaterias();
        this.cargarInscripciones();
    },
    
    methods: {
        cerrarVentana() {
            this.forms.inscripciones.mostrar = false;
        },
        
        recargarDatos() {
            this.cargarAlumnos();
            this.cargarMaterias();
            this.cargarInscripciones();
            alertify.success('Datos recargados');
        },
        
        async cargarAlumnos() {
            try {
                this.alumnos = await db.alumnos.toArray();
                console.log('Alumnos cargados:', this.alumnos);
                
                // Si no hay alumnos, crear algunos de prueba
                if (this.alumnos.length === 0) {
                    await this.crearAlumnosPrueba();
                }
            } catch (error) {
                console.error('Error cargando alumnos:', error);
            }
        },
        
        async cargarMaterias() {
            try {
                this.materias = await db.materias.toArray();
                console.log('Materias cargadas:', this.materias);
                
                // Si no hay materias, crear algunas de prueba
                if (this.materias.length === 0) {
                    await this.crearMateriasPrueba();
                }
            } catch (error) {
                console.error('Error cargando materias:', error);
            }
        },
        
        async cargarInscripciones() {
            try {
                this.inscripciones = await db.inscripciones.toArray();
                this.filtrarInscripciones();
                console.log('Inscripciones cargadas:', this.inscripciones);
            } catch (error) {
                console.error('Error cargando inscripciones:', error);
            }
        },
        
        filtrarInscripciones() {
            let term = this.buscar.toLowerCase();
            this.inscripcionesFiltradas = this.inscripciones.filter(i => {
                const nombreAlumno = this.obtenerNombreAlumno(i.idAlumno).toLowerCase();
                const nombreMateria = this.obtenerNombreMateria(i.idMateria).toLowerCase();
                const matchResueltos = nombreAlumno.includes(term) || nombreMateria.includes(term);
                const matchBase = Object.values(i).some(val => String(val).toLowerCase().includes(term));
                return matchResueltos || matchBase;
            });
        },
        
        async crearAlumnosPrueba() {
            const alumnosPrueba = [
                { idAlumno: 1, codigo: 'A001', nombre: 'Juan Pérez' },
                { idAlumno: 2, codigo: 'A002', nombre: 'María García' },
                { idAlumno: 3, codigo: 'A003', nombre: 'Carlos López' }
            ];
            
            for (let alumno of alumnosPrueba) {
                await db.alumnos.add(alumno);
            }
            
            this.cargarAlumnos();
            alertify.success('Alumnos de prueba creados');
        },
        
        async crearMateriasPrueba() {
            const materiasPrueba = [
                { idMateria: 1, codigo: 'M001', nombre: 'Matemáticas', uv: 4 },
                { idMateria: 2, codigo: 'M002', nombre: 'Física', uv: 4 },
                { idMateria: 3, codigo: 'M003', nombre: 'Programación', uv: 5 }
            ];
            
            for (let materia of materiasPrueba) {
                await db.materias.add(materia);
            }
            
            this.cargarMaterias();
            alertify.success('Materias de prueba creadas');
        },
        
        obtenerNombreAlumno(id) {
            const alumno = this.alumnos.find(a => a.idAlumno === id);
            return alumno ? alumno.nombre : 'Desconocido';
        },
        
        obtenerNombreMateria(id) {
            const materia = this.materias.find(m => m.idMateria === id);
            return materia ? materia.nombre : 'Desconocida';
        },
        
        abrirModalNuevo() {
            this.modoEdicion = false;
            this.formData = {
                idInscripcion: null,
                idAlumno: '',
                idMateria: '',
                fecha: new Date().toISOString().split('T')[0]
            };
            this.mostrarModal = true;
        },
        
        editarInscripcion(inscripcion) {
            this.modoEdicion = true;
            this.formData = { ...inscripcion };
            this.mostrarModal = true;
        },
        
        async guardarInscripcion() {
            try {
                if (!this.formData.idAlumno || !this.formData.idMateria) {
                    alertify.error('Debe seleccionar alumno y materia');
                    return;
                }
                
                // Verificar duplicado
                const existe = await db.inscripciones
                    .where('idAlumno').equals(this.formData.idAlumno)
                    .and(item => item.idMateria === this.formData.idMateria)
                    .toArray();
                
                if (existe.length > 0 && !this.modoEdicion) {
                    alertify.error('Esta inscripción ya existe');
                    return;
                }
                
                let accion_php = this.modoEdicion ? 'modificar' : 'nuevo';

                if (!this.modoEdicion) {
                    this.formData.idInscripcion = Date.now().toString();
                }

                // EL TRUCO DE ESTERILIZACIÓN: Limpiar el Proxy de Vue 3
                let datosLimpios = JSON.parse(JSON.stringify(this.formData));

                if (this.modoEdicion) {
                    await db.inscripciones.update(datosLimpios.idInscripcion, datosLimpios);
                } else {
                    await db.inscripciones.add(datosLimpios);
                }

                alertify.success(this.modoEdicion ? 'Inscripción actualizada' : 'Inscripción guardada');
                
                // Sincronizar con el backend
                const urlFetch = `private/modulos/inscripciones/inscripciones.php?accion=${accion_php}&inscripciones=${encodeURIComponent(JSON.stringify(datosLimpios))}`;
                
                fetch(urlFetch)
                    .then(res => res.json())
                    .then(data => {
                        if (data && data.error) {
                            alertify.error(`Falló sincronización: ${data.error}`);
                        } else if (data !== true && data.msg !== 'ok') {
                            alertify.error("Respuesta desconocida del servidor");
                        }
                    }).catch(e => console.error("Error fetch inscripciones", e));
                
                this.cerrarModal();
                this.cargarInscripciones();
            } catch (error) {
                console.error('Error guardando:', error);
                alertify.error('Error al guardar localmente: ' + error.message);
            }
        },
        
        async eliminarInscripcion(id) {
            if (!confirm('¿Eliminar inscripción?')) return;
            
            try {
                await db.inscripciones.delete(id);
                
                fetch(`private/modulos/inscripciones/inscripciones.php?accion=eliminar&inscripciones={"idInscripcion":${id}}`)
                    .then(res => res.json())
                    .then(data => {
                        if(data !== true) console.error("No borrado de remoto", data);
                    });

                alertify.success('Inscripción eliminada');
                this.cargarInscripciones();
            } catch (error) {
                console.error('Error eliminando:', error);
                alertify.error('Error al eliminar');
            }
        },
        
        cerrarModal() {
            this.mostrarModal = false;
        }
    }
};

window.inscripciones = inscripciones;