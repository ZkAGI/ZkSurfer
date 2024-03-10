import React, { useEffect } from 'react';

interface FormComponentProps {
  onFormSubmit: () => void;
}

const FormComponent: React.FC<FormComponentProps> = ({ onFormSubmit }) => {
  useEffect(() => {
    const handleSignInCompletion = (event: MessageEvent) => {
      // Check if the message indicates sign-in completion
      console.log(event.data);
      console.log('Form submitted:');
      if (event.data === 'Identity') {
        // If sign-in completed, trigger the parent's callback
        localStorage.setItem('userLoggedIn', 'true');
        onFormSubmit();
        // Close the iframe
        const iframe = document.getElementById('myIframe') as HTMLIFrameElement;
        if (iframe) {
          iframe.remove();
        }
      }
    };

    // Add event listener to listen for messages from the iframe
    window.addEventListener('message', handleSignInCompletion);

    // Load the specified URL in the iframe
    const iframe = document.createElement('iframe');
    iframe.id = 'myIframe';
    iframe.src = 'https://cubesigner-backend-production.up.railway.app/';
    iframe.allow='publickey-credentials-get *'
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    document.body.appendChild(iframe);
    // iframe.contentWindow?.addEventListener("log",function(value){console.log(value)})
    
    const checkButton = () => {
      const iframe = document.getElementById('myIframe') as HTMLIFrameElement;
      if (iframe && iframe.contentWindow) {
        const txFormButton = iframe.contentWindow.document.getElementById('txForm');
        if (txFormButton) {
          // Button found, trigger action and close iframe
          localStorage.setItem('userLoggedIn', 'true');
          onFormSubmit();
          iframe.remove();
        }
      }
    };
    // Check periodically if the button exists in the iframe content
    const interval = setInterval(checkButton, 1000);


    return () => {
      // Cleanup: remove event listener when the component unmounts
      window.removeEventListener('message', handleSignInCompletion);
      clearInterval(interval);
    };
  }, [onFormSubmit]);

  return null; // No need to render anything visible for the form component
};

export default FormComponent;
