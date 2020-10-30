// arquivo botão logout para adm 
import React, {useState} from 'react';
import "./styles.css";
import AuthApi from '../../AuthApi';
import Cookies from "js-cookie"


const Logout = () => {
    const Auth =React.useContext(AuthApi)
    // função ao clicar no botao
    const handleOnClick = () =>{
        // seta autenticação para 0 e remove os cookies
        Auth.setAuth(0)
       Cookies.remove("user")
       Cookies.remove("nivel")
    }
    // html do botão 
    return (
        <>
            <div className="logoutBtn">
            <span onClick={handleOnClick} className="fas fa-power-off fa-2x"></span>
            </div>
        </>
    );
}

export default Logout;
