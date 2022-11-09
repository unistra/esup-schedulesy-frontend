import axios from '@/plugins/axios'

const backendLegacyURL = process.env.VUE_APP_BACKEND_LEGACY_URL

export const getCustomization = async (username) => {
  const response = await axios.get(`${backendLegacyURL}/customization/${username}.json`)

  return response.data
}

export const postCustomization = async (user) => {
  const response = await axios.get(`${backendLegacyURL}/customization.json`, user)

  return response.data
}

export const patchCustomization = async (username, payload) => {
  const response = await axios.patch(`${backendLegacyURL}/customization/${username}.json`, payload)

  return response.data
}
