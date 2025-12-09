function registrarUsuario(){
//crear variable: nombre, apellido, correo, clave,confirmacion de clave,
let nombre=document.getElementById("nombres").value;
let apellido=document.getElementById("apellidos").value;
let correo=document.getElementById("correo").value;
let clave=document.getElementById("clave").value;
let confimacionClave=document.getElementById("confirmarClave").value;
let fechaNcimiento=document.getElementById("fechaNacimiento").value;
//validar que los campos no esten vacios
if(nombre=="" || apellido=="" || correo==""||clave==""||confimacionClave==""||fechaNcimiento==""){
    alert("Por favor complete todos los campos");
    return;
}
if(clave!=confimacionClave){
    alert("Las contraseñas no coinciden");
    document.getElementById("clave").style.border="1px solid red";
    document.getElementById("confirmarClave").style.border="1px solid red";
    return;
}
// Validar mínima longitud de contraseña
if (clave.length < 8) {
    alert("La clave debe tener mínimo 8 caracteres. 🔐");
    document.getElementById('clave').style.borderColor = 'red';
    return;
}

// Validar que el usuario no este registrado
if (localStorage.getItem('usuario_' + correo)) {
    alert('El correo ya está registrado');
    return;
}

// se crea el objeto para guardarlo en localstorage
let usuario = {
    nombres: nombre,
    apellidos: apellido,
    correo: correo,
    clave: clave,
    fechaNacimiento: fechaNcimiento,
};

//Guardar los datos en localstorage
localStorage.setItem('usuario_' + correo, JSON.stringify(usuario));
alert('Registro exitoso');
window.location.href = 'index.html';
}

function iniciarSesion(){
    let correo=document.getElementById("correo").value;
    let clave=document.getElementById("clave").value;   
    let datos=localStorage.getItem('usuario_' + correo);
    if(!datos){
        alert("Usuario no encontrado");
        return;
    }

    let usuario=JSON.parse(datos);
    if(usuario.clave!=clave){
        alert("Clave incorrecta");
        return;
    }

localStorage.setItem("usuarioActivo", correo);
window.location.href="inicio.html";


}

function mostrarBienvenida() {
    let correoActivo = localStorage.getItem('usuarioActivo');
    if (!correoActivo) { // Si no hay usuario activo, redirigir a la página de inicio de sesión
        window.location.href = 'index.html';
        return;
    }
    let datos = JSON.parse(localStorage.getItem('usuario_' + correoActivo));
    // Obtener los datos del usuario activo
    if (!datos) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('mensajeBienvenida').innerHTML = `<i class="fas fa-user-circle"></i> ¡Bienvenido/a, <a href="perfil.html">${datos.nombres}</a>!`;

    mostrarTareas(); // Mostrar tareas al cargar
}

function cerrarSesion() {
    localStorage.removeItem('usuarioActivo'); // Eliminar el usuario activo del almacenamiento local
    const confirmar = confirm("¿Deseas salir del sitio?");

    if (confirmar) {
        alert("Gracias por visitar la página. ¡Hasta pronto!");

        setTimeout(() => {
            window.location.href = "../index.html";
        }, 500);

    } else {
        alert(" Qué bueno que decidiste quedarte.");
    }
}

function guardarTarea(event) {
  event.preventDefault(); // Evitar recarga de página
  
  let tarea = document.getElementById('nuevaTarea').value.trim();

  if (!tarea) {
    alert('Por favor, ingresa una tarea válida');
    return;
  }

  let correoActivo = localStorage.getItem('usuarioActivo');
  let listaTareas = JSON.parse(localStorage.getItem('tareas_' + correoActivo)) || [];

  listaTareas.push(tarea);
  localStorage.setItem('tareas_' + correoActivo, JSON.stringify(listaTareas));
  
  document.getElementById('nuevaTarea').value = '';
  mostrarTareas();
}

function mostrarTareas() {
  let correoActivo = localStorage.getItem('usuarioActivo');
  let tareas = JSON.parse(localStorage.getItem('tareas_' + correoActivo)) || [];

  let lista = document.getElementById('listaTareas');
  lista.innerHTML = '';

  if (tareas.length === 0) {
    lista.innerHTML = `
      <div class="lista-vacia">
        <i class="fas fa-inbox"></i>
        <p>No tienes tareas aún. ¡Crea una para comenzar!</p>
      </div>
    `;
    return;
  }

  tareas.forEach((tarea, indice) => {
    lista.innerHTML += `
      <div class="tarea-item">
        <div class="tarea-texto">
          ${tarea}
        </div>
        <div class="tarea-acciones">
          <button class="btn-accion btn-editar" onclick="irAEditar(${indice})">
            <i class="fas fa-edit"></i> Editar
          </button>
          <button class="btn-accion btn-eliminar" onclick="eliminarTarea(${indice})">
            <i class="fas fa-trash"></i> Eliminar
          </button>
        </div>
      </div>
    `;
  });
}

function eliminarTarea(indice) {
let confirmacion = confirm('¿Estás seguro de que deseas eliminar esta tarea?');

  if (confirmacion) { // Si el usuario confirma la eliminación
    let correoActivo = localStorage.getItem('usuarioActivo');
    let tareas = JSON.parse(localStorage.getItem('tareas_' + correoActivo)) || [];

    tareas.splice(indice, 1); // Eliminar la tarea del array
    localStorage.setItem('tareas_' + correoActivo, JSON.stringify(tareas));
    // stringify convierte el array de tareas en una cadena JSON y lo guarda en el almacenamiento local
    alert('Tarea eliminada correctamente');
    mostrarTareas();
}
}

function irAEditar(indice) {
  let correoActivo = localStorage.getItem('usuarioActivo');
  let tareas = JSON.parse(localStorage.getItem('tareas_' + correoActivo)) || [];

  let tarea = tareas[indice];
  document.getElementById('tareaEditada').value = tarea;
  indiceTareaEditando = indice;

  document.getElementById('editarModal').classList.add('show');
  document.getElementById('editarModal').style.display = 'flex';
}

function guardarEdicion() {
  if (indiceTareaEditando === null) return;

  let nuevaTarea = document.getElementById('tareaEditada').value.trim();
  if (!nuevaTarea) {
    alert('La tarea no puede estar vacía');
    return;
  }

  let correoActivo = localStorage.getItem('usuarioActivo');
  let tareas = JSON.parse(localStorage.getItem('tareas_' + correoActivo)) || [];

  tareas[indiceTareaEditando] = nuevaTarea;
  localStorage.setItem('tareas_' + correoActivo, JSON.stringify(tareas));

  cerrarModal();
  mostrarTareas();
}

function cerrarModal() {
  document.getElementById('editarModal').classList.remove('show');
  document.getElementById('editarModal').style.display = 'none';
  indiceTareaEditando = null;
}

let indiceTareaEditando = null;

// Cerrar modal al hacer clic en la X o fuera del contenido
document.addEventListener('DOMContentLoaded', function() {
  // Cerrar modal al hacer clic fuera del contenido
  window.addEventListener('click', function(event) {
    let modal = document.getElementById('editarModal');
    if (event.target === modal) {
      cerrarModal();
    }
  });

  // Cerrar con tecla Escape
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      cerrarModal();
    }
  });
});
function cargarDatosUsuario() {
  let correoActivo = localStorage.getItem('usuarioActivo');
  if (!correoActivo) {
    window.location.href = 'index.html';
    return;
  }

  let datos = JSON.parse(localStorage.getItem('usuario_' + correoActivo));
  if (!datos) {
    window.location.href = 'index.html';
    return;
  }

  // Llenar el formulario con los datos del usuario
  document.getElementById('nombres').value = datos.nombres || '';
  document.getElementById('apellidos').value = datos.apellidos || '';
  document.getElementById('correo').value = datos.correo || '';
  document.getElementById('fechaNacimiento').value = datos.fechaNacimiento || '';

  // Actualizar el header con el nombre del usuario
  let nombreCompleto = (datos.nombres + ' ' + datos.apellidos).trim();
  document.getElementById('nombreCompleto').textContent = nombreCompleto || 'Tu Nombre';
  document.getElementById('correoMostrado').textContent = datos.correo || 'tu@email.com';
}

function mostrarMensaje(tipo, texto) {
  if (tipo === 'exito') {
    document.getElementById('textoExito').textContent = texto;
    document.getElementById('mensajeExito').classList.add('show');
    setTimeout(() => {
      document.getElementById('mensajeExito').classList.remove('show');
    }, 3000);
  } else if (tipo === 'error') {
    document.getElementById('textoError').textContent = texto;
    document.getElementById('mensajeError').classList.add('show');
    setTimeout(() => {
      document.getElementById('mensajeError').classList.remove('show');
    }, 3000);
  }
}

function actualizarPerfil() {
  let nombres = document.getElementById('nombres').value.trim();
  let apellidos = document.getElementById('apellidos').value.trim();
  let fechaNacimiento = document.getElementById('fechaNacimiento').value;
  let claveActual = document.getElementById('claveActual').value;
  let nuevaClave = document.getElementById('nuevaClave').value;
  let confirmarNuevaClave = document.getElementById('confirmarNuevaClave').value;

  if (!nombres || !apellidos || !fechaNacimiento) {
    mostrarMensaje('error', 'Por favor completa todos los campos obligatorios');
    return;
  }

  let correoActivo = localStorage.getItem('usuarioActivo');
  let datos = JSON.parse(localStorage.getItem('usuario_' + correoActivo));

  // Validar cambio de contraseña
  if (nuevaClave || confirmarNuevaClave || claveActual) {
    if (!claveActual) {
      mostrarMensaje('error', 'Debes ingresar tu contraseña actual para cambiarla');
      return;
    }

    if (datos.clave !== claveActual) {
      mostrarMensaje('error', 'La contraseña actual es incorrecta');
      return;
    }

    if (nuevaClave !== confirmarNuevaClave) {
      mostrarMensaje('error', 'Las nuevas contraseñas no coinciden');
      return;
    }

    if (nuevaClave.length > 0 && nuevaClave.length < 8) {
      mostrarMensaje('error', 'La nueva contraseña debe tener mínimo 8 caracteres');
      return;
    }

    if (nuevaClave) {
      datos.clave = nuevaClave;
    }
  }

  // Actualizar datos
  datos.nombres = nombres;
  datos.apellidos = apellidos;
  datos.fechaNacimiento = fechaNacimiento;

  localStorage.setItem('usuario_' + correoActivo, JSON.stringify(datos));

  // Actualizar header
  let nombreCompleto = (nombres + ' ' + apellidos).trim();
  document.getElementById('nombreCompleto').textContent = nombreCompleto;

  // Limpiar campos de contraseña
  document.getElementById('claveActual').value = '';
  document.getElementById('nuevaClave').value = '';
  document.getElementById('confirmarNuevaClave').value = '';

  mostrarMensaje('exito', 'Perfil actualizado correctamente');
}

// Edita un solo campo del usuario activo. Maneja cambio de correo (traslada la entrada en localStorage)
function editarDatoUsuario(campo, valor) {
  let correoActivo = localStorage.getItem('usuarioActivo');
  if (!correoActivo) {
    mostrarMensaje('error', 'No hay usuario activo');
    return false;
  }

  let datos = JSON.parse(localStorage.getItem('usuario_' + correoActivo));
  if (!datos) {
    mostrarMensaje('error', 'Usuario no encontrado');
    return false;
  }

  // Si se intenta cambiar el correo, mover la entrada en localStorage
  if (campo === 'correo') {
    let nuevoCorreo = valor.trim();
    if (!nuevoCorreo) {
      mostrarMensaje('error', 'El correo no puede estar vacío');
      return false;
    }

    // Evitar sobreescribir otro usuario existente
    if (localStorage.getItem('usuario_' + nuevoCorreo)) {
      mostrarMensaje('error', 'El correo ya está en uso');
      return false;
    }

    datos.correo = nuevoCorreo;
    // Guardar con la nueva clave y eliminar la antigua
    localStorage.setItem('usuario_' + nuevoCorreo, JSON.stringify(datos));
    localStorage.removeItem('usuario_' + correoActivo);
    // Actualizar usuario activo
    localStorage.setItem('usuarioActivo', nuevoCorreo);

    // Actualizar campos en la UI si existen
    if (document.getElementById('correo')) document.getElementById('correo').value = nuevoCorreo;
    if (document.getElementById('correoMostrado')) document.getElementById('correoMostrado').textContent = nuevoCorreo;
    mostrarMensaje('exito', 'Correo actualizado correctamente');
    return true;
  }

  // Actualizar el campo en el objeto y persistir
  datos[campo] = valor;
  localStorage.setItem('usuario_' + correoActivo, JSON.stringify(datos));

  // Actualizar UI dependiendo del campo
  if (campo === 'nombres' || campo === 'apellidos') {
    if (document.getElementById('nombres')) document.getElementById('nombres').value = datos.nombres || '';
    if (document.getElementById('apellidos')) document.getElementById('apellidos').value = datos.apellidos || '';
    let nombreCompleto = ((datos.nombres || '') + ' ' + (datos.apellidos || '')).trim();
    if (document.getElementById('nombreCompleto')) document.getElementById('nombreCompleto').textContent = nombreCompleto || 'Tu Nombre';
  }

  if (campo === 'fechaNacimiento') {
    if (document.getElementById('fechaNacimiento')) document.getElementById('fechaNacimiento').value = datos.fechaNacimiento || '';
  }

  // No mostrar la contraseña en claro, pero si se cambió, limpiar campos relacionados
  if (campo === 'clave') {
    if (document.getElementById('claveActual')) document.getElementById('claveActual').value = '';
    if (document.getElementById('nuevaClave')) document.getElementById('nuevaClave').value = '';
    if (document.getElementById('confirmarNuevaClave')) document.getElementById('confirmarNuevaClave').value = '';
  }

  mostrarMensaje('exito', 'Dato actualizado correctamente');
  return true;
}

// ============================================
// SISTEMA DE VALIDACIÓN EN TIEMPO REAL
// ============================================

// Objeto con las reglas de validación
const REGLAS_VALIDACION = {
  nombres: {
    patron: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/,
    mensaje: 'Solo letras, mínimo 2 caracteres'
  },
  apellidos: {
    patron: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/,
    mensaje: 'Solo letras, mínimo 2 caracteres'
  },
  correo: {
    patron: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    mensaje: 'Formato de correo inválido'
  },
  clave: {
    patron: /^.{8,}$/,
    mensaje: 'Mínimo 8 caracteres'
  }
};

// Inicializar validaciones cuando cargue el documento
document.addEventListener('DOMContentLoaded', function() {
  // Ejecutar validaciones según la página
  if (document.getElementById('formRegistro')) {
    inicializarValidacionesRegistro();
  }
  
  if (document.getElementById('formLogin')) {
    inicializarValidacionesLogin();
  }
    if (document.getElementById('formPerfil')) {
        inicializarValidacionesPerfil();
    }
});

// FUNCIÓN: Inicializar validaciones en tiempo real 
function inicializarValidacionesPerfil() {
    // Campos de datos personales (requieren validación de formato/obligatoriedad)
    const camposDatosPersonales = ['nombres', 'apellidos', 'fechaNacimiento'];
    
    // Campos de contraseña (requieren validación condicional)
    const camposClave = ['claveActual', 'nuevaClave', 'confirmarNuevaClave'];

    // 1. Inicializar Validación para Nombres, Apellidos, Fecha
    camposDatosPersonales.forEach(campo => {
        const input = document.getElementById(campo);
        if (!input) return;

        let timeout;
        input.addEventListener('input', function() {
            clearTimeout(timeout);
            timeout = setTimeout(() => validarCampo(campo), 500);
        });

        input.addEventListener('blur', function() {
            validarCampo(campo);
        });

        input.addEventListener('focus', function() {
            limpiarError(campo);
        });
    });

    // 2. Inicializar Validación para Contraseñas
    // La validación de las claves en perfil es condicional (solo si se usan)
    camposClave.forEach(campo => {
        const input = document.getElementById(campo);
        if (!input) return;

        let timeout;
        input.addEventListener('input', function() {
            clearTimeout(timeout);
            timeout = setTimeout(() => validarCampoClavePerfil(campo), 500);
        });

        input.addEventListener('blur', function() {
            validarCampoClavePerfil(campo);
        });

        input.addEventListener('focus', function() {
            limpiarError(campo);
        });
    });
}

// FUNCIÓN: Inicializar validaciones en tiempo real
function inicializarValidacionesRegistro() {
  const campos = ['nombres', 'apellidos', 'correo', 'clave', 'confirmarClave', 'fechaNacimiento'];
  
  campos.forEach(campo => {
    const input = document.getElementById(campo);
    if (!input) return;
    
    // Validar mientras el usuario escribe (con pequeño retraso)
    let timeout;
    input.addEventListener('input', function() {
      clearTimeout(timeout);
      timeout = setTimeout(() => validarCampo(campo), 500);
    });
    
    // Validar cuando el usuario sale del campo
    input.addEventListener('blur', function() {
      validarCampo(campo);
    });
    
    // Limpiar error cuando el usuario empieza a escribir
    input.addEventListener('focus', function() {
      limpiarError(campo);
    });
  });
}

// ============================================
// FUNCIÓN: Inicializar validaciones en tiempo real - LOGIN
// ============================================
function inicializarValidacionesLogin() {
  const campos = ['correoLogin', 'claveLogin'];
  
  campos.forEach(campo => {
    const input = document.getElementById(campo);
    if (!input) return;
    
    // Validar mientras el usuario escribe
    let timeout;
    input.addEventListener('input', function() {
      clearTimeout(timeout);
      timeout = setTimeout(() => validarCampoLogin(campo), 500);
    });
    
    // Validar al salir del campo
    input.addEventListener('blur', function() {
      validarCampoLogin(campo);
    });
    
    // Limpiar error al enfocar
    input.addEventListener('focus', function() {
      limpiarError(campo);
    });
    
    // Permitir login con Enter
    input.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        iniciarSesion();
      }
    });
  });
}

// ============================================
// FUNCIÓN: Validar campo individual
// ============================================
function validarCampo(campo) {
  const input = document.getElementById(campo);
  if (!input) return false;
  
  const valor = input.value.trim();
  
  // Validaciones específicas por campo
  switch(campo) {
    case 'nombres':
    case 'apellidos':
      return validarTexto(campo, valor);
      
    case 'correo':
      return validarCorreo(campo, valor);
      
    case 'clave':
      return validarClave(campo, valor);
      
    case 'confirmarClave':
      return validarConfirmacionClave(valor);
      
    case 'fechaNacimiento':
      return validarFechaNacimiento(valor);
      
    default:
      return true;
  }
}

// ============================================
// VALIDACIONES PARA LOGIN
// ============================================

function validarCampoLogin(campo) {
  const input = document.getElementById(campo);
  if (!input) return false;
  
  const valor = input.value.trim();
  
  switch(campo) {
    case 'correoLogin':
      return validarCorreoLogin(valor);
      
    case 'claveLogin':
      return validarClaveLogin(valor);
      
    default:
      return true;
  }
}

// Validar correo en login
function validarCorreoLogin(valor) {
  const input = document.getElementById('correoLogin');
  
  if (valor === '') {
    mostrarError('correoLogin', 'El correo es obligatorio');
    return false;
  }
  
  if (!REGLAS_VALIDACION.correo.patron.test(valor)) {
    mostrarError('correoLogin', 'Formato de correo inválido');
    return false;
  }
  
  // Verificar si el usuario existe (opcional, para mejor UX)
  if (!localStorage.getItem('usuario_' + valor)) {
    mostrarError('correoLogin', '⚠️ Usuario no registrado');
    return false;
  }
  
  mostrarExito('correoLogin');
  return true;
}

// Validar contraseña en login
function validarClaveLogin(valor) {
  const input = document.getElementById('claveLogin');
  
  if (valor === '') {
    mostrarError('claveLogin', 'La contraseña es obligatoria');
    return false;
  }
  
  if (valor.length < 4) {
    mostrarError('claveLogin', 'La contraseña es muy corta');
    return false;
  }
  
  mostrarExito('claveLogin');
  return true;
}

// ============================================
// FUNCIÓN: Iniciar Sesión (MEJORADA CON VALIDACIONES)
// ============================================
function iniciarSesion() {
  const correo = document.getElementById("correoLogin").value.trim();
  const clave = document.getElementById("claveLogin").value;
  const recordar = document.getElementById("recordarSesion")?.checked || false;
  
  // Validar campos
  const validacionCorreo = validarCorreoLogin(correo);
  const validacionClave = validarClaveLogin(clave);
  
  if (!validacionCorreo || !validacionClave) {
    alert("⚠️ Por favor corrige los errores antes de continuar");
    return;
  }
  
  // Deshabilitar botón mientras procesa
  const btnIngresar = document.getElementById('btnIngresar');
  if (btnIngresar) {
    btnIngresar.disabled = true;
    btnIngresar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';
  }
  
  // Simular delay de validación (mejor UX)
  setTimeout(() => {
    // Buscar usuario
    const datos = localStorage.getItem('usuario_' + correo);
    
    if (!datos) {
      mostrarError('correoLogin', '❌ Usuario no encontrado');
      if (btnIngresar) {
        btnIngresar.disabled = false;
        btnIngresar.innerHTML = '<i class="fas fa-arrow-right"></i> Ingresar';
      }
      alert("❌ Usuario no encontrado. ¿Deseas registrarte?");
      return;
    }
    
    const usuario = JSON.parse(datos);
    
    // Verificar contraseña
    if (usuario.clave !== clave) {
      mostrarError('claveLogin', '❌ Contraseña incorrecta');
      if (btnIngresar) {
        btnIngresar.disabled = false;
        btnIngresar.innerHTML = '<i class="fas fa-arrow-right"></i> Ingresar';
      }
      alert("❌ Contraseña incorrecta. Intenta nuevamente.");
      return;
    }
    
    // Inicio de sesión exitoso
    localStorage.setItem("usuarioActivo", correo);
    
    // Guardar preferencia de recordar sesión
    if (recordar) {
      localStorage.setItem("recordarSesion", "true");
    }
    
    alert("✅ ¡Bienvenido/a de nuevo, " + usuario.nombres + "!");
    window.location.href = "inicio.html";
  }, 800);
}

// ============================================
// VALIDACIONES ESPECÍFICAS (CONTINUACIÓN)
// ============================================

// Validar campos de texto (nombres, apellidos)
function validarTexto(campo, valor) {
  const input = document.getElementById(campo);
  const regla = REGLAS_VALIDACION[campo];
  
  if (valor === '') {
    mostrarError(campo, 'Este campo es obligatorio');
    return false;
  }
  
  if (!regla.patron.test(valor)) {
    mostrarError(campo, regla.mensaje);
    return false;
  }
  
  mostrarExito(campo);
  return true;
}

// Validar correo electrónico
function validarCorreo(campo, valor) {
  const input = document.getElementById(campo);
  
  if (valor === '') {
    mostrarError(campo, 'El correo es obligatorio');
    return false;
  }
  
  if (!REGLAS_VALIDACION.correo.patron.test(valor)) {
    mostrarError(campo, 'Formato de correo inválido (ej: usuario@ejemplo.com)');
    return false;
  }
  
  // Verificar si el correo ya está registrado
  if (localStorage.getItem('usuario_' + valor)) {
    mostrarError(campo, '⚠️ Este correo ya está registrado');
    return false;
  }
  
  mostrarExito(campo);
  return true;
}

// Validar contraseña
function validarClave(campo, valor) {
  const input = document.getElementById(campo);
  
  if (valor === '') {
    mostrarError(campo, 'La contraseña es obligatoria');
    return false;
  }
  
  if (valor.length < 8) {
    mostrarError(campo, 'Mínimo 8 caracteres');
    return false;
  }
  
  // Validaciones adicionales de seguridad
  const tieneNumero = /\d/.test(valor);
  const tieneMayuscula = /[A-Z]/.test(valor);
  const tieneMinuscula = /[a-z]/.test(valor);
  
  if (!tieneNumero || !tieneMayuscula || !tieneMinuscula) {
    mostrarError(campo, 'Debe tener mayúsculas, minúsculas y números');
    return false;
  }
  
  mostrarExito(campo);
  
  // También validar confirmación si ya tiene valor
  const confirmar = document.getElementById('confirmarClave').value;
  if (confirmar) {
    validarConfirmacionClave(confirmar);
  }
  
  return true;
}

// Validar confirmación de contraseña
function validarConfirmacionClave(valor) {
  const input = document.getElementById('confirmarClave');
  const clave = document.getElementById('clave').value;
  
  if (valor === '') {
    mostrarError('confirmarClave', 'Confirma tu contraseña');
    return false;
  }
  
  if (valor !== clave) {
    mostrarError('confirmarClave', '❌ Las contraseñas no coinciden');
    return false;
  }
  
  mostrarExito('confirmarClave');
  return true;
}

// Validar fecha de nacimiento
function validarFechaNacimiento(valor) {
  const input = document.getElementById('fechaNacimiento');
  
  if (valor === '') {
    mostrarError('fechaNacimiento', 'La fecha de nacimiento es obligatoria');
    return false;
  }
  
  const fecha = new Date(valor);
  const hoy = new Date();
  const edad = hoy.getFullYear() - fecha.getFullYear();
  
  // Validar que sea mayor de 13 años
  if (edad < 13) {
    mostrarError('fechaNacimiento', 'Debes ser mayor de 13 años');
    return false;
  }
  
  // Validar que no sea mayor de 120 años
  if (edad > 120) {
    mostrarError('fechaNacimiento', 'Fecha no válida');
    return false;
  }
  
  // Validar que no sea una fecha futura
  if (fecha > hoy) {
    mostrarError('fechaNacimiento', 'No puedes nacer en el futuro');
    return false;
  }
  
  mostrarExito('fechaNacimiento');
  return true;
}

// ============================================
// FUNCIONES DE UI: Mostrar errores y éxitos
// ============================================

function mostrarError(campo, mensaje) {
  const input = document.getElementById(campo);
  if (!input) return;
  
  // Cambiar estilo del input
  input.style.border = '2px solid #e74c3c';
  input.style.backgroundColor = '#ffe6e6';
  
  // Crear o actualizar mensaje de error
  let errorDiv = input.parentElement.querySelector('.mensaje-error');
  
  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.className = 'mensaje-error';
    errorDiv.style.cssText = `
      color: #e74c3c;
      font-size: 12px;
      margin-top: 5px;
      display: flex;
      align-items: center;
      gap: 5px;
      animation: slideIn 0.3s ease;
    `;
    input.parentElement.appendChild(errorDiv);
  }
  
  errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${mensaje}`;
}

function mostrarExito(campo) {
  const input = document.getElementById(campo);
  if (!input) return;
  
  // Cambiar estilo del input a éxito
  input.style.border = '2px solid #27ae60';
  input.style.backgroundColor = '#e8f8f5';
  
  // Eliminar mensaje de error si existe
  const errorDiv = input.parentElement.querySelector('.mensaje-error');
  if (errorDiv) {
    errorDiv.remove();
  }
  
  // Mostrar checkmark temporal
  let checkDiv = input.parentElement.querySelector('.check-exito');
  if (!checkDiv) {
    checkDiv = document.createElement('div');
    checkDiv.className = 'check-exito';
    checkDiv.style.cssText = `
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      color: #27ae60;
      font-size: 18px;
    `;
    input.parentElement.style.position = 'relative';
    input.parentElement.appendChild(checkDiv);
  }
  checkDiv.innerHTML = '<i class="fas fa-check-circle"></i>';
}

function limpiarError(campo) {
  const input = document.getElementById(campo);
  if (!input) return;
  
  // Restaurar estilo original
  input.style.border = '2px solid #e8eef5';
  input.style.backgroundColor = '#f8fafc';
  
  // Eliminar mensajes
  const errorDiv = input.parentElement.querySelector('.mensaje-error');
  if (errorDiv) errorDiv.remove();
  
  const checkDiv = input.parentElement.querySelector('.check-exito');
  if (checkDiv) checkDiv.remove();
}

// ============================================
// FUNCIÓN: Registrar Usuario (MEJORADA)
// ============================================
function registrarUsuario() {
  // Obtener valores
  const nombre = document.getElementById("nombres").value.trim();
  const apellido = document.getElementById("apellidos").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const clave = document.getElementById("clave").value;
  const confirmacionClave = document.getElementById("confirmarClave").value;
  const fechaNacimiento = document.getElementById("fechaNacimiento").value;
  
  // Validar todos los campos
  const validaciones = [
    validarTexto('nombres', nombre),
    validarTexto('apellidos', apellido),
    validarCorreo('correo', correo),
    validarClave('clave', clave),
    validarConfirmacionClave(confirmacionClave),
    validarFechaNacimiento(fechaNacimiento)
  ];
  
  // Si alguna validación falla, detener el registro
  if (validaciones.includes(false)) {
    alert('⚠️ Por favor corrige los errores antes de continuar');
    // Hacer scroll al primer error
    const primerError = document.querySelector('.mensaje-error');
    if (primerError) {
      primerError.parentElement.querySelector('input').focus();
    }
    return;
  }
  
  // Crear objeto usuario
  const usuario = {
    nombres: nombre,
    apellidos: apellido,
    correo: correo,
    clave: clave,
    fechaNacimiento: fechaNacimiento,
    fechaRegistro: new Date().toISOString()
  };
  
  // Guardar en localStorage
  localStorage.setItem('usuario_' + correo, JSON.stringify(usuario));
  
  // Mensaje de éxito y redirección
  alert('✅ ¡Registro exitoso! Bienvenido/a ' + nombre);
  window.location.href = 'index.html';
}

// ============================================
// FUNCIÓN: Iniciar Sesión (ELIMINADA - MOVIDA ARRIBA)
// ============================================

// ============================================
// FUNCIONES EXISTENTES (sin cambios significativos)
// ============================================

function mostrarBienvenida() {
  let correoActivo = localStorage.getItem('usuarioActivo');
  if (!correoActivo) {
    window.location.href = 'index.html';
    return;
  }
  
  let datos = JSON.parse(localStorage.getItem('usuario_' + correoActivo));
  if (!datos) {
    window.location.href = 'index.html';
    return;
  }
  
  document.getElementById('mensajeBienvenida').innerHTML = 
    `<i class="fas fa-user-circle"></i> ¡Bienvenido/a, <a href="perfil.html">${datos.nombres}</a>!`;
  
  mostrarTareas();
  inicializarBusqueda(); // Inicializar búsqueda
}

function cerrarSesion() {
  const confirmar = confirm("¿Deseas cerrar sesión?");
  
  if (confirmar) {
    localStorage.removeItem('usuarioActivo');
    alert("👋 ¡Hasta pronto!");
    window.location.href = "index.html";
  }
}

// ============================================
// FUNCIONES PARA GESTIÓN DE TAREAS
// ============================================

function guardarTarea(event) {
  event.preventDefault();
  
  const input = document.getElementById('nuevaTarea');
  const tarea = input.value.trim();
  const errorDiv = document.getElementById('errorNuevaTarea');
  
  // Limpiar error previo
  errorDiv.classList.remove('show');
  input.style.borderColor = '#e8eef5';
  
  // Validaciones
  if (!tarea) {
    mostrarErrorTarea('Por favor, ingresa una tarea');
    return;
  }
  
  if (tarea.length < 3) {
    mostrarErrorTarea('La tarea debe tener al menos 3 caracteres');
    return;
  }
  
  if (tarea.length > 200) {
    mostrarErrorTarea('La tarea no puede superar 200 caracteres');
    return;
  }
  
  // Validar caracteres especiales excesivos
  const caracteresEspeciales = tarea.match(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,;:()\-]/g);
  if (caracteresEspeciales && caracteresEspeciales.length > 5) {
    mostrarErrorTarea('Demasiados caracteres especiales');
    return;
  }
  
  const correoActivo = localStorage.getItem('usuarioActivo');
  let listaTareas = JSON.parse(localStorage.getItem('tareas_' + correoActivo)) || [];
  
  // Verificar tarea duplicada
  const tareaExiste = listaTareas.some(t => {
    const textoTarea = typeof t === 'string' ? t : t.texto;
    return textoTarea.toLowerCase() === tarea.toLowerCase();
  });
  
  if (tareaExiste) {
    mostrarErrorTarea('⚠️ Esta tarea ya existe en tu lista');
    return;
  }
  
  // Agregar tarea
  listaTareas.push({
    texto: tarea,
    fecha: new Date().toISOString(),
    completada: false,
    id: Date.now()
  });
  
  localStorage.setItem('tareas_' + correoActivo, JSON.stringify(listaTareas));
  
  // Limpiar campo y mostrar éxito
  input.value = '';
  input.style.borderColor = '#27ae60';
  
  setTimeout(() => {
    input.style.borderColor = '#e8eef5';
  }, 1500);
  
  mostrarTareas();
  limpiarBusqueda(); // Limpiar búsqueda al agregar nueva tarea
  
  // Mensaje de éxito
  const Toast = {
    mensaje: function(texto) {
      const toast = document.createElement('div');
      toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: #27ae60;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideInUp 0.3s ease;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 10px;
      `;
      toast.innerHTML = `<i class="fas fa-check-circle"></i> ${texto}`;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.style.animation = 'slideOutDown 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }
  };
  
  Toast.mensaje('Tarea agregada correctamente');
}

function mostrarErrorTarea(mensaje) {
  const input = document.getElementById('nuevaTarea');
  const errorDiv = document.getElementById('errorNuevaTarea');
  
  input.style.borderColor = '#dc2626';
  input.style.background = '#fee2e2';
  
  errorDiv.querySelector('span').textContent = mensaje;
  errorDiv.classList.add('show');
  
  input.focus();
  
  setTimeout(() => {
    errorDiv.classList.remove('show');
    input.style.background = '#f8fafc';
  }, 3000);
}

function mostrarTareas(filtro = '') {
  const correoActivo = localStorage.getItem('usuarioActivo');
  const tareas = JSON.parse(localStorage.getItem('tareas_' + correoActivo)) || [];
  const lista = document.getElementById('listaTareas');
  
  if (!lista) return;
  
  // Aplicar filtro de búsqueda
  let tareasFiltradas = tareas;
  if (filtro) {
    const filtroLower = filtro.toLowerCase();
    tareasFiltradas = tareas.filter(tarea => {
      const textoTarea = typeof tarea === 'string' ? tarea : tarea.texto;
      return textoTarea.toLowerCase().includes(filtroLower);
    });
  }
  
  // Actualizar contador de resultados
  actualizarContador(tareasFiltradas.length, tareas.length, filtro);
  
  lista.innerHTML = '';
  
  if (tareas.length === 0) {
    lista.innerHTML = `
      <div class="lista-vacia">
        <i class="fas fa-clipboard-list"></i>
        <p>¡Tu lista está vacía!</p>
        <small>Agrega tu primera tarea para comenzar</small>
      </div>
    `;
    return;
  }
  
  if (tareasFiltradas.length === 0) {
    lista.innerHTML = `
      <div class="lista-vacia">
        <i class="fas fa-search-minus"></i>
        <p>No se encontraron tareas con "${filtro}"</p>
        <small>Intenta con otras palabras clave</small>
      </div>
    `;
    return;
  }
  
  tareasFiltradas.forEach((tarea, indice) => {
    // Encontrar el índice original en la lista completa
    const textoTarea = typeof tarea === 'string' ? tarea : tarea.texto;
    const indiceOriginal = tareas.findIndex(t => {
      const texto = typeof t === 'string' ? t : t.texto;
      return texto === textoTarea;
    });
    
    // Resaltar texto coincidente
    let textoMostrado = textoTarea;
    if (filtro) {
      const regex = new RegExp(`(${filtro})`, 'gi');
      textoMostrado = textoTarea.replace(regex, '<mark style="background: #fef08a; padding: 2px 4px; border-radius: 3px; font-weight: 700;">$1</mark>');
    }
    
    lista.innerHTML += `
      <div class="tarea-item" id="tarea-${indiceOriginal}">
        <div class="tarea-contenido">
          <div class="tarea-texto">${textoMostrado}</div>
        </div>
        <div class="tarea-acciones">
          <button class="btn-accion btn-editar" onclick="irAEditar(${indiceOriginal})">
            <i class="fas fa-pen"></i> Editar
          </button>
          <button class="btn-accion btn-eliminar" onclick="eliminarTarea(${indiceOriginal})">
            <i class="fas fa-trash-alt"></i> Eliminar
          </button>
        </div>
      </div>
    `;
  });
}

// ============================================
// FUNCIONES DE BÚSQUEDA Y FILTRADO
// ============================================

function inicializarBusqueda() {
  const inputBuscar = document.getElementById('buscarTarea');
  if (!inputBuscar) return;
  
  let timeout;
  inputBuscar.addEventListener('input', function() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      const filtro = this.value.trim();
      mostrarTareas(filtro);
      
      // Resaltar campo de búsqueda si hay filtro
      if (filtro) {
        this.style.borderColor = '#2c5aa0';
        this.style.background = '#f0f9ff';
      } else {
        this.style.borderColor = '#e8eef5';
        this.style.background = '#f8fafc';
      }
    }, 300);
  });
  
  // Permitir búsqueda con Enter
  inputBuscar.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      mostrarTareas(this.value.trim());
    }
  });
}

function limpiarBusqueda() {
  const inputBuscar = document.getElementById('buscarTarea');
  if (inputBuscar) {
    inputBuscar.value = '';
    inputBuscar.style.borderColor = '#e8eef5';
    inputBuscar.style.background = '#f8fafc';
  }
  mostrarTareas();
}

function actualizarContador(resultados, total, filtro) {
  const contador = document.getElementById('contadorResultados');
  const textoContador = document.getElementById('textoContador');
  
  if (!contador || !textoContador) return;
  
  if (filtro && filtro.length > 0) {
    contador.classList.add('show');
    
    if (resultados === 0) {
      textoContador.innerHTML = `No se encontraron resultados para "<strong>${filtro}</strong>"`;
      contador.style.background = 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)';
      contador.style.borderLeftColor = '#ef4444';
      contador.querySelector('i').style.color = '#ef4444';
    } else if (resultados === total) {
      textoContador.innerHTML = `Mostrando todas las <strong>${total}</strong> tareas`;
      contador.style.background = 'linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)';
      contador.style.borderLeftColor = '#2c5aa0';
      contador.querySelector('i').style.color = '#2c5aa0';
    } else {
      textoContador.innerHTML = `Se encontraron <strong>${resultados}</strong> de <strong>${total}</strong> tareas`;
      contador.style.background = 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)';
      contador.style.borderLeftColor = '#10b981';
      contador.querySelector('i').style.color = '#10b981';
    }
  } else {
    contador.classList.remove('show');
  }
}

function eliminarTarea(indice) {
  const correoActivo = localStorage.getItem('usuarioActivo');
  let tareas = JSON.parse(localStorage.getItem('tareas_' + correoActivo)) || [];
  
  const tarea = tareas[indice];
  const textoTarea = typeof tarea === 'string' ? tarea : tarea.texto;
  
  // Mostrar preview de la tarea a eliminar
  const confirmacion = confirm(
    `¿Estás seguro de eliminar esta tarea?\n\n"${textoTarea}"\n\nEsta acción no se puede deshacer.`
  );
  
  if (!confirmacion) return;
  
  tareas.splice(indice, 1);
  localStorage.setItem('tareas_' + correoActivo, JSON.stringify(tareas));
  
  limpiarBusqueda(); // Limpiar búsqueda al eliminar
  mostrarTareas();
  
  // Mensaje de éxito con animación
  const Toast = {
    mensaje: function(texto, tipo = 'success') {
      const toast = document.createElement('div');
      const color = tipo === 'success' ? '#27ae60' : '#dc2626';
      toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: ${color};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideInUp 0.3s ease;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 10px;
      `;
      const icono = tipo === 'success' ? 'check-circle' : 'trash';
      toast.innerHTML = `<i class="fas fa-${icono}"></i> ${texto}`;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.style.animation = 'slideOutDown 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }
  };
  
  Toast.mensaje('Tarea eliminada correctamente', 'success');
}

function irAEditar(indice) {
  const correoActivo = localStorage.getItem('usuarioActivo');
  const tareas = JSON.parse(localStorage.getItem('tareas_' + correoActivo)) || [];
  
  const tarea = tareas[indice];
  const textoTarea = typeof tarea === 'string' ? tarea : tarea.texto;
  
  const input = document.getElementById('tareaEditada');
  input.value = textoTarea;
  input.style.borderColor = '#e8eef5';
  input.style.background = '#f8fafc';
  
  indiceTareaEditando = indice;
  
  document.getElementById('editarModal').classList.add('show');
  document.getElementById('editarModal').style.display = 'flex';
  
  // Enfocar el input y seleccionar todo el texto
  setTimeout(() => {
    input.focus();
    input.select();
  }, 100);
}

function guardarEdicion() {
  if (indiceTareaEditando === null) return;
  
  const input = document.getElementById('tareaEditada');
  const nuevaTarea = input.value.trim();
  
  // Validaciones
  if (!nuevaTarea) {
    input.style.borderColor = '#dc2626';
    input.style.background = '#fee2e2';
    alert('⚠️ La tarea no puede estar vacía');
    input.focus();
    return;
  }
  
  if (nuevaTarea.length < 3) {
    input.style.borderColor = '#dc2626';
    input.style.background = '#fee2e2';
    alert('⚠️ La tarea debe tener al menos 3 caracteres');
    input.focus();
    return;
  }
  
  if (nuevaTarea.length > 200) {
    input.style.borderColor = '#dc2626';
    input.style.background = '#fee2e2';
    alert('⚠️ La tarea no puede superar 200 caracteres');
    input.focus();
    return;
  }
  
  const correoActivo = localStorage.getItem('usuarioActivo');
  let tareas = JSON.parse(localStorage.getItem('tareas_' + correoActivo)) || [];
  
  // Verificar tarea duplicada (excepto la actual)
  const tareaExiste = tareas.some((t, idx) => {
    if (idx === indiceTareaEditando) return false;
    const textoTarea = typeof t === 'string' ? t : t.texto;
    return textoTarea.toLowerCase() === nuevaTarea.toLowerCase();
  });
  
  if (tareaExiste) {
    input.style.borderColor = '#dc2626';
    input.style.background = '#fee2e2';
    alert('⚠️ Ya existe una tarea con ese nombre');
    input.focus();
    return;
  }
  
  // Actualizar tarea
  const tareaActual = tareas[indiceTareaEditando];
  if (typeof tareaActual === 'string') {
    tareas[indiceTareaEditando] = {
      texto: nuevaTarea,
      fecha: new Date().toISOString(),
      completada: false,
      id: Date.now()
    };
  } else {
    tareaActual.texto = nuevaTarea;
    tareaActual.fechaModificacion = new Date().toISOString();
  }
  
  localStorage.setItem('tareas_' + correoActivo, JSON.stringify(tareas));
  
  cerrarModal();
  limpiarBusqueda(); // Limpiar búsqueda al editar
  mostrarTareas();
  
  // Resaltar tarea editada
  setTimeout(() => {
    const tareaElement = document.getElementById('tarea-' + indiceTareaEditando);
    if (tareaElement) {
      tareaElement.classList.add('highlight');
      tareaElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      setTimeout(() => {
        tareaElement.classList.remove('highlight');
      }, 2000);
    }
  }, 100);
  
  alert('✅ Tarea actualizada correctamente');
}

function cerrarModal() {
  document.getElementById('editarModal').classList.remove('show');
  document.getElementById('editarModal').style.display = 'none';
  indiceTareaEditando = null;
}

// Cerrar modal con Escape o click fuera
document.addEventListener('DOMContentLoaded', function() {
  window.addEventListener('click', function(event) {
    const modal = document.getElementById('editarModal');
    if (event.target === modal) {
      cerrarModal();
    }
  });
  
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      cerrarModal();
    }
  });
});

function cargarDatosUsuario() {
  const correoActivo = localStorage.getItem('usuarioActivo');
  if (!correoActivo) {
    window.location.href = 'index.html';
    return;
  }
  
  const datos = JSON.parse(localStorage.getItem('usuario_' + correoActivo));
  if (!datos) {
    window.location.href = 'index.html';
    return;
  }
  
  document.getElementById('nombres').value = datos.nombres || '';
  document.getElementById('apellidos').value = datos.apellidos || '';
  document.getElementById('correo').value = datos.correo || '';
  document.getElementById('fechaNacimiento').value = datos.fechaNacimiento || '';
  
  const nombreCompleto = (datos.nombres + ' ' + datos.apellidos).trim();
  document.getElementById('nombreCompleto').textContent = nombreCompleto || 'Tu Nombre';
  document.getElementById('correoMostrado').textContent = datos.correo || 'tu@email.com';
}

function mostrarMensaje(tipo, texto) {
  const elementoId = tipo === 'exito' ? 'mensajeExito' : 'mensajeError';
  const textoId = tipo === 'exito' ? 'textoExito' : 'textoError';
  
  const elemento = document.getElementById(elementoId);
  const textoElemento = document.getElementById(textoId);
  
  if (!elemento || !textoElemento) return;
  
  textoElemento.textContent = texto;
  elemento.classList.add('show');
  
  setTimeout(() => {
    elemento.classList.remove('show');
  }, 3000);
}

// ============================================
// FUNCIÓN: Actualizar Perfil (MEJORADA CON VALIDACIONES)
// ============================================
function actualizarPerfil() {
    const nombres = document.getElementById('nombres').value.trim();
    const apellidos = document.getElementById('apellidos').value.trim();
    const fechaNacimiento = document.getElementById('fechaNacimiento').value;

    const claveActual = document.getElementById('claveActual').value;
    const nuevaClave = document.getElementById('nuevaClave').value;
    const confirmarNuevaClave = document.getElementById('confirmarNuevaClave').value;
    
    let validacionesPasadas = true;

    // 1. Validar Datos Personales (Obligatorios y con formato)
    validacionesPasadas &= validarTexto('nombres', nombres);
    validacionesPasadas &= validarTexto('apellidos', apellidos);
    validacionesPasadas &= validarFechaNacimiento(fechaNacimiento);

    // 2. Validar Lógica de Contraseña (Solo si hay intento de cambio)
    if (claveActual || nuevaClave || confirmarNuevaClave) {
        // Ejecutar las validaciones de formato en tiempo real
        validacionesPasadas &= validarCampoClavePerfil('nuevaClave');
        validacionesPasadas &= validarCampoClavePerfil('confirmarNuevaClave');
        validacionesPasadas &= validarCampoClavePerfil('claveActual'); 
        
        // Si el formato de las claves falla, detener
        if (!validacionesPasadas) {
            mostrarMensaje('error', 'Por favor corrige los errores de formato en las claves.');
            return;
        }
        
        // Si el formato es OK, validar la lógica de las claves (que requiere datos del usuario)
        if (!claveActual) {
            mostrarMensaje('error', 'Debes ingresar tu contraseña actual para realizar cambios.');
            validacionesPasadas = false;
        }
        if (nuevaClave !== confirmarNuevaClave) {
            mostrarMensaje('error', 'La nueva contraseña y su confirmación NO coinciden.');
            validacionesPasadas = false;
        }
        // Nota: La validación de longitud y complejidad se maneja en 'validarCampoClavePerfil'
    }

    // 3. Verificar si hay errores pendientes (de formato o lógica)
    if (!validacionesPasadas) {
        // Intentar hacer scroll al primer error (opcional)
        const primerError = document.querySelector('.mensaje-error');
        if (primerError) {
            primerError.parentElement.querySelector('input').focus();
        }
        mostrarMensaje('error', 'Por favor, corrige los campos marcados antes de guardar.');
        return;
    }
    
    // 4. Si todas las validaciones de front-end pasaron, proceder a la lógica de LocalStorage
    
    let correoActivo = localStorage.getItem('usuarioActivo');
    let datos = JSON.parse(localStorage.getItem('usuario_' + correoActivo));

    // Validar Contraseña Actual contra LocalStorage (Solo si hay intento de cambio)
    if (claveActual || nuevaClave || confirmarNuevaClave) {
        if (datos.clave !== claveActual) {
            mostrarMensaje('error', 'La contraseña actual ingresada es incorrecta.');
            return;
        }
        // Si todo es correcto, actualizar la clave
        if (nuevaClave) {
            datos.clave = nuevaClave;
        }
    }
    
    // 5. Actualizar y Guardar Datos Personales
    datos.nombres = nombres;
    datos.apellidos = apellidos;
    datos.fechaNacimiento = fechaNacimiento;
    
    localStorage.setItem('usuario_' + correoActivo, JSON.stringify(datos));

    // 6. Limpiar campos de contraseña y mostrar éxito
    document.getElementById('claveActual').value = '';
    document.getElementById('nuevaClave').value = '';
    document.getElementById('confirmarNuevaClave').value = '';
    limpiarError('claveActual');
    limpiarError('nuevaClave');
    limpiarError('confirmarNuevaClave');

    // Volver a cargar los datos para actualizar el header con el nuevo nombre
    cargarDatosUsuario(); 
    mostrarMensaje('exito', 'Perfil actualizado correctamente');
}

// ============================================
// FUNCIÓN: Validar campos de clave en PERFIL (CONDICIONAL)
// ============================================
function validarCampoClavePerfil(campo) {
    const claveActual = document.getElementById('claveActual').value;
    const nuevaClave = document.getElementById('nuevaClave').value;
    const confirmarNuevaClave = document.getElementById('confirmarNuevaClave').value;

    // Si todos los campos de clave están vacíos, no mostrar errores ni éxitos.
    if (!claveActual && !nuevaClave && !confirmarNuevaClave) {
        limpiarError('claveActual');
        limpiarError('nuevaClave');
        limpiarError('confirmarNuevaClave');
        return true;
    }

    let valido = true;

    // 1. Validar Nueva Clave (solo si no está vacía)
    if (campo === 'nuevaClave' || campo === 'confirmarNuevaClave') {
        if (nuevaClave && nuevaClave.length < 8) {
            mostrarError('nuevaClave', 'Mínimo 8 caracteres');
            valido = false;
        } else if (nuevaClave) {
            // Re-utilizar la validación avanzada de clave del registro
            const tieneNumero = /\d/.test(nuevaClave);
            const tieneMayuscula = /[A-Z]/.test(nuevaClave);
            const tieneMinuscula = /[a-z]/.test(nuevaClave);

            if (!tieneNumero || !tieneMayuscula || !tieneMinuscula) {
                mostrarError('nuevaClave', 'Debe tener mayúsculas, minúsculas y números');
                valido = false;
            } else {
                mostrarExito('nuevaClave');
            }
        } else {
            limpiarError('nuevaClave');
        }
    }
    
    // 2. Validar Confirmación de Clave (solo si se está llenando)
    if (campo === 'confirmarNuevaClave' || campo === 'nuevaClave') {
        if (confirmarNuevaClave && nuevaClave !== confirmarNuevaClave) {
            mostrarError('confirmarNuevaClave', '❌ Las contraseñas no coinciden');
            valido = false;
        } else if (confirmarNuevaClave) {
            mostrarExito('confirmarNuevaClave');
        } else {
            limpiarError('confirmarNuevaClave');
        }
    }

    // 3. La validación de 'claveActual' se realiza 100% en 'actualizarPerfil()'
    // ya que requiere acceso a localStorage para comparar. En tiempo real, solo
    // podemos asegurarnos de que no esté vacía si las nuevas claves se usan.
    if (nuevaClave || confirmarNuevaClave) {
        if (!claveActual) {
            mostrarError('claveActual', 'Se requiere la clave actual para cambiar');
            valido = false;
        } else {
            mostrarExito('claveActual');
        }
    } else {
        limpiarError('claveActual');
    }

    return valido;
}

function editarDatoUsuario(campo, valor) {
  const correoActivo = localStorage.getItem('usuarioActivo');
  if (!correoActivo) {
    mostrarMensaje('error', 'No hay usuario activo');
    return false;
  }
  
  let datos = JSON.parse(localStorage.getItem('usuario_' + correoActivo));
  if (!datos) {
    mostrarMensaje('error', 'Usuario no encontrado');
    return false;
  }
  
  if (campo === 'correo') {
    const nuevoCorreo = valor.trim();
    if (!nuevoCorreo) {
      mostrarMensaje('error', 'El correo no puede estar vacío');
      return false;
    }
    
    if (localStorage.getItem('usuario_' + nuevoCorreo)) {
      mostrarMensaje('error', 'El correo ya está en uso');
      return false;
    }
    
    datos.correo = nuevoCorreo;
    localStorage.setItem('usuario_' + nuevoCorreo, JSON.stringify(datos));
    localStorage.removeItem('usuario_' + correoActivo);
    localStorage.setItem('usuarioActivo', nuevoCorreo);
    
    if (document.getElementById('correo')) document.getElementById('correo').value = nuevoCorreo;
    if (document.getElementById('correoMostrado')) document.getElementById('correoMostrado').textContent = nuevoCorreo;
    mostrarMensaje('exito', 'Correo actualizado correctamente');
    return true;
  }
  
  datos[campo] = valor;
  localStorage.setItem('usuario_' + correoActivo, JSON.stringify(datos));
  
  if (campo === 'nombres' || campo === 'apellidos') {
    if (document.getElementById('nombres')) document.getElementById('nombres').value = datos.nombres || '';
    if (document.getElementById('apellidos')) document.getElementById('apellidos').value = datos.apellidos || '';
    const nombreCompleto = ((datos.nombres || '') + ' ' + (datos.apellidos || '')).trim();
    if (document.getElementById('nombreCompleto')) document.getElementById('nombreCompleto').textContent = nombreCompleto || 'Tu Nombre';
  }
  
  if (campo === 'fechaNacimiento') {
    if (document.getElementById('fechaNacimiento')) document.getElementById('fechaNacimiento').value = datos.fechaNacimiento || '';
  }
  
  if (campo === 'clave') {
    if (document.getElementById('claveActual')) document.getElementById('claveActual').value = '';
    if (document.getElementById('nuevaClave')) document.getElementById('nuevaClave').value = '';
    if (document.getElementById('confirmarNuevaClave')) document.getElementById('confirmarNuevaClave').value = '';
  }
  
  mostrarMensaje('exito', 'Dato actualizado correctamente');
  return true;
}