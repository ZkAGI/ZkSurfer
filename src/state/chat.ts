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
  generateChat: (file: File | null) => Promise<void>; // Modify generateChat to accept a file argument
}

const useChatStore = create<ChatState>((set) => ({
  history: [],
  addMessage: (message) =>
    set((state) => ({ history: [...state.history, message] })),
  clearHistory: () => set({ history: [] }),
  generateChat: async (file) => { // Accept file as an argument
    try {
      const lastUserMessage = getLastUserMessage(useChatStore.getState().history);
      if (!lastUserMessage) {
        console.error('No user message found in history.');
        return;
      }
      
      const chatResponse = await determineNextChat(lastUserMessage.content);
      if (chatResponse) {
        const { response } = chatResponse;
        
        // Remove the <Action> tag from the response
        const contentWithoutActionTag = response.replace(/<Action>(.*?)<\/Action>/g, '');
        
        const newMessage: ChatMessage = {
          id: Date.now(),
          sender: 'AI assistant',
          content: contentWithoutActionTag, // Use modified content without <Action> tag
          timestamp: Date.now(),
        };
        set((state) => ({ history: [...state.history, newMessage] }));
        
        const parsedResponse = parseResponse(response);
        if ('error' in parsedResponse) {
          console.error('Error parsing response:', parsedResponse.error);
          return;
        }
        
        const { action, parsedAction } = parsedResponse as ParsedResponseSuccess;
        if (Array.isArray(parsedAction.args) && parsedAction.args.some(arg => arg.includes('<') && arg.includes('>'))) {
          console.log("No function call")
        } else {
          // Perform action if specified
          if (parsedAction.name === 'TaikoNodeEnvironmentSetup') {
            // Here, you need to provide the required parameters for taikoNodeCreation
            await taikoNodeEnvironmentSetup({host:parsedAction.args.host,username:parsedAction.args.username,password:parsedAction.args.Password});
          }
          if(parsedAction.name==="TaikoNodeDashboardSetup"){
            await taikoNodeAndDashboardSetup({
              host: parsedAction.args.host,
              username: parsedAction.args.username,
              password: parsedAction.args.Password,
              L1_ENDPOINT_HTTP: parsedAction.args.http_endpoint,
              L1_ENDPOINT_WS: parsedAction.args.ws_endpoint, 
              // ENABLE_PROPOSER: parsedAction.args.ENABLE_PROPOSER === 'True' , // Convert to boolean
              L1_PROPOSER_PRIVATE_KEY: parsedAction.args.private_key,
              PROPOSE_BLOCK_TX_GAS_LIMIT: parsedAction.args.gas_limit,
              BLOCK_PROPOSAL_FEE: parsedAction.args.block_fee
            });
          }
          if(parsedAction.name==="ChangeNodePassword"){
            await changeNodePassword({
              host: parsedAction.args.host,
              username: parsedAction.args.username,
              currentPassword: parsedAction.args.currentPassword,
              newPassword: parsedAction.args.newPassword
            });
          }
          if (parsedAction.name === "sendEmail") {
            // Access the file passed from generateChat function
            const csv_file = file;
            if (!csv_file) {
              console.error('No file attached.');
              return;
            }

            await sendEmail({
              user_id: parsedAction.args.user_id,
              user_pass: parsedAction.args.user_pass,
              subject: parsedAction.args.subject,
              msg: parsedAction.args.msg,
              csv_file: csv_file
            });
          }
        }
      } else {
        console.error('No chat response received.');
        // Handle null response here, e.g., display error message to user
      }
    } catch (error) {
      console.error('Error generating chat:', error);
      // Handle error here, e.g., display error message to user
    }
  },
}));

export default useChatStore;
