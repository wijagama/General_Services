document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
        fetch(`http://127.0.0.1:5000/api/usuarios/${id}`)
            .then(res => {
                if (!res.ok) throw new Error("Error en la respuesta de la API");
                return res.json();
            })
            .then(usuario => {
                document.getElementById("especialidad").innerHTML = usuario.especialidad || 'No especificado';
                document.getElementById("nombre").innerHTML = usuario.nombre || 'Desconocido';
                document.getElementById("resumen").innerHTML = usuario.resumen || 'Sin resumen disponible';
                document.getElementById("correo").innerHTML = usuario.correo || 'No disponible';
                document.getElementById("phone").innerHTML = usuario.phone || 'No proporcionado';

                if (usuario.foto) {
                    const fotoElement = document.getElementById("foto");
                    fotoElement.src = `data:image/png;base64,${usuario.foto}`;
                    fotoElement.alt = usuario.nombre;
                } else {
                    console.log("No se encontró una foto para este usuario.");
                }
            })
            .catch(error => {
                console.error('Error al obtener el usuario:', error);
                const usuarioContainer = document.getElementById('usuario_detalle');
                usuarioContainer.innerHTML = '<p>Error al cargar los detalles del usuario. Intenta nuevamente más tarde.</p>';
            });
    } else {
        const usuarioContainer = document.getElementById('usuario_detalle');
        usuarioContainer.innerHTML = '<p>No se proporcionó un ID válido para el usuario.</p>';
    }
});
