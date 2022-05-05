$(document).ready(function () {
  var rol = localStorage.getItem("rol");
  var email = localStorage.getItem("email");
  if (email == null || email == "") {
    Swal.fire({
      icon: "error",
      title: "No está autorizado",
      showConfirmButton: false,
    });
    setInterval(() => {
      window.location = "../Login/index.html";
    }, 2000);
  } else {
    fetch("https://practica-supervisada.herokuapp.com/api/Usuarios", {
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
        hideSpinner();
        console.log(json);
        getTabla();
      });
  }
});

function cerrarSesion() {
  localStorage.setItem("token", 0);
}

function hideSpinner() {
  document.getElementById("spinner").style.display = "none";
  // document.getElementById("tabla").style.display = "none";
}

function getTabla() {
  $.ajax({
    url: "https://practica-supervisada.herokuapp.com/api/Usuarios",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "Content-Type": "application/json",
    },
    success: function (data) {
      var o = data; //A la variable le asigno el json decodificado
      console.log(o);
      tabla = $("#example").DataTable({
        data: o,
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
        order: [],
        columns: [
          { data: "email" },
          { data: "nombre" },
          { data: "rol" },
          {
            data: null,
            defaultContent:
              "<button id='btnEliminar' value='idReserva' class='btn btn-danger'><box-icon name='trash'></box-icon></button>" +
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
    url: "https://practica-supervisada.herokuapp.com/api/Usuarios",
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
        order: [],
        columns: [
          { data: "email" },
          { data: "nombre" },
          { data: "rol" },
          {
            data: null,
            defaultContent:
              "<button id='btnEliminar' value='idReserva' class='btn btn-danger'><box-icon name='trash'></box-icon></button>" +
              "<button id='btnEditar' data-toggle='modal' data-target='#exampleModalEditar' class='btn btn-primary'><box-icon name='edit'></box-icon></button>",
          },
        ],
      });
    },
    error: function (error) {
      alert("No hay Reservas");
    },
  });
}

//Eliminar
$(document).on("click", "#btnEliminar", function (e) {
  e.preventDefault();
  emailEliminado = $(this).parent().parent().children().first().text();

  Swal.fire({
    title: "¿Desea Eliminar el Usuario?",
    showDenyButton: true,
    confirmButtonText: "Eliminar",
    denyButtonText: `Cancelar`,
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: `https://practica-supervisada.herokuapp.com/api/Usuarios/${emailEliminado}`,
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
        title: "Usuario Eliminad",
        showConfirmButton: false,
        timer: 2000,
      });
      // getTabla();
    } else if (result.isDenied) {
      Swal.fire({
        icon: "info",
        title: "Usuario no Eliminado",
        showConfirmButton: false,
        timer: 2000,
      });
      getTabla2();
    }
  });
});

$(document).on("click", "#btnEditar", function (e) {
  e.preventDefault();
  emailUsuario = $(this).parent().parent().children().first().text();
  var idCambiar = 0;

  fetch(
    `https://practica-supervisada.herokuapp.com/api/Usuarios/${emailUsuario}`,
    {
      method: "get",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      document.getElementById("txtSelect").value = data[0].idRol;
      idCambiar = data[0].id;
    });

  let editar = document.getElementById("btnGuardar");
  editar.addEventListener("click", (e) => {
    e.preventDefault();

    var datos = {
      id: idCambiar,
      rol: document.getElementById("txtSelect").value,
    };
    console.log(datos);

    fetch(`https://practica-supervisada.herokuapp.com/api/Usuarios/UpdateRol`, {
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
          localStorage.setItem(
            "rol",
            document.getElementById("txtSelect").value
          );
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
