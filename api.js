import axios from 'axios'

export const apivalidacpf = axios.create({
    baseURL: 'http://192.168.0.6:4001'
})

export const api = axios.create({
    baseURL: 'http://192.168.0.6:4000'
})