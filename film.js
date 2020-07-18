'use strict'
sessionStorage.length == 0 ? location.href = "login.html" : "";

//Dom
const imgfullfilm = document.getElementById("imgfullfilm");
const ttitle = document.getElementById("title");
const mark = document.getElementById("mark");
const fulldescription = document.getElementById("fulldescription");
const year = document.getElementById("year");
const directed = document.getElementById("directed");
const genre = document.getElementById("genre");
const actors = document.getElementById("actors");
const logout = document.getElementById("logout");
const burger = document.getElementById("burger");
const homepage = document.getElementById("homepage");
const saved = document.getElementById("saved");
const loggout = document.getElementById("loggout");
let remainLocal = JSON.parse(localStorage.getItem("local"));
let remainSession = JSON.parse(sessionStorage.getItem("session"));

logout.addEventListener("click", () => {
    sessionStorage.clear();
})

//Vale, reconozco que esta función no es mía, pero es que se me fundirían los sesos si tuviera que escribirla yo jeje. Fuente: https://es.stackoverflow.com/questions/445/c%C3%B3mo-obtener-valores-de-la-url-get-en-javascript
//Obtener el parametro get (id de la peli) de la url
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

//funcion para sacar un elemento de un array
const removeItemFromArray = (array, item) => {
    let i = array.indexOf(item);
    i !== -1 ? array.splice(i,1) : "";
}

//función para pasarle por parametro el objeto almacenado de la sesion y el id de una pelicula y que la añada (si no la tiene) o la quite (si ya la tiene), en el localstorage del usuario con la session activa.
const refreshFav = (person, id) => {
    let username = person.username;
    let password = person.password;
    for (let i = 0; i < remainLocal.length; i++) {
        if (remainLocal[i].username == username && remainLocal[i].password == password) {
            if (remainLocal[i].favorites.includes(id)) {
                removeItemFromArray(remainLocal[i].favorites, id);
                localStorage.setItem("local", JSON.stringify(remainLocal));
                remainSession.favorites = remainLocal[i].favorites;
                sessionStorage.setItem("session", JSON.stringify(remainSession));
            } else {
                remainLocal[i].favorites.push(id);
                localStorage.setItem("local", JSON.stringify(remainLocal));
                remainSession.favorites = remainLocal[i].favorites;
                sessionStorage.setItem("session", JSON.stringify(remainSession));
            }
        }
    }
    return false;
}

//Si se ha entrado a esta dirección sin un parametro get llamado "id", redirigimos a la página principal.
const fullfilmid = getParameterByName("id");
if (fullfilmid == null || fullfilmid == "") {
    location.href = "practica2.html";
}

//Para el menu responsive
burger.addEventListener("click", ()=>{
    if(loggout.classList.contains("showmenu")){
        loggout.classList.remove("showmenu");
        loggout.classList.add("hidemenu");
        saved.classList.remove("showmenu");
        saved.classList.add("hidemenu");
        homepage.classList.remove("showmenu");
        homepage.classList.add("hidemenu");
    }else if(loggout.classList.contains("hidemenu")){
        loggout.classList.remove("hidemenu");
        loggout.classList.add("showmenu");
        saved.classList.remove("hidemenu");
        saved.classList.add("showmenu");
        homepage.classList.remove("hidemenu");
        homepage.classList.add("showmenu");
    }else{
        loggout.classList.add("showmenu");
        saved.classList.add("showmenu");
        homepage.classList.add("showmenu");
    }
});

//peticion
axios({
    method: 'GET',
    url: 'http://www.omdbapi.com/?i=' + fullfilmid + '&plot=full&apikey=3a83ea6'
})
    .then(res => {
        let img;
        if (res.data.Poster === "N/A") {
            img = "assert/unnamed.jpg"
        } else {
            img = res.data.Poster;
        }

        ttitle.textContent = res.data.Title;
        document.title = ttitle.textContent + " - Buscador de películas";
        imgfullfilm.setAttribute("src", img);
        fulldescription.textContent = res.data.Plot;
        year.textContent = res.data.Year;
        directed.textContent = res.data.Director;
        genre.textContent = res.data.Genre;
        actors.textContent = res.data.Actors;

        //Boton añadir a favorito
        if (JSON.parse(sessionStorage.getItem("session")).favorites.includes(fullfilmid)) {
            mark.classList.add("red");
            mark.textContent = "Quitar de favoritos";
            mark.addEventListener("click", () => {
                refreshFav(JSON.parse(sessionStorage.getItem("session")), fullfilmid);
                location.reload();
            });   
        } else {
            mark.classList.remove("red");
            mark.innerHTML = `Marcar como favorita &#x2764;`
            mark.addEventListener("click", () => {
                refreshFav(JSON.parse(sessionStorage.getItem("session")), fullfilmid);
                location.reload();
            });
            
        }
    })
    .catch(console.log);