import axios from 'axios'
import { messageDataType } from '../types'


export const sendDataSAbackend = async (messageData : messageDataType) => {
    const apiUrl = ``

    const body = {
        method : 'post',
        url : apiUrl,
        data : messageData,
        headers : ''
    }
}