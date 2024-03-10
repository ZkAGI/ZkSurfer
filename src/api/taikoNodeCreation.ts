import { sleep } from "../helpers/utils";

const api_endpoint ="https://node.tektorch.info";

let savedParams: { host: string; username: string } | null = null; // Variable to store host and username

async function executeTaikoNodeEnvironmentSetup(params: {
    host: string;
    username: string;
    password: string;
}): Promise<void> {
    try {
        const { host, username, password } = params;
        // Example command for setting up the node environment
        const command = 'apt install git -y && [ ! -d "taiko_node" ] && git clone https://github.com/Bitbaza-Org/taiko_node.git ; cd taiko_node && ./setup_env.sh';
        // Execute the command on the remote host
        const response= await fetch(`${api_endpoint}/ssh-command`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                host,
                username,
                password,
                command
            })
        });
        // Wait for a brief period for the action to complete
        await sleep(2000); // Adjust the delay as needed
        console.log('Taiko node environment setup completed successfully.');
    } catch (error) {
        console.error('Error setting up Taiko node environment:', error);
        throw error; // Propagate the error to handle it appropriately
    }
}

async function executeTaikoNodeAndDashboardSetup(params: {
    host: string;
    username: string;
    password: string;
    L1_ENDPOINT_HTTP: string;
    L1_ENDPOINT_WS: string;
    ENABLE_PROPOSER: boolean;
    L1_PROPOSER_PRIVATE_KEY: string;
    PROPOSE_BLOCK_TX_GAS_LIMIT: number;
    BLOCK_PROPOSAL_FEE: number;
}): Promise<void> {
    try {
        const { host, username, password, ...otherParams } = params;
        // Example command for setting up the node and dashboard
        const command = `cd taiko_node && ./setup_node.sh ${otherParams.L1_ENDPOINT_HTTP} ${otherParams.L1_ENDPOINT_WS} ${otherParams.ENABLE_PROPOSER} ${otherParams.L1_PROPOSER_PRIVATE_KEY} ${otherParams.PROPOSE_BLOCK_TX_GAS_LIMIT} ${otherParams.BLOCK_PROPOSAL_FEE} %% ./setup_dashboard`;
        // Execute the command on the remote host
        const response= await fetch(`${api_endpoint}/ssh-command`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                host,
                username,
                password,
                command
            })
        });
        // Wait for a brief period for the action to complete
        await sleep(2000); // Adjust the delay as needed
        if(response.status==200)
        console.log('Taiko node and dashboard setup completed successfully.');
    } catch (error) {
        console.error('Error setting up Taiko node and dashboard:', error);
        throw error; // Propagate the error to handle it appropriately
    }
}

export const saveHostAndUsername = (params: { host: string; username: string }): void => {
    savedParams = params; // Save host and username
};

export const taikoNodeEnvironmentSetup = async (params: {
    host: string;
    username: string;
    password: string;
}): Promise<void> => {
    try {
        // Perform any necessary validation or preprocessing of parameters here
        // Execute the Taiko node environment setup action
        await executeTaikoNodeEnvironmentSetup(params);
    } catch (error) {
        console.error('Error in Taiko node environment setup:', error);
        // Handle the error as needed (e.g., show error message to user)
    }
};

export const taikoNodeAndDashboardSetup = async (params: {
  host: string;
  username: string;
  password: string;
  L1_ENDPOINT_HTTP: string;
  L1_ENDPOINT_WS: string;
  ENABLE_PROPOSER: boolean;
  L1_PROPOSER_PRIVATE_KEY: string;
  PROPOSE_BLOCK_TX_GAS_LIMIT: number;
  BLOCK_PROPOSAL_FEE: number;
}): Promise<void> => {
  try {
      // Execute the Taiko node and dashboard setup action with the gathered parameters
      await executeTaikoNodeAndDashboardSetup(params);
  } catch (error) {
      console.error('Error in Taiko node and dashboard setup:', error);
      // Handle the error as needed (e.g., show error message to user)
  }
};
