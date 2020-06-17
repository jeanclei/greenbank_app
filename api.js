import axios from 'axios'

//api geral
export const api = axios.create({
    baseURL: 'http://vibefloripa.com:4000'
})


//api para validacao de CPF e de login
export const apivalidacpf = axios.create({
    baseURL: 'http://vibefloripa.com:4001'
})

//token do aplicativo em si, que será usado quando o usuario ainda nao esta logado, para que seja possivel
//que o aplicativo cadastre as pessoas usando a api graphql. depois de receber o token cpf, 
//ira passar a usar esse token cpf recebido
export const apptoken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQGRtaW4iLCJpYXQiOjE1OTE5NzI5OTUsImV4cCI6NzU4OTIxMjAxN30.jtHT3eQ5cgEY2N5nISprnnOT3lVZ-BYcJ7nPbcD4cP0'