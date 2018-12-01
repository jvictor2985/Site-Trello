var token = window.sessionStorage.getItem("token");
var idBoardAtual;
var idListAtual;
var idCardAtual;
var novaIdList;

function checarLogin() {
  if (token == null) {
    window.open("front_Login.html", "_self");
  }
};

function deslogar() {
  token = "";
  window.open("front_Login.html", "_self");
};

function definirNome() {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var nome = JSON.parse(this.responseText).name;
      document.getElementById("nomeUsuario").innerHTML = "Bem-vindo, " + nome;
    }
  }
  var url = "http://www.henriquesantos.pro.br:8080/api/trello/users/" + token;
  request.open("GET", url);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send();
};

function criarBoard() {
  var newBoard = document.querySelector("#novoBoard");
  var formData = new FormData(newBoard);
  var request = new XMLHttpRequest();
  //console.log(formData);
  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var allBoards = JSON.parse(this.responseText);
    }
  }
  var url = "http://www.henriquesantos.pro.br:8080/api/trello/boards/new";
  request.open("POST", url);
  request.setRequestHeader('Content-type', 'application/json');
  var name = formData.get("nomeBoard");
  //console.log(name);
  var cor = null;
  var quadro = { "name": name, "color": cor, "token": token };
  //console.log(quadro);
  var infoQuadro = JSON.stringify(quadro);
  console.log(infoQuadro);
  request.send(infoQuadro);
  //recarregarPag();
  //window.location.reload();
  var resetName = formData.set("nomeBoard", "");
  listaBoards();
};

function listaBoards() {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
      var quadroCriados = JSON.parse(this.responseText);
      exibirBoard();
    }
  }
  var url = "http://www.henriquesantos.pro.br:8080/api/trello/boards/" + token;
  request.open("GET", url);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send();
};

function exibirBoard() {
  var exibirBoards = document.querySelector("#div_boards");
  var request = new XMLHttpRequest();
  var board = "";
  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var boardExibido = JSON.parse(this.responseText);
      boardExibido.forEach(function (e) {
        board += ` </br>
        <div class="quadro col-sm-6 col-md-6 col-lg-3 col-xl-3">
        <div class="card text-white bg-light" style="background: linear-gradient(#000428,#004e92) no-repeat center top fixed; font-family: 'Times New Roman', Times, serif;margin-top:3%;">
            <div class="card-header" onclick="exibirListaQuadro(${e.id})">ID (${e.id})</div>
            <div class="card-body" onclick="exibirListaQuadro(${e.id})">
              <h4 class="card-title" id="nomeBoard">${e.name}</h4>
              <p class="card-text">
            </p>
          </div>
          <div class="card-footer">
            <button type="button" class="btn btn-primary" onclick="renomearBoard(${e.id})">
                <i class="fas fa-pencil-alt"> Renomear</i>
            </button>
            <button type="button" class="btn btn-danger" onclick="excluirBoard(${e.id})">
                <i class="fas fa-trash-alt"> Excluir</i>
            </button>
          </div>
        </div>
        </div>`;
      });
      exibirBoards.innerHTML = board;
    }
  }
  var url = "http://www.henriquesantos.pro.br:8080/api/trello/boards/" + token;
  request.open("GET", url);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send();
};

function renomearBoard(idBoard) {
  var solicitar = new XMLHttpRequest();
  var novoNome;
  var infoRename;
  var rename;
  novoNome = prompt("Digite o novo nome do quadro:");
  rename = { "board_id": idBoard, "name": novoNome, "token": token };
  infoRename = JSON.stringify(rename);
  console.log(infoRename);
  solicitar.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      console.log(this.responseText);
      listaBoards();
    }
  }
  var url = "http://www.henriquesantos.pro.br:8080/api/trello/boards/rename";
  solicitar.open("PATCH", url);
  solicitar.setRequestHeader('Content-Type', 'application/json');
  //recarregarPag();
  solicitar.send(infoRename);
};

function excluirBoard(idBoard) {
  console.log(idBoard);
  var deletar;
  var infoDeletar;
  var request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    console.log(this.responseText);
    deletar = { "board_id": idBoard, "token": token };
    console.log(deletar);
    infoDeletar = JSON.stringify(deletar);
    console.log(infoDeletar);
    listaBoards();
  }
  var url = "http://www.henriquesantos.pro.br:8080/api/trello/boards/delete";
  request.open("DELETE", url);
  request.setRequestHeader('Content-Type', 'application/json');
  var confirmDeletar = confirm("Deseja realmente excluir este quadro?");
  if (confirmDeletar == true) {
    request.send(infoDeletar);
    //recarregarPag();
  }
};

function exibirListaQuadro(idBoard) {
  console.log(idBoard);
  idBoardAtual = window.sessionStorage.setItem("idBoardAtual", idBoard);
  document.getElementById('boards').style.display = 'none';
  document.getElementById('lists').style.display = 'block';
  listaLists();
};

function criarList() {
  var newList = document.querySelector("#novoList");
  // alert("Cria um list");
  var formData = new FormData(newList);
  var request = new XMLHttpRequest();
  //console.log(formData);
  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var allLists = JSON.parse(this.responseText);
      listaLists();
    }
  }
  var url = "http://www.henriquesantos.pro.br:8080/api/trello/lists/new";
  request.open("POST", url);
  request.setRequestHeader('Content-type', 'application/json');
  var name = formData.get("nomeList");
  //console.log(name);
  var list = { "name": name, "token": token, "board_id": sessionStorage.getItem("idBoardAtual") };
  console.log(list);
  var infoList = JSON.stringify(list);
  console.log(infoList);
  request.send(infoList);
  listaLists();
};

function listaLists() {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var listsCriados = JSON.parse(this.responseText);
      exibirList(listsCriados);
    }
  }
  var url = "http://www.henriquesantos.pro.br:8080/api/trello/lists/" + token + "/board/" + sessionStorage.getItem("idBoardAtual");
  request.open("GET", url);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send();
  listaTags();
};

function exibirList(listsCriados) {
  var exibirLists = document.getElementById("div_lists");
  var listsDisponiveis = document.getElementById("listsDisponiveis");
  var request = new XMLHttpRequest();
  var list = "";
  var listDisponivel = "";
  listsCriados.forEach(function (e) {
    list += `<div class"lista col-6 col-sm-6 col-md-6 col-lg-3 col-xl-3" ondrop="drop(event, ${e.id})" ondragover="allowDrop(event)">
        <div class="card text-white bg-light mb-2" style="background: linear-gradient(#2C3E50,#4CA1AF) no-repeat center top fixed; font-family: 'Times New Roman', Times, serif;">
        <div class="card-header">ID (${e.id})</div>
        <div class="card-body">
            <h4 class="card-title">${e.name}</h4>
            <p class="card-text"></p>
            <div id="cardsList${e.id}"></div>
            </div>
        
        <div class="card-footer">
            <button type="button" class="btn btn-primary" onclick="renomearList(${e.id})">
                <i class="fas fa-pencil-alt"></i>
            </button>
            <button type="button" class="btn btn-danger" onclick="excluirList(${e.id})">
                <i class="fas fa-trash-alt"></i>
            </button>
            <button type="button" class="btn btn-success" onclick="modalCriarCard(${e.id})">
                <i class="fas fa-plus-circle">Adicionar cartão</i>
            </button>
        </div>
    </div>`;

    listaCards(e.id);
    //console.log(e.id);
  });
  exibirLists.innerHTML = list;
  listsCriados.forEach(function (e) {
    listDisponivel += `<option value=${e.id}>${e.name}</option>`
  })
  listsDisponiveis.innerHTML = listDisponivel;
  //listaLists();
};

function renomearList(idList) {
  var request = new XMLHttpRequest();
  var novoNome = "";
  var infoRename;
  var rename;
  request.onreadystatechange = function () {
    console.log(this.responseText);
    novoNome = prompt("Digite o novo nome do list:");
    rename = { "list_id": idList, "name": novoNome, "token": token };
    infoRename = JSON.stringify(rename);
    listaLists();
  }
  var url = "http://www.henriquesantos.pro.br:8080/api/trello/lists/rename";
  request.open("PATCH", url);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send(infoRename);
};

function excluirList(idList) {
  var deletar;
  var infoDeletar;
  var request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    console.log(this.responseText);
    deletar = { "list_id": idList, "token": token };
    infoDeletar = JSON.stringify(deletar);
    listaLists();
  }
  var url = "http://www.henriquesantos.pro.br:8080/api/trello/lists/delete";
  request.open("DELETE", url);
  request.setRequestHeader('Content-Type', 'application/json');
  var confirmDeletar = confirm("Deseja realmente excluir esta lista?");
  if (confirmDeletar == true) {
    request.send(infoDeletar);
  }
};

function criarCard() {
  var newCard = document.querySelector("#novoCard");
  var formData = new FormData(newCard);
  var request = new XMLHttpRequest();
  console.log(formData);
  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var allCards = JSON.parse(this.responseText);

    }
  }
  var url = "http://www.henriquesantos.pro.br:8080/api/trello/cards/new"
  request.open("POST", url);
  request.setRequestHeader('Content-Type', 'application/json');
  var name = formData.get("nomeCard");
  console.log(name);
  var card = { "name": name, "token": token, "list_id": sessionStorage.getItem("idListAtual") };
  var infoCard = JSON.stringify(card);
  console.log(infoCard);
  request.send(infoCard);
  sessionStorage.removeItem("idListAtual");
  listaLists(sessionStorage.getItem("idBoardAtual"));
};

function listaCards(idListAtual) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var cardsCriados = JSON.parse(this.responseText);
      exibirCards(cardsCriados, idListAtual)
    }
  }
  var url = "http://www.henriquesantos.pro.br:8080/api/trello/cards/" + token + "/list/" + idListAtual;
  request.open("GET", url);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send();
};

function exibirCards(cardsCriados, idListAtual) {
  var exibirCard = document.getElementById("cardsList" + idListAtual);
  var card = "";
  cardsCriados.forEach(function (e) {
    card += `<div class="card-deck" draggable="true" ondragstart="drag(event)">
      <div class="card text-white bg-light" style="background: linear-gradient(#3E5151,#DECBA4) no-repeat center top fixed; font-family: 'Times New Roman', Times, serif;">
      <div class="card-body text-center">
              <p class="card-text">${e.name}(${e.id})</p>
              <div id="tags"></div>
          </div>
          <div class="card-footer">
              <button type="button" onclick="renomearCard(${e.id})">
                  <i class="fas fa-pencil-alt"></i>
              </button>
              <button class="button" onclick="excluirCard(${e.id})">
                  <i class="fas fa-trash-alt"></i>
              </button>
              <button class="button" onclick="modalComentarios(${e.id})">
                  <i class="fas fa-comments"></i>
              </button>
              <button class="button" onclick="modalMover(${e.id})">
                  <i class="fas fa-people-carry">Mover Cartão</i>
              </button>
              <button class="button" onclick="modalTag(${e.id})">Tags</button>
          </div>
      </div>
  </div>`;
  });
  console.log(card);
  exibirCard.innerHTML = card;
}


function renomearCard(idCard) {
  var request = new XMLHttpRequest();
  var novoNome = "";
  var rename;
  var infoRename;
  request.onreadystatechange = function () {
    console.log(this.responseText);
    novoNome = prompt("Digite o novo nome do card:");
    rename = { "token": token, "card_id": idCard, "name": novoNome };
    infoRename = JSON.stringify(rename);
    console.log(infoRename);
    listaLists(sessionStorage.getItem("idBoardAtual"));
  }
  var url = "http://www.henriquesantos.pro.br:8080/api/trello/cards/rename";
  request.open("PATCH", url);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send(infoRename);
}

function excluirCard(idCard) {
  var deletar;
  var infoDeletar;
  var request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    console.log(this.responseText);
    deletar = { "card_id": idCard, "token": token };
    infoDeletar = JSON.stringify(deletar);

  }
  var url = "http://www.henriquesantos.pro.br:8080/api/trello/cards/delete";
  request.open("DELETE", url);
  request.setRequestHeader('Content-Type', 'application/json');
  var confirmDeletar = confirm("Deseja realmente excluir este card?");
  if (confirmDeletar == true) {
    request.send(infoDeletar);
    listaLists(sessionStorage.getItem("idBoardAtual"));
  }
}

function criarComent() {
  var newComent = document.querySelector("#novoComent");
  var formData = new FormData(newComent);
  var request = new XMLHttpRequest();
  console.log(formData);
  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var allComents = JSON.parse(this.responseText);
    }
  }
  var url = "http://www.henriquesantos.pro.br:8080/api/trello/cards/addcomment";
  request.open("POST", url);
  request.setRequestHeader('Content-Type', 'application/json');
  var coment = formData.get("coment");
  console.log(coment)
  var comentario = { "card_id": sessionStorage.getItem("idCardAtual"), "comment": coment, "token": token };
  console.log(comentario);
  var infoComentario = JSON.stringify(comentario);
  console.log(infoComentario);
  request.send(infoComentario);
}

function listaComentarios() {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      // console.log(this.responseText);
      var comentsCriados = JSON.parse(this.responseText);
      //console.log(comentsCriados);
      exibirComentarios(comentsCriados);
    }
  }
  var url = "http://www.henriquesantos.pro.br:8080/api/trello/cards/" + token + "/" + sessionStorage.getItem("idCardAtual") + "/comments"
  request.open("GET", url);
  request.setRequestHeader("Content-Type", 'application/json');
  request.send();
}

function exibirComentarios(comentsCriados) {
  var mostrarComents = document.querySelector("#div_coments");
  var coment = "";
  comentsCriados.forEach(function (e) {
    coment += `<div class="card">
      <div class="card text-black bg-light">
          <div class="card-body text-center">
              <p class="card-text" id="comentario">${e.comment}</p>
          </div>
      </div>
  </div>`
  });
  mostrarComents.innerHTML = coment;
}

function voltarBoard() {
  recarregarPag();
};

function modalCriarList() {
  $("#criar_list").modal("show");
};

function modalCriarCard(idList) {
  idListAtual = window.sessionStorage.setItem("idListAtual", idList);

  $("#criar_card").modal("show");
};

function modalComentarios(idCard) {
  idCardAtual = window.sessionStorage.setItem("idCardAtual", idCard);
  listaComentarios();
  $("#comentarios").modal("show");
}

function modalMover(idCard) {
  idCardAtual = window.sessionStorage.setItem("idCardAtual", idCard);
  $("#mover").modal("show");
}

function modalTag(idCard) {
  idCardAtual = window.sessionStorage.setItem("idCardAtual", idCard);
  possiveisTags();
  $("#tags").modal("show")
}

function recarregarPag() {
  window.location.reload();
};

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drop(ev, idList) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  var moverCard = { "token": token, "card_id": sessionStorage.getItem("idCardAtual"), "list_id": idList }
  var infoMoverCard = JSON.stringify(moverCard);
  console.log(infoMoverCard);
  var request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      listaLists(sessionStorage.getItem("id_board"));
    }

  }
  var url = "http://www.henriquesantos.pro.br:8080/api/trello/cards/changelist";
  request.open("PATCH", url);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send(infoMoverCard);
}

function moverCard() {
  var request = new XMLHttpRequest();
  var id = document.getElementById("listsDisponiveis");
  var moverCard = { "token": token, "card_id": sessionStorage.getItem("idCardAtual"), "list_id": id.value };
  var infoMoverCard = JSON.stringify(moverCard);
  console.log(infoMoverCard);
  request.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      listaLists(sessionStorage.getItem("id_board"));
    }
  }
  var url = "http://www.henriquesantos.pro.br:8080/api/trello/cards/changelist";
  request.open("PATCH", url);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send(infoMoverCard);
}

function possiveisTags() {
  var request = new XMLHttpRequest();
  var tags;
  request.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      var tags = JSON.parse(this.responseText);
      console.log(tags);
      exibirPossiveisTags(tags);
    }
  }
  var url = "http://www.henriquesantos.pro.br:8080/api/trello/tags";
  request.open("GET", url);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send();
}

function exibirPossiveisTags(tags) {
  var tagsDisponiveis = document.getElementById("tagsDisponiveis");
  var tagDisponivel = "";
  tags.forEach(function (e) {
    tagDisponivel += `<option value=${e.id}>${e.tag}</option>`;
  });
  tagsDisponiveis.innerHTML = tagDisponivel;
}

function addTag() {
  var request = new XMLHttpRequest();
  var id = document.getElementById("tagsDisponiveis");
  var newTag = { "card_id": sessionStorage.getItem("idCardAtual"), "tag_id": id.value, "token": token };
  var infoNewTag = JSON.stringify(newTag);
  console.log(infoNewTag);
  request.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      listaLists(sessionStorage.getItem("id_board"));
    }
  }
  var url = "http://www.henriquesantos.pro.br:8080/api/trello/cards/addtag";
  request.open("POST", url);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send(infoNewTag);
}

function listaTags() {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      var tagsCriadas = JSON.parse(this.responseText);
      exibirTags(tagsCriadas);
    }
  }
  var url = "http://www.henriquesantos.pro.br:8080/api/trello/cards/" + token + "/" + sessionStorage.getItem("idCardAtual") + "/tags";
  request.open("GET", url);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send();
}

function exibirTags(tagsCriadas) {
  var tags = document.getElementById("tags");
  var tag = "";
  tagsCriadas.forEach(function (e) {
    tag += `<div style="max-height:0.3%; max-width:5%;background-color:${e.color};">${e.tag}</div>`
  });
  tagsCriadas.innerHTML = tag;
}
exibirBoard();
checarLogin();
definirNome();