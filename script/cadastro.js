function cadastrarUsuario(){
    var formCadastrarUsuario = document.querySelector("#cadastrar_usuario_form");
    formCadastrarUsuario.addEventListener("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(formCadastrarUsuario);
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log(this.responseText);
            }
        }
        var url = "http://www.henriquesantos.pro.br:8080/api/trello/users/new";
        request.open("POST", url);
        request.setRequestHeader('Content-Type', 'application/json');

        var name = formData.get("name");
        var username = formData.get("username");
        var password = formData.get("password");
        var newUser = {"name": name, "username":username, "password":password};
        var infoNewUser = JSON.stringify(newUser);
        request.send(infoNewUser);
    });
}