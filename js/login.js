'use strict'

localStorage.getItem("local") == null ? localStorage.setItem("local", JSON.stringify([{ username: "admin", password: "admin", favorites: ["tt1790885"] }])) : "";

const searchdivlogin = document.getElementById("searchdivlogin");
const entry = document.getElementById("entry");
searchdivlogin.addEventListener("click", () => entry.click());
let remainLocal = JSON.parse(localStorage.getItem("local"));
let remainSession = JSON.parse(sessionStorage.getItem("session"));

const form = document.getElementById("form");
form.addEventListener("submit", (e) => {
    e.preventDefault();
    //capturar usuario
    if (form.user.textLength < 3) {
        alert("El usuario debe tener 3 o más caracteres");
        return false;
    }

    //Crear objeto con el usuario y contraseña y guardarlo en el sessionStorage
    const session = {
        username: form.user.value,
        password: form.password.value,
        favorites: []
    }
    sessionStorage.setItem("session", JSON.stringify(session));
    location.href = "practica2.html";

    if(!isRegistred(remainSession)){
        remainLocal.push(remainSession);
        localStorage.setItem("local", JSON.stringify(remainLocal));
    }else{
        remainSession = remainLocal[positionOf(remainSession)];
        sessionStorage.setItem("session", JSON.stringify(remainSession));
    }
});
