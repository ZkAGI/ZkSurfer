// api.ts
const API_ENDPOINT = "https://autosurf.tektorch.info/scrape_telegram_member";

export async function scrapeMembers(apiKey: string, apiHash: string, phoneNumber: string, groupName: string): Promise<string> {
  const formData = new FormData();
  formData.append('group_name', groupName);
  formData.append('api_id', apiKey);
  formData.append('api_hash', apiHash);
  formData.append('phone', phoneNumber);

  const requestOptions = {
    method: 'POST',
    body: formData,
  };

  try {
    const response = await fetch(API_ENDPOINT, requestOptions);
    if (!response.ok) {
      throw new Error('Failed to download CSV file. Status code: ' + response.status);
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'members.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    console.log('CSV file downloaded successfully.');
    return 'CSV file downloaded successfully.';
  } catch (error) {
    console.error('Error occurred while fetching data:', error);
    throw error; // Propagate the error to the caller
  }
}