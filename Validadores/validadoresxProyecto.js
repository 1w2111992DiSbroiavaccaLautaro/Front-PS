$(document).ready(function () {
    fetch("https://www.dolarsi.com/api/api.php?type=valoresprincipales")
        .then(response => response.json())
        .then(json => {
            dolar = json[0].casa.compra;
            euro = json[0].casa.venta;
        })

    fetch("https://practica-supervisada.herokuapp.com/api/reportes/reporte1", {
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
            cargarGrafico();
        });
})

function hideSpinner() {
    document.getElementById("spinner").style.display = "none";
}


let filtrar = document.getElementById("btnFiltrar");
filtrar.addEventListener("click", e => {
    e.preventDefault();

    var anioDesde = document.getElementById("anioDesde").value;
    var anioHasta = document.getElementById("anioHasta").value;

    if (anioDesde == "" && anioHasta == "") {
        Swal.fire({
            icon: "error",
            title: "Complete los filtros de busqueda",
            showConfirmButton: false,
            timer: 1500
        });
        return false;
    }
    else {
        if (!/^(1[9-9][6-9][0-9]|20[0-9][0-9]|2100)$/.test(anioDesde) || !/^(1[9-9][6-9][0-9]|20[0-9][0-9]|2100)$/.test(anioHasta)) {
            Swal.fire({
                icon: "error",
                title: "Ingrese un año valido",
                showConfirmButton: true,
            });
            return false;
        }
    }
    cargarGrafico2(anioDesde, anioHasta);
})


function cargarGrafico2(desde, hasta) {
    $.ajax({
        //url: "https://localhost:44343/api/Reportes/Reporte1",
        url: `https://practica-supervisada.herokuapp.com/api/Validador/validadorxProyecto?AnioDesde=${desde}&AnioFin=${hasta}`,
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
        },
        success: function (data) {

            var o = data; //A la variable le asigno el json decodificado
            total = o.cantidad0 + o.cantidad1 + o.cantidad2 + o.cantidad3 + o.cantidad4 + o.cantidad5;

            if (o.cantidad0 === 0 && o.cantidad1 === 0 && o.cantidad2 === 0 && o.cantidad3 === 0 && o.cantidad4 === 0 && o.cantidad5 === 0) {
                Swal.fire({
                    icon: "info",
                    title: "No hay resultados",
                    showConfirmButton: false,
                    timer: 1500
                });
                return false;
            }

            myChart.destroy();
            const labels = [
                'Landaveri, Raúl',
                'Lallana, Francisco',
                'Nadal, Gustavo',
                'Di Sbroiavacca, Nicolás',
                'Dubrovsky, Hilda',
                'Recalde, Marina'
            ];

            const datas = {
                labels: labels,
                datasets: [{
                    label: 'Cantidad Fichas',
                    backgroundColor: [
                        'rgba(253, 65, 162, 0.8)',
                        'rgba(48, 33, 236, 0.8)',
                        'rgba(22, 189, 0, 0.8)',
                        'rgba(196, 226, 0, 0.8)',
                        'rgba(255, 0, 19, 0.8)',
                        'rgba(255, 247, 0, 0.76)',
                    ],
                    borderColor: 'rgb(255, 99, 132)',
                    data: [o.cantidad0, o.cantidad1, o.cantidad2, o.cantidad3, o.cantidad4, o.cantidad5],
                }]
            };

            const config = {
                type: 'bar',
                data: datas,
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: 'Cantidad de fichas de proyectos validadas filtradas por rango de años. Total de Proyectos: ' + total,
                            font: {
                                size: 20
                            }
                        }
                    }
                }
            };

            myChart = new Chart(
                document.getElementById('myChart'),
                config
            );

        },

        error: function (error) {
            Swal.fire({
                icon: "error",
                title: "Sesión Expirada",
                showConfirmButton: false
            });
            setInterval(() => {
                window.location = "../index.html"
            }, 2000);
        },
    });
}

let quitar = document.getElementById("btnQuitar");
quitar.addEventListener("click", e => {
    e.preventDefault();
    document.getElementById("anioDesde").value = "";
    document.getElementById("anioHasta").value = "";
    cargarGrafico2("1000", "3000");
})

var total = 0;

function cargarGrafico() {
    $.ajax({
        //url: "https://localhost:44343/api/Reportes/Reporte1",
        url: `https://practica-supervisada.herokuapp.com/api/Validador/validadorxProyecto`,
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
        },
        success: function (data) {

            var o = data; //A la variable le asigno el json decodificado
            total = o.cantidad0 + o.cantidad1 + o.cantidad2 + o.cantidad3 + o.cantidad4 + o.cantidad5;

            const labels = [
                'Landaveri, Raúl',
                'Lallana, Francisco',
                'Nadal, Gustavo',
                'Di Sbroiavacca, Nicolás',
                'Dubrovsky, Hilda',
                'Recalde, Marina'
            ];

            const datas = {
                labels: labels,
                datasets: [{
                    label: 'Cantidad Fichas',
                    backgroundColor: [
                        'rgba(253, 65, 162, 0.8)',
                        'rgba(48, 33, 236, 0.8)',
                        'rgba(22, 189, 0, 0.8)',
                        'rgba(196, 226, 0, 0.8)',
                        'rgba(255, 0, 19, 0.8)',
                        'rgba(255, 247, 0, 0.76)',
                    ],
                    borderColor: 'rgb(255, 99, 132)',
                    data: [o.cantidad0, o.cantidad1, o.cantidad2, o.cantidad3, o.cantidad4, o.cantidad5],
                }]
            };

            const config = {
                type: 'bar',
                data: datas,
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: 'Cantidad de fichas de proyectos validadas filtradas por rango de años. Total Proyetos: ' + total,
                            font: {
                                size: 20
                            }
                        }
                    }
                }
            };

            myChart = new Chart(
                document.getElementById('myChart'),
                config
            );

        },

        error: function (error) {
            Swal.fire({
                icon: "error",
                title: "Sesión Expirada",
                showConfirmButton: false
            });
            setInterval(() => {
                window.location = "../index.html"
            }, 2000);
        },
    });
}