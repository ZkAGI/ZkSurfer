import { create } from 'zustand';
import { determineNextChat } from '../helpers/determineNextChat';
import getLastUserMessage from '../helpers/getLastUserMessage';
import { taikoNodeEnvironmentSetup, taikoNodeAndDashboardSetup } from "../api/taikoNodeCreation";
import { changeNodePassword } from '../api/changeNodePassword';
import { sendEmail } from '../api/sendEmail';
import { authenticateCode, requestCode } from '../api/telegram_auth';
import { dmTelegramMembers } from '../api/dmtelegram';
import { scrapeMembers } from '../api/scrapetelegram';
import { LeofetchData } from '../api/leocode';

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
    currentPassword: string,
    newPassword: string,
    password: string,
    privateKey: string
  ) => Promise<void>;
  showPasswordModal: boolean;
  setShowPasswordModal: (show: boolean) => void;
  showUpdatePasswordModal: boolean;
  setShowUpdatePasswordModal: (show: boolean) => void;
  showCredentialsModal: boolean;
  setShowCredentialsModal: (show: boolean) => void;
  showFileUploadModal: boolean;
  setShowFileUploadModal: (show: boolean) => void;
  currentFunctionArguments: any; // Add this line
  setCurrentFunctionArguments: (args: any) => void; // Add this line
}

const useChatStore = create<ChatState>((set) => ({
  history: [],
  showPasswordModal: false,
  setShowPasswordModal: (show) => set({ showPasswordModal: show }),
  showUpdatePasswordModal: false,
  setShowUpdatePasswordModal: (show) => set({ showUpdatePasswordModal: show }),
  showCredentialsModal: false,
  setShowCredentialsModal: (show) => set({ showCredentialsModal: show }),
  showFileUploadModal :false,
  setShowFileUploadModal:(show) =>set({showFileUploadModal:show}),
  currentFunctionArguments: null, // Add this line
  setCurrentFunctionArguments: (args) => set({ currentFunctionArguments: args }), // Add this line

  addMessage: (message) =>
    set((state) => ({ ...state, history: [...state.history, message] })),
  clearHistory: () => set({ history: [] }),
  generateChat: async (
    message,
    file,
    userPass,
    currentPassword,
    newPassword,
    password,
    privateKey
  ) => {

    try {
      const lastUserMessage = getLastUserMessage(useChatStore.getState().history);
      if (!lastUserMessage) {
        console.error('No user message found in history.');
        return;
      }

      const parseToolCallFromResponse = (response: string): { functionName: string; functionArguments: any } | null => {
        try {
            const matches = response.match(/<tool_call>(.*?)<\/tool_call>/s);
            
            if (matches && matches[1]) {
                let toolCallJson = matches[1].trim();
                
                // Attempt to make the JSON valid by replacing single quotes with double quotes
                // This is simplistic and may not handle all edge cases
                toolCallJson = toolCallJson.replace(/'/g, '"');
                
                // Attempt to handle escaped single quotes in values
                toolCallJson = toolCallJson.replace(/\\\\"/g, '\'');
    
                const toolCall = JSON.parse(toolCallJson);
    
                return {
                    functionName: toolCall.name,
                    functionArguments: toolCall.arguments,
                };
            }
        } catch (error) {
            console.error('Error parsing tool call:', error);
        }
        return null;
    };
    
    
    
    
    const chatResponse = await determineNextChat(message);
    if (chatResponse) {
      const { response } = chatResponse;
      // const { messages } = chatResponse
      const toolCallInfo = parseToolCallFromResponse(response);
      let contentWithoutActionTag = response.replace(/<tool_call>(.*?)<\/tool_call>/s, '');
        if (contentWithoutActionTag.length === 0) {
          // const newMessage: ChatMessage = {
          //   id: Date.now(),
          //   sender: 'AI assistant',
          //   content: response,
          //   timestamp: Date.now(),
          //     };
          // set((state) => ({ ...state, history: [...state.history, newMessage] }));
          // contentWithoutActionTag = 'Once given all details just say call tool with given details or if tool is called then wait for some time';
        }else{
        const newMessage: ChatMessage = {
          id: Date.now(),
          sender: 'AI assistant',
          content: contentWithoutActionTag,
          timestamp: Date.now(),
            };
        set((state) => ({ ...state, history: [...state.history, newMessage] }));
          }
        // const waitForDetails = async (variable: any) => {
        //   while (!variable) {
        //     // Do nothing and keep looping until the variable is provided
        //     await new Promise(resolve => setTimeout(resolve, 100)); // Wait for 100 milliseconds before checking again
        //   }
        // };

        // const toolCallInfo = parseToolCallFromResponse(response);
        if (toolCallInfo) {
          const { functionName, functionArguments } = toolCallInfo;

          console.log(functionName,functionArguments.host)
          // Check if all parameters are not null
          const allParametersNotNull = Object.values(functionArguments).every(value => value !== 'null');
          if (allParametersNotNull) {
            if (functionName === 'TaikoNodeEnvironmentSetup') {
              if (!password || !privateKey) {
                set((state) => ({ ...state, showCredentialsModal: true }));
                set((state) => ({ ...state, currentFunctionArguments: functionArguments }));
                //await waitForDetails(password);
              }
              //const res = await taikoNodeEnvironmentSetup({ host: functionArguments.host, username: functionArguments.username, password: password });
              //set((state) => ({ ...state, showCredentialsModal: false }));
              //console.log("logging",res)
              // const newMessage: ChatMessage = {
              //   id: Date.now(),
              //   sender: 'AI assistant',
              //   content: res,
              //   timestamp: Date.now(),
              // };
             // set((state) => ({ ...state, history: [...state.history, newMessage] }));
            }
            if (functionName === "TaikoNodeDashboardSetup") {
              const res = await taikoNodeAndDashboardSetup({
                host: functionArguments.host,
                username: functionArguments.username,
                password: password,
                L1_ENDPOINT_HTTP: functionArguments.http_endpoint,
                L1_ENDPOINT_WS: functionArguments.ws_endpoint,
                L1_PROPOSER_PRIVATE_KEY: privateKey,
                PROPOSE_BLOCK_TX_GAS_LIMIT: functionArguments.gas_limit,
                BLOCK_PROPOSAL_FEE: functionArguments.block_fee
              });
              const newMessage: ChatMessage = {
                id: Date.now(),
                sender: 'AI assistant',
                content: res,
                timestamp: Date.now(),
              };
              set((state) => ({ ...state, history: [...state.history, newMessage] }));
            }
            if (functionName === "ChangeNodePassword") {
              if (!currentPassword || !newPassword) {
                set((state) => ({ ...state, showUpdatePasswordModal: true }));
                set((state) => ({ ...state, currentFunctionArguments: functionArguments }));
                //await waitForDetails(currentPassword);
              }
              // const res = await changeNodePassword({
              //   host: functionArguments.host,
              //   username: functionArguments.username,
              //   currentPassword: currentPassword,
              //   newPassword: newPassword,
              // });
             //set((state) => ({ ...state, showUpdatePasswordModal: false }));
              // const newMessage: ChatMessage = {
              //   id: Date.now(),
              //   sender: 'AI assistant',
              //   content: res,
              //   timestamp: Date.now(),
              // };
              //set((state) => ({ ...state, history: [...state.history, newMessage] }));
            }
            if (functionName === "sendEmail") {
              if (!password || !file) {
                set((state) => ({ ...state, showPasswordModal: true }));
                set((state) => ({ ...state, currentFunctionArguments: functionArguments }));
                //await waitForDetails(userPass);
              }
              // const csv_file = file;
              // if (!csv_file) {
              //   const newMessage: ChatMessage = {
              //     id: Date.now(),
              //     sender: 'AI assistant',
              //     content: "Please attach the csv file with Email field, then type 'Confirm Action'",
              //     timestamp: Date.now(),
              //   };
              //   set((state) => ({ ...state, history: [...state.history, newMessage] }));
              //   console.error('No file attached.');
              //   return;
              // }
             // await waitForDetails(csv_file);
              // const res = await sendEmail({
              //   user_id: functionArguments.user_id,
              //   subject: functionArguments.subject,
              //   user_pass: userPass,
              //   msg: functionArguments.msg,
              //   csv_file: csv_file
              // });
             // set((state) => ({ ...state, showPasswordModal: false }));
              // const newMessage: ChatMessage = {
              //   id: Date.now(),
              //   sender: 'AI assistant',
              //   content: res,
              //   timestamp: Date.now(),
              // };
              // set((state) => ({ ...state, history: [...state.history, newMessage] }));
            }
            if (functionName === 'AuthenticateTelegram') {
              if (!localStorage.getItem('telegramApiKey')) {
                const res = await requestCode(functionArguments.api_id, functionArguments.api_hash, functionArguments.phone)
                const otp = prompt("Enter the OTP:")
                if (otp === null) {
                  console.error('User canceled OTP input.');
                  return;
                }
                const res1 = await authenticateCode(functionArguments.phone, otp)
                const newMessage: ChatMessage = {
                  id: Date.now(),
                  sender: 'AI assistant',
                  content: res1,
                  timestamp: Date.now(),
                };
                set((state) => ({ ...state, history: [...state.history, newMessage] }));
              }
              else {
                const newMessage: ChatMessage = {
                  id: Date.now(),
                  sender: 'AI assistant',
                  content: "You are Already Signed-In use the Scrape members or Send DM functionality",
                  timestamp: Date.now(),
                };
                set((state) => ({ ...state, history: [...state.history, newMessage] }));
              }
            }
            if (functionName === "dmTelegramMembers") {
              const isUserLoggedIn = localStorage.getItem('telegramlogin');
              if (isUserLoggedIn === 'true') {
                const apikey = localStorage.getItem('telegramApiKey') || '';
                const apihash = localStorage.getItem('telegramApiHash') || '';
                const phone = localStorage.getItem('telegramPhoneNumber') || '';
                const csv_file = file;
                if (!csv_file) {
                  set((state) => ({ ...state, showFileUploadModal: true }));
                  set((state) => ({ ...state, currentFunctionArguments: functionArguments }));

                 } else {
                  const res = await dmTelegramMembers(apikey, apihash, phone, functionArguments.msg, csv_file)
                  const newMessage: ChatMessage = {
                    id: Date.now(),
                    sender: 'AI assistant',
                    content: "Messages Send Successfully",
                    timestamp: Date.now(),
                  };
                  set((state) => ({ ...state, history: [...state.history, newMessage] }));
                }
              } else {
                const newMessage: ChatMessage = {
                  id: Date.now(),
                  sender: 'AI assistant',
                  content: "Please use authenticate telegram to login",
                  timestamp: Date.now(),
                };
                set((state) => ({ ...state, history: [...state.history, newMessage] }));
              }
            }
            if (functionName === "scrapeMembers") {
              const isUserLoggedIn = localStorage.getItem('telegramlogin');
              if (isUserLoggedIn === 'true') {
                const apikey = localStorage.getItem('telegramApiKey') || '';
                const apihash = localStorage.getItem('telegramApiHash') || '';
                const phone = localStorage.getItem('telegramPhoneNumber') || '';
                const group = functionArguments.groupName.replace(/\\/g, '');
                const res = await scrapeMembers(apikey, apihash, phone, group);
                const newMessage: ChatMessage = {
                  id: Date.now(),
                  sender: 'AI assistant',
                  content: res,
                  timestamp: Date.now(),
                };
                set((state) => ({ ...state, history: [...state.history, newMessage] }));
              }
              else {
                const newMessage: ChatMessage = {
                  id: Date.now(),
                  sender: 'AI assistant',
                  content: "Please use authenticate telegram to login",
                  timestamp: Date.now(),
                };
                set((state) => ({ ...state, history: [...state.history, newMessage] }));
              }
            }
            if(functionName==='getLeoCodeSolution'){
              const res=await LeofetchData(functionArguments.query);
              const newMessage: ChatMessage = {
                id: Date.now(),
                sender: 'AI assistant',
                content: res,
                timestamp: Date.now(),
              };
              set((state) => ({ ...state, history: [...state.history, newMessage] }));
            }
          }
        }
      }
    }
    catch (error) {
      console.error('Error generating chat:', error);
    }
  },
}));

export default useChatStore;
