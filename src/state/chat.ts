import { create } from 'zustand';
import { determineNextChat } from '../helpers/determineNextChat';
import getLastUserMessage from '../helpers/getLastUserMessage';
import { taikoNodeEnvironmentSetup, taikoNodeAndDashboardSetup } from "../api/taikoNodeCreation";
import { parseResponse, ParsedResponseSuccess } from '../helpers/parseChatResponse';
import { changeNodePassword } from '../api/changeNodePassword';
import { sendEmail } from '../api/sendEmail';

export interface ChatMessage {
  id: number;
  sender: string;
  content: string;
  timestamp: number;
}

export interface ChatState {
  history: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  clearHistory: () => void;
  generateChat: (
    message: string,
    file: File | null,
    userPass: string,
    currentPassword: string, // New state variable for current password
    newPassword: string, // New state variable for new password
    password: string, // New state variable for password
    privateKey: string // New state variable for private key
  ) => Promise<void>;
  showPasswordModal: boolean;
  setShowPasswordModal: (show: boolean) => void;
  showUpdatePasswordModal: boolean; // New state variable for Update Password modal
  setShowUpdatePasswordModal: (show: boolean) => void; // Function to toggle Update Password modal
  showCredentialsModal: boolean; // New state variable for Credentials modal
  setShowCredentialsModal: (show: boolean) => void; // Function to toggle Credentials modal
}

const useChatStore = create<ChatState>((set) => ({
  history: [],
  showPasswordModal: false,
  setShowPasswordModal: (show) => set({ showPasswordModal: show }),
  showUpdatePasswordModal: false, // Initialize Update Password modal state
  setShowUpdatePasswordModal: (show) => set({ showUpdatePasswordModal: show }), // Function to toggle Update Password modal
  showCredentialsModal: false, // Initialize Credentials modal state
  setShowCredentialsModal: (show) => set({ showCredentialsModal: show }), // Function to toggle Credentials modal

  addMessage: (message) =>
    set((state) => ({ ...state, history: [...state.history, message] })),
  clearHistory: () => set({ history: [] }),
  generateChat: async (message, file, userPass, currentPassword, newPassword, password, privateKey) => { // Modify generateChat function signature
    try {
      const lastUserMessage = getLastUserMessage(useChatStore.getState().history);
      if (!lastUserMessage) {
        console.error('No user message found in history.');
        return;
      }
      
      const chatResponse = await determineNextChat(message);
      if (chatResponse) {
        const { response } = chatResponse;
        
        let contentWithoutActionTag = response.replace(/<Action>(.*?)<\/Action>/g, '');
        if (contentWithoutActionTag.length === 0) {
          contentWithoutActionTag = 'Please provide more details';
        }
        
        const newMessage: ChatMessage = {
          id: Date.now(),
          sender: 'AI assistant',
          content: contentWithoutActionTag,
          timestamp: Date.now(),
        };
        set((state) => ({ ...state, history: [...state.history, newMessage] }));
        
        const parsedResponse = parseResponse(response);
        if ('error' in parsedResponse) {
          console.error('Error parsing response:', parsedResponse.error);
          return;
        }
        
        const { action, parsedAction } = parsedResponse as ParsedResponseSuccess;
          // const newMessage: ChatMessage = {
          //   id: Date.now(),
          //   sender: 'AI assistant',
          //   content: 'Please provide the required details if you Dont know what details to send Please ask me by defining the task and ask details related to it.',
          //   timestamp: Date.now(),
          // };
          // set((state) => ({ ...state, history: [...state.history, newMessage] }));
          // console.log("No function call")
          const waitForDetails = async (variable: any) => {
            while (!variable) {
              // Do nothing and keep looping until the variable is provided
              await new Promise(resolve => setTimeout(resolve, 100)); // Wait for 100 milliseconds before checking again
            }
          };
          
          if (parsedAction.name === 'TaikoNodeEnvironmentSetup') {
            set((state) => ({ ...state, showCredentialsModal: true })); // Show the Credentials modal
            await waitForDetails(password)
            await waitForDetails(privateKey)
            await taikoNodeEnvironmentSetup({ host: parsedAction.args.host, username: parsedAction.args.username, password: password }); // Pass password from state
            set((state) => ({ ...state, showCredentialsModal: false })); // Hide the Credentials modal
          }
          if (parsedAction.name === "TaikoNodeDashboardSetup") {
            await taikoNodeAndDashboardSetup({
              host: parsedAction.args.host,
              username: parsedAction.args.username,
              password: password,
              L1_ENDPOINT_HTTP: parsedAction.args.http_endpoint,
              L1_ENDPOINT_WS: parsedAction.args.ws_endpoint,
              L1_PROPOSER_PRIVATE_KEY: privateKey,
              PROPOSE_BLOCK_TX_GAS_LIMIT: parsedAction.args.gas_limit,
              BLOCK_PROPOSAL_FEE: parsedAction.args.block_fee
            });
          }
          if (parsedAction.name === "ChangeNodePassword") {
            set((state) => ({ ...state, showUpdatePasswordModal: true })); // Show the Update Password modal
            await waitForDetails(currentPassword); 

            const res = await changeNodePassword({
              host: parsedAction.args.host,
              username: parsedAction.args.username,
              currentPassword: currentPassword, // Pass current password from state
              newPassword: newPassword, // Pass new password from state
            });
            set((state) => ({ ...state, showUpdatePasswordModal: false })); // Hide the Update Password modal
            const newMessage: ChatMessage = {
              id: Date.now(),
              sender: 'AI assistant',
              content: res,
              timestamp: Date.now(),
            };
            set((state) => ({ ...state, history: [...state.history, newMessage] }));
          }
          if (parsedAction.name === "sendEmail") {
            if(!password || !file){

              set((state) => ({ ...state, showPasswordModal: true }));
              await waitForDetails(userPass);
            }
            const csv_file = file;
            if (!csv_file) {
              const newMessage: ChatMessage = {
                id: Date.now(),
                sender: 'AI assistant',
                content: "Please attach the csv file with Email field, then type 'Confirm Action'",
                timestamp: Date.now(),
              };
              set((state) => ({ ...state, history: [...state.history, newMessage] }));
              console.error('No file attached.');
              return;
            }
            await waitForDetails(csv_file); // Wait until csv_file is provided


            const res=await sendEmail({
              user_id: parsedAction.args.user_id,
              subject: parsedAction.args.subject,
              user_pass: userPass,
              msg: parsedAction.args.msg,
              csv_file: csv_file
            });
            set((state) => ({ ...state, showPasswordModal: false }));
            const newMessage: ChatMessage = {
              id: Date.now(),
              sender: 'AI assistant',
              content: res,
              timestamp: Date.now(),
            };
            set((state) => ({ ...state, history: [...state.history, newMessage] }));
          }
        
      } else {
        console.error('No chat response received.');
      }
    } catch (error) {
      console.error('Error generating chat:', error);
    }
  },
}));

export default useChatStore;
