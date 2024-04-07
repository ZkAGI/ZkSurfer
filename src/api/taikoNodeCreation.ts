import axios from 'axios';
import { sleep } from "../helpers/utils";

const api_endpoint ="https://node.tektorch.info";

export const taikoNodeEnvironmentSetup = async (params: { host: string; username: string; password: string; }): Promise<string> => {
    try {
        const { host, username, password } = params;
        const command = 'apt install git -y ; rm -rf taiko_node ; git clone https://github.com/Bitbaza-Org/taiko_node.git ; cd taiko_node && ./setup_env.sh';
        
        const response = await axios.post(`${api_endpoint}/ssh-command`, {
            host,
            username,
            password,
            command
        });
        
        if (response.status === 200) {
            console.log(response)
            console.log('Taiko node environment setup completed successfully.');
            return 'Taiko node environment setup completed successfully.'
        } else {
            console.error('Something went wrong');
            return 'Something went wrong';
        }
    } catch (error) {
        console.error('Error in Taiko node environment setup:', error);
        throw error;
    }
};

export const taikoNodeAndDashboardSetup = async (params: { host: string; username: string; password: string; L1_ENDPOINT_HTTP?: string; L1_ENDPOINT_WS?: string; L1_PROPOSER_PRIVATE_KEY?: string; PROPOSE_BLOCK_TX_GAS_LIMIT?: number; BLOCK_PROPOSAL_FEE?: number; }): Promise<string> => {
    try {
        const { host, username, password, ...otherParams } = params;
        const enb="true"
        const command = `cd taiko_node && ./setup_node.sh ${otherParams.L1_ENDPOINT_HTTP} ${otherParams.L1_ENDPOINT_WS} ${enb} ${otherParams.L1_PROPOSER_PRIVATE_KEY} ${otherParams.PROPOSE_BLOCK_TX_GAS_LIMIT} ${otherParams.BLOCK_PROPOSAL_FEE} %% ./setup_dashboard`;

        const response = await axios.post(`${api_endpoint}/ssh-command`, {
            host,
            username,
            password,
            command
        });
        
        if (response.status === 200) {
            console.log('Taiko node and dashboard setup completed successfully.');
            return 'Taiko node and dashboard setup completed successfully.';
        } else {
            console.error('Something went wrong');
            return 'Something went wrong';
        }
    } catch (error) {
        console.error('Error in Taiko node and dashboard setup:', error);
        throw error;
    }
};
