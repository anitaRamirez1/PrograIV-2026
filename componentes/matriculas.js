const matriculas = {
    props: ['forms'],
    data() {
        return {
            matricula: {
                idMatricula: 0, 
                idAlumno: '', 
                idMateria: '', 
                idDocente: '',
                fecha: new Date().toISOString().substr(0, 10),
                estado: 'Activo', 
                periodo: '', 
                gestion: new Date().getFullYear()
            },
            accion: 'nuevo',
            alumnos: [], 
            materias: [], 
            docentes: []
        }
    },
    methods: {
        async cargarListas() {
            this.alumnos = await db.alumnos.toArray();
            this.materias = await db.materias.toArray();
            this.docentes = await db.docentes.toArray();
        },
        cerrarFormulario() { 
            this.forms.matriculas.mostrar = false; 
        },
        // Recibe datos desde busqueda_matriculas.js
        modificarMatricula(datos) {
            this.accion = 'modificar';
            this.matricula = { ...datos }; 
            this.forms.matriculas.mostrar = true;
        },
        // Abre el componente de búsqueda
        abrirBusqueda() {
            this.forms.busqueda_matriculas.mostrar = !this.forms.busqueda_matriculas.mostrar;
            this.$emit('buscar'); 
        },
        async guardarMatricula() {
            if (this.accion == 'nuevo') {
                this.matricula.idMatricula = uuid.v4();
            }
            
            // Guardar en IndexedDB (Dexie)
            await db.matriculas.put(this.matricula);
            
            // Sincronización con el servidor
            fetch(`private/modulos/matriculas/matriculas.php?accion=${this.accion}&matriculas=${JSON.stringify(this.matricula)}`)
                .then(res => res.json())
                .then(data => {
                    if (data !== true) {
                        alertify.error("Error de sincronización con el servidor");
                    }
                });

            alertify.success(`Matrícula ${this.accion == 'nuevo' ? 'registrada' : 'actualizada'} correctamente`);
            this.limpiarFormulario();
        },
        limpiarFormulario() {
            this.accion = 'nuevo';
            this.matricula = {
                idMatricula: 0, 
                idAlumno: '', 
                idMateria: '', 
                idDocente: '',
                fecha: new Date().toISOString().substr(0, 10),
                estado: 'Activo', 
                periodo: '', 
                gestion: new Date().getFullYear()
            };
        }
    },
    mounted() { 
        this.cargarListas(); 
    },
    template: `
        <div v-draggable>
            <form @submit.prevent="guardarMatricula" @reset.prevent="limpiarFormulario">
                <div class="card text-bg-dark" style="width: 450px;">
                    <div class="card-header d-flex justify-content-between">
                        <div class="p-1">REGISTRO DE MATRÍCULA</div>
                        <button type="button" class="btn-close btn-close-white" @click="cerrarFormulario"></button>
                    </div>
                    <div class="card-body">
                        <div class="mb-2">
                            <label class="form-label">Alumno:</label>
                            <select v-model="matricula.idAlumno" class="form-control" required>
                                <option value="" disabled>Seleccione un alumno</option>
                                <option v-for="a in alumnos" :key="a.idAlumno" :value="a.idAlumno">
                                    {{a.nombre}}
                                </option>
                            </select>
                        </div>
                        <div class="mb-2">
                            <label class="form-label">Materia:</label>
                            <select v-model="matricula.idMateria" class="form-control" required>
                                <option value="" disabled>Seleccione una materia</option>
                                <option v-for="m in materias" :key="m.idMateria" :value="m.idMateria">
                                    {{m.nombre}}
                                </option>
                            </select>
                        </div>
                        <div class="mb-2">
                            <label class="form-label">Docente:</label>
                            <select v-model="matricula.idDocente" class="form-control" required>
                                <option value="" disabled>Seleccione un docente</option>
                                <option v-for="d in docentes" :key="d.idDocente" :value="d.idDocente">
                                    {{d.nombre}}
                                </option>
                            </select>
                        </div>
                        <div class="row">
                            <div class="col-6 p-1">
                                <label class="form-label">Periodo:</label>
                                <input v-model="matricula.periodo" type="text" class="form-control" placeholder="Ej: Ciclo I" required>
                            </div>
                            <div class="col-6 p-1">
                                <label class="form-label">Gestión:</label>
                                <input v-model="matricula.gestion" type="number" class="form-control" required>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer text-center">
                        <div class="row">
                            <div class="col">
                                <button type="submit" class="btn btn-primary">GUARDAR</button>
                                <button type="reset" class="btn btn-warning">NUEVO</button>
                                <button type="button" @click="abrirBusqueda" class="btn btn-success">BUSCAR</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>`
};