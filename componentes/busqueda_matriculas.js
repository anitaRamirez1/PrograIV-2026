const busqueda_matriculas = {
    props: ['forms'],
    data() {
        return {
            buscar: '',
            matriculas: [],
            alumnos: {},
            materias: {},
            docentes: {}
        }
    },
    methods: {
        async obtenerDatosRelacionados() {
            // Cargamos mapas de nombres para mostrar en la tabla en lugar de IDs
            const [listaAlumnos, listaMaterias, listaDocentes] = await Promise.all([
                db.alumnos.toArray(),
                db.materias.toArray(),
                db.docentes.toArray()
            ]);
            
            this.alumnos = Object.fromEntries(listaAlumnos.map(a => [a.idAlumno, a.nombre]));
            this.materias = Object.fromEntries(listaMaterias.map(m => [m.idMateria, m.nombre]));
            this.docentes = Object.fromEntries(listaDocentes.map(d => [d.idDocente, d.nombre]));
            
        },
        async obtenerMatriculas() {
            await this.obtenerDatosRelacionados();
            let term = this.buscar.toLowerCase();
            let todas = await db.matriculas.toArray();
            this.matriculas = todas.filter(m => {
                const nombreAlumno = (this.alumnos[m.idAlumno] || '').toLowerCase();
                const nombreMateria = (this.materias[m.idMateria] || '').toLowerCase();
                const nombreDocente = (this.docentes[m.idDocente] || '').toLowerCase();
                
                // Buscar en los nombres resueltos
                const matchResueltos = nombreAlumno.includes(term) || nombreMateria.includes(term) || nombreDocente.includes(term);
                // Buscar en los campos directos de la base
                const matchBase = Object.values(m).some(val => String(val).toLowerCase().includes(term));
                
                return matchResueltos || matchBase;
            });
        },
        async editarMatricula(matricula) {
            this.$emit('modificar', matricula);
            this.forms.busqueda_matriculas.mostrar = false;
        },
        async eliminarMatricula(matricula) {
            alertify.confirm('Eliminar Matrícula', `¿Desea eliminar la matrícula del alumno ${this.alumnos[matricula.idAlumno]}?`, 
            async () => {
                await db.matriculas.delete(matricula.idMatricula);
                fetch(`private/modulos/matriculas/matriculas.php?accion=eliminar&matriculas=${JSON.stringify(matricula)}`);
                this.obtenerMatriculas();
                alertify.success('Eliminado correctamente');
            }, () => {});
        },
        cerrar() {
            this.forms.busqueda_matriculas.mostrar = false;
        }
    },
    template: `
        <div v-draggable style="width: 90%; max-width: 1000px;">
            <div class="card text-bg-dark mb-3">
                <div class="card-header d-flex justify-content-between">
                    BUSQUEDA DE MATRICULAS
                    <button type="button" class="btn-close btn-close-white" @click="cerrar"></button>
                </div>
                <div class="card-body">
                    <div class="input-group mb-3">
                        <input type="search" v-model="buscar" @keyup="obtenerMatriculas" 
                               placeholder="Buscar por alumno o periodo..." class="form-control">
                        <button class="btn btn-outline-secondary" @click="obtenerMatriculas">BUSCAR</button>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-dark table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>ALUMNO</th>
                                    <th>MATERIA</th>
                                    <th>DOCENTE</th>
                                    <th>FECHA</th>
                                    <th>PERIODO</th>
                                    <th>GESTION</th>
                                    <th colspan="2">ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="m in matriculas" :key="m.idMatricula">
                                    <td>{{ alumnos[m.idAlumno] || 'Desconocido' }}</td>
                                    <td>{{ materias[m.idMateria] || 'Desconocida' }}</td>
                                    <td>{{ docentes[m.idDocente] || 'Desconocido' }}</td>
                                    <td>{{ m.fecha }}</td>
                                    <td>{{ m.periodo }}</td>
                                    <td>{{ m.gestion }}</td>
                                    <td>
                                        <button class="btn btn-warning btn-sm" @click="editarMatricula(m)">EDITAR</button>
                                    </td>
                                    <td>
                                        <button class="btn btn-danger btn-sm" @click="eliminarMatricula(m)">ELIMINAR</button>
                                    </td>
                                </tr>
                                <tr v-if="matriculas.length === 0">
                                    <td colspan="8" class="text-center">No hay registros</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `
};