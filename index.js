const corsHeaders = {
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'GET',
  'Access-Control-Allow-Origin': 'http://localhost:3000'
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  if (request.method === 'OPTIONS') {
    return new Response('OK', { headers: corsHeaders })
  } else if (request.method === 'GET') {
    if (request.headers.get('X-API-KEY') !== X_API_KEY) {
      return new Response('Forbidden', { status: 403 })
    }

    const url = `https://api.pinata.cloud/data/testAuthentication`
    const headers = {
      Authorization: `Bearer ${PINATA_JWT}`,
      'content-type': 'application/json'
    }
    const response = await fetch(url, { headers });
    const cid = await response.json()

    return new Response(JSON.stringify(cid), {
      headers: {
        'Content-type': 'application/json',
        ...corsHeaders
      }
    })
  } else {
    return new Response('Invalid method', { status: 500 });
  }
}
