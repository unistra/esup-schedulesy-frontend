import axios from '@/plugins/axios'
import jwt_decode from 'jwt-decode'

const apiURL = process.env.VUE_APP_BACKEND_API_URL
const token = localStorage.getItem('JWT__access__token')
const noToken = () => !token

export const getUsername = () => {
  if (noToken()) return

  return jwt_decode(token).user_id
}

export const getDirectoryId = () => {
  if (noToken()) return

  return jwt_decode(token).directory_id
}
export const getOrganization = () => {
  if (noToken()) return

  return jwt_decode(token).organization
}

export const getUuid = async () => {
  const response = await axios.get(`${apiURL}/customization/${getUsername()}/uuid.json`)
  
  return response.data[0].key
}
