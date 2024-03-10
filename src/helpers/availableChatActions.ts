export const availableActions = [
    {
      name: 'taikoNodeEnvironmentSetup',
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
      name: 'taikoNodeDashboardSetup',
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
          name: 'L1_ENDPOINT_HTTP',
          type: 'string',
        },
        {
          name: 'L1_ENDPOINT_WS',
          type: 'string',
        },
        {
          name: 'ENABLE_PROPOSER',
          type: 'boolean',
        },
        {
          name: 'L1_PROPOSER_PRIVATE_KEY',
          type: 'string',
        },
        {
          name: 'PROPOSE_BLOCK_TX_GAS_LIMIT',
          type: 'number',
        },
        {
          name: 'BLOCK_PROPOSAL_FEE',
          type: 'number',
        },
      ],
    },
    {
      name: 'changeNodePassword',
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
    },
    
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
  