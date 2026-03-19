const buscar_alumnos = {
    data(){
        return{
            buscar:'',
            alumnos:[]
        }
    },
    props: {
        forms: {
            type: Object,
            required: true
        }
    },
    methods:{
        modificarAlumno(alumno){
            this.$emit('modificar', alumno);
        },
        async obtenerAlumnos(){
            this.alumnos = await db.alumnos.filter(
                alumno => alumno.codigo.toLowerCase().includes(this.buscar.toLowerCase()) 
                    || alumno.nombre.toLowerCase().includes(this.buscar.toLowerCase())
                    || alumno.apellido.toLowerCase().includes(this.buscar.toLowerCase())
            ).toArray();
        },
        async editarAlumno(alumno, e){
            e.stopPropagation();
            this.$emit('modificar', alumno);
            this.cerrarFormularioBusquedaAlumnos();
        },
        async eliminarAlumno(alumno, e){
            e.stopPropagation();
            alertify.confirm('Eliminar alumno', `¿Está seguro de eliminar el alumno ${alumno.nombre} ${alumno.apellido}?`, async e=>{
                await db.alumnos.delete(alumno.idAlumno);
                this.obtenerAlumnos();
                alertify.success(`Alumno ${alumno.nombre} eliminado correctamente`);
            }, () => {});
        },
        cerrarFormularioBusquedaAlumnos() {
            if (this.forms && this.forms.busqueda_alumnos) {
                this.forms.busqueda_alumnos.mostrar = false;
            }
        }
    },
    template: `
        <div v-draggable 
             :style="{ zIndex: forms.busqueda_alumnos.zIndex }" 
             @click="$root.traerAlFrente('busqueda_alumnos')">
            <div class="card text-bg-dark mb-3">
                <div class="card-header">
                    <div class="d-flex justify-content-between">
                        <div class="p-1">
                            BUSQUEDA DE ALUMNOS
                        </div>
                        <div>
                            <button type="button" class="btn-close btn-close-white" aria-label="Close" @click="cerrarFormularioBusquedaAlumnos"></button>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <table class="table table-striped table-hover" id="tblAlumnos">
                        <thead>
                            <tr>
                                <th colspan="8">
                                    <input autocomplete="off" type="search" @keyup="obtenerAlumnos()" v-model="buscar" placeholder="Buscar alumno" class="form-control">
                                </th>
                            </tr>
                            <tr>
                                <th>CODIGO</th>
                                <th>NOMBRE</th>
                                <th>APELLIDO</th>
                                <th>DIRECCION</th>
                                <th>EMAIL</th>
                                <th>TELEFONO</th>
                                <th colspan="2">ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="alumno in alumnos" :key="alumno.idAlumno">
                                <td>{{ alumno.codigo }}</td>
                                <td>{{ alumno.nombre }}</td>
                                <td>{{ alumno.apellido }}</td>
                                <td>{{ alumno.direccion }}</td>
                                <td>{{ alumno.email }}</td>
                                <td>{{ alumno.telefono }}</td>
                                <td>
                                    <button class="btn btn-warning btn-sm" @click="editarAlumno(alumno, $event)" title="Editar">
                                        <i class="fas fa-edit"></i> EDITAR
                                    </button>
                                </td>
                                <td>
                                    <button class="btn btn-danger btn-sm" @click="eliminarAlumno(alumno, $event)" title="Eliminar">
                                        <i class="fas fa-trash"></i> DEL
                                    </button>
                                </td>
                            </tr>
                            <tr v-if="alumnos.length === 0">
                                <td colspan="8" class="text-center">No hay alumnos que coincidan con la búsqueda</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `
};