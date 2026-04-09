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

function buscarBotonCargarMas() {
    const elementos = [...document.querySelectorAll('button, a, div, span')];

    return elementos.find(el => {
        const texto = (el.textContent || '').trim().toLowerCase();
        return texto === 'cargar mas' || texto === 'cargar más';
    });
}

document.addEventListener('DOMContentLoaded', cargarProductosTienda);







function buscarBotonCargarMas() {
    const elementos = [...document.querySelectorAll('button, a, div, span')];

    return elementos.find(el => {
        const texto = (el.textContent || '').trim().toLowerCase();
        return texto === 'cargar mas' || texto === 'cargar más';
    });
}

function clickReal(elemento) {
    if (!elemento) return;

    elemento.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    elemento.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    elemento.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

let cargandoScroll = false;

function intentarCargarMas() {
    const scrollActual = window.scrollY + window.innerHeight;
    const altoDocumento = document.documentElement.scrollHeight;

    // puedes mover este número si quieres que cargue antes
    if (scrollActual < altoDocumento - 350) return;
    if (cargandoScroll) return;

    const btnCargarMas = buscarBotonCargarMas();
    if (!btnCargarMas) return;

    cargandoScroll = true;
    console.log('Activando cargar más...');

    clickReal(btnCargarMas);

    setTimeout(() => {
        cargandoScroll = false;

        // 🔥 vuelve a revisar solo, sin que el usuario tenga que subir y bajar otra vez
        intentarCargarMas();
    }, 600);
}

window.addEventListener('scroll', intentarCargarMas);
window.addEventListener('load', () => {
    setTimeout(intentarCargarMas, 800);
});

window.addEventListener('load', () => {
    setTimeout(() => {
        const elementos = [...document.querySelectorAll('button, a, div, span')];

        const btnCargarMas = elementos.find(el => {
            const texto = (el.textContent || '').trim().toLowerCase();
            return texto === 'cargar mas' || texto === 'cargar más';
        });

        if (btnCargarMas) {
            btnCargarMas.style.display = 'none';
        }
    }, 800);
});