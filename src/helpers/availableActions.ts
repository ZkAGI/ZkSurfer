export const availableActions = [
  {
    name: 'click',
    description: 'Clicks on an element',
    args: [
      {
        name: 'elementId',
        type: 'number',
      },
    ],
  },
  {
    name: 'setValue',
    description: 'Focuses on and sets the value of an input element',
    args: [
      {
        name: 'elementId',
        type: 'number',
      },
      {
        name: 'value',
        type: 'string',
      },
    ],
  },
  {
    name: 'finish',
    description: 'Indicates the task is finished',
    args: [],
  },
  {
    name: 'fail',
    description: 'Indicates that you are unable to complete the task',
    args: [],
  },
  {
    name: 'scrapeValue',
    description: 'Scrapes the value of an element and elementID',
    args: [
      {
        name: 'elementId',
        type: 'number',
      },
      {
        name: 'elementvalue',
        type: 'string',
      },
    ],
  },
  {
    name: 'waitTask',
    description: 'Waits for a specific task to be completed like let user enter password , status should be waiting or completed',
    args: [
      {
        name: 'taskName',
        type: 'string',
      },
      {
        name: 'taskStatus',
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
