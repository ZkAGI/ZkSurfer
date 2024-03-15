// api.ts
const API_REQ_ENDPOINT = "http://43.205.198.30:80/request_otp";
const API_CODE_ENDPOINT = "http://43.205.198.30:80/authenticate_with_otp";

export async function requestCode(api_id: string, api_hash: string, phone: string): Promise<void> {
  const formData = new FormData();
  formData.append('api_id', api_id);
  formData.append('api_hash', api_hash);
  formData.append('phone', phone);

  const requestOptions = {
    method: 'POST',
    body: formData,
  };

  try {
    const response = await fetch(API_REQ_ENDPOINT, requestOptions);
    if (response.ok) {
        const data = await response.json();
        console.log(data); // Handle response from FastAPI
        console.log("otp sent successfully!"); // Call function to display success message
      } else {
        throw new Error('Network response was not ok.');
      }
  } catch (error) {
    console.error('Error occurred while fetching data:', error);
    throw error; // Propagate the error to the caller
  }
}

export async function authenticateCode(phone: string,code:string): Promise<void> {
    const formData = new FormData();
    formData.append('phone', phone);
    formData.append('code', code);
  
    const requestOptions = {
      method: 'POST',
      body: formData,
    };
  
    try {
      const response = await fetch(API_CODE_ENDPOINT, requestOptions);
      if (response.ok) {
          const data = await response.json();
          console.log(data); // Handle response from FastAPI
          console.log("Authenticated successfully!"); // Call function to display success message
        } else {
          throw new Error('Network response was not ok.');
        }
    } catch (error) {
      console.error('Error occurred while fetching data:', error);
      throw error; // Propagate the error to the caller
    }
  }