// Función para cargar los productos desde la base de datos y mostrarlos en la tienda
async function cargarProductosTienda() {
    const contenedor = document.getElementById('lista-1');

    if (!contenedor) return;

    contenedor.innerHTML = '';

    try {
        const respuesta = await fetch('/api/productos');
        const data = await respuesta.json();

        if (!respuesta.ok || !data.ok) {
            throw new Error(data.mensaje || 'No se pudieron cargar los productos');
        }

        const productos = data.productos || [];

        if (productos.length === 0) {
            contenedor.innerHTML = '<p>No hay productos disponibles.</p>';
            return;
        }

        productos.forEach(producto => {
            const box = document.createElement('div');
            box.className = 'box';

            box.innerHTML = `
                <img src="${producto.URL_IMAGEN || 'images/default.png'}" alt="${producto.NOMBRE}">
                <div class="product-text">
                    <h3>${producto.NOMBRE}</h3>
                    <p>${producto.DESCRIPCION || ''}</p>
                    <p class="precio">₡${parseFloat(producto.PRECIO).toFixed(2)}</p>
                    <a href="#" class="agregar-carrito btn-3" data-id="${producto.ID}">
                        Agregar al carrito
                    </a>
                </div>
            `;

            contenedor.appendChild(box);
        });

    } catch (error) {
        console.error('Error al cargar productos:', error);
        contenedor.innerHTML = '<p>Error al cargar productos.</p>';
    }
}

// Ejecuta cuando carga la página
document.addEventListener('DOMContentLoaded', cargarProductosTienda);