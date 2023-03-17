import axios from '@/plugins/axios'

const apiURL = process.env.VUE_APP_BACKEND_API_URL

export const getUserEvents = async (username) => {
  const response = await axios.get(`${apiURL}/calendar/${username}.json`)

  return response.data.events
}
