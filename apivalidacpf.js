import axios from 'axios'

export const apivalidacpf = axios.create({
    baseURL: 'http://192.168.0.6:4001'
})
