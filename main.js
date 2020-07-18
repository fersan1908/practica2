'use strict'
//Si no hay sessionstorage que redirija y si no hay localstorage que lo cree
sessionStorage.length == 0 ? location.href = "login.html" : "";
localStorage.getItem("local") == null ? localStorage.setItem("local", JSON.stringify([{ username: "admin", password: "admin", favorites: ["tt1790885"] }])) : "";

//DOM
const form = document.getElementById("form");
const films = document.getElementById("films");
const searched = document.getElementById("searched");
const numresults = document.getElementById("numresults");
const results = document.getElementById("results");
const submit = document.getElementById("ssubmit");
const hearts = document.getElementsByClassName("heart");
document.getElementById("searchdiv").addEventListener("click", () => submit.click());
const logout = document.getElementById("logout");
const burger = document.getElementById("burger");
const homepage = document.getElementById("homepage");
const saved = document.getElementById("saved");
const loggout = document.getElementById("loggout");
const previus = document.getElementById("previus");
const next = document.getElementById("next");
let remainLocal = JSON.parse(localStorage.getItem("local"));
let remainSession = JSON.parse(sessionStorage.getItem("session"));

console.log(17.4 % 1);
/*Funciones*/
//función para pasarle por parametro el objeto almacenado en la sesion y devuelva true o false en base a si ya está registrado en el local
const isRegistred = (person) => {
    let username = person.username;
    let password = person.password;
    for (let i = 0; i < remainLocal.length; i++) {
        if (remainLocal[i].username == username && remainLocal[i].password == password) {
            return true;
            break;
        }
    }
    return false;
}

//Funcion que devuelva la posicion del array de localstorage en la que está registrado el usuario de la sesión
const positionOf = (person) => {
    let username = person.username;
    let password = person.password;
    for (let i = 0; i < remainLocal.length; i++) {
        if (remainLocal[i].username == username && remainLocal[i].password == password) {
            return i
        }
    }
    return false;
}

//función para pasarle por parametro el objeto almacenado en la sesion y devuelva un array con los id de las peliculas marcadas como favorito
const favFilms = (person) => {
    let username = person.username;
    let password = person.password;
    for (let i = 0; i < remainLocal.length; i++) {
        if (remainLocal[i].username == username && remainLocal[i].password == password) {
            return remainLocal[i].favorites;
            break;
        }
    }
    return false;
}

//funcion para sacar un elemento de un array
const removeItemFromArray = (array, item) => {
    let i = array.indexOf(item);
    i !== -1 ? array.splice(i, 1) : "";
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

/*Ejecucion*/
//Si el usuario de la sesión no esta registrado se registra y si sí recupere la sesion los archivos ya guardados del usuario en el local.
if (!isRegistred(remainSession)) {
    remainLocal.push(remainSession);
    localStorage.setItem("local", JSON.stringify(remainLocal));
} else {
    remainSession = remainLocal[positionOf(remainSession)];
    sessionStorage.setItem("session", JSON.stringify(remainSession));
}

//Para el menu responsive
burger.addEventListener("click", () => {
    if (loggout.classList.contains("showmenu")) {
        loggout.classList.remove("showmenu");
        loggout.classList.add("hidemenu");
        saved.classList.remove("showmenu");
        saved.classList.add("hidemenu");
        homepage.classList.remove("showmenu");
        homepage.classList.add("hidemenu");
    } else if (loggout.classList.contains("hidemenu")) {
        loggout.classList.remove("hidemenu");
        loggout.classList.add("showmenu");
        saved.classList.remove("hidemenu");
        saved.classList.add("showmenu");
        homepage.classList.remove("hidemenu");
        homepage.classList.add("showmenu");
    } else {
        loggout.classList.add("showmenu");
        saved.classList.add("showmenu");
        homepage.classList.add("showmenu");
    }
});

logout.addEventListener("click", () => {
    sessionStorage.clear();
})

form.addEventListener("submit", (e) => {
    e.preventDefault();

    //Vaciar las anteriores búsquedas
    films.innerHTML = "";
    for (let i = 0; i < films.children.length; i++) {
        films.removeChild(films.children.item(i));
    }

    /* let fragment = document.createDocumentFragment(); */

    //Peticion Peliculas
    let page = 1
    let pagecode = "&page=" + page;
    let string = form.browser.value;
    if (string.trim().length > 2) {
        results.classList.remove("display-none");
        searched.textContent = string;
        axios({
            method: 'GET',
            url: 'http://www.omdbapi.com/?s=' + string + pagecode + '&apikey=3a83ea6'
        })
            .then(res => {
                res.data.totalResults > 0 ? numresults.textContent = res.data.totalResults : numresults.textContent = 0;

                for (const result of res.data.Search) {
                    let img;
                    if (result.Poster === "N/A") {
                        img = "assert/unnamed.jpg"
                    } else {
                        img = result.Poster;
                    }
                    /*fragment.innerHTML +=  `<div class=film>
                    <span class='heart'>&#x2764;</span>
                    <img src='${result.Poster}' alt='' class='filmimg'>
                    <div class='title'>${result.Title}</div></div>`*/

                    films.appendChild(document.createElement('div'));
                    films.lastElementChild.classList.add("film");
                    films.lastElementChild.innerHTML = `
            <span class='heart' id="${result.imdbID}">&#x2764;</span>
            <img src='${img}' alt='' class='filmimg'>
            <div class='title'>${result.Title}</div>`;

                    let filmtowork = document.getElementById(result.imdbID);
                    favFilms(remainSession).includes(result.imdbID) ? filmtowork.classList.add("red") : "";

                    //Capturar el click del corazoncito de la película
                    filmtowork.addEventListener("click", (e) => {
                        if (!filmtowork.classList.contains("red")) {
                            refreshFav(remainSession, result.imdbID);
                            filmtowork.classList.add("red");
                        } else {
                            //Aqui programar la funcion para que se elimine de favoritos
                            refreshFav(remainSession, result.imdbID);
                            filmtowork.classList.remove("red");
                        }
                    })

                }
            })
            .catch(console.log);
        /* films.appendChild(fragment); */
    } else {
        location.reload();
    }

    //Timeout para dar margen a que se haya completado la peticion
    let checking;
    setTimeout(() => {
        //Comprobamos que no se haya imprimido ningun título repetido
        checking = hearts[0].getAttribute("id");
        for (let i = 1; i < hearts.length; i++) {
            if (hearts[i].getAttribute("id") === checking) {
                form.browser.value = string;
                submit.click();
                break;
            }
        }
        // Pongo enlace a las peliculas para ir a verlas en detalle
        const film = document.getElementsByClassName("film");
        for (let i = 0; i < film.length; i++) {
            film[i].firstElementChild.nextElementSibling.addEventListener("click", () => {
                location.href = "film.html?id=" + film[i].firstElementChild.getAttribute("id");
            })
            film[i].firstElementChild.nextElementSibling.nextElementSibling.addEventListener("click", () => {
                location.href = "film.html?id=" + film[i].firstElementChild.getAttribute("id");
            })
        }
    }, 800);
}); // end submit
