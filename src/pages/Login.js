import React, { useState } from 'react';
import logoDevaria from '../assets/icons/devaria-logo.svg'
import mail from '../assets/icons/mail.svg'
import lock from '../assets/icons/lock.svg'
import { Input } from '../components/input';
import { executaRequisicao } from '../services/api';


export const Login = () => {

    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');
    const [msgErro, setMsgErro] = useState('');
    const [isLoading, setLoading] = useState(false);

    const executaLogin = async evento => {
        try {
            evento.preventDefault();
            setLoading(true);
            
            const body = {
                login, senha
            }
    
            const resultado = await executaRequisicao('login', 'POST', body);
            console.log(resultado);
        } catch (e) {
            console.log(e);
            if(e?.response?.data?.erro)
                setMsgErro(e.response.data.erro);
            
        }
        setLoading(false);
    
    }
    return (
        <div className="container-login">
            <img
                src={logoDevaria}
                alt="Logo da Devaria"
                className="logo"
            />
            <form>
                {msgErro && <p>{msgErro}</p>}
                <Input
                    srcImg={mail}
                    altImg={"Icone login"}
                    inputType="text"
                    inputName="login"
                    inputPlaceholder="Informe seu Email"
                    value={login}
                    setValue={setLogin}
                />
                <Input
                    srcImg={lock}
                    altImg={"Icone cadeado"}
                    inputType="password"
                    inputName="senha"
                    inputPlaceholder="Informe sua senha"
                    value={senha}
                    setValue={setSenha}
                />
                <button onClick={executaLogin} disabled={isLoading}>{isLoading === true ? 'Carregando' : 'Entrar'}</button>
            </form>
        </div>
    );
}