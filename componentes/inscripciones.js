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
                fecha: new Date().toISOString().substr(0, 10)
            },
            accion: 'nuevo',
            alumnos: [],
            materias: []
        }
    },
    watch: {
        'forms.inscripciones.mostrar': function(valor) {
            if (valor) this.cargarListas();
        }
    },
    methods: {
        async cargarListas() {
            this.alumnos = await db.alumnos.toArray();
            this.materias = await db.materias.toArray();
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
                fecha: new Date().toISOString().substr(0, 10)
            };
        },
        modificarInscripcion(datos) {
            this.accion = 'modificar';
            this.inscripcion = { ...datos };
            this.forms.inscripciones.mostrar = true;
        },
        abrirBusqueda() {
            // Asumiendo que crearás un componente de búsqueda similar a los otros
            if(this.forms.busqueda_inscripciones) {
                this.forms.busqueda_inscripciones.mostrar = !this.forms.busqueda_inscripciones.mostrar;
                this.$emit('buscar');
            } else {
                alertify.error("El componente de búsqueda no está configurado");
            }
        },
        async guardarInscripcion() {
            if (this.accion == 'nuevo') {
                this.inscripcion.idInscripcion = uuid.v4();
            }

            await db.inscripciones.put(this.inscripcion);

            // Sincronización con el servidor PHP
            fetch(`private/modulos/inscripciones/inscripciones.php?accion=${this.accion}&inscripciones=${JSON.stringify(this.inscripcion)}`)
                .then(res => res.json())
                .then(data => {
                    if (data !== true) {
                        alertify.error("Error de sincronización con el servidor");
                    } else {
                        alertify.success(`Inscripción guardada correctamente`);
                        this.limpiarFormulario();
                        this.$emit('buscar'); 
                    }
                });
        }
    },
    mounted() {
        this.cargarListas();
    }
};