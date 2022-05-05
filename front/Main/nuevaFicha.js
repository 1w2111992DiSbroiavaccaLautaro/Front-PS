$(document).ready(function () {
  fichaSeleccionada();
  let token = localStorage.getItem("token");
  if (token === "0" || token === "") {
    Swal.fire({
      icon: "error",
      title: "Ingrese al sistema primero",
      showConfirmButton: false,
    });
    setInterval(() => {
      window.location = "../Login/index.html";
    }, 2000);
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

    fetch("https://proyecto-fundacion.herokuapp.com/api/Personal", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        cargarComboPersonal(data);
      });

    function cargarComboAreas(datos) {
      var html = "<option value=''>Seleccione</option>";
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
  }
});

let cancelar = document.getElementById("cancelar");
cancelar.addEventListener("click", () => {
  window.location = "../Main/main.html";
});

$("#myModal").on("shown.bs.modal", function () {
  $("#myInput").trigger("focus");
});

// -------------------------AREAS-----------------------------
let areas = [];
var objAreas = [];
var selectAreas;
function imprimirValorAreas() {
  selectAreas = document.getElementById("txtAreas");
  var selectSeleccionado = selectAreas.options[selectAreas.selectedIndex].text;
  var options = document.getElementById("idOpcionArea");
  console.log(selectAreas.value);

  if (selectAreas.value == "") {
    return false;
  } else {
    areas.push(selectAreas.value);
    objAreas.push({
      idArea: selectAreas.value,
    });
    console.log(objAreas);
  }
}

//cargar tabla areas y remover

let btnAgregarArea = document.getElementById("btnAgregarArea");

btnAgregarArea.addEventListener("click", cargarTablaArea);
btnAgregarArea.addEventListener("click", mostrarDatosArea);
btnAgregarArea.addEventListener("click", mostrarDatos2Area);

var indexArea = 0;
function removerArea(areaIndex, areaId) {
  const eliminadoArea = objAreas.findIndex((object) => {
    return object.idArea == areaId;
  });

  console.log(eliminadoArea);
  let area = objAreas.splice(eliminadoArea, 1);
  console.log(area);
  console.log(objAreas);

  $("#rowArea" + areaIndex)
    .closest("tr")
    .remove();
}

// $(document).on("click", "#btnEliminarArea", function (e) {
//   e.preventDefault();

//   id = $(this).parent().parent().children().first().text();

//   const eliminadoArea = objAreas.findIndex((object) => {
//     return object.area1 === id;
//   });

//   console.log(eliminadoArea);
//   let area = objAreas.splice(eliminadoArea, 1);
//   console.log(area);
//   console.log(objAreas);
// });

function cargarTablaArea() {
  var area = document.getElementById("txtAreas").value;
  var combo = document.getElementById("txtAreas");
  var nombre = combo.options[combo.selectedIndex].text;

  if (area == "null") {
    Swal.fire({
      icon: "error",
      title: "Seleccione un Area",
    });
    return false;
  }

  var fila =
    '<tr id="rowArea' +
    indexArea +
    '"><td>' +
    nombre +
    '</td><td><button onclick="removerArea(' +
    indexArea +
    "," +
    area +
    ')" id="btnEliminarArea" class="btn btn-danger" type=button><box-icon name="trash"></box-icon></button></td></tr>';

  indexArea++;

  $("#mytableArea tr:first").after(fila);
}

function mostrarDatosArea() {
  for (let row of mytableArea.rows) {
    for (let cell of row.cells) {
      console.log(cell);
      console.log(cell.textContent);
      console.log(cell.firstChild);
    }
  }
}

function mostrarDatos2Area() {
  $("#mytableArea tr").each(function () {
    $(this)
      .find("td")
      .each(function () {
        console.log($(this));
      });
  });
}

// ---------------------------PERSONAL-------------------------------------

$(document).on("click", "#txtCordinador", function (personaId) {
  var persona = personaId.target.value;
  if ($(this).is(':checked')) {
    for (const obj of objPersonal) {
      if (obj.idPersonal == persona) {
        obj.coordinador = true;
        break;
      }
      //coordinadorOpcion = false;
    }
  } else {
    for (const obj of objPersonal) {
      if (obj.idPersonal == persona) {
        obj.coordinador = false;
        break;
      }
      //coordinadorOpcion = false;
    }
  }
});

let personal = [];
var objPersonal = [];
var select;
function imprimirValorPersonal() {
  select = document.getElementById("txtPersonal");
  var options = document.getElementById("idOpcionPersonal");
  if (select.value == "") {
    return false;
  } else {
    var coordinadorOpcion = false;
    personal.push(select.value);
    objPersonal.push({
      idPersonal: select.value,
      coordinador: coordinadorOpcion,
    });
    console.log(objPersonal);
  }
  //coordinadorOpcion = null;
  console.log(select.value);
}

var i = 0;
function removerPersonal(index, personalId) {
  const eliminado = objPersonal.findIndex((object) => {
    return object.idPersonal == personalId;
  });

  console.log(eliminado);
  let a = objPersonal.splice(eliminado, 1);
  console.log(a);
  console.log(objPersonal);

  $("#row" + index)
    .closest("tr")
    .remove();
}

let btnAgregarPersonal = document.getElementById("btnAgregarPersonal");

btnAgregarPersonal.addEventListener("click", cargarTabla);
btnAgregarPersonal.addEventListener("click", mostrarDatos);
btnAgregarPersonal.addEventListener("click", mostrarDatos2);

function cargarTabla() {
  var personal = document.getElementById("txtPersonal").value;
  var combo = document.getElementById("txtPersonal");
  var nombre = combo.options[combo.selectedIndex].text;

  if (personal == "null") {
    Swal.fire({
      icon: "error",
      title: "Seleccione un Personal",
    });
    return false;
  }

  var fila =
    '<tr id="row' +
    i +
    '"><td>' +
    nombre +
    '</td><td><input type=checkbox value=' + personal + ' id="txtCordinador" /></td><td><button id="btnEliminarPersonal" class="btn btn-danger" onclick="removerPersonal(' +
    i +
    "," +
    personal +
    ')" type=button><box-icon name="trash"></box-icon></button></td></tr>';

  i++;

  $("#mytable tr:first").after(fila);
}

function mostrarDatos() {
  for (let row of mytable.rows) {
    for (let cell of row.cells) {
      console.log(cell);
      console.log(cell.textContent);
      console.log(cell.firstChild);
    }
  }
}

function mostrarDatos2() {
  $("#mytable tr").each(function () {
    $(this)
      .find("td")
      .each(function () {
        console.log($(this));
      });
  });
}

// ---------------------PUBLICACIONES----------------------------
var indexPublicacion = 0;
let publicacionBtn = document.getElementById("btnPublicacion");

let publicacion = [];
var objPublicacion = [];
// var select;
var iPubli = 0;

function imprimirValorPublicacion() {
  var txtPubli = document.getElementById("txtPublicacion").value;
  var anio = document.getElementById("txtAnioPubli").value;
  var codigoBcs = document.getElementById("txtCodigoBcs").value;
  if (anio === "" || codigoBcs === "" || txtPubli === "") {
    Swal.fire({
      icon: "error",
      title: "Complete los campos",
      showConfirmButton: true,
    });
    return false;
  }
  if (
    !/^([0-9])*$/.test(anio) ||
    !/^(1[7-9][0-9][0-9]|20[0-9][0-9]|2100)$/.test(anio)
  ) {
    Swal.fire({
      icon: "error",
      title: "Ingrese un Año valido",
      showConfirmButton: true,
    });
    return false;
  }
  if (!/^([0-9])*$/.test(codigoBcs)) {
    Swal.fire({
      icon: "error",
      title: "Ingrese un Códigooooooo BCS valido",
      text: "El Código debe ser unicamente numerico",
      showConfirmButton: false,
    });
    return false;
  } else {
    //publicacion.push(select.value);
    objPublicacion.push({
      idProyecto: iPubli,
      publicacion: txtPubli,
      año: anio,
      codigobcs: codigoBcs,
    });
    console.log(objPublicacion);
    iPubli++;
    document.getElementById("formPublicacion").reset();
  }
}

publicacionBtn.addEventListener("click", (e) => {
  e.preventDefault();
  cargarTablaPublicacion();
  imprimirValorPublicacion();
});
publicacionBtn.addEventListener("click", mostrarDatosPublicacion());
publicacionBtn.addEventListener("click", mostrarDatos2Publicacion());

// function removerPublicacion(pubicacionIdex) {
//     $('#rowPubli' + pubicacionIdex).closest('tr').remove();
// }

var removido = 0;
const removerPublicacion = (pubicacionIdex, codigoRemover) => {
  const codigo = codigoRemover.toString();
  const eliminadoPublicacion = objPublicacion.findIndex((object) => {
    return object.codigobcs === codigo;
  });

  console.log(eliminadoPublicacion);
  let p = objPublicacion.splice(eliminadoPublicacion, 1);
  console.log(p);
  console.log(objPublicacion);
  codigoBcs = 0;

  $("#rowPubli" + pubicacionIdex)
    .closest("tr")
    .remove();
  removido = pubicacionIdex;
};

var masInfo = 0;
const funcionMasInfo = (j) => {
  console.log(j);
  masInfo = j;
};

function cargarTablaPublicacion() {
  var txtPubli = document.getElementById("txtPublicacion").value;
  var anio = document.getElementById("txtAnioPubli").value;
  var codigoBcs = document.getElementById("txtCodigoBcs").value;
  if (anio === "" || codigoBcs === "" || txtPubli === "") {
    Swal.fire({
      icon: "error",
      title: "Complete los campos",
      showConfirmButton: false,
    });
    return false;
  }
  if (
    !/^([0-9])*$/.test(anio) ||
    !/^(1[7-9][0-9][0-9]|20[0-9][0-9]|2100)$/.test(anio)
  ) {
    Swal.fire({
      icon: "error",
      title: "Ingrese un Año valido",
      showConfirmButton: true,
    });
    return false;
  }
  if (!/^([0-9])*$/.test(codigoBcs)) {
    Swal.fire({
      icon: "error",
      title: "Ingrese un Código BCS valido",
      text: "El Código debe ser unicamente numerico",
      showConfirmButton: true,
    });
    return false;
  } else {
    var fila =
      '<tr id="rowPubli' +
      indexPublicacion +
      '"><td>' +
      anio +
      "</td><td>" +
      codigoBcs +
      '</td><td><button class="btn btn-danger" id="btnEliminarPublicacion" onclick="removerPublicacion(' +
      indexPublicacion +
      "," +
      codigoBcs +
      ')" type=button><box-icon name="trash"></box-icon></button>' +
      '<button data-toggle="modal" data-target="#exampleModal2" id="btnMasInfo" onclick="funcionMasInfo( ' +
      indexPublicacion +
      ')" class="btn btn-secondary" type="button"><box-icon name="info-circle"></box-icon></button></td></tr>';

    indexPublicacion++;

    $("#mytablePublicacion tr:first").after(fila);

  }
}

function mostrarDatosPublicacion() {
  for (let row of mytablePublicacion.rows) {
    for (let cell of row.cells) {
      console.log(cell);
      console.log(cell.textContent);
      console.log(cell.firstChild);
    }
  }
}

function mostrarDatos2Publicacion() {
  $("#mytablePublicacion tr").each(function () {
    $(this)
      .find("td")
      .each(function () {
        console.log($(this));
      });
  });
}


$(document).on("click", "#btnMasInfo", function (e) {
  e.preventDefault();
  console.log(masInfo);
  document.getElementById("txtPublicacion2").disabled = true;
  document.getElementById("txtAnioPubli2").disabled = true;
  document.getElementById("txtCodigoBcs2").disabled = true;

  objPublicacion.forEach((element) => {
    if (element.idProyecto == masInfo) {
      document.getElementById("txtPublicacion2").value = element.publicacion;
      document.getElementById("txtAnioPubli2").value = element.año;
      document.getElementById("txtCodigoBcs2").value = element.codigobcs;
    }
  });
});

// --------------------PRESUPUESTO--------------------------

let presupuestos = [];
var objPresupuesto = [];
//var idPresupuesto = 0;
var iPresupuesto = 0;
function imprimirValorPresupuesto() {
  var viaticos = document.getElementById("txtViaticos").value;
  var equipamientos = document.getElementById("txtEquipo").value;
  var gastos = document.getElementById("txtGastos").value;
  var honorarios = document.getElementById("txtHonorario").value;
  var divisa = document.getElementById("txtDivisa");
  var divisaSeleccionada = divisa.options[divisa.selectedIndex].text;
  var montoTotal =
    parseFloat(viaticos) +
    parseFloat(equipamientos) +
    parseFloat(honorarios) -
    parseFloat(gastos);

  objPresupuesto.push({
    honorario: parseFloat(honorarios),
    viatico: parseFloat(viaticos),
    equipamiento: parseFloat(equipamientos),
    gastos: parseFloat(gastos),
    idProyecto: iPresupuesto,
    divisa: divisaSeleccionada,
    montototal: montoTotal,
  });
  iPresupuesto++;
  console.log(objPresupuesto);
  document.getElementById("formPresupuesto").reset();
}

let btnAgregarPresupuesto = document.getElementById("btnPresupuesto");


btnAgregarPresupuesto.addEventListener("click", cargarTablaPresupuesto);
btnAgregarPresupuesto.addEventListener("click", imprimirValorPresupuesto);
btnAgregarPresupuesto.addEventListener("click", mostrarDatosPresupuesto);
btnAgregarPresupuesto.addEventListener("click", mostrarDatos2Presupuesto);

var indexPresupuesto = 0;

function removerPresupuesto(presupuestoIndex, presupuestoId) {
  const eliminadoArea = objPresupuesto.findIndex((object) => {
    return object.idProyecto == presupuestoId;
  });

  console.log(eliminadoArea);
  let presupuesto = objPresupuesto.splice(eliminadoArea, 1);
  console.log(presupuesto);
  console.log(objPresupuesto);

  $("#rowPresupuesto" + presupuestoIndex)
    .closest("tr")
    .remove();
}

function cargarTablaPresupuesto() {
  var viaticos = document.getElementById("txtViaticos").value;
  var equipamientos = document.getElementById("txtEquipo").value;
  var gastos = document.getElementById("txtGastos").value;
  var honorarios = document.getElementById("txtHonorario").value;
  var divisa = document.getElementById("txtDivisa");
  var divisaSeleccionada = divisa.options[divisa.selectedIndex].text;
  var montoTotal =
    parseFloat(viaticos) +
    parseFloat(equipamientos) +
    parseFloat(honorarios) -
    parseFloat(gastos);

  //var fila = '<tr id="rowPresupuesto' + indexArea + '"><td>' + nombre + '</td><td><button onclick="removerArea(' + indexArea + "," + area + ')" id="btnEliminarArea" class="btn btn-secondary" type=button><box-icon name="trash"></box-icon></button></td></tr>';

  // var fila = `<tr id="rowPresupuesto${indexPresupuesto}"><td>${montoTotal}</td><td>${divisaSeleccionada}</td><td>${gastos}</td><td><button onclick="removerPresupuesto(${indexPresupuesto}, ${iPresupuesto})" class="btn btn-danger" type=button><box-icon name="trash"></box-icon></button>
  // <button data-toggle="modal" data-target="#exampleModalPresupuestoEditar" onclick="funcionMasInfoPresupuesto(${indexPresupuesto})" id="btnMasInfoPresupuesto" class="btn btn-secondary" type="button"><box-icon name="info-circle"></box-icon></button></td></tr>`;

  var fila =
    '<tr id="rowPresupuesto' +
    indexPresupuesto +
    '"><td>' +
    montoTotal +
    "</td><td>" +
    divisaSeleccionada +
    "</td><td> " +
    gastos +
    '</td><td><button class="btn btn-danger" id="btnEliminarPublicacion" onclick="removerPresupuesto(' + indexPresupuesto + "," + iPresupuesto + ')" type=button><box-icon name="trash"></box-icon></button>' +
    '<button data-toggle="modal" data-target="#exampleModalPresupuestoEditar" onclick="funcionMasInfoPresupuesto( ' + iPresupuesto + ')" id="btnMasInfoPresupuesto" class="btn btn-secondary" type="button"><box-icon name="info-circle"></box-icon></button></td></tr>';


  indexPresupuesto++;

  $("#mytablePresupuesto tr:first").after(fila);
}

function mostrarDatosPresupuesto() {
  for (let row of mytablePresupuesto.rows) {
    for (let cell of row.cells) {
      console.log(cell);
      console.log(cell.textContent);
      console.log(cell.firstChild);
    }
  }
}

function mostrarDatos2Presupuesto() {
  $("#mytablePresupuesto tr").each(function () {
    $(this)
      .find("td")
      .each(function () {
        console.log($(this));
      });
  });
}


var masInfoPresupuesto = 0;
const funcionMasInfoPresupuesto = (j) => {
  console.log(j);
  masInfoPresupuesto = j;
};


$(document).on("click", "#btnMasInfoPresupuesto", function (e) {
  e.preventDefault();
  console.log(masInfoPresupuesto)
  document.getElementById("txtDivisa2").disabled = true
  document.getElementById("txtHonorario2").disabled = true
  document.getElementById("txtViaticos2").disabled = true
  document.getElementById("txtEquipo2").disabled = true
  document.getElementById("txtGastos2").disabled = true

  objPresupuesto.forEach((element) => {
    if (element.idProyecto == masInfoPresupuesto) {
      document.getElementById("txtDivisa2").value = element.divisa;
      document.getElementById("txtHonorario2").value = element.honorario;
      document.getElementById("txtViaticos2").value = element.viatico;
      document.getElementById("txtEquipo2").value = element.equipamiento;
      document.getElementById("txtGastos2").value = element.gastos;
    }
  });
});

// --------------------FICHA LISTA--------------------------
var comboFicha;
var comboFichaSeleccionada;

function fichaSeleccionada() {
  var fichaLista = document.getElementById("idFichaLista").checked;

  if (fichaLista) {
    document.getElementById("comboFicha").disabled = !fichaLista;
    comboFicha = document.getElementById("comboFicha").value;
    comboFicha2 = document.getElementById("comboFicha");

    comboFichaSeleccionada =
      comboFicha2.options[comboFicha2.selectedIndex].text;
    console.log(comboFichaSeleccionada);
  } else {
    document.getElementById("comboFicha").disabled = !fichaLista;
    comboFicha2 = document.getElementById("comboFicha");
    comboFichaSeleccionada =
      comboFicha2.options[comboFicha2.selectedIndex].text;
    comboFichaSeleccionada = "";
    comboFicha = -1;
  }
}

function cambiarValor() {
  comboFicha = document.getElementById("comboFicha").value;
  comboFicha2 = document.getElementById("comboFicha");

  comboFichaSeleccionada = comboFicha2.options[comboFicha2.selectedIndex].text;
  console.log(comboFichaSeleccionada);
}

// ----------------------ENVIO DE DATOS---------------------------

let boton = document.getElementById("enviar");
boton.addEventListener("click", (e) => {
  e.preventDefault();

  // var moneda = document.getElementById("txtMoneda");
  // var monedaSeleccionada = moneda.options[moneda.selectedIndex].text;
  // console.log(moneda);

  var tit = document.getElementById("txtTitulo").value;

  var depto = document.getElementById("txtDepartamento");
  var deptoSeleccionado = depto.options[depto.selectedIndex].text;

  var url = "https://practica-supervisada.herokuapp.com/api/proyecto/";
  //var url = "https://localhost:44313/api/Proyecto";
  var data = {
    titulo: document.getElementById("txtTitulo").value,
    paisRegion: document.getElementById("txtPais").value,
    contratante: document.getElementById("txtContratante").value,
    dirección: document.getElementById("txtDireccion").value,
    //montoContrato: document.getElementById("txtMonto").value,
    nroContrato: document.getElementById("txtNumero").value,
    mesInicio: parseInt(document.getElementById("mesDesde").value),
    anioInicio: parseInt(document.getElementById("txtAnioInicio").value),
    mesFinalizacion: parseInt(document.getElementById("mesHasta").value),
    anioFinalizacion: parseInt(document.getElementById("txtAnioFin").value),
    consultoresAsoc: document.getElementById("txtConsultores").value,
    descripcion: document.getElementById("txtDescProyexto").value,
    resultados: null,
    fichaLista: document.getElementById("idFichaLista").checked,
    enCurso: document.getElementById("txtEjecucion").checked,
    departamento: deptoSeleccionado,
    //moneda: monedaSeleccionada,
    certconformidad: document.getElementById("certConformidad").checked,
    certificadopor: comboFicha,
    activo: true,
    listaAreas: objAreas,
    listaPersonal: objPersonal,
    listaPresupuestos: objPresupuesto,
    listaPublicaciones: objPublicacion,
    link: document.getElementById("txtLink").value,
    convenio: document.getElementById("txtConvenio").checked,
  };

  console.log(data);

  if (tit === "") {
    Swal.fire({
      icon: "error",
      title: "Ingrese un Titulo",
    });
    return false;
  } else {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Insercion Exitosa",
      showConfirmButton: false,
      timer: 1500,
    });
    document.getElementById("formulario").reset();
    $("#myTable > tbody").empty();
    $("#myTableArea > tbody").empty();
    objAreas = [];
    objPersonal = [];
    // setInterval(() => {
    //   location.reload();
    // }, 2000);
    fetch(url, {
      method: "POST", // or 'PUT'
      body: JSON.stringify(data), // data can be `string` or {object}!
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res)
      //.catch((error) => console.error("Error:", error))
      .then((data) => {
        console.log(data);
      });
  }
});
