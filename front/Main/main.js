$(document).ready(function () {
  var rol = localStorage.getItem("rol");
  if (rol != 1) {
    Swal.fire({
      icon: "error",
      title: "No esta autorizado",
      showConfirmButton: false,
    });
    setInterval(() => {
      window.location = "/index.html";
    }, 100);
  } else {
    fetch("https://proyecto-fundacion.herokuapp.com/api/Areas", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        cargarComboAreas(data);
      });

    fetch("https://practica-supervisada.herokuapp.com/api/proyecto/tabla", {
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
          window.location = "/Login/index.html";
        }, 2000);
        return false;
      })
      .then((json) => {
        console.log(json);
        getTabla();
        hideSpinner();
      });
  }

  function cargarComboAreas(datos) {
    var html = "<option value=''>Áreas</option>";
    $("#txtAreas").append(html);
    select = document.getElementById("txtAreas");
    for (let i = 0; i < datos.length; i++) {
      var option = document.createElement("option");
      option.value = datos[i].id;
      option.text = datos[i].area1;
      select.add(option);
      //console.log(datos[i].area1);
    }
  }
});

function hideSpinner() {
  document.getElementById("spinner").style.display = "none";
}

function cerrarSesion() {
  localStorage.setItem("token", 0);
  localStorage.setItem("email", "");
}

function getTabla() {
  $.ajax({
    url: "https://practica-supervisada.herokuapp.com/api/proyecto/tabla",
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
        rowId: "id",
        order: [],
        columns: [
          // { data: "id" },
          { data: "titulo" },
          { data: "paisRegion" },
          // { data: "moneda" },
          // { data: "montoContrato" },
          { data: "anioInicio" },
          { data: "anioFinalizacion" },
          { data: "listaAreas[ - ].area1" },
          { data: "departamento" },
          {
            data: null,
            defaultContent:
              "<button id='btnEliminar' class='btn btn-danger'><box-icon name='trash'></box-icon></button>" +
              "<button id='btnEditar' data-toggle='modal' data-target='#exampleModalEditar' class='btn btn-primary'><box-icon name='edit'></box-icon></button>",
          },
        ],
      });
    },
  });
}

function getTabla2() {
  $.ajax({
    url: "https://practica-supervisada.herokuapp.com/api/proyecto/tabla",
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
        rowId: "id",
        order: [],
        columns: [
          // { data: "id" },
          { data: "titulo" },
          { data: "paisRegion" },
          // { data: "moneda" },
          // { data: "montoContrato" },
          { data: "anioInicio" },
          { data: "anioFinalizacion" },
          { data: "listaAreas[ - ].area1" },
          { data: "departamento" },
          {
            data: null,
            defaultContent:
              "<button id='btnEliminar' value='id' class='btn btn-danger'><box-icon name='trash'></box-icon></button>" +
              "<button id='btnEditar' data-toggle='modal' data-target='#exampleModalEditar' class='btn btn-primary'><box-icon name='edit'></box-icon></button>",
          },
        ],
      });
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

//------------------EDITAR----------------------
$(document).on("click", "#btnEditar", function (e) {
  e.preventDefault();
  localStorage.setItem("idFicha", id);
  window.location = "editarFicha.html";
});

//Eliminar
$(document).on("click", "#btnEliminar", function (e) {
  e.preventDefault();

  Swal.fire({
    title: "¿Desea Eliminar la Ficha?",
    showDenyButton: true,
    confirmButtonText: "Eliminar",
    denyButtonText: `Cancelar`,
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: `https://practica-supervisada.herokuapp.com/api/proyecto/${id}`,
        type: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
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
        title: "Ficha Eliminada",
        showConfirmButton: false,
        timer: 2000,
      });
      // getTabla();
    } else if (result.isDenied) {
      Swal.fire({
        icon: "info",
        title: "Ficha no Eliminada",
        showConfirmButton: false,
        timer: 2000,
      });
      getTabla2();
    }
  });
});


// -----------------------------FILTRADO---------------------------------

function getTablaFiltrada() {

  var departamento = document.getElementById("txtDepartamento").value;
  var desde = document.getElementById("txtDesde").value;
  var hasta = document.getElementById("txtHasta").value;
  var paisRegion = document.getElementById("txtPaisRegion").value;
  var area = document.getElementById("txtAreas").value

  if (desde == "" && hasta == "") {
    tablaFiltrada(departamento, desde, hasta, paisRegion, area);
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
      tablaFiltrada(departamento, desde, hasta, paisRegion, area);

    }
  }

}

function tablaFiltrada(departamento, desde, hasta, paisRegion, area) {
  $.ajax({
    url: `https://practica-supervisada.herokuapp.com/api/proyecto/tabla?Pais=${paisRegion}&AnioInicio=${desde}&AnioFin=${hasta}&Area=${area}&Departamento=${departamento}`,
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
        rowId: "id",
        order: [],
        columns: [
          // { data: "id" },
          { data: "titulo" },
          { data: "paisRegion" },
          // { data: "moneda" },
          // { data: "montoContrato" },
          { data: "anioInicio" },
          { data: "anioFinalizacion" },
          { data: "listaAreas[ - ].area1" },
          { data: "departamento" },
          {
            data: null,
            defaultContent:
              "<button id='btnEliminar' value='id' class='btn btn-danger'><box-icon name='trash'></box-icon></button>" +
              "<button id='btnEditar' data-toggle='modal' data-target='#exampleModalEditar' class='btn btn-primary'><box-icon name='edit'></box-icon></button>",
          },
        ],
      });
    },
  });
}

let filtrar = document.getElementById("btnFiltrar");
filtrar.addEventListener("click", (e) => {
  e.preventDefault();
  getTablaFiltrada();
})


let eliminarFiltros = document.getElementById("btnEliminarFiltros");
eliminarFiltros.addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("txtDepartamento").value = "";
  document.getElementById("txtDesde").value = "";
  document.getElementById("txtHasta").value = "";
  document.getElementById("txtPaisRegion").value = "";
  document.getElementById("txtAreas").value = "";
  getTabla2();
})


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