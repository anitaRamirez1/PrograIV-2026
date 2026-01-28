document.addEventListener("DOMContentLoaded", () => {
    frmAlumnos.addEventListener("submit", (e) => {
        e.preventDefault();
       guardarAlumno();
    });
    mostrarAlumnos();
});

function mostrarAlumnos(){
    let $tblAlumnos = document.querySelector("#tblAlumnos tbody");
    n = localStorage.length;
    $tblAlumnos.innerHTML = '';
    for (let i = 0; i < n; i++){
        let datos = JSON.parse(localStorage.getItem(i));
    filas += `
        <tr>
            <td>${datos.codigo}</td>
            <td>${datos.nombre}</td>
            <td>${datos.direccion}</td>
            <td>${datos.email}</td> 
            <td>${datos.telefono}</td>
            </td>

        </tr>`;
    }
    $tblAlumnos.innerHTML = filas;
}

function guardarAlumno() {
    let datos = {
        id: getId(),
        codigo: txtCodigoAlumno.value,
        nombre: txtnombreAlumno.value,
        direccion: txtDireccionAlumno.value,
        email: txtEmailAlumno.value,
        telefono: txtTelefonoAlumno.value
    }, codigoDuplicado = buscarAlumno(datos.codigo);
    if(codigoDuplicado){
        alert("El codigo del alumno ya existe, "+ codigoDuplicado.nombre);
        return; //Termina la ejecucion de la funcion
    }
    localStorage.setItem( datos.id, JSON.stringify(datos));
    limpiarFormulario();
}

function getId(){
    return localStorage.length + 1;
}

function limpiarFormulario(){
    frmAlumnos.reset();
}

function buscarAlumno(codigo=''){
    let n = localStorage.length;
    for(let i = 0; i < n; i++){
        let datos = JSON.parse(localStorage.getItem(i));
        if(datos?.codigo && datos.codigo.trim().toUpperCase() == codigo.trim().toUpperCase()){
            return datos;
        }
    }
    return null;
}
