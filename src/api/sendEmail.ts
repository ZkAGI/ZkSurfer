// api.ts
const API_ENDPOINT = "http://43.205.198.30:80/send_mail";

export async function sendEmail(params:{user_id: string, user_pass: string, subject:string,msg: string,csv_file:File}): Promise<void> {
  const  {user_id,user_pass,subject,msg,csv_file}=params;
  const formData = new FormData();
  formData.append('email_sender', user_id);
  formData.append('email_password', user_pass);
  formData.append('subject', subject);
  formData.append('body', msg);
  formData.append('csv_file',csv_file);
  console.log(formData.values)
  const requestOptions = {
    method: 'POST',
    body: formData,
  };

  try {
    const response = await fetch(API_ENDPOINT, requestOptions);
    if (response.ok) {
        const data = await response.json();
        console.log(data); // Handle response from FastAPI
        console.log("Email sent successfully!"); // Call function to display success message
      } else {
        throw new Error('Network response was not ok.');
      }
  } catch (error) {
    console.error('Error occurred while fetching data:', error);
    throw error; // Propagate the error to the caller
  }
}