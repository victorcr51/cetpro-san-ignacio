const infoCarreras = {
    computacion: {
        titulo: "Computación e Informática",
        imagen: "promo_computacion.jpg",
        descripcion: "Capacitación técnica superior en herramientas informáticas, mantenimiento de PC, diseño gráfico publicitario y creación de páginas web."
    },
    textileria: {
        titulo: "Textilería y Confección",
        imagen: "promo_textileria.jpg",
        descripcion: "Domina el patronaje, corte y confección textil. Diseña y elabora prendas de vestir personalizadas de alta calidad."
    },
    mecanica: {
        titulo: "Mecánica Automotriz",
        imagen: "promo_mecanica.jpg",
        descripcion: "Diagnóstico técnico, reparación de motores gasolina y diésel, electricidad automotriz y mantenimiento preventivo integral."
    },
    agricultura: {
        titulo: "Agricultura Orgánica y Pecuaria",
        imagen: "promo_agricultura.jpg",
        descripcion: "Aprende la gestión de cultivos sostenibles (café, cacao), compostaje, abonos orgánicos y crianza de animales menores."
    },
    construccion: {
        titulo: "Construcción Civil",
        imagen: "promo_construccion.jpg",
        descripcion: "Instalación de armaduras de acero, losas, encofrado, desencomfrado y revestimiento de superficies con acabado profesional."
    }
};

function mostrarDetalles(key) {
    const data = infoCarreras[key];
    if (data) {
        document.getElementById("modalImg").src = data.imagen;
        document.getElementById("modalTitulo").textContent = data.titulo;
        document.getElementById("modalDescripcion").textContent = data.descripcion;
        document.getElementById("modalDetalles").classList.remove("hidden");
    }
}

function cerrarDetalles() {
    document.getElementById("modalDetalles").classList.add("hidden");
}

function abrirMatriculaDirecta() {
    document.getElementById("modalRequisitos").classList.remove("hidden");
}

function cerrarRequisitos() {
    document.getElementById("modalRequisitos").classList.add("hidden");
}

function cerrarFormularioFinal() {
    document.getElementById("modalFormularioFinal").classList.add("hidden");
}

function cerrarAdminTabla() {
    document.getElementById("modalAdminTabla").classList.add("hidden");
}

function irMatriculaDesdeModal() {
    cerrarDetalles();
    abrirMatriculaDirecta();
}

function toggleAccordion(element) {
    const active = document.querySelector(".accordion-item.active");
    if (active && active !== element) {
        active.classList.remove("active");
    }
    element.classList.toggle("active");
}

document.addEventListener("DOMContentLoaded", function () {
    const formRequisitos = document.getElementById("formRequisitos");
    const studentForm = document.getElementById("studentForm");
    const logoAdmin = document.getElementById("logoAdmin");
    const tablaCuerpo = document.getElementById("tablaCuerpo");
    const btnDescargarExcel = document.getElementById("btnDescargarExcel");
    const btnBorrarBD = document.getElementById("btnBorrarBD");

    let listaAlumnos = JSON.parse(localStorage.getItem("bd_alumnos_cetpro")) || [];
    let datosTemporales = {};
    const CLAVE_ADMIN = "1234";

    function actualizarTabla() {
        tablaCuerpo.innerHTML = "";
        if (listaAlumnos.length === 0) {
            tablaCuerpo.innerHTML = `<tr><td colspan="8" style="padding:15px;">No hay registros de alumnos.</td></tr>`;
            return;
        }

        listaAlumnos.forEach((alumno, index) => {
            const fila = document.createElement("tr");
            fila.style.borderBottom = "1px solid #e5e7eb";
            fila.innerHTML = `
                <td style="padding:10px;">${index + 1}</td>
                <td>${alumno.Dni || '-'}</td>
                <td>${alumno.Nombres}</td>
                <td>${alumno.Apellidos}</td>
                <td>${alumno.Especialidad || '-'}</td>
                <td>${alumno.Edad}</td>
                <td>${alumno.Sexo}</td>
                <td>${alumno.Fecha_Registro}</td>
            `;
            tablaCuerpo.appendChild(fila);
        });
    }

    formRequisitos.addEventListener("submit", function (e) {
        e.preventDefault();

        const dniVal = document.getElementById("reqDni").value.trim();
        if (dniVal.length !== 8 || isNaN(dniVal)) {
            alert("⚠️ Ingrese un DNI válido de 8 dígitos.");
            return;
        }

        datosTemporales.dni = dniVal;
        datosTemporales.fechaNac = document.getElementById("reqFechaNac").value;
        datosTemporales.celular = document.getElementById("reqCelular").value.trim();
        datosTemporales.carrera = document.getElementById("reqCarrera").value;

        cerrarRequisitos();
        document.getElementById("modalFormularioFinal").classList.remove("hidden");
    });

    logoAdmin.addEventListener("dblclick", function () {
        const pass = prompt("Clave de Administrador:");
        if (pass === CLAVE_ADMIN) {
            actualizarTabla();
            document.getElementById("modalAdminTabla").classList.remove("hidden");
        } else if (pass !== null) {
            alert("Clave incorrecta.");
        }
    });

    studentForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const nombres = document.getElementById("nombres").value.trim();
        const apellidos = document.getElementById("apellidos").value.trim();
        const edad = parseInt(document.getElementById("edad").value.trim());
        const sexo = document.getElementById("sexo").value;

        if (isNaN(edad) || edad < 14) {
            alert("⛔ EDAD INSUFICIENTE: La edad mínima requerida es de 14 años.");
            return;
        }

        const fechaActual = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

        const nuevoAlumno = {
            Dni: datosTemporales.dni || "N/A",
            Nombres: nombres,
            Apellidos: apellidos,
            Especialidad: datosTemporales.carrera || "General",
            Edad: edad,
            Sexo: sexo,
            Centro_Educativo: "CETPRO ARZ. OSCAR ARNULFO ROMERO - SAN IGNACIO",
            Fecha_Registro: fechaActual
        };

        listaAlumnos.push(nuevoAlumno);
        localStorage.setItem("bd_alumnos_cetpro", JSON.stringify(listaAlumnos));

        formRequisitos.reset();
        studentForm.reset();
        datosTemporales = {};

        alert(`🎉 ¡FELICITACIONES ${nombres.toUpperCase()}!\n\nTu pre-matrícula para la especialidad de ${nuevoAlumno.Especialidad} ha sido registrada con éxito en San Ignacio.\n\n¡Bienvenido al CETPRO "Arz. Óscar Arnulfo Romero"!`);

        cerrarFormularioFinal();
    });

    btnDescargarExcel.addEventListener("click", async function () {
        if (listaAlumnos.length === 0) {
            alert("No hay registros acumulados para exportar.");
            return;
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Matriculados 2026");

        worksheet.mergeCells('A1:H1');
        const titleCell = worksheet.getCell('A1');
        titleCell.value = 'REPORTE OFICIAL DE ALUMNOS MATRICULADOS - SAN IGNACIO 2026';
        titleCell.font = { name: 'Segoe UI', size: 14, bold: true, color: { argb: 'FFFFFF' } };
        titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D90429' } };
        titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

        const headers = ["N°", "DNI", "Nombres", "Apellidos", "Especialidad", "Edad", "Sexo", "Fecha de Matrícula"];
        const headerRow = worksheet.getRow(3);
        headerRow.values = headers;

        listaAlumnos.forEach((alumno, index) => {
            const row = worksheet.getRow(4 + index);
            row.values = [
                index + 1, alumno.Dni, alumno.Nombres, alumno.Apellidos,
                alumno.Especialidad, parseInt(alumno.Edad), alumno.Sexo, alumno.Fecha_Registro
            ];
        });

        worksheet.columns = [
            { width: 8 }, { width: 14 }, { width: 22 }, { width: 22 },
            { width: 28 }, { width: 10 }, { width: 14 }, { width: 26 }
        ];

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "Reporte_Matriculados_San_Ignacio_2026.xlsx";
        link.click();
    });

    btnBorrarBD.addEventListener("click", function () {
        if (confirm("¿Estás seguro de borrar todos los registros acumulados?")) {
            localStorage.removeItem("bd_alumnos_cetpro");
            listaAlumnos = [];
            actualizarTabla();
        }
    });
});