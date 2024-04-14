
import { tools } from "./availableChatActions";

  let myArray: { role: string; content: string; }[] = [];
  const mysystemMessage = `You are AI assistant and you need to complete user task by using the tools that are given.
  chat_message: |
  <|im_start|>{{if eq .RoleName "assistant"}}assistant{{else if eq .RoleName "system"}}system{{else if eq .RoleName "function"}}{{.Role}}{{else if eq .RoleName "user"}}user{{end}}
  {{ if eq .RoleName "assistant_function_call" }}<tool_call>{{end}}
  {{ if eq .RoleName "function" }}<tool_result>{{end}}
  {{if .Content}}{{.Content}}{{end}}
  {{if .FunctionCall}}{{toJson .FunctionCall}}{{end}}
  {{ if eq .RoleName "assistant_function_call" }}</tool_call>{{end}}
  {{ if eq .RoleName "function" }}</tool_result>{{end}}
  <|im_end|>
# https://huggingface.co/NousResearch/Hermes-2-Pro-Mistral-7B-GGUF#prompt-format-for-function-calling
function: |
  <|im_start|>system
  You are a function calling AI model. You are provided with function signatures within <tools></tools> XML tags. You may call one or more functions to assist with the user query. Don't make assumptions about what values to plug into functions. Here are the available tools:
  <tools>
  {{range .Functions}}
  {'type': 'function', 'function': {'name': '{{.Name}}', 'description': '{{.Description}}', 'parameters': {{toJson .Parameters}} }}
  {{end}}
  </tools>
  Use the following pydantic model json schema for each tool call you will make:
  {'title': 'FunctionCall', 'type': 'object', 'properties': {'arguments': {'title': 'Arguments', 'type': 'object'}, 'name': {'title': 'Name', 'type': 'string'}}, 'required': ['arguments', 'name']}
  For each function call return a json object with function name and arguments within <tool_call></tool_call> XML tags as follows:
  <tool_call>
  {'arguments': <args-dict>, 'name': <function-name>}
  </tool_call><|im_end|>
  {{.Input}}
  <|im_start|>assistant
  <tool_call>
chat: |
  {{.Input}}
  <|im_start|>assistant
  "tools": [
    {
        "type": "function",
        "function": {
            "name": "ChangeNodePassword",
            "description": "Change the password for a node",
            "parameters": {
                "type": "object",
                "properties": {
                    "host": {
                        "type": "string",
                        "description": "The host where the password change is to be applied"
                    },
                    "username": {
                        "type": "string",
                        "description": "The username for authentication"
                    }
                },
                "required": ["host", "username"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "TaikoNodeEnvironmentSetup",
            "description": "Setup Taiko node environment",
            "parameters": {
                "type": "object",
                "properties": {
                    "host": {
                        "type": "string",
                        "description": "The host where the environment setup is to be performed"
                    },
                    "username": {
                        "type": "string",
                        "description": "The username for authentication"
                    }
                },
                "required": ["host", "username"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "TaikoNodeDashboardSetup",
            "description": "Setup Taiko node and dashboard",
            "parameters": {
                "type": "object",
                "properties": {
                    "host": {
                        "type": "string",
                        "description": "The host where the setup is to be performed"
                    },
                    "username": {
                        "type": "string",
                        "description": "The username for authentication"
                    },
                    "L1_ENDPOINT_HTTP": {
                        "type": "string",
                        "description": "L1 HTTP endpoint"
                    },
                    "L1_ENDPOINT_WS": {
                        "type": "string",
                        "description": "L1 WebSocket endpoint"
                    },
                    "PROPOSE_BLOCK_TX_GAS_LIMIT": {
                        "type": "number",
                        "description": "Propose block transaction gas limit"
                    },
                    "BLOCK_PROPOSAL_FEE": {
                        "type": "number",
                        "description": "Block proposal fee"
                    }
                },
                "required": ["host", "username", "L1_ENDPOINT_HTTP", "L1_ENDPOINT_WS", "PROPOSE_BLOCK_TX_GAS_LIMIT", "BLOCK_PROPOSAL_FEE"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "TaikoNodeDashboardSetup",
            "description": "Sets up Taiko node and dashboard",
            "parameters": {
                "type": "object",
                "properties": {
                    "host": {
                        "type": "string",
                        "description": "The host where the setup is to be performed"
                    },
                    "username": {
                        "type": "string",
                        "description": "The username for authentication"
                    },
                    "password": {
                        "type": "string",
                        "description": "The password for authentication"
                    },
                    "http_endpoint": {
                        "type": "string",
                        "description": "L1 HTTP endpoint"
                    },
                    "ws_endpoint": {
                        "type": "string",
                        "description": "L1 WebSocket endpoint"
                    },
                    "gas_limit": {
                        "type": "number",
                        "description": "Propose block transaction gas limit"
                    },
                    "block_fee": {
                        "type": "number",
                        "description": "Block proposal fee"
                    }
                },
                "required": ["host", "username", "password", "http_endpoint", "ws_endpoint", "gas_limit", "block_fee"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "AuthenticateTelegram",
            "description": "Authenticates the user with Telegram",
            "parameters": {
                "type": "object",
                "properties": {
                    "api_id": {
                        "type": "string",
                        "description": "API ID for Telegram authentication"
                    },
                    "api_hash": {
                        "type": "string",
                        "description": "API hash for Telegram authentication"
                    },
                    "phone": {
                        "type": "string",
                        "description": "Phone number for Telegram authentication"
                    }
                },
                "required": ["api_id", "api_hash", "phone"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "dmTelegramMembers",
            "description": "Direct message to Telegram members",
            "parameters": {
                "type": "object",
                "properties": {
                    "msg": {
                        "type": "string",
                        "description": "Message content to be sent"
                    },
                },
                "required": ["msg"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "scrapeMembers",
            "description": "Scrapes members of a group",
            "parameters": {
                "type": "object",
                "properties": {
                    "groupName": {
                        "type": "string",
                        "description": "Name of the group to scrape members from"
                    }
                },
                "required": ["groupName"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "sendEmail",
            "description": "Sends an email with attachments",
            "parameters": {
                "type": "object",
                "properties": {
                    "user_id": {
                        "type": "string",
                        "description": "User ID of the recipient"
                    },
                    "subject": {
                        "type": "string",
                        "description": "Subject of the email"
                    },
                    "msg": {
                        "type": "string",
                        "description": "Message content of the email"
                    }
                },
                "required": ["user_id", "subject", "msg"]
            }
        }
    },
    {
        "type": "function",
        "function": {
          "name": "getLeoCodeSolution",
          "description": "Fetches the solution code for a given LeoCode query",
          "parameters": {
            "type": "object",
            "properties": {
              "query": {
                "type": "string",
                "description": "The query to search for on the LeoCode API"
              }
            },
            "required": ["query"]
          },
          "return": {
            "type": "object",
            "properties": {
              "code": {
                "type": "string",
                "description": "The solution code for the given query"
              }
            }
          }
        }
      }
]
  
  You should ask user for parameters that are required to perform a task and keep it null it user has not entered it the default value should be null only`;
  myArray.push({role:"system",content:mysystemMessage})
export async function determineNextChat(
  taskInstructions: string,
  maxAttempts = 3,
  notifyError?: (error: string) => void
) {
  

  // const apiEndpoint = 'https://leo.tektorch.info/chat/completions'; // Replace with your own API endpoint
  const apiEndpoint = 'http://164.52.213.234:5000/v1/chat/completions'; // Replace with your own API endpoint
//   const apiEndpoint = 'http://164.52.213.234:8080/v1/chat/completions'; // Replace with your own API endpoint
 
  myArray.push({role:'user',content:taskInstructions})
  // Define the request payload
  const payload = {
    "model": "mistral",
    "messages": myArray,
    "prompt_template":"mytmp",
    "temperature": 0.1,
    
};



// Define the headers
const headers = {
  "Content-Type": "application/json"
};

    try {
  
      console.log(JSON.stringify({payload}))

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          "x-api-key": "39361746844cf9e0cbefdb80d1b081f1",
          'Content-Type': 'application/json',},
          body: JSON.stringify(payload),
      }
      );
      // const response = await fetch(apiEndpoint, requestOptions as RequestInit);

      const data = await response.json();
      myArray.push(data.choices[0].message)
      console.log("Chat history is: ",myArray)
      console.log("Response is:",data)
      console.log(data.choices[0].message?.content?.trim());


      return {
        usage: data.usage, // Replace with your own API response format
        choices:data.choices,
        prompt,
        response: data.choices[0].message?.content?.trim(),
        finish: data.choices[0].finish_reason, // Replace with your own API response format
        messages: myArray
      };
    } catch (error: any) {
      console.log('determineNextAction error', error);
      if (error.response.data.error.message.includes('server error')) {
        // Problem with the API, try again
        if (notifyError) {
          notifyError(error.response.data.error.message);
        }
      } else {
        // Another error, give up
        throw new Error(error.response.data.error.message);
      }
    }
  }

