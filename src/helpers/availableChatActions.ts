export const availableActions = [
    {
      name: 'TaikoNodeEnvironmentSetup',
      description: 'Sets up Taiko node environment',
      args: [
        {
          name: 'host',
          type: 'string',
        },
        {
          name: 'username',
          type: 'string',
        },
        {
          name: 'Password',
          type: 'string',
        },
      ],
    },
    {
      name: 'TaikoNodeDashboardSetup',
      description: 'Sets up Taiko node and dashboard',
      args: [
        {
          name: 'host',
          type: 'string',
        },
        {
          name: 'username',
          type: 'string',
        },
        {
          name: 'Password',
          type: 'string',
        },
        {
          name: 'http_endpoint',
          type: 'string',
        },
        {
          name: 'ws_endpoint',
          type: 'string',
        },
        // {
        //   name: 'ENABLE_PROPOSER',
        //   type: 'boolean',
        // },
        {
          name: 'private_key',
          type: 'string',
        },
        {
          name: 'gas_limit',
          type: 'number',
        },
        {
          name: 'block_fee',
          type: 'number',
        },
      ],
    },
    {
      name: 'ChangeNodePassword',
      description: 'Changes the password of a node',
      args: [
        {
          name: 'host',
          type: 'string',
        },
        {
          name: 'username',
          type: 'string',
        },
        {
          name: 'currentPassword',
          type: 'string',
        },
        {
          name: 'newPassword',
          type: 'string',
        },
      ],
    },{
      name: 'dmTelegramMembers',
      description: 'Direct message to Telegram members',
      args: [
        {
          name: 'msg',
          type: 'string',
        },
        {
          name: 'csv_file',
          type: 'File',
        },
      ],
    },
    {
      name: 'scrapeMembers',
      description: 'Scrapes members of a group',
      args: [
        {
          name: 'groupName',
          type: 'string',
        },
      ],
    },{
      name: 'sendEmail',
      description: 'Sends an email with attachments',
      args: [
        {
          name: 'user_id',
          type: 'string',
        },
        {
          name: 'user_pass',
          type: 'string',
        },
        {
          name: 'subject',
          type: 'string',
        },
        {
          name: 'msg',
          type: 'string',
        },
        
      ],
    }      
  ] as const;
  
  type AvailableAction = (typeof availableActions)[number];
  
  type ArgsToObject<T extends ReadonlyArray<{ name: string; type: string }>> = {
    [K in T[number]['name']]: Extract<
      T[number],
      { name: K }
    >['type'] extends 'number'
      ? number
      : string;
  };
  
  export type ActionShape<
    T extends {
      name: string;
      args: ReadonlyArray<{ name: string; type: string }>;
    }
  > = {
    name: T['name'];
    args: ArgsToObject<T['args']>;
  };
  
  export type ActionPayload = {
    [K in AvailableAction['name']]: ActionShape<
      Extract<AvailableAction, { name: K }>
    >;
  }[AvailableAction['name']];
  