import React from 'react'
import style from "./App.module.css"
import { Link, useNavigate } from 'react-router-dom'

function BasicNavbar() {

    const navigate = useNavigate()
    const studentData = JSON.parse(localStorage.getItem("StudentData"))

    return (
        <aside className={style.basicAside}>
            <i className={`fa-solid fa-house ${style.icon}`} onClick={() => navigate(`/studentpages/${studentData.id}`)}></i>
            <i className={`fa-solid fa-layer-group ${style.icon}`}></i>
            <Link to="/chat">
                <i className={`fa-solid fa-message ${style.icon}`}></i>
            </Link>
        </aside>
    )
}

export default BasicNavbar