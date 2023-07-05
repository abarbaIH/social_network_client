// Helper para los datos del formulario

// import React from "react";

export const SerializeForm = (form) => { // recibe como argumento el e.target del formulario
    const formData = new FormData(form) // creamos una variable con los datos recibidos en un objeto de formulario

    const completeObj = {} // definimos el objeto vacío para ir rellenando posteriormente

    for (let [name, value] of formData) {// recorre todo formData y sácame las propiedades name y value
        completeObj[name] = value
    }

    return completeObj
}