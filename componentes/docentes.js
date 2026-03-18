const docentes = {
    props:['forms'],
    data(){
        return{
            docente:{
                idDocente:0,
                codigo:"",
                nombre:"",
                direccion:"",
                email:"",
                telefono:"",
                escalafon:""
            },
            accion:'nuevo',
            idDocente:0,
            data_docentes:[]
        }
    },
    methods:{
        buscarDocente(){
            this.forms.busqueda_docentes.mostrar = !this.forms.busqueda_docentes.mostrar;
            this.$emit('buscar');
        },
        modificarDocente(docente){
            this.accion = 'modificar';
            this.idDocente = docente.Id_Docentes || docente.idDocente;
            this.docente.codigo = docente.codigo;
            this.docente.nombre = docente.nombre;
            this.docente.direccion = docente.direccion;
            this.docente.email = docente.email;
            this.docente.telefono = docente.telefono;
            this.docente.escalafon = docente.escalafon;
        },
        async guardarDocente() {
            let datos = {
                idDocente: this.accion=='modificar' ? this.idDocente : this.getId(),
                codigo: this.docente.codigo,
                nombre: this.docente.nombre,
                direccion: this.docente.direccion,
                email: this.docente.email,
                telefono: this.docente.telefono,
                escalafon: this.docente.escalafon
            };
            
            // Guardar en IndexedDB
            db.docentes.put(datos);

            // Sincronizar con el servidor
            fetch(`private/modulos/docentes/docentes.php?accion=${this.accion}&docentes=${JSON.stringify(datos)}`)
                .then(response => response.json())
                .then(data => {
                    if(data == true || data.msg == 'ok') {
                        alertify.success(`${datos.nombre} guardado correctamente`);
                        this.limpiarFormulario();
                    } else {
                        alertify.error(`Error al sincronizar con el servidor: ${JSON.stringify(data)}`);
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                    alertify.error("Error de conexión con el servidor");
                });
        },
        getId(){
            return typeof uuid !== 'undefined' ? uuid.v4() : new Date().getTime();
        },
        limpiarFormulario(){
            this.accion = 'nuevo';
            this.idDocente = 0;
            this.docente.codigo = '';
            this.docente.nombre = '';
            this.docente.direccion = '';
            this.docente.email = '';
            this.docente.telefono = '';
            this.docente.escalafon = '';
        },
    },
    template: `
        <div v-draggable class="card text-bg-dark mb-3" 
             style="position: absolute; z-index: 1000; width: 600px; top: 50px; left: 50px;">
            
            <div class="card-header d-flex justify-content-between align-items-center" style="cursor: move;">
                <span>REGISTRO DE DOCENTES</span>
                <button type="button" 
                        class="btn-close btn-close-white" 
                        @click="forms.docentes.mostrar=false" 
                        aria-label="Close">
                </button>
            </div>

            <div class="card-body">
                <form id="frmDocentes" @submit.prevent="guardarDocente" @reset.prevent="limpiarFormulario">
                    <div class="row p-1">
                        <div class="col-3">CODIGO:</div>
                        <div class="col-4">
                            <input placeholder="codigo" required v-model="docente.codigo" type="text" class="form-control form-control-sm">
                        </div>
                    </div>
                    <div class="row p-1">
                        <div class="col-3">NOMBRE:</div>
                        <div class="col-9">
                            <input placeholder="nombre" required v-model="docente.nombre" type="text" class="form-control form-control-sm">
                        </div>
                    </div>
                    <div class="row p-1">
                        <div class="col-3">DIRECCION:</div>
                        <div class="col-9">
                            <input placeholder="direccion" required v-model="docente.direccion" type="text" class="form-control form-control-sm">
                        </div>
                    </div>
                    <div class="row p-1">
                        <div class="col-3">EMAIL:</div>
                        <div class="col-9">
                            <input placeholder="email" required v-model="docente.email" type="text" class="form-control form-control-sm">
                        </div>
                    </div>
                    <div class="row p-1">
                        <div class="col-3">TELEFONO:</div>
                        <div class="col-4">
                            <input placeholder="telefono" required v-model="docente.telefono" type="text" class="form-control form-control-sm">
                        </div>
                    </div>
                    <div class="row p-1">
                        <div class="col-3">ESCALAFON:</div>
                        <div class="col-6">
                            <select required v-model="docente.escalafon" class="form-select form-select-sm">
                                <option value="tecnico">Tecnico</option>
                                <option value="profesor">Profesor</option>
                                <option value="ingeniero">Licenciado/Ingeniero</option>
                                <option value="maestria">Maestria</option>
                                <option value="doctor">Doctor</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="row mt-3">
                        <div class="col text-center">
                            <button type="submit" class="btn btn-primary">GUARDAR</button>
                            <button type="reset" class="btn btn-warning">NUEVO</button>
                            <button type="button" @click="buscarDocente" class="btn btn-success">BUSCAR</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `
};