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
        fetch("https://practica-supervisada.herokuapp.com/api/Personal", {
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
        url: "https://practica-supervisada.herokuapp.com/api/Personal",
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
                order: [0, "asc"],
                columns: [
                    { data: "nombre" },
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
            console.log("Cargando");
        },
    });
}


function getTabla2() {
    $.ajax({
        url: "https://practica-supervisada.herokuapp.com/api/Personal",
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
                order: [0, "asc"],
                columns: [
                    { data: "nombre" },
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
            alert("No hay Areas");
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

    fetch(`https://practica-supervisada.herokuapp.com/api/Personal/${id}`, {
        method: "get",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            document.getElementById("txtPersonalEditar").value = data[0].nombre;
        });

    let editar = document.getElementById("btnGuardar");
    editar.addEventListener("click", (e) => {
        e.preventDefault();

        var datos = {
            id: id,
            nombre: document.getElementById("txtPersonalEditar").value,
        };
        console.log(datos);

        fetch(`https://practica-supervisada.herokuapp.com/api/Personal`, {
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
                        title: "Modificación exitosa",
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
        title: "¿Desea eliminar el personal?",
        showDenyButton: true,
        confirmButtonText: "Eliminar",
        denyButtonText: `Cancelar`,
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: `https://practica-supervisada.herokuapp.com/api/Personal/${id}`,
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
                title: "Personal Eliminado",
                showConfirmButton: false,
                timer: 2000,
            });
            // getTabla();
        } else if (result.isDenied) {
            Swal.fire({
                icon: "info",
                title: "Personal no eliminado",
                showConfirmButton: false,
                timer: 2000,
            });
            getTabla2();
        }
    });
});

//AGREGAR
let area = document.getElementById("btnAgregar");
area.addEventListener("click", (e) => {
    e.preventDefault();
    var nuevaArea = document.getElementById("txtNombre").value;
    if (nuevaArea === "") {
        Swal.fire({
            icon: "error",
            title: "Ingrese un nombre",
            showConfirmButton: false,
            timer: 1500,
        });
        return false;
    } else {

        const datos = {
            nombre: nuevaArea,
            activo: true
        };

        var url = "https://practica-supervisada.herokuapp.com/api/Personal";
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
                        title: "Inserción Exitosa",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    getTabla2();
                    document.getElementById("formulario").reset();
                }
            });
    }
});