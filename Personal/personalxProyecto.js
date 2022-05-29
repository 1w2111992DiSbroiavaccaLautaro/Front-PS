$(document).ready(function () {
    var rol = localStorage.getItem("rol");
    if (rol != 1) {
        Swal.fire({
            icon: "error",
            title: "No está Autorizado",
            showConfirmButton: false,
        });
        setInterval(() => {
            window.location = "../index.html";
        }, 100);
    } else {
        fetch("https://practica-supervisada.herokuapp.com/api/personal", {
            method: "get",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .catch((response) => {
                Swal.fire({
                    icon: "error",
                    title: "Sesión Expirada",
                    showConfirmButton: false,
                });
                setInterval(() => {
                    window.location = "../index.html";
                }, 2000);
                return false;
            })
            .then((json) => {
                console.log(json);
                hideSpinner();
                //getTabla();
                cargarComboPersonal(json)
            });
    }
});

function cargarComboPersonal(datos) {
    var html = "";
    $("#txtPersonal").append(html);
    select = document.getElementById("txtPersonal");
    for (let i = 0; i < datos.length; i++) {
        var option = document.createElement("option");
        option.value = datos[i].id;
        option.text = datos[i].nombre;
        select.add(option);
        //console.log(datos[i].area1);
    }
}

function hideSpinner() {
    document.getElementById("spinner").style.display = "none";
}

$(document).ready(function () {
    getDatosInicial();
})


function getDatosInicial() {
    fetch(`https://practica-supervisada.herokuapp.com/api/personal/personalxproyecto?id=24&fichaLista=false`, {
        method: "GET", // or 'PUT'
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
            var o = data; //A la variable le asigno el json decodificado
            console.log(o);
            tabla = $("#example").DataTable({
                data: o,
                rowId: "id",
                searching: true,
                language: {
                    "lengthMenu": "Mostrar _MENU_ proyectos por página",
                    "zeroRecords": "Ningún proyecto encontrado",
                    "infoEmpty": "Ningún proyecto disponible",
                    "search": "Búscar",
                    "sInfo": "Mostrando proyectos del _START_ al _END_ de un total de _TOTAL_ proyectos",
                    "oPaginate": {
                        "sFirst": "Primero",
                        "sLast": "Último",
                        "sNext": "Siguiente",
                        "sPrevious": "Anterior"
                    },
                },
                order: [0, "desc"],
                columns: [
                    { data: "titulo" },
                    { data: "anioInicio" },
                    { data: "anioFin" },
                    { data: "fichaLista" },
                    { data: "coordinador" },
                ],
            });
        })

}


function getDatos(idPersonal, fichaLista) {
    fetch(`https://practica-supervisada.herokuapp.com/api/personal/personalxproyecto?id=${idPersonal}&fichaLista=${fichaLista}`, {
        method: "GET", // or 'PUT'
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
            var o = data; //A la variable le asigno el json decodificado
            console.log(o);
            tabla.destroy();
            tabla = $("#example").DataTable({
                data: o,
                rowId: "id",
                searching: true,
                language: {
                    "lengthMenu": "Mostrar _MENU_ proyectos por página",
                    "zeroRecords": "Ningún proyecto encontrado",
                    "infoEmpty": "Ningún proyecto disponible",
                    "search": "Búscar",
                    "sInfo": "Mostrando proyectos del _START_ al _END_ de un total de _TOTAL_ proyectos",
                    "oPaginate": {
                        "sFirst": "Primero",
                        "sLast": "Último",
                        "sNext": "Siguiente",
                        "sPrevious": "Anterior"
                    },
                },
                order: [0, "desc"],
                columns: [
                    { data: "titulo" },
                    { data: "anioInicio" },
                    { data: "anioFin" },
                    { data: "fichaLista" },
                    { data: "coordinador" },
                ],
            });
        })
    var cantidadDatos = tabla.data().count();
    console.log(cantidadDatos)
}

var idPesonal;
var fichaLista;

let filtrar = document.getElementById("btnFiltrar");
filtrar.addEventListener("click", e => {
    e.preventDefault();
    idPersonal = document.getElementById("txtPersonal").value;
    fichaLista = document.getElementById("fichaLista").value;
    getDatos(idPersonal, fichaLista);
})

let imprimir = document.getElementById("btnImprimir");
imprimir.addEventListener("click", e => {
    e.preventDefault();

    if (idPesonal === undefined && fichaLista === undefined) {
        localStorage.setItem("idPersonalImprimir", "24");
        localStorage.setItem("fichaLista", "");
    }
    else {
        localStorage.setItem("idPersonalImprimir", idPersonal);
        localStorage.setItem("fichaLista", fichaLista);
    }

    window.location = "impresionPersonal.html"
})











