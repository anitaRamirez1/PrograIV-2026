const buscar_docentes = {
    data(){
        return{
            buscar:'',
            docentes:[]
        }
    },
    props: {
        forms: {
            type: Object,
            required: true
        }
    },
    methods:{
        modificarDocente(docente){
            this.$emit('modificar', docente);
        },
        async obtenerDocentes(){
            let term = this.buscar.toLowerCase();
            this.docentes = await db.docentes.filter(d => {
                return Object.values(d).some(val => String(val).toLowerCase().includes(term));
            }).toArray();
        },
        async editarDocente(docente, e){
            e.stopPropagation();
            // Emitir el evento para editar
            this.$emit('modificar', docente);
            // Cerrar la ventana de búsqueda después de seleccionar
            this.cerrarFormularioBusquedaDocentes();
        },
        async eliminarDocente(docente, e){
            e.stopPropagation();
            alertify.confirm('Eliminar docentes', `¿Está seguro de eliminar el docente ${docente.nombre}?`, async e=>{
                await db.docentes.delete(docente.idDocente);
                fetch(`private/modulos/docentes/docentes.php?accion=eliminar&docentes=${encodeURIComponent(JSON.stringify(docente))}`);
                this.obtenerDocentes();
                alertify.success(`Docente ${docente.nombre} eliminado correctamente`);
            }, () => {
                //No hacer nada
            });
        },
        cerrarFormularioBusquedaDocentes() {
            if (this.forms && this.forms.busqueda_docentes) {
                this.forms.busqueda_docentes.mostrar = false;
            }
        }
    },
    template: `
        <div v-draggable 
             :style="{ zIndex: forms.busqueda_docentes.zIndex }" 
             @click="$root.traerAlFrente('busqueda_docentes')">
            <div class="card text-bg-dark mb-3">
                <div class="card-header">
                    <div class="d-flex justify-content-between">
                        <div class="p-1">
                            BUSQUEDA DE DOCENTES
                        </div>
                        <div>
                            <button type="button" class="btn-close btn-close-white" aria-label="Close" @click="cerrarFormularioBusquedaDocentes"></button>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <table class="table table-striped table-hover" id="tblDocentes">
                        <thead>
                            <tr>
                                <th colspan="9">
                                    <input autocomplete="off" type="search" @keyup="obtenerDocentes()" v-model="buscar" placeholder="Buscar docente" class="form-control">
                                </th>
                            </tr>
                            <tr>
                                <th>CODIGO</th>
                                <th>NOMBRE</th>
                                <th>DIRECCION</th>
                                <th>EMAIL</th>
                                <th>TELEFONO</th>
                                <th>ESCALAFON</th>
                                <th>HASH</th>
                                <th colspan="2">ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="docente in docentes" :key="docente.idDocente">
                                <td>{{ docente.codigo }}</td>
                                <td>{{ docente.nombre }}</td>
                                <td>{{ docente.direccion }}</td>
                                <td>{{ docente.email }}</td>
                                <td>{{ docente.telefono }}</td>
                                <td>{{ docente.escalafon }}</td>
                                <td>{{ docente.hash }}</td>
                                <td>
                                    <button class="btn btn-warning btn-sm" @click="editarDocente(docente, $event)" title="Editar">
                                        <i class="fas fa-edit"></i> EDITAR
                                    </button>
                                </td>
                                <td>
                                    <button class="btn btn-danger btn-sm" @click="eliminarDocente(docente, $event)" title="Eliminar">
                                        <i class="fas fa-trash"></i> DEL
                                    </button>
                                </td>
                            </tr>
                            <tr v-if="docentes.length === 0">
                                <td colspan="9" class="text-center">No hay docentes que coincidan con la búsqueda</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `
};