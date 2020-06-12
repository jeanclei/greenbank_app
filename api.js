import axios from 'axios'

//api geral
export const api = axios.create({
    baseURL: 'http://192.168.0.6:4000'
})


//api para validacao de CPF e de login
export const apivalidacpf = axios.create({
    baseURL: 'http://192.168.0.6:4001'
})

//token do aplicativo em si, que será usado quando o usuario ainda nao esta logado, para que seja possivel
//que o aplicativo cadastre as pessoas usando a api graphql. depois de receber o token cpf, 
//ira passar a usar esse token cpf recebido
export const apptoken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQGRtaW4iLCJpYXQiOjE1OTE5NDg0MzIsImV4cCI6MTU5MTk1NzA3Mn0.5H3Es4r74yOzQXQIVclF3uT4NuPmsa0G1q_Q5Oz5A4M'