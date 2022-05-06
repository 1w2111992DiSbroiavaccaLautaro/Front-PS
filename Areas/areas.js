$(document).ready(function () {
  var rol = localStorage.getItem("rol");
  if (rol != 1) {
    Swal.fire({
      icon: "error",
      title: "No esta Autorizado",
      showConfirmButton: false,
    });
    setInterval(() => {
      window.location = "../index.html";
    }, 100);
  } else {
    fetch("https://practica-supervisada.herokuapp.com/api/Area", {
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
    url: "https://practica-supervisada.herokuapp.com/api/Area",
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
        order: [0, "desc"],
        columns: [
          { data: "area1" },
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
    url: "https://practica-supervisada.herokuapp.com/api/Area",
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
        order: [0, "desc"],
        columns: [
          { data: "area1" },
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

//Editar
$(document).on("click", "#btnEditar", function (e) {
  e.preventDefault();
  //idEditado = $(this).parent().parent().children().first().text();

  fetch(`https://practica-supervisada.herokuapp.com/api/Area/${id}`, {
    method: "get",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      document.getElementById("txtAreaEditar").value = data.area1;
    });

  let editar = document.getElementById("btnGuardar");
  editar.addEventListener("click", (e) => {
    e.preventDefault();

    var datos = {
      id: id,
      area1: document.getElementById("txtAreaEditar").value,
    };
    console.log(datos);

    fetch(`https://practica-supervisada.herokuapp.com/api/Area`, {
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

//Eliminar
$(document).on("click", "#btnEliminar", function (e) {
  e.preventDefault();

  Swal.fire({
    title: "¿Desea Eliminar el Area?",
    showDenyButton: true,
    confirmButtonText: "Eliminar",
    denyButtonText: `Cancelar`,
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: `https://practica-supervisada.herokuapp.com/api/Area/${id}`,
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
        title: "Area Eliminada",
        showConfirmButton: false,
        timer: 2000,
      });
      // getTabla();
    } else if (result.isDenied) {
      Swal.fire({
        icon: "info",
        title: "Area no Eliminada",
        showConfirmButton: false,
        timer: 2000,
      });
      getTabla2();
    }
  });
});

//Agregar area
let area = document.getElementById("btnAgregar");
area.addEventListener("click", (e) => {
  e.preventDefault();
  var nuevaArea = document.getElementById("txtArea").value;
  if (nuevaArea === "") {
    Swal.fire({
      icon: "error",
      title: "Ingrese un area",
    });
    return false;
  } else {

    const datos = {
      area1: nuevaArea,
      activo: true
    };

    var url = "https://practica-supervisada.herokuapp.com/api/Area";
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
  }
});

document.addEventListener("DOMContentLoaded", function (event) {
  const showNavbar = (toggleId, navId, bodyId, headerId) => {
    const toggle = document.getElementById(toggleId),
      nav = document.getElementById(navId),
      bodypd = document.getElementById(bodyId),
      headerpd = document.getElementById(headerId);

    // Validate that all variables exist
    if (toggle && nav && bodypd && headerpd) {
      toggle.addEventListener("click", () => {
        // show navbar
        nav.classList.toggle("show");
        // change icon
        toggle.classList.toggle("bx-x");
        // add padding to body
        bodypd.classList.toggle("body-pd");
        // add padding to header
        headerpd.classList.toggle("body-pd");
      });
    }
  };
  showNavbar("header-toggle", "nav-bar", "body-pd", "header");
  /*===== LINK ACTIVE =====*/
  const linkColor = document.querySelectorAll(".nav_link");
  function colorLink() {
    if (linkColor) {
      linkColor.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");
    }
  }
  linkColor.forEach((l) => l.addEventListener("click", colorLink));
  // Your code to run since DOM is loaded and ready
});
