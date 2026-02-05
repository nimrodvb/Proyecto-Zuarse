// ==================== CONFIGURACIÓN EMAILJS ====================
// Este archivo contiene la configuración para enviar emails

// INSTRUCCIONES:
// 1. Regístrate en https://www.emailjs.com (es gratuito)
// 2. Crea un servicio de email (Gmail, Outlook, etc)
// 3. Crea una plantilla de email con variables: {{to_email}}, {{order_id}}, etc
// 4. Copia tu PUBLIC_KEY, SERVICE_ID y TEMPLATE_ID abajo

const EMAILJS_CONFIG = {
    // Tu Public Key de EmailJS
    PUBLIC_KEY: 'l916G61c0ZQ6UUg5-',
    
    // El Service ID de tu servicio de email
    SERVICE_ID: 'service_orq3kj1',
    
    // El Template ID de tu plantilla de email
    TEMPLATE_ID: 'template_vay9db4',
    
    // Email desde el cual se enviarán los correos
    FROM_EMAIL: 'proyectoiabotfinanciero@gmail.com',
    
    // Nombre que aparecerá como remitente
    FROM_NAME: 'ZUARSE - Tienda Online'
};

// Función para inicializar EmailJS
function inicializarEmailJS() {
    try {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
        console.log('EmailJS inicializado correctamente');
        return true;
    } catch (error) {
        console.error('Error al inicializar EmailJS:', error);
        return false;
    }
}

// Función para validar la configuración
function validarConfiguracionEmailJS() {
    const requeridos = ['PUBLIC_KEY', 'SERVICE_ID', 'TEMPLATE_ID'];
    const config = EMAILJS_CONFIG;
    
    for (let key of requeridos) {
        if (!config[key] || config[key] === '') {
            console.warn(`⚠️ Configuración faltante: ${key}`);
            return false;
        }
    }
    return true;
}

// Inicializar al cargar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarEmailJS);
} else {
    inicializarEmailJS();
}
