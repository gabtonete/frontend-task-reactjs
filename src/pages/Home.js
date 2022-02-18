import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';

import { Header } from '../components/Header';
import { Filtros } from '../components/Filtros';
import { Listagem } from '../components/Listagem';
import { Footer } from '../components/Footer';
import { executaRequisicao } from '../services/api';


export const Home = props => {

    const [tarefas, setTarefas] = useState([]);

    const [periodoDe, setPeriodoDe] = useState('');
    const [periodoAte, setPeriodoAte] = useState('');
    const [status, setStatus] = useState(0);

    const [showModal, setShowModal] = useState(false);


    const [erro, setErro] = useState('');
    const [nomeTarefa, setNomeTarefa] = useState('');
    const [dataPrevisaoTarefa, setDataPrevisaoTarefa] = useState('');


    const getTarefasComFiltro = async () => {
        try {

            let filtros = '?status=' + status
            if (periodoDe) {
                filtros += '&periodoDe=' + periodoDe;
            }
            if (periodoAte) {
                filtros += '&periodoAte=' + periodoAte;

            }

            const resultado = await executaRequisicao('tarefa' + filtros, 'get');
            if (resultado && resultado.data) {
                setTarefas(resultado.data);
            }
        } catch (e) {
            console.log(e);
        }
    }

    const salvarTarefa = async () => {
        try {
            if (!nomeTarefa || !dataPrevisaoTarefa) {
                setErro('Favor informar nome e data de previsão')
                return;
            }
            const body = {
                nome: nomeTarefa,
                dataPrevistaConclusao: dataPrevisaoTarefa
            };

            await executaRequisicao('tarefa', 'post', body)
            setNomeTarefa('');
            setDataPrevisaoTarefa('');
            setShowModal(false);
            await getTarefasComFiltro;
        } catch (e) {
            console.log(e);
            if (e?.response?.data?.erro) {
                setErro(e.response.data.erro);
            } else {
                setErro('Não foi possível cadastrar a tarefa, tente novamente')
            }
        }
    }


    useEffect(() => {
        getTarefasComFiltro()
    }, [status, periodoDe, periodoAte]);

    const sair = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('usuarioNome');
        localStorage.removeItem('usuarioEmail');
        props.setAccessToken('');
    }

    return (
        <>
            <Header sair={sair} />
            <Filtros
                periodoDe={periodoDe}
                periodoAte={periodoAte}
                status={status}
                setPeriodoDe={setPeriodoDe}
                setPeriodoAte={setPeriodoAte}
                setStatus={setStatus}
            />
            <Listagem tarefas={tarefas} />
            <Footer showModal={() => setShowModal(true)} />
            <Modal show={showModal} onHide={() => setShowModal(false)} className="container-modal">
                <Modal.Body>
                    <p>Adicionar uma tarefa</p>
                    {erro && <p className='error'>{erro}</p>}
                    <input type="text" name="nome"
                        placeholder="Nome da tarefa"
                        className="col-12"
                        value={nomeTarefa}
                        onChange={evento => setNomeTarefa(evento.target.value)} />
                    <input type="text" name="dataPrevisao"
                        placeholder="Data de previsão de conclusão"
                        className="col-12"
                        value={dataPrevisaoTarefa}
                        onChange={evento => setDataPrevisaoTarefa(evento.target.value)}
                        onFocus={evento => evento.target.type = 'date'}
                        onBlur={evento => dataPrevisaoTarefa ? evento.target.type = 'date' : evento.target.type = 'text'} />
                </Modal.Body>
                <Modal.Footer>
                    <div className="buttons col-12">
                        <button onClick={salvarTarefa}>Salvar</button>
                        <span onClick={() => {
                            setShowModal(false)
                            setErro('')
                            setNomeTarefa('')
                            setDataPrevisaoTarefa('')
                        }}>Cancelar</span>
                    </div>

                </Modal.Footer>
            </Modal>
        </>
    )
}