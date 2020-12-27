import React from "react";
import "../css/Logo.css";

function Logo() {

    return ( <
        img className = "logo"
        src = { require('../img/logo.png') }
        alt = "" /
        >
    );
}

export default Logo;