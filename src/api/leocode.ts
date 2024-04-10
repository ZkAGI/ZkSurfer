import axios, { AxiosResponse } from 'axios';

export async function LeofetchData(query: string): Promise<string> {
  try {
    const response: AxiosResponse = await axios.get(`https://leo.tektorch.info/query/?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

