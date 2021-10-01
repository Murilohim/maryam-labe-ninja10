import Axios from "axios";
import React from "react";
import styled from "styled-components";
import Filtro from "./Filtro";
import carrinho from "../../imgs/carrinho2.png"


const headers = {
    headers: {
        Authorization: "7b34660a-e65f-4a6b-b3af-7b3651eccdad"
    }
}


// Disposição na página

const Escopo = styled.div`
    display: flex; 
    flex-grow: inherit;
    font-family: Graphik-Medium, Graphik-Regular, "Gotham SSm A", "Gotham SSm B", "Helvetica Neue", Helvetica, Arial, sans-serif;
`

const ContainerGlobal = styled.div`
    display: flex;
    flex-direction: column;
`


// Container Buscar e Ordenação

const ContainerPesquisa = styled.div`
    display: flex;
    justify-content: space-around;
    margin-top: 30px;
    margin-bottom: 20px;
    
    input {
        width: 400px;
        height: 24px;
        border-radius: 20px;
        color: #FF9933;
        font-weight: 800;
        padding: 2px 35px;
        cursor: pointer;
        -webkit-box-shadow: 5px 6px #727D71;
        border: 1px solid gray;
    }

    select {
        width: 200px;
        height: 30px;
        margin-bottom: 10px;
        border-radius: 20px;
        color: #FF9933;
        font-weight: 800;
        padding: 2px 35px;
        cursor: pointer;
        -webkit-box-shadow: 5px 6px #727D71;
        border: 1px solid gray;
    }
`


// Cards Serviços

const ContainerServicos = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    margin: 10px;

`

const Cards = styled.div`
    background-color: #FF9933;
    width: 280px;
    margin: 10px;
    border-radius: 25px;
    color: black;

`

const CardWhite = styled.div`
    border-radius: 10px;
    background-color: white;
    margin: 0 auto;
    margin-bottom: 10px;
    width: 200px;
    height: 150px;
    text-align: center;
    justify-content: center;
    align-items: center;
    h3 {
        padding-top: 15px;
    }
`

const BotaoDetalhes = styled.button`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
    margin: 0 auto;
    margin-bottom: 15px;
    width: 200px;
    height: 25px;
    
    -webkit-box-shadow: 3px 4px #727D71;
	border: none;
    border-radius: 10px;
    background-color: white;
    color: #FF9933;
    cursor: pointer;
    border: hidden;
    font-weight: bold;
    font-weight: 800;
`

// Botão Adcionar ao Carrinho 

const BotaoCarrinho = styled.button`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
    margin: 0 auto;
    margin-bottom: 15px;
    width: 50px;
    height: 50px;
    
    border-radius: 40px;
    background-color: black;
    color: white;
    cursor: pointer;
    border: hidden;
    font-weight: 800;
`


export default class Servicos extends React.Component {

    state = {
        servicos: [],
        buscar: "",
        precoMin: "",
        precoMax: "",
        ordenacao: ""
    }

    componentDidMount () {
        this.getAllJobs()
    }

    getAllJobs = () => {
        const url = 'https://labeninjas.herokuapp.com/jobs'

        Axios
        .get(url, headers)
        .then((res) => {
            this.setState({
                servicos: res.data.jobs
            })
        })
        .catch((err) => {
            alert(err)
        })
    }

    updateBuscar = (event) => {
        this.setState({
            buscar: event.target.value
        })
    }

    updatePrecoMin = (event) => {
        this.setState({
            precoMin: event.target.value
        })
    }
    
    updatePrecoMax = (event) => {
        this.setState({
            precoMax: event.target.value
        })
    }

    updateOrdenacao = (event) => {
        this.setState({
            ordenacao: event.target.value
        })
    }

    render() {        
        return (
            <Escopo>

                <Filtro 
                precoMin={this.state.precoMin}
                updatePrecoMin={this.updatePrecoMin}
                precoMax={this.state.precoMax}
                updatePrecoMax={this.updatePrecoMax}
                />

                <ContainerGlobal>

                <ContainerPesquisa>

                    <input placeholder="Busca por título ou descrição" type="text" id="nomeServico" name="nomeServico" value={this.state.buscar} onChange={this.updateBuscar} />

                    <select value={this.state.ordenacao} onChange={this.updateOrdenacao}>
                        <option value="titulo">Título</option>
                        <option value="decrescente preço">Decrescente</option>
                        <option value="crescente preço">Crescente</option>
                        <option value="prazo">Prazo</option>
                        {this.state.ordenacao}
                    </select>

                </ContainerPesquisa>
                
                <ContainerServicos>

                    {this.state.servicos
                        .filter((servico) => {
                            return (this.state.precoMin === "") || (this.state.precoMin <= servico.price)
                        })
                        .filter((servico) => {
                            return (this.state.precoMax === "") || (this.state.precoMax >= servico.price)
                        })
                        .filter((servico) => {
                            return (servico.title.toLowerCase().includes(this.state.buscar.toLowerCase()))
                        })
                        .sort((atualServico, proximoServico) => { 
                            switch (this.state.ordenacao) {
                                case "crescente preço":
                                    return 1 * (atualServico.price - proximoServico.price)
                                case "decrescente preço":
                                    return -1 * (atualServico.price - proximoServico.price)
                                case "titulo":
                                    let a = atualServico.title.toUpperCase()
                                    let b = proximoServico.title.toUpperCase();
                                    return a == b ? 0 : a > b ? 1 : -1;
                                case "prazo":
                                    let c = new Date(atualServico.dueDate)     
                                    let d = new Date(proximoServico.dueDate);
                                    return c - d;     
                                default:
                                    return "Nenhuma ordenação selecionada"
                            }
                        })
                        .map((servico) => {
                            function adicionaZero(numero) {
                                if (numero <= 9) {
                                    return "0" + numero
                                } else {
                                    return numero
                                }
                            }
                            let data = new Date(servico.dueDate);
                            // Precisa arrumar, pois transforma o dia para um dia anterior.
                            let dataFormatada = (adicionaZero(data.getDate())) + "/" + (adicionaZero(data.getMonth() + 1)) + "/" + data.getFullYear(); 
                            return (
                                <Cards key={servico.id}>
                                    <CardWhite>
                                        <h3>{servico.title}</h3>
                                        <p>
                                            <b>Preço:</b>
                                            R$ {servico.price}
                                        </p>
                                        <p>
                                            <b>Prazo:</b>
                                            {servico.dueDate}
                                        </p>
                                    </CardWhite>
                                    <BotaoDetalhes>Ver Detalhes</BotaoDetalhes>
                                    <BotaoCarrinho><img src={carrinho} alt="carrinho imagem" /></BotaoCarrinho>
                                </Cards>
                            )
                        })            
                    }

                </ContainerServicos>
                </ContainerGlobal>
            </Escopo>
        )
    } 
}