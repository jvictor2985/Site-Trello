var token = window.sessionStorage.getItem("token");

function criarBoard() {
  var newBoard = document.querySelector("#div1");
  newBoard.addEventListener("submit", function (e) {
    e.preventDefault();
    var formData = new FormData(newBoard);
    var request = new XMLHttpRequest;
    request.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        console.log(this.responseText);
      }
    }
    var url = "http://www.henriquesantos.pro.br:8080/api/trello/boards/new";
    request.open("POST", url);
    request.setRequestHeader('Content-Type', 'application/json');
    var name = formData.get("nomeBoard");
    console.log(name);
    var cor = null;
    var infoQuadro = {"name": name.value, "color":cor.value ,"token":token};
    infoQuadro = JSON.stringify(infoQuadro);
    request.send(infoQuadro);
    //addElementCard(name);
  })
}


/*function addElementCard(name) {
  $("#div1").append(`<a href="">
    <div class="card bg-light">
    <div class="card-body text-center">
        <p class="card-text">${name}</p>
    </div>
</div>
</a>`);
  function openBoard() {

  }*/

function exibirBoard() {
    var exibirBoards = document.querySelector("#div1");
      var request = new XMLHttpRequest();
      var board = "";
      request.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          var allBoards = JSON.parse(this.responseText);

          allBoards.forEach(function (e) {
            board += `<div draggable="true" class="card style="border: 1px solid black">
          <div onclick="openBoard(${e.id});" id='${e.id}' class="card-body text-center">
          <p class="card-text">${e.name}</p>
          </div>
            <div class="card-footer" d-flex justify-content-end">
              <span class="renomear" onclick"renomearQuadro(${e.id});">renomear</span>
              <span class="apagar" onclick"apagarQuadro(${e.id});">apagar</span>
            </div>
          </div>`
          console.log(e);
          });
        }
      }
      var url = "http://www.henriquesantos.pro.br:8080/api/trello/boards/" + token;
      request.open("GET", url);
      request.setRequestHeader('Content-Type', 'application/json');
      request.send();
    }

    exibirBoard();