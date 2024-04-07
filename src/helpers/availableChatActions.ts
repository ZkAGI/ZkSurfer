export const tools = [
  {
      "type": "function",
      "function": {
          "name": "changeNodePassword",
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
                  },
                  "currentPassword": {
                      "type": "string",
                      "description": "The current password"
                  },
                  "newPassword": {
                      "type": "string",
                      "description": "The new password"
                  }
              },
              "required": ["host", "username", "currentPassword", "newPassword"]
          }
      }
  },
  {
      "type": "function",
      "function": {
          "name": "TaikoNodeEnvironmentSetup",
          "description": "Sets up Taiko node environment",
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
                  },
                  "password": {
                      "type": "string",
                      "description": "The password for authentication"
                  }
              },
              "required": ["host", "username", "password"]
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
                  "csv_file": {
                      "type": "File",
                      "description": "CSV file containing members to be messaged"
                  }
              },
              "required": ["msg", "csv_file"]
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
  }
];
