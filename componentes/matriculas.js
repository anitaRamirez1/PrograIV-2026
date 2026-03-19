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
    watch: {
        // Detecta cuando se abre el formulario para refrescar las listas
        'forms.matriculas.mostrar': function(valor) {
            if (valor) this.cargarListas();
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
        modificarMatricula(datos) {
            this.accion = 'modificar';
            this.matricula = { ...datos }; 
            this.forms.matriculas.mostrar = true;
        },
        abrirBusqueda() {
            this.forms.busqueda_matriculas.mostrar = !this.forms.busqueda_matriculas.mostrar;
            this.$emit('buscar'); 
        },
        async guardarMatricula() {
    try {
        // 1. Generamos el ID si es nuevo
        if (this.accion == 'nuevo') {
            // Usamos getTime por si la librería uuid no está cargada correctamente
            this.matricula.idMatricula = typeof uuid !== 'undefined' ? uuid.v4() : new Date().getTime().toString();
        }
        
        // 2. EL TRUCO DE MAGIA: Limpiamos el objeto Proxy de Vue
        let datosLimpios = JSON.parse(JSON.stringify(this.matricula));
        
        // 3. Guardamos en Dexie (Local) usando los datos limpios
        await db.matriculas.put(datosLimpios);
        
        // 4. Enviamos a PHP (Servidor)
        fetch(`private/modulos/matriculas/matriculas.php?accion=${this.accion}&matriculas=${JSON.stringify(datosLimpios)}`)
            .then(res => res.json())
            .then(data => {
                if (data !== true) alertify.error("Error al sincronizar con el servidor");
            });

        alertify.success(`Matrícula guardada con éxito`);
        this.limpiarFormulario();

    } catch (error) {
        // Si Dexie vuelve a fallar, esto nos dirá EXACTAMENTE por qué
        console.error("Error crítico al guardar en la base local:", error);
        alertify.error("Error al guardar de forma local");
    }
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
        <div v-draggable v-if="forms.matriculas.mostrar" class="position-absolute top-50 start-50 translate-middle" style="z-index: 1050;">
            <form @submit.prevent="guardarMatricula" @reset.prevent="limpiarFormulario">
                <div class="card text-bg-dark" style="width: 450px; box-shadow: 0px 0px 15px black;">
                    <div class="card-header d-flex justify-content-between">
                        <div class="p-1">REGISTRO DE MATRÍCULA</div>
                        <button type="button" class="btn-close btn-close-white" @click="cerrarFormulario"></button>
                    </div>
                    <div class="card-body">
                        <div class="mb-2">
                            <label class="form-label">Alumno:</label>
                            <select v-model="matricula.idAlumno" class="form-select" required>
                                <option value="" disabled>Seleccione un alumno</option>
                                <option v-for="a in alumnos" :key="a.idAlumno" :value="a.idAlumno">{{a.nombre}}</option>
                            </select>
                        </div>
                        <div class="mb-2">
                            <label class="form-label">Materia:</label>
                            <select v-model="matricula.idMateria" class="form-select" required>
                                <option value="" disabled>Seleccione una materia</option>
                                <option v-for="m in materias" :key="m.idMateria" :value="m.idMateria">{{m.nombre}}</option>
                            </select>
                        </div>
                        <div class="mb-2">
                            <label class="form-label">Docente:</label>
                            <select v-model="matricula.idDocente" class="form-select" required>
                                <option value="" disabled>Seleccione un docente</option>
                                <option v-for="d in docentes" :key="d.idDocente" :value="d.idDocente">{{d.nombre}}</option>
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
                        <button type="submit" class="btn btn-primary m-1">GUARDAR</button>
                        <button type="reset" class="btn btn-warning m-1">NUEVO</button>
                        <button type="button" @click="abrirBusqueda" class="btn btn-success m-1">BUSCAR</button>
                    </div>
                </div>
            </form>
        </div>`
};