document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("submit").addEventListener("click", function (event) {
        event.preventDefault();

        let formData = new FormData();
        formData.append('name', document.getElementById("name").value);
        formData.append('email', document.getElementById("email").value);
        formData.append('phone', document.getElementById("phone").value);
        formData.append('summary', document.getElementById("summary").value);
        formData.append('specialty', document.getElementById("specialty").value);
        formData.append('file', document.getElementById("file").files[0]);

        fetch('http://127.0.0.1:5000/api/registro', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                document.getElementById('resultado').innerText = data.message;
                if (data.success) {
                    document.getElementById('reloading').innerText = "Redireccionando...";
                    setTimeout(() => {
                        location.reload();
                        window.location.href = "http://127.0.0.1:5500/index.html";
                    }, 3000);
                }
            })
            .catch(error => console.error('Error:', error));
    });
});
