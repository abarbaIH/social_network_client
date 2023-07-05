import React, { useState } from "react";

const useForm = (initObject) => {

    const [formData, setFormData] = useState(initObject)

    const changed = ({ target }) => {

        const { name, value } = target //target es el e.target del formulario destructurado y recibimos, entre otros, las propiedades name y value

        setFormData({ ...formData, [name]: value }) // aquí lo que hacemos es conformar el objeto de user con los datos que se meten en cada campo con onchange
        // básicamente es añadir name:value (xej firstName: Alvaro) en cada cambio realizado, sacando una copia de lo anterior con el spreadoperator
        // console.log(formData)
    }

    return {
        formData,
        changed
    }
}

export default useForm