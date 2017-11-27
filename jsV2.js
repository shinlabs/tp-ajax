var login;
var password;
var objToSend = {};

function appel() {
    var req = new XMLHttpRequest();
    login = document.getElementById("login").value;
    password = document.getElementById("password").value;

    req.open("GET", "http://37.59.100.204:8080/todo/listes", true);
    req.setRequestHeader("login", login);
    req.setRequestHeader("password", password);
    req.addEventListener('readystatechange', resultatAppel);
    req.send();

}

function resultatAppel(event) {
    if (event.target.readyState == 4 && event.target.status == 200) {
        var resultat = event.target.response;
        var obj = JSON.parse(resultat);
        var div = document.getElementById("resultat");
        div.innerHTML = "<h1 style='text-align:center'>Liste de " + obj.utilisateur + "</h1>";
        displayList(obj.todoListes);

    } else if (event.target.readyState == 4 && event.target.status != 200) {
        var div = document.getElementById("resultat");
        div.innerHTML = "Une erreur est survenue essayer plus tard";
    }
}

function appelEnvoiElement() {

    var objToSend = {};
    objToSend = creationObjToSend();
    var req = new XMLHttpRequest();

    req.open("POST", "http://37.59.100.204:8080/todo/listes/", true);
    req.setRequestHeader("content-type", "application/json; charset=utf-8");
    req.addEventListener('readystatechange', resultatAppelEnvoi);
    var ch = JSON.stringify(objToSend);
    req.send(ch);
}

function resultatAppelEnvoi(event) {
    if (event.target.readyState == 4 && event.target.status == 200) {
        var resultat = event.target.response;
        var obj = JSON.parse(resultat);
        var div = document.getElementById("resultat");
        div.innerHTML = "<h1 style='text-align:center'>Liste de " + obj.utilisateur + "</h1>";
        displayList(obj.todoListes);

    } else if (event.target.readyState == 4 && event.target.status != 200) {
        var div = document.getElementById("resultat");
        div.innerHTML = "Une erreur est survenue essayer plus tard";
    }
}

function displayList(todoListes) {

    var div = document.getElementById("resultat");

    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }

    for (var j = 0; j < todoListes.length; j++) {

        div.innerHTML += "<h3 style='color:white; padding-left:5px'>" + todoListes[j].name + "</h3>";

        var ul = document.createElement("ul");

        for (var i = 0; i < todoListes[j].elements.length; i++) {
            var li = document.createElement("li");
            li.textContent = todoListes[j].elements[i];
            ul.appendChild(li);
            delete li;

        }

        div.appendChild(ul);

        delete ul;
    }

    div.appendChild(document.createElement("br"));
    div.innerHTML += '<button onclick = "appelEnvoiElement()" id="envoyer">Envoyer</button>';

    settingIDsInDom();

}

//à chaque fois qu'on rencontre un noeud intéressant, on lui créé à la volée un listener
//grâce à la fonction createListenerOn(objDom)
function settingIDsInDom() {
    var div = document.getElementById("resultat");
    var numberOfChildsToSet = (div.childNodes.length - 2);

    for (var i = 0; i < numberOfChildsToSet; i++) { //lorsque i est pair, c'est une balise h3, et donc n = i
        var nbre = Math.floor(i / 2);

        if (i % 2 == 0) {
            div.childNodes[i].setAttribute("n", nbre);
            createListenerOn(div.childNodes[i]);
        } else { //lorsque i est impair, c'est une balise ul, et son id sera "ul"+i
            var ul = div.childNodes[i];
            ul.setAttribute("u", nbre);
            for (var j = 0; j < ul.childNodes.length; j++) {
                ul.childNodes[j].setAttribute("l", j);
                createListenerOn(ul.childNodes[j]);
            }
        }
        delete nbre;
    }
}

function createListenerOn(objDom) {
    objDom.addEventListener("click", function(event) {
        var nouvN = prompt("Nouveau nom ?");
        objDom.textContent = nouvN;
    });
}

function creationObjToSend() {

    var obj = {};
    obj.utilisateur = "mreia";
    obj.password = "nmggGCEN";
    var div = document.getElementById("resultat");
    var todoListesLength = (div.childNodes.length - 2) / 2;

    var tabToDoListes = new Array();

    for (var i = 0; i < todoListesLength; i++) {
        var objRow = {};
        var objElements = new Array();

        objRow.name = document.querySelector('[n="' + i + '"]').textContent;


        for (var j = 0; j < document.querySelector('[u="' + i + '"]').childNodes.length; j++) {
            objElements.push(document.querySelector('[u="' + i + '"]').childNodes[j].textContent);
        }
        objRow.elements = objElements;

        tabToDoListes.push(objRow);
    }
    obj.todoListes = tabToDoListes;

    return obj;
}