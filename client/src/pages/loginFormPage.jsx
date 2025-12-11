import React from "react";
import LoginForm from '../components/loginForm';
import ParticlesComponent from '../components/particles';

const LoginFormPage = () =>{

    return(
        <div>
             <ParticlesComponent id="particles" />
        <LoginForm/>
        </div>
    );
}
export default LoginFormPage;