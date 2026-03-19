const inscripciones = {
    props: ['forms'],
    template: `
        <div v-draggable v-if="forms.inscripciones.mostrar" class="position-absolute top-50 start-50 translate-middle" style="z-index: 1050; cursor: move;">
            <form @submit.prevent="guardarInscripcion" @reset.prevent="limpiarFormulario">
                <div class="card text-bg-dark" style="width: 450px; box-shadow: 0px 0px 15px black;">
                    <div class="card-header d-flex justify-content-between">
                        <div class="p-1 text-uppercase fw-bold">{{ accion == 'nuevo' ? 'Registro de' : 'Modificar' }} Inscripción</div>
                        <button type="button" class="btn-close btn-close-white" @click="cerrarFormulario"></button>
                    </div>
                    
                    <div class="card-body">
                        <div class="mb-2">
                            <label class="form-label">Alumno:</label>
                            <select v-model="inscripcion.idAlumno" class="form-select" required>
                                <option value="" disabled>Seleccione un alumno</option>
                                <option v-for="a in alumnos" :key="a.idAlumno" :value="a.idAlumno">
                                    {{ a.nombre }}
                                </option>
                            </select>
                        </div>

                        <div class="mb-2">
                            <label class="form-label">Materia:</label>
                            <select v-model="inscripcion.idMateria" class="form-select" required>
                                <option value="" disabled>Seleccione una materia</option>
                                <option v-for="m in materias" :key="m.idMateria" :value="m.idMateria">
                                    {{ m.nombre }}
                                </option>
                            </select>
                        </div>

                        <div class="mb-2">
                            <label class="form-label">Fecha:</label>
                            <input v-model="inscripcion.fecha" type="date" class="form-control" required>
                        </div>
                    </div>

                    <div class="card-footer text-center">
                        <button type="submit" class="btn btn-primary m-1">GUARDAR</button>
                        <button type="reset" class="btn btn-warning m-1">NUEVO</button>
                        <button type="button" @click="abrirBusqueda" class="btn btn-success m-1">BUSCAR</button>
                    </div>
                </div>
            </form>
        </div>
    `,
    data() {
        return {
            inscripcion: {
                idInscripcion: 0,
                idAlumno: '',
                idMateria: '',
                fecha: new Date().toISOString().substr(0, 10),
                estado: 'activo'
            },
            accion: 'nuevo',
            alumnos: [],
            materias: []
        }
    },
    methods: {
        async cargarListas() {
            try {
                this.alumnos = await db.alumnos.toArray();
                this.materias = await db.materias.toArray();
            } catch (error) {
                console.error('Error cargando listas:', error);
                alertify.error('Error al cargar datos');
            }
        },
        cerrarFormulario() {
            this.forms.inscripciones.mostrar = false;
        },
        limpiarFormulario() {
            this.accion = 'nuevo';
            this.inscripcion = {
                idInscripcion: 0,
                idAlumno: '',
                idMateria: '',
                fecha: new Date().toISOString().substr(0, 10),
                estado: 'activo'
            };
        },
        modificarInscripcion(datos) {
            this.accion = 'modificar';
            // Asegurar que los datos son planos
            this.inscripcion = { ...datos };
            this.forms.inscripciones.mostrar = true;
        },
        abrirBusqueda() {
            this.forms.busqueda_inscripciones.mostrar = !this.forms.busqueda_inscripciones.mostrar;
            this.$emit('buscar');
        },
        async guardarInscripcion() {
            try {
                const datosLimpios = { ...this.inscripcion };

                if (this.accion == 'nuevo') {
                    datosLimpios.idInscripcion = uuid.v4();
                }

                // Guardar en IndexedDB
                await db.inscripciones.put(datosLimpios);

                // Crear una copia segura para enviar al servidor
                const datosParaServidor = JSON.parse(JSON.stringify(datosLimpios));
                const url = `private/modulos/inscripciones/inscripciones.php?accion=${this.accion}&inscripciones=${JSON.stringify(datosParaServidor)}`;
                
                const response = await fetch(url);
                const data = await response.json();
                
                if (data !== true) {
                    alertify.error("Error al sincronizar con el servidor");
                } else {
                    alertify.success(`Inscripción guardada correctamente`);
                    this.limpiarFormulario();
                    this.$emit('buscar');
                }

            } catch (e) {
                console.error('Error completo:', e);
                alertify.error("Error en base de datos local");
            }
        }
    },
    mounted() {
        this.cargarListas();
    }
};