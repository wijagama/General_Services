fetch('http://127.0.0.1:5000/api/usuarios')
    .then(res => res.json())
    .then(usuarios => {
        window.usuariosCargados = usuarios; 
        const lista_usuarios = document.getElementById('lista_usuarios');
        renderizarUsuarios(usuarios, lista_usuarios); 
    })
    .catch(error => {
        console.error('Error al obtener los usuarios:', error);
        const lista_usuarios = document.getElementById('lista_usuarios');
        lista_usuarios.innerHTML = '<p>Error al cargar los usuarios. Intenta nuevamente más tarde.</p>';
    });

function verDescripcion(id) {
    window.location.href = `usuario.html?id=${id}`;
}

function filtrarPorCategoria() {
    const categoriaSeleccionada = document.getElementById('categoria').value;
    const lista_usuarios = document.getElementById('lista_usuarios');

    if (categoriaSeleccionada === 'todas') {
        renderizarUsuarios(window.usuariosCargados, lista_usuarios);
    } else {
        const usuariosFiltrados = window.usuariosCargados.filter(usuario => usuario.especialidad === categoriaSeleccionada);
        renderizarUsuarios(usuariosFiltrados, lista_usuarios);
    }
}

function renderizarUsuarios(usuarios, contenedor) {
    contenedor.innerHTML = ''; 
    usuarios.forEach(usuario => {
        const div = document.createElement('div');
        div.className = 'usuario-card';
        const fotoSrc = `data:image/png;base64,${usuario.foto}`;
        div.innerHTML = `
            <img src="${fotoSrc}" alt="${usuario.nombre_foto}">
            <h2>${usuario.nombre}</h2>
            <p><strong>Especialidad:</strong> ${usuario.especialidad}</p>
            <p><strong>Correo:</strong> ${usuario.correo}</p>
            <p><strong>Teléfono:</strong> ${usuario.phone}</p>
            <p><strong>Resumen:</strong> ${usuario.resumen}</p>
            <button id="prueba" onclick="verDescripcion(${usuario.id})">Ver más</button>
            <hr>
        `;
        contenedor.appendChild(div);
    });
}
