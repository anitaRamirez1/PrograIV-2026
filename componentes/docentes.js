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
        cerrarFormularioDocente(){
            this.forms.docentes.mostrar = false;
        },
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
            this.buscar = datos.codigo;

            if(this.data_docentes.length > 0 && this.accion=='nuevo'){
                alertify.error(`El codigo del docente ya existe, ${this.data_docentes[0].nombre}`);
                return; //Termina la ejecucion de la funcion
            }
            db.docentes.put(datos);
            fetch(`private/modulos/docentes/docentes.php?accion=${this.accion}&docentes=${JSON.stringify(datos)}`)
                .then(response=>response.json())
                .then(data=>{
                    if(data!=true) alertify.error(`Error al sincronizar con el servidor: ${data}`);
                });
            this.limpiarFormulario();
            alertify.success(`${datos.nombre} guardado correctamente`);
        },
        getId(){
            return uuid.v4();
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
        <div v-draggable>
            <form id="frmDocentes" @submit.prevent="guardarDocente" @reset.prevent="limpiarFormulario">
                <div class="card text-bg-dark">
                    <div class="card-header">
                        <div class="d-flex justify-content-between">
                            <div class="p-1">
                                REGISTRO DE DOCENTES
                            </div>
                            <div>
                                <button type="button" class="btn-close btn-close-white" aria-label="Close" @click="cerrarFormularioDocente"></button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="row p-1">
                            <div class="col-4">
                                CODIGO:
                            </div>
                            <div class="col-5">
                                <input placeholder="codigo" required v-model="docente.codigo" type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col-4">
                                NOMBRE:
                            </div>
                            <div class="col-8">
                                <input placeholder="nombre" required v-model="docente.nombre" type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col-4">
                                DIRECCION:
                            </div>
                            <div class="col-8">
                                <input placeholder="direccion" required v-model="docente.direccion" type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col-4">
                                EMAIL:
                            </div>
                            <div class="col-8">
                                <input placeholder="email" required v-model="docente.email" type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col-4">
                                TELEFONO:
                            </div>
                            <div class="col-6">
                                <input placeholder="telefono" required v-model="docente.telefono" type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col-4">
                                ESCALAFON:
                            </div>
                            <div class="col-8">
                                <select required v-model="docente.escalafon" class="form-select">
                                    <option value="tecnico">Tecnico</option>
                                    <option value="profesor">Profesor</option>
                                    <option value="ingeniero">Licenciado/Ingeniero</option>
                                    <option value="maestria">Maestria</option>
                                    <option value="doctor">Doctor</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer">
                        <div class="row">
                            <div class="col text-center">
                                <button type="submit" id="btnGuardarDocente" class="btn btn-primary">GUARDAR</button>
                                <button type="reset" id="btnCancelarDocente" class="btn btn-warning">NUEVO</button>
                                <button type="button" @click="buscarDocente" id="btnBuscarDocente" class="btn btn-success">BUSCAR</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    `
};