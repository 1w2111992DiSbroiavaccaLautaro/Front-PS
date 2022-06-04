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
        fetch("https://practica-supervisada.herokuapp.com/api/Proyecto/presupuestoxProyecto", {
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
                getTabla();
            });
    }
});

function cerrarSesion() {
    localStorage.setItem("token", 0);
}

function hideSpinner() {
    document.getElementById("spinner").style.display = "none";
}

function getTabla() {
    $.ajax({
        url: "https://practica-supervisada.herokuapp.com/api/Proyecto/presupuestoxProyecto",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
        },
        success: function (data) {
            var o = data; //A la variable le asigno el json decodificado
            console.log(o);
            tabla = $("#example").DataTable({
                data: o,
                rowId: "id",
                columnDefs: [
                    {
                        "targets": 2, // your case first column
                        "className": "text-right",
                    },
                    {
                        "targets": 3,
                        "className": "text-right",
                    },
                    {
                        "targets": 4,
                        "className": "text-right",
                    },
                    {
                        "targets": 5,
                        "className": "text-right",
                    },
                    {
                        "targets": 6,
                        "className": "text-right",
                    },
                ],
                searching: true,
                language: {
                    "lengthMenu": "Mostrar _MENU_ registros por página",
                    "zeroRecords": "Ningún registro encontrado",
                    "infoEmpty": "Ningún registro disponible",
                    "search": "Búscar",
                    "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                    "oPaginate": {
                        "sFirst": "Primero",
                        "sLast": "Último",
                        "sNext": "Siguiente",
                        "sPrevious": "Anterior"
                    },
                },
                columns: [
                    { data: "titulo" },
                    { data: "depto" },
                    { data: "honorario" },
                    { data: "viatico" },
                    { data: "equipamiento" },
                    { data: "gastos" },
                    { data: "montototal" },
                    { data: "divisa" },
                ],
            });
        },
        error: function (error) {
            console.log("Cargando");
        },
    });
}

function getTabla2(desde, hasta, depto) {
    $.ajax({
        url: `https://practica-supervisada.herokuapp.com/api/Proyecto/presupuestoxProyecto?AnioDesde=${desde}&AnioFin=${hasta}&Depto=${depto}`,
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
        },
        success: function (data) {
            var o = data; //A la variable le asigno el json decodificado
            console.log(o);
            tabla.destroy();
            tabla = $("#example").DataTable({
                data: o,
                rowId: "id",
                searching: true,
                language: {
                    "lengthMenu": "Mostrar _MENU_ registros por página",
                    "zeroRecords": "Ningún registro encontrado",
                    "infoEmpty": "Ningún registro disponible",
                    "search": "Búscar",
                    "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                    "oPaginate": {
                        "sFirst": "Primero",
                        "sLast": "Último",
                        "sNext": "Siguiente",
                        "sPrevious": "Anterior"
                    },
                },
                columns: [
                    { data: "titulo" },
                    { data: "depto" },
                    { data: "honorario" },
                    { data: "viatico" },
                    { data: "equipamiento" },
                    { data: "gastos" },
                    { data: "montototal" },
                    { data: "divisa" },
                ],
            });
        },
        error: function (error) {
            console.log("Cargando");
        },
    });
}

let filtrar = document.getElementById("btnFiltrar");
filtrar.addEventListener("click", e => {
    e.preventDefault();
    getDatos();
})

function getDatos() {
    var desde = document.getElementById("txtAnioDesde").value;
    var hasta = document.getElementById("txtAnioHasta").value;
    var depto = document.getElementById("txtDepto").value;

    if (desde == "" && hasta == "") {
        // Swal.fire({
        //     icon: "error",
        //     title: "Ingrese un Año valido",
        //     showConfirmButton: true,
        // });
        // return false;
        getTabla2(1000, 3000, depto);
    }
    else {
        if (!/^(1[9-9][6-9][0-9]|20[0-9][0-9]|2100)$/.test(desde) || !/^(1[9-9][6-9][0-9]|20[0-9][0-9]|2100)$/.test(hasta)) {
            Swal.fire({
                icon: "error",
                title: "Ingrese un Año valido",
                showConfirmButton: true,
            });
            return false;
        }
        else {
            getTabla2(desde, hasta, depto);
        }
    }
}

let quitar = document.getElementById("btnQuitar");
quitar.addEventListener("click", e => {
    e.preventDefault();
    document.getElementById("txtAnioDesde").value = "";
    document.getElementById("txtAnioHasta").value = "";
    document.getElementById("txtDepto").value = "";

    getTabla2(1000, 3000, "");
})