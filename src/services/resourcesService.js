import axios from '@/plugins/axios'

export const getResource = async (resourceUrl) => {
  const response = await axios.get(resourceUrl)

  return response.data
}
