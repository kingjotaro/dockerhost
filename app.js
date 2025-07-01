const GATEWAY_URL = 'http://host.docker.internal:3000';
const NETWORK_ID = 'ayumi'; // Replace with your network ID

const data = {
  stores: [
    {
      _id: 'store001',
      storeId: 'SP001',
      name: 'Supermercado Vila Madalena',
      location: {
        address: 'Rua Harmonia, 456',
        city: 'São Paulo',
        state: 'SP',
        zip: '05435-000'
      },
      categories: ['Supermercado', 'Açougue', 'Padaria', 'Farmácia']
    },
    {
      _id: 'store002',
      storeId: 'RJ001',
      name: 'Mercado Ipanema',
      location: {
        address: 'Av. Vieira Souto, 789',
        city: 'Rio de Janeiro',
        state: 'RJ',
        zip: '22420-000'
      },
      categories: ['Supermercado', 'Hortifruti', 'Lanchonete']
    },
    {
      _id: 'store003',
      storeId: 'MG001',
      name: 'Empório Belo Horizonte',
      location: {
        address: 'Rua da Bahia, 321',
        city: 'Belo Horizonte',
        state: 'MG',
        zip: '30160-012'
      },
      categories: ['Empório', 'Delicatessen', 'Vinhos']
    }
  ]
};

// Utility function to get timestamp for logs
const getTimestamp = () => new Date().toISOString();

// Mock traceFunction for logging (replace with actual implementation if available)
const traceFunction = (functionName) => (fn) => async (...args) => {
  console.log(`[${getTimestamp()}] Tracing ${functionName} with args: ${JSON.stringify(args)}`);
  try {
    const result = await fn(...args);
    console.log(`[${getTimestamp()}] ${functionName} completed successfully`);
    return result;
  } catch (error) {
    console.error(`[${getTimestamp()}] ${functionName} failed: ${error.message}`);
    throw error;
  }
};

// Fetch network config function
async function fetchNetworkConfig(networkId) {
  const url = `${GATEWAY_URL}/config/${networkId}`;
  console.log(`[${getTimestamp()}] Fetching config from ${url}`);
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
}

// Traced version of fetchNetworkConfig
const fetchNetworkConfigTracedGateway = traceFunction('fetchNetworkConfig')(fetchNetworkConfig);

// Main function to fetch config and ingest stores
async function ingestStores() {
  try {
    // Fetch network configuration
    console.log(`[${getTimestamp()}] Starting config fetch for network ID: ${NETWORK_ID}`);
    const config = await fetchNetworkConfigTracedGateway(NETWORK_ID);
    console.log(`[${getTimestamp()}] Config retrieved: ${JSON.stringify(config, null, 2)}`);

    // Validate config (basic check, adjust as needed)
    if (!config || !config.network) {
      throw new Error('Invalid or missing network configuration');
    }

    // Proceed with store ingestion
    const url = `${GATEWAY_URL}/ingest/store`;
    console.log(`[${getTimestamp()}] Sending POST request to ${url} with ${data.stores.length} stores`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const responseBody = await response.text();
    console.log(`[${getTimestamp()}] Status: ${response.status}`);
    console.log(`[${getTimestamp()}] Response: ${responseBody}`);
  } catch (error) {
    console.error(`[${getTimestamp()}] Error during execution: ${error.message}`);
  }
}

// Run the ingestion process
ingestStores();