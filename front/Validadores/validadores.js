$(document).ready(function () {
    var rol = localStorage.getItem("rol");
    if (rol != 1) {
        Swal.fire({
            icon: "error",
            title: "No esta autorizado",
            showConfirmButton: false,
        });
        setInterval(() => {
            window.location = "/Login/index.html";
        }, 2000);
    } else {
        fetch("https://practica-supervisada.herokuapp.com/api/validador", {
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
                    title: "Sesión expirada",
                    showConfirmButton: false,
                });
                setInterval(() => {
                    window.location = "/Login/index.html";
                }, 2000);
                return false;
            })
            .then((json) => {
                console.log(json);
                getTabla();
            });
    }
});

function getTabla() {
    $.ajax({
        url:
            "https://practica-supervisada.herokuapp.com/api/validador",
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
                bPaginate: false,
                bLengthChange: false,
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
                searching: false,
                bInfo: false,
                order: [],
                columns: [
                    { data: "nombre" },
                    { data: "titulo" },
                    {
                        data: null,
                        defaultContent:
                            "<button id='btnEliminar' class='btn btn-danger'><box-icon name='trash'></box-icon></button>" +
                            "<button id='btnEditar' data-bs-toggle='modal' data-bs-target='#exampleModalEditar' class='btn btn-primary'><box-icon name='edit'></box-icon></button>",
                    },
                ],
            });
        },
        error: function (error) {
            alert("No hay Reservas");
        },
    });
}


function getTabla2() {
    $.ajax({
        url:
            "https://practica-supervisada.herokuapp.com/api/validador",
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
                bPaginate: false,
                bLengthChange: false,
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
                searching: false,
                bInfo: false,
                order: [],
                columns: [
                    { data: "nombre" },
                    { data: "titulo" },
                    {
                        data: null,
                        defaultContent:
                            "<button id='btnEliminar' class='btn btn-danger'><box-icon name='trash'></box-icon></button>" +
                            "<button id='btnEditar' data-bs-toggle='modal' data-bs-target='#exampleModalEditar' class='btn btn-primary'><box-icon name='edit'></box-icon></button>",
                    },
                ],
            });
        },
        error: function (error) {
            alert("No hay Reservas");
        },
    });
}

var id = 0;
$("#example").on("click", "tr", function () {
    // Get the rows id value
    id = tabla.row(this).id();
    // Filter for only numbers
    id = id.replace(/\D/g, "");
    // Transform to numeric value
    id = parseInt(id, 10);
    console.log(id);
});

//EDITAR
$(document).on("click", "#btnEditar", function (e) {
    e.preventDefault();
    //idEditado = $(this).parent().parent().children().first().text();

    fetch(`https://practica-supervisada.herokuapp.com/api/Validador/${id}`, {
        method: "GET",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            document.getElementById("txtNombreEditar").value = data.nombre;
            document.getElementById("txtTituloEditar").value = data.titulo;
        });

    let editar = document.getElementById("btnGuardar");
    editar.addEventListener("click", (e) => {
        e.preventDefault();

        var datos = {
            id: id,
            nombre: document.getElementById("txtNombreEditar").value,
            titulo: document.getElementById("txtTituloEditar").value
        };

        console.log(datos);

        fetch(`https://practica-supervisada.herokuapp.com/api/Validador`, {
            method: "PUT", // or 'PUT'
            body: JSON.stringify(datos), // data can be `string` or {object}!
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json",
            },
        })
            .then((res) => res)
            .then((data) => {
                if (data.status == 200) {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Modificacion Exitosa",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    getTabla2();
                    $('#exampleModalEditar').modal('toggle');
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Complete los campos",
                    });
                    return false;
                }
            });
    });
});

//ELIMINAR
$(document).on("click", "#btnEliminar", function (e) {
    e.preventDefault();

    Swal.fire({
        title: "¿Desea Eliminar al Validador?",
        showDenyButton: true,
        confirmButtonText: "Eliminar",
        denyButtonText: `Cancelar`,
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: `https://practica-supervisada.herokuapp.com/api/Validador/${id}`,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
                type: "DELETE",
                dataType: "json",
                success: function (result) {
                    console.log(result);
                    if (result) {
                        getTabla2();
                    } else {
                        //Swal.fire(result.error);
                        console.log(result.error);
                    }
                },
                error: function (error) {
                    console.log(error);
                },
            });
            Swal.fire({
                icon: "success",
                title: "Validador Eliminado",
                showConfirmButton: false,
                timer: 2000,
            });
            // getTabla();
        } else if (result.isDenied) {
            Swal.fire({
                icon: "info",
                title: "Validador no Eliminado",
                showConfirmButton: false,
                timer: 2000,
            });
            getTabla2();
        }
    });
});

//AGREGAR VALIDADOR
let agregar = document.getElementById("btnAgregar");
agregar.addEventListener("click", (e) => {
    e.preventDefault();
    var nombre = document.getElementById("txtNombre").value;
    var titulo = document.getElementById("txtTitulo").value;

    if (nombre == "" || titulo == "") {
        Swal.fire({
            icon: "error",
            title: "Complete los Campos",
            showConfirmButton: false,
            timer: 1500
        });
        return false;
    }

    const datos = {
        nombre: nombre,
        titulo: titulo,
        activo: true
    };

    var url = "https://practica-supervisada.herokuapp.com/api/Validador";
    fetch(url, {
        method: "POST", // or 'PUT'
        body: JSON.stringify(datos), // data can be `string` or {object}!
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
        },
    })
        .then((res) => res)
        //.catch((error) => console.error("Error:", error))
        .then((data) => {
            if (data.status == 200) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Insercion Exitosa",
                    showConfirmButton: false,
                    timer: 1500,
                });
                getTabla2();
                document.getElementById("formulario").reset();


            }
        });
})