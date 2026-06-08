// Manejo del Formulario de Inicio de Sesión
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const role = document.getElementById('role').value;

        // Almacenamos la sesión activa localmente en el navegador
        localStorage.setItem('user', username);
        localStorage.setItem('role', role);

        // Redirección automática al Dashboard principal
        window.location.href = 'dashboard.html';
    });
}

// Lógica de Protección de Rutas y Renderizado Dinámico al Cargar Pantallas
document.addEventListener('DOMContentLoaded', function() {
    const user = localStorage.getItem('user');
    const role = localStorage.getItem('role');

    // Si intenta acceder a una sección interna sin loguearse, lo regresa al Login
    if (!user && !window.location.href.includes('index.html')) {
        window.location.href = 'index.html';
    }

    // Inyectar datos de sesión en la interfaz actual
    if (document.getElementById('user-display')) {
        document.getElementById('user-display').innerText = user;
        document.getElementById('role-display').innerText = role;
    }

    // CONTROL DE PRIVILEGIOS: Si el rol es Voluntario, ocultamos las opciones CRUD de administración
    if (role === 'Voluntario') {
        const crudMenu = document.getElementById('menu-inventario');
        if (crudMenu) {
            crudMenu.style.display = 'none'; // Protege visualmente la sección CRUD de inventario
        }
        // Si el voluntario intenta entrar directamente por URL al inventario, lo rebota
        if (window.location.href.includes('inventario.html')) {
            alert('Acceso Denegado: Su rol Operativo no tiene permisos de Administrador.');
            window.location.href = 'dashboard.html';
        }
    }
});

// Función global de Salida Segura del Sistema
function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}