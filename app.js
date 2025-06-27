import fetch from 'node-fetch';

const url = 'http://host.docker.internal:3000/ingest/store';

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

try {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const responseBody = await response.text();
  console.log('Status:', response.status);
  console.log('Resposta:', responseBody);
} catch (error) {
  console.error('Erro ao enviar os dados:', error);
}
