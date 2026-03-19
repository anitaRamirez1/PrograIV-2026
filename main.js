const { createApp } = Vue,
    Dexie = window.Dexie,
    db = new Dexie("db_academica"),
    sha256 = CryptoJS.SHA256,
    uuid = window.uuid;

createApp({
    components:{
        alumnos,
        buscar_alumnos,
        materias,
        buscar_materias,
        docentes,
        buscar_docentes,
        matriculas,
        busqueda_matriculas,
        inscripciones,
        busqueda_inscripciones // Registro del nuevo componente
    },
    data(){
        return{
            forms:{
                alumnos:{mostrar:false},
                busqueda_alumnos:{mostrar:false},
                materias:{mostrar:false},
                busqueda_materias:{mostrar:false},
                docentes:{mostrar:false},
                busqueda_docentes:{mostrar:false},
                matriculas:{mostrar:false},
                busqueda_matriculas:{mostrar:false},
                inscripciones:{mostrar:false},
                busqueda_inscripciones:{mostrar:false} // Estado para la búsqueda de inscripciones
            }
        }
    },
    methods:{
        buscar(ventana, metodo){
            this.$refs[ventana][metodo]();
        },
        abrirVentana(ventana){
            this.forms[ventana].mostrar = !this.forms[ventana].mostrar;
        },
        modificar(ventana, metodo, data){
            this.$refs[ventana][metodo](data);
        },
        async sincronizarTablas() {
            // Agregamos inscripciones y matriculas a la sincronización si tienes sus PHP listos
            const tablas = ['alumnos', 'materias', 'docentes'];
            tablas.forEach(tabla => {
                const endpoint = tabla === 'alumnos' ? 'alumno' : (tabla === 'materias' ? 'materia' : 'docentes');
                fetch(`private/modulos/${tabla}/${endpoint}.php?accion=consultar`)
                    .then(res => res.json())
                    .then(datos => {
                        if (Array.isArray(datos)) {
                            db[tabla].clear().then(() => {
                                db[tabla].bulkPut(datos);
                            });
                        }
                    })
                    .catch(err => console.error(`Error sincronizando ${tabla}:`, err));
            });
        }
    },
    mounted(){
        // Configuración de tablas en Dexie
        db.version(1).stores({
            "alumnos": "idAlumno, codigo, nombre, direccion, email, telefono",
            "materias": "idMateria, codigo, nombre, uv",
            "docentes": "idDocente, codigo, nombre, direccion, email, telefono, escalafon",
            "matriculas": "idMatricula, idAlumno, idMateria, idDocente, fecha, estado",
            "inscripciones": "idInscripcion, idAlumno, idMateria, fecha, estado"
        });
        
        this.sincronizarTablas();
    }
}).directive('draggable', vDraggable).mount("#app");