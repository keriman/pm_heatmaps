// Sistema de alertas con SweetAlert2
(function() {
    'use strict';

    // Configuración global de SweetAlert2
    const defaultConfig = {
        confirmButtonColor: '#667eea',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        customClass: {
            confirmButton: 'btn btn-primary px-4',
            cancelButton: 'btn btn-secondary px-4'
        },
        buttonsStyling: false
    };

    // Objeto global para manejar alertas
    window.Alert = {
        // Alerta de éxito
        success(title, message = '') {
            return Swal.fire({
                icon: 'success',
                title: title,
                text: message,
                ...defaultConfig,
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: message !== ''
            });
        },

        // Alerta de error
        error(title, message = '') {
            return Swal.fire({
                icon: 'error',
                title: title,
                text: message,
                ...defaultConfig
            });
        },

        // Alerta de advertencia
        warning(title, message = '') {
            return Swal.fire({
                icon: 'warning',
                title: title,
                text: message,
                ...defaultConfig
            });
        },

        // Alerta de información
        info(title, message = '') {
            return Swal.fire({
                icon: 'info',
                title: title,
                text: message,
                ...defaultConfig
            });
        },

        // Confirmación
        confirm(title, message = '', confirmText = 'Sí, continuar') {
            return Swal.fire({
                icon: 'question',
                title: title,
                text: message,
                showCancelButton: true,
                confirmButtonText: confirmText,
                ...defaultConfig
            });
        },

        // Confirmación de eliminación
        confirmDelete(title = '¿Estás seguro?', message = 'Esta acción no se puede deshacer') {
            return Swal.fire({
                icon: 'warning',
                title: title,
                text: message,
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                confirmButtonColor: '#dc3545',
                ...defaultConfig
            });
        },

        // Alerta de carga (loading)
        loading(title = 'Procesando...', message = 'Por favor espera') {
            return Swal.fire({
                title: title,
                text: message,
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
        },

        // Cerrar alerta de carga
        closeLoading() {
            Swal.close();
        },

        // Toast notification (pequeña notificación)
        toast(type, message, position = 'top-end') {
            const Toast = Swal.mixin({
                toast: true,
                position: position,
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer);
                    toast.addEventListener('mouseleave', Swal.resumeTimer);
                }
            });

            return Toast.fire({
                icon: type,
                title: message
            });
        },

        // Formulario simple con input
        async prompt(title, inputLabel = '', inputType = 'text', inputValue = '') {
            const result = await Swal.fire({
                title: title,
                input: inputType,
                inputLabel: inputLabel,
                inputValue: inputValue,
                showCancelButton: true,
                inputValidator: (value) => {
                    if (!value) {
                        return 'Este campo es requerido';
                    }
                },
                ...defaultConfig
            });

            return result;
        },

        // Formulario para cambiar contraseña
        async changePasswordForm() {
            const { value: formValues } = await Swal.fire({
                title: 'Cambiar Contraseña',
                html: `
                    <div class="mb-3">
                        <label class="form-label">Contraseña Actual</label>
                        <input type="password" id="swal-current-password" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Nueva Contraseña</label>
                        <input type="password" id="swal-new-password" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Confirmar Nueva Contraseña</label>
                        <input type="password" id="swal-confirm-password" class="form-control" required>
                    </div>
                `,
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: 'Cambiar Contraseña',
                preConfirm: () => {
                    const currentPassword = document.getElementById('swal-current-password').value;
                    const newPassword = document.getElementById('swal-new-password').value;
                    const confirmPassword = document.getElementById('swal-confirm-password').value;

                    if (!currentPassword || !newPassword || !confirmPassword) {
                        Swal.showValidationMessage('Todos los campos son requeridos');
                        return false;
                    }

                    if (newPassword.length < 6) {
                        Swal.showValidationMessage('La contraseña debe tener al menos 6 caracteres');
                        return false;
                    }

                    if (newPassword !== confirmPassword) {
                        Swal.showValidationMessage('Las contraseñas no coinciden');
                        return false;
                    }

                    return {
                        currentPassword: currentPassword,
                        newPassword: newPassword
                    };
                },
                ...defaultConfig
            });

            return formValues;
        },

        // Formulario para crear usuario
        async createUserForm() {
            const { value: formValues } = await Swal.fire({
                title: 'Crear Nuevo Usuario',
                html: `
                    <div class="mb-3">
                        <label class="form-label">Usuario</label>
                        <input type="text" id="swal-username" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Nombre Completo</label>
                        <input type="text" id="swal-fullname" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Contraseña</label>
                        <input type="password" id="swal-password" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Rol</label>
                        <select id="swal-role" class="form-select">
                            <option value="user">Usuario</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>
                `,
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: 'Crear Usuario',
                width: '500px',
                preConfirm: () => {
                    const username = document.getElementById('swal-username').value;
                    const fullname = document.getElementById('swal-fullname').value;
                    const password = document.getElementById('swal-password').value;
                    const role = document.getElementById('swal-role').value;

                    if (!username || !password) {
                        Swal.showValidationMessage('Usuario y contraseña son requeridos');
                        return false;
                    }

                    if (password.length < 6) {
                        Swal.showValidationMessage('La contraseña debe tener al menos 6 caracteres');
                        return false;
                    }

                    return {
                        username: username,
                        fullname: fullname,
                        password: password,
                        role: role
                    };
                },
                ...defaultConfig
            });

            return formValues;
        },

        // Alerta de error de autenticación
        authError(message = 'No tienes permiso para realizar esta acción') {
            return Swal.fire({
                icon: 'error',
                title: 'Acceso Denegado',
                text: message,
                confirmButtonText: 'Entendido',
                ...defaultConfig
            });
        },

        // Alerta de sesión expirada
        sessionExpired() {
            return Swal.fire({
                icon: 'warning',
                title: 'Sesión Expirada',
                text: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.',
                confirmButtonText: 'Ir a Login',
                allowOutsideClick: false,
                allowEscapeKey: false,
                ...defaultConfig
            }).then(() => {
                window.location.href = 'login.html';
            });
        },

        // Mostrar progreso de carga de archivo
        uploadProgress(filename) {
            let timerInterval;
            return Swal.fire({
                title: 'Cargando Archivo',
                html: `
                    <p class="mb-3">${filename}</p>
                    <div class="progress">
                        <div id="upload-progress-bar" class="progress-bar progress-bar-striped progress-bar-animated"
                             role="progressbar" style="width: 0%"></div>
                    </div>
                    <p class="mt-2 text-muted" id="upload-percentage">0%</p>
                `,
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
        },

        // Actualizar progreso
        updateProgress(percentage) {
            const progressBar = document.getElementById('upload-progress-bar');
            const percentageText = document.getElementById('upload-percentage');
            if (progressBar) {
                progressBar.style.width = percentage + '%';
            }
            if (percentageText) {
                percentageText.textContent = percentage + '%';
            }
        },

        // Alerta personalizada para exportación
        exportSuccess(filename) {
            return Swal.fire({
                icon: 'success',
                title: 'Exportación Exitosa',
                html: `
                    <p class="mb-0">El archivo ha sido descargado:</p>
                    <p class="fw-bold text-primary">${filename}</p>
                `,
                confirmButtonText: 'Aceptar',
                ...defaultConfig,
                timer: 5000,
                timerProgressBar: true
            });
        },

        // Mostrar detalles de error técnico
        technicalError(errorMessage, errorStack = null) {
            return Swal.fire({
                icon: 'error',
                title: 'Error Técnico',
                html: `
                    <div class="text-start">
                        <p class="fw-bold">Mensaje de error:</p>
                        <pre class="bg-light p-2 rounded small">${errorMessage}</pre>
                        ${errorStack ? `
                            <details class="mt-2">
                                <summary class="cursor-pointer text-muted">Ver detalles técnicos</summary>
                                <pre class="bg-light p-2 rounded small mt-2">${errorStack}</pre>
                            </details>
                        ` : ''}
                    </div>
                `,
                confirmButtonText: 'Cerrar',
                width: '600px',
                ...defaultConfig
            });
        }
    };

    // Sobrescribir console.error para mostrar alertas automáticamente en desarrollo
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const originalConsoleError = console.error;
        console.error = function(...args) {
            originalConsoleError.apply(console, args);
            // Opcional: Descomentar para mostrar todos los errores en desarrollo
            // Alert.toast('error', 'Error en consola: ' + args[0]);
        };
    }

    console.log('Sistema de alertas SweetAlert2 inicializado');
})();
