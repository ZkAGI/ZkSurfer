// api.ts
const API_ENDPOINT = "http://43.205.198.30:80/send_telegram_dm";

export async function dmTelegramMembers(apiKey: string, apiHash: string, phoneNumber: string, msg: string,csv_file:File): Promise<void> {
  const formData = new FormData();
  formData.append('api_id', apiKey);
  formData.append('api_hash', apiHash);
  formData.append('phone', phoneNumber);
  formData.append('msg', msg);
  formData.append('csv_file',csv_file);

  const requestOptions = {
    method: 'POST',
    body: formData,
  };

  try {
    const response = await fetch(API_ENDPOINT, requestOptions);
    if (response.ok) {
        const data = await response.json();
        console.log(data); // Handle response from FastAPI
        console.log("Telegram sent successfully!"); // Call function to display success message
      } else {
        throw new Error('Network response was not ok.');
      }
  } catch (error) {
    console.error('Error occurred while fetching data:', error);
    throw error; // Propagate the error to the caller
  }
}