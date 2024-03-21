const api_endpoint ="https://node.tektorch.info";

export const changeNodePassword = async (params: {
  host: string;
  username: string;
  currentPassword: string;
  newPassword: string;
}): Promise<string> => {
  try {
    const { host, username, currentPassword, newPassword } = params;

    // Make a POST request to change the password
    const response = await fetch(`${api_endpoint}/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        host: host,
        username: username,
        current_password: currentPassword,
        new_password: newPassword
      })
    });

    // Handle the response
    const data = await response.json();
    if(response.status==200){
      return "Successfully changed Password";

    }
    else{
      return "Something went wrong"
    }
    // Return a success message
  } catch (error) {
    console.error('Error:', error);
    throw error; // Propagate the error to the caller
  }
};
