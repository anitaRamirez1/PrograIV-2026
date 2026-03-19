const buscar_materias = {
    data(){
        return{
            buscar:'',
            materias:[]
        }
    },
    props: {
        forms: {
            type: Object,
            required: true
        }
    },
    methods:{
        modificarMateria(materia){
            this.$emit('modificar', materia);
        },
        async obtenerMaterias(){
            let term = this.buscar.toLowerCase();
            this.materias = await db.materias.filter(m => {
                return Object.values(m).some(val => String(val).toLowerCase().includes(term));
            }).toArray();
        },
        async editarMateria(materia, e){
            e.stopPropagation();
            this.$emit('modificar', materia);
            this.cerrarFormularioBusquedaMaterias();
        },
        async eliminarMateria(materia, e){
            e.stopPropagation();
            alertify.confirm('Eliminar materia', `¿Está seguro de eliminar la materia ${materia.nombre}?`, async e=>{
                await db.materias.delete(materia.idMateria);
                fetch(`private/modulos/materias/materia.php?accion=eliminar&materias=${encodeURIComponent(JSON.stringify(materia))}`);
                this.obtenerMaterias();
                alertify.success(`Materia ${materia.nombre} eliminada correctamente`);
            }, () => {});
        },
        cerrarFormularioBusquedaMaterias() {
            if (this.forms && this.forms.busqueda_materias) {
                this.forms.busqueda_materias.mostrar = false;
            }
        }
    },
    template: `
        <div v-draggable 
             :style="{ zIndex: forms.busqueda_materias.zIndex }" 
             @click="$root.traerAlFrente('busqueda_materias')">
            <div class="card text-bg-dark mb-3">
                <div class="card-header">
                    <div class="d-flex justify-content-between">
                        <div class="p-1">
                            BUSQUEDA DE MATERIAS
                        </div>
                        <div>
                            <button type="button" class="btn-close btn-close-white" aria-label="Close" @click="cerrarFormularioBusquedaMaterias"></button>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <table class="table table-striped table-hover" id="tblMaterias">
                        <thead>
                            <tr>
                                <th colspan="5">
                                    <input autocomplete="off" type="search" @keyup="obtenerMaterias()" v-model="buscar" placeholder="Buscar materia" class="form-control">
                                </th>
                            </tr>
                            <tr>
                                <th>CODIGO</th>
                                <th>NOMBRE</th>
                                <th>UV</th>
                                <th colspan="2">ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="materia in materias" :key="materia.idMateria">
                                <td>{{ materia.codigo }}</td>
                                <td>{{ materia.nombre }}</td>
                                <td>{{ materia.uv }}</td>
                                <td>
                                    <button class="btn btn-warning btn-sm" @click="editarMateria(materia, $event)" title="Editar">
                                        <i class="fas fa-edit"></i> EDITAR
                                    </button>
                                </td>
                                <td>
                                    <button class="btn btn-danger btn-sm" @click="eliminarMateria(materia, $event)" title="Eliminar">
                                        <i class="fas fa-trash"></i> DEL
                                    </button>
                                </td>
                            </tr>
                            <tr v-if="materias.length === 0">
                                <td colspan="5" class="text-center">No hay materias que coincidan con la búsqueda</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `
};