const api_endpoint ="https://node.tektorch.info";

export const changeNodePassword = async (params: {
    host: string;
    username: string;
    currentPassword: string;
    newPassword: string;
  }): Promise<void> => {
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
      console.log(data); // Handle response data
  
      // Set loading to false after fetching
  
      // Move to the next step
    } catch (error) {
      console.error('Error:', error);
      // Set loading to false in case of error
    }
  };
  