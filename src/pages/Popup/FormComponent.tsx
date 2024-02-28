import React, { useEffect } from 'react';

interface FormComponentProps {
  onFormSubmit: () => void;
}

const FormComponent: React.FC<FormComponentProps> = ({ onFormSubmit }) => {
  useEffect(() => {
    const handleSignInCompletion = (event: MessageEvent) => {
      // Check if the message indicates sign-in completion
      if (event.data === 'signInCompleted') {
        // If sign-in completed, trigger the parent's callback
        onFormSubmit();
      }
    };

    // Add event listener to listen for messages from the child window
    window.addEventListener('message', handleSignInCompletion);

    // Load the specified URL in the child window
    const childWindow = window.open('https://cubesigner-backend-production.up.railway.app/', '_blank');

    return () => {
      // Cleanup: remove event listener when the component unmounts
      window.removeEventListener('message', handleSignInCompletion);

      // Close the child window if it exists
      if (childWindow) {
        childWindow.close();
      }
    };
  }, [onFormSubmit]);

  return (
    <form>
      {/* This form will be hidden */}
    </form>
  );
};

export default FormComponent;
