'use strict'

//Si no hay sessionstorage que redirija y si no hay localstorage que lo cree
sessionStorage.length == 0 ? location.href = "login.html": "";
localStorage.getItem("local") == null ? localStorage.setItem("local", JSON.stringify([{username: "admin", password: "admin", favorites: ["tt1790885"]}])) : "";

//dom
const username = document.getElementById("username");
const favnum = document.getElementById("favnum");
const films = document.getElementById("films");
const logout = document.getElementById("logout");
const burger = document.getElementById("burger");
const homepage = document.getElementById("homepage");
const saved = document.getElementById("saved");
const loggout = document.getElementById("loggout");
let remainLocal = JSON.parse(localStorage.getItem("local"));
let session = JSON.parse(sessionStorage.getItem("session"));

/*Funciones*/
//función para pasarle por parametro el objeto almacenado en la sesion y devuelva true o false en base a si ya está registrado en el local
const isRegistred = (person) =>{
    let username = person.username;
    let password = person.password;
    for (let i = 0; i < remainLocal.length; i++) {
        if(remainLocal[i].username == username && remainLocal[i].password == password){
            return true;
            break;
        }
    }
    return false;
}

//Funcion que devuelva la posicion del array de localstorage en la que está registrado el usuario de la sesión
const positionOf = (person) =>{
    let username = person.username;
    let password = person.password;
    for (let i = 0; i < remainLocal.length; i++) {
        if(remainLocal[i].username == username && remainLocal[i].password == password){
            return i
        }
    }
    return false;
}

//función para pasarle por parametro el objeto almacenado en la sesion y devuelva un array con los id de las peliculas marcadas como favorito
const favFilms = (person) =>{
    let username = person.username;
    let password = person.password;
    for (let i = 0; i < remainLocal.length; i++) {
        if(remainLocal[i].username == username && remainLocal[i].password == password){
            return remainLocal[i].favorites;
            break;
        }
    }
    return false;
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
                session.favorites = remainLocal[i].favorites;
                sessionStorage.setItem("session", JSON.stringify(session));
            } else {
                remainLocal[i].favorites.push(id);
                localStorage.setItem("local", JSON.stringify(remainLocal));
                session.favorites = remainLocal[i].favorites;
                sessionStorage.setItem("session", JSON.stringify(session));
            }
        }
    }
    return false;
}

/*Ejecucion*/
//Si el usuario de la sesión no esta registrado se registra y si sí recupere la sesion los archivos ya guardados del usuario en el local.
if(!isRegistred(session)){
    remainLocal.push(session);
    localStorage.setItem("local", JSON.stringify(remainLocal));
}else{
    session = remainLocal[positionOf(session)];
    sessionStorage.setItem("session", JSON.stringify(session));
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

//rellenar dom
username.textContent = session.username;
favnum.textContent = favFilms(session).length;
const pelis = favFilms(session);

//logout
logout.addEventListener("click", ()=>{
    sessionStorage.clear();
})

//Peticion
for (let i = 0; i < pelis.length; i++) {
    axios({
        method: 'GET',
        url: 'http://www.omdbapi.com/?i=' + pelis[i] + '&apikey=3a83ea6'
    })
        .then(res => {
            let img;
            if (res.data.Poster === "N/A") {
                img = "assert/unnamed.jpg"
            } else {
                img = res.data.Poster;
            }

            films.appendChild(document.createElement('div'));
            films.lastElementChild.classList.add("film");
            films.lastElementChild.innerHTML = `
            <span class='heart red' id="${res.data.imdbID}">&#x2764;</span>
            <img src='${img}' alt='' class='filmimg'>
            <div class='title'>${res.data.Title}</div>`;

            let filmtowork = document.getElementById(res.data.imdbID);
            //Capturar el click del corazoncito de la película
            filmtowork.addEventListener("click", (e) => {
                if (!filmtowork.classList.contains("red")) {
                    refreshFav(session, res.data.imdbID);
                    filmtowork.classList.add("red");
                    location.reload();
                } else {
                    //Aqui programar la funcion para que se elimine de favoritos
                    refreshFav(session, res.data.imdbID);
                    filmtowork.classList.remove("red");
                    location.reload();
                }
            })
        })
        .catch(console.log);

    //Timeout para dar margen a que se haya completado la peticion
    setTimeout(() => {
        // Pongo enlace a las peliculas para ir a verlas en detalle
        const film = document.getElementsByClassName("film");
        for (let i = 0; i < film.length; i++) {
            film[i].firstElementChild.nextElementSibling.addEventListener("click", ()=>{
                location.href = "film.html?id="+film[i].firstElementChild.getAttribute("id");
            })
            film[i].firstElementChild.nextElementSibling.nextElementSibling.addEventListener("click", ()=>{
                location.href = "film.html?id="+film[i].firstElementChild.getAttribute("id");
            })   
        }
    }, 800);
}
