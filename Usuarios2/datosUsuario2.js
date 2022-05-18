$(document).ready(function () {
  var rol = localStorage.getItem("rol");

  // if (email == null || email == "") {
  //   Swal.fire({
  //     icon: "error",
  //     title: "No esta autorizado",
  //     showConfirmButton: false,
  //   });
  //   setInterval(() => {
  //     window.location = "/Login/index.html";
  //   }, 2000);
  // } else {
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
        window.location = "../index.html";
      }, 2000);
      return false;
    })
    .then((json) => {
      console.log(json);
      getTabla();
    });

});

function cerrarSesion() {
  localStorage.setItem("token", 0);
}


var usuarioId = localStorage.getItem("idUsuario");
var email = localStorage.getItem("email");

function getTabla() {
  $.ajax({
    url:
      "https://practica-supervisada.herokuapp.com/api/Usuarios/" + email,
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "Content-Type": "application/json",
    },
    success: function (data) {
      var o = data; //A la variable le asigno el json decodificado
      console.log(o);
      tabla = $("#example").DataTable({
        data: o,
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
          { data: "email" },
          { data: "nombre" },
          { data: "rol" },
          {
            data: null,
            defaultContent:
              "<button id='btnEditar' data-bs-toggle='modal' data-bs-target='#exampleModalEditar' class='btn btn-primary'><box-icon name='edit'></box-icon></button>" +
              "<button id='btnCambiarPass' data-bs-toggle='modal' data-bs-target='#exampleModalPassword' class='btn btn-secondary'><box-icon name='low-vision'></box-icon></button>",
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
      "https://practica-supervisada.herokuapp.com/api/Usuarios/" + email,
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
        searching: false,
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
        bLengthChange: false,
        bInfo: false,
        order: [],
        columns: [
          { data: "email" },
          { data: "nombre" },
          { data: "rol" },
          {
            data: null,
            defaultContent:
              "<button id='btnEditar' data-toggle='modal' data-target='#exampleModalEditar' class='btn btn-primary'><box-icon name='edit'></box-icon></button>" +
              "<button id='btnCambiarPass' data-bs-toggle='modal' data-bs-target='#exampleModalPassword' class='btn btn-secondary'><box-icon name='low-vision'></box-icon></button>",
          },
        ],
      });
    },
    error: function (error) {
      alert("No hay Reservas");
    },
  });
}

//Cambiar Password
$(document).on("click", "#btnCambiarPass", function (e) {
  e.preventDefault();

  let guardarPassword = document.getElementById("btnCambiarPassword");
  guardarPassword.addEventListener("click", (e) => {
    e.preventDefault();

    var vieja = document.getElementById("txtPassVieja").value;
    var nueva = document.getElementById("txtPassNueva").value;
    var passwordRegex = /^(?=.*[az]).{8,20}$/


    if (vieja == "" || nueva == "") {
      Swal.fire({
        icon: "error",
        title: "Complete los campos",
      });
      return false;
    } else if (nueva === vieja) {
      Swal.fire({
        icon: "error",
        title: "Las password nueva debe ser diferente a la password antigua",
      });
      return false;
    } else if (passwordRegex.test(nueva)) {
      var datosPassword = {
        email: email,
        passwordVieja: vieja,
        passwordNueva: nueva,
      };
      $.ajax({
        url: `https://practica-supervisada.herokuapp.com/api/Usuarios/UpdatePassword`,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        type: "PUT",
        data: JSON.stringify(datosPassword),
        dataType: "json",
        success: function (result) {
          console.log(result);
          if (result.ok) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Modificacion Exitosa",
              showConfirmButton: false,
              timer: 1500,
            });
            getTabla2();
            localStorage.setItem("token", 0);
            setInterval(() => {
              window.location = "../index.html";
            }, 2000);
          } else {
            Swal.fire({
              icon: "error",
              title: result.error,
            });
          }
        },
        error: function (error) {
          console.log(error);
        },
      });
    }
    else {
      Swal.fire({
        icon: 'error',
        title: 'Ingrese un password valido',
        text: "El password debe tener entre 8 y 20 caracteres"
      })
      return false;
    }
  });
});

// Editar
$(document).on("click", "#btnEditar", function (e) {
  e.preventDefault();
  //idEditado = $(this).parent().parent().children().first().text();

  fetch(
    `https://practica-supervisada.herokuapp.com/api/Usuarios/${email}`,
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
      document.getElementById("txtEmail").value = data[0].email;
      document.getElementById("txtNombre").value = data[0].nombre;
    });

  let editar = document.getElementById("btnGuardar");
  editar.addEventListener("click", (e) => {
    e.preventDefault();

    var datos = {
      id: parseInt(usuarioId),
      email: document.getElementById("txtEmail").value,
      nombre: document.getElementById("txtNombre").value,
    };
    console.log(datos);

    if (document.getElementById("txtEmail").value === "" || document.getElementById("txtNombre").value === "") {
      Swal.fire({
        icon: "error",
        title: "Complete los campos",
      });
      return false;
    }

    fetch(
      `https://practica-supervisada.herokuapp.com/api/Usuarios/UpdateCredenciales`,
      {
        method: "PUT", // or 'PUT'
        body: JSON.stringify(datos), // data can be `string` or {object}!
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      }
    )
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
          setInterval(() => {
            location = "/index.html";
          }, 2000)
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
