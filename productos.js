let modoCategoria = false;



document.addEventListener('DOMContentLoaded', cargarProductosTienda);

document.addEventListener('DOMContentLoaded', () => {
    const inputBusqueda = document.getElementById('busqueda-producto');

    if (!inputBusqueda) return;

    inputBusqueda.addEventListener('input', () => {
        const texto = inputBusqueda.value.trim();
        const btnCargarMas = document.getElementById('load-more');

        if (texto === '') {
            currentItem = 8;
            cargarProductosTienda();

            setTimeout(() => {
                if (btnCargarMas) {
                    btnCargarMas.style.display = 'none';
                }

                intentarCargarMas();
            }, 300);

        } else {
            if (btnCargarMas) {
                btnCargarMas.style.display = 'none';
            }

            cargarProductosPorBusqueda(texto);
        }
    });
});




// ==================================================================================cargar los productos=================================================================
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




// ============================================================================== CARGAR CATEGORÍAS ======
const listaCategorias = document.getElementById('lista-categorias');

if (listaCategorias) {
    listaCategorias.innerHTML = '';

    const categorias = [
        "Todas",
        ...new Set(productos.map(p => p.CATEGORIA || "Sin categoría"))
    ];

categorias.forEach(cat => {
    const li = document.createElement('li');
    li.textContent = cat;

   li.addEventListener('click', () => {
    const btnCargarMas = document.getElementById('load-more');

    if (cat === 'Todas') {
        modoCategoria = false;

        currentItem = 8;

        cargarProductosTienda();

        setTimeout(() => {
            if (btnCargarMas) {
                btnCargarMas.style.display = 'none';
            }

            intentarCargarMas();
        }, 300);

    } else {
        modoCategoria = true;

        if (btnCargarMas) {
            btnCargarMas.style.display = 'none';
        }

        cargarProductosTienda2(cat);
    }
});

    listaCategorias.appendChild(li);
});
}

// =============================================================================== CARGAR CATEGORÍAS ======


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



if (document.body.dataset.scrollAuto === 'true') {

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
        if (modoCategoria) return;

        const scrollActual = window.scrollY + window.innerHeight;
        const altoDocumento = document.documentElement.scrollHeight;

        if (scrollActual < altoDocumento - 350) return;
        if (cargandoScroll) return;

        const btnCargarMas = buscarBotonCargarMas();
        if (!btnCargarMas) return;

        cargandoScroll = true;
        clickReal(btnCargarMas);

        setTimeout(() => {
            cargandoScroll = false;
            intentarCargarMas();
        }, 500);
    }

    window.addEventListener('scroll', intentarCargarMas);

    window.addEventListener('load', () => {
        setTimeout(() => {
            const btnCargarMas = buscarBotonCargarMas();
            if (btnCargarMas) {
                btnCargarMas.style.display = 'none';
            }

            intentarCargarMas();
        }, 300);
    });

}



//======================================================================= Categorias de producto ==========================================================================


async function cargarProductosTienda2(categoria) {
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

        const productosFiltrados = productos.filter(producto =>
            (producto.CATEGORIA || 'Sin categoría').toLowerCase() === categoria.toLowerCase()
        );

        if (productosFiltrados.length === 0) {
            contenedor.innerHTML = '<p>No hay productos en esta categoría.</p>';
            return;
        }

        productosFiltrados.forEach(producto => {
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
        console.error('Error al cargar productos por categoría:', error);
        contenedor.innerHTML = '<p>Error al cargar productos.</p>';
    }
}



//==========================================================================BARRA DE BUSCAR=====================================================================
async function cargarProductosPorBusqueda(textoBusqueda) {
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

        const texto = textoBusqueda.toLowerCase().trim();

        const productosFiltrados = productos.filter(producto =>
            (producto.NOMBRE || '').toLowerCase().includes(texto)
        );

        if (productosFiltrados.length === 0) {
            contenedor.innerHTML = '<p>No se encontraron productos.</p>';
            return;
        }

        productosFiltrados.forEach(producto => {
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
        console.error('Error al buscar productos:', error);
        contenedor.innerHTML = '<p>Error al buscar productos.</p>';
    }
}
