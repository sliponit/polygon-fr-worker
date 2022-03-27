const corsHeaders = {
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'GET',
  'Access-Control-Allow-Origin': 'http://localhost:3000'
}

const nameToJson = (name) => {
  const svgPartOne = '<svg xmlns="http://www.w3.org/2000/svg" width="270" height="270" fill="none"><path fill="url(#a)" d="M0 0h135v270H0z"/><path fill="url(#b)" d="M135 0h135v270H135z"/><defs><filter id="c" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse" height="270" width="270"><feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity=".225" width="200%" height="200%"/></filter></defs><path d="M72.863 42.949a4.382 4.382 0 0 0-4.394 0l-10.081 6.032-6.85 3.934-10.081 6.032a4.382 4.382 0 0 1-4.394 0l-8.013-4.721a4.52 4.52 0 0 1-1.589-1.616 4.54 4.54 0 0 1-.608-2.187v-9.31a4.27 4.27 0 0 1 .572-2.208 4.25 4.25 0 0 1 1.625-1.595l7.884-4.59a4.382 4.382 0 0 1 4.394 0l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616 4.54 4.54 0 0 1 .608 2.187v6.032l6.85-4.065v-6.032a4.27 4.27 0 0 0-.572-2.208 4.25 4.25 0 0 0-1.625-1.595L41.456 24.59a4.382 4.382 0 0 0-4.394 0l-14.864 8.655a4.25 4.25 0 0 0-1.625 1.595 4.273 4.273 0 0 0-.572 2.208v17.441a4.27 4.27 0 0 0 .572 2.208 4.25 4.25 0 0 0 1.625 1.595l14.864 8.655a4.382 4.382 0 0 0 4.394 0l10.081-5.901 6.85-4.065 10.081-5.901a4.382 4.382 0 0 1 4.394 0l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616 4.54 4.54 0 0 1 .608 2.187v9.311a4.27 4.27 0 0 1-.572 2.208 4.25 4.25 0 0 1-1.625 1.595l-7.884 4.721a4.382 4.382 0 0 1-4.394 0l-7.884-4.59a4.52 4.52 0 0 1-1.589-1.616 4.53 4.53 0 0 1-.608-2.187v-6.032l-6.85 4.065v6.032a4.27 4.27 0 0 0 .572 2.208 4.25 4.25 0 0 0 1.625 1.595l14.864 8.655a4.382 4.382 0 0 0 4.394 0l14.864-8.655a4.545 4.545 0 0 0 2.198-3.803V55.538a4.27 4.27 0 0 0-.572-2.208 4.25 4.25 0 0 0-1.625-1.595l-14.993-8.786z" fill="#000"/><defs><linearGradient id="a" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse"><stop stop-color="#00f"/><stop offset="1" stop-color="#fff" stop-opacity=".99"/></linearGradient><linearGradient id="b" x1="170" y1="0" x2="270" y2="0" gradientUnits="userSpaceOnUse"><stop stop-color="#fff"/><stop offset="1" stop-color="red" stop-opacity=".99"/></linearGradient></defs><text x="32.5" y="231" font-size="27" fill="#000" filter="url(#c)" font-family="Plus Jakarta Sans,DejaVu Sans,Noto Color Emoji,Apple Color Emoji,sans-serif" font-weight="bold">';
  const svgPartTwo = '</text></svg>';
  const _name = name + '.fr'
  const finalSvg = svgPartOne + _name+ svgPartTwo
  const bytes = new TextEncoder().encode(finalSvg)
  return {
    name: _name,
    description: 'A domain on the Fr name service',
    image: 'data:image/svg+xml;base64,' + btoa(String.fromCharCode(...bytes)), // Buffer.from(finalSvg, 'utf8').toString('base64')
    length: name.length
  }
}

const post = async (name) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`
  const headers = {
    Authorization: `Bearer ${PINATA_JWT}`,
    'content-type': 'application/json'
  }
  const body = nameToJson(name)
  const response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
  return response.json()
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
  } else if (request.method === 'POST') {
    if (request.headers.get('X-API-KEY') !== X_API_KEY) {
      return new Response('Forbidden', { status: 403 })
    }

    const { name  } = await request.json()
    const { IpfsHash: cid } = await post(name)
    return new Response(JSON.stringify({ cid }), {
      headers: {
        'Content-type': 'application/json',
        ...corsHeaders
      }
    })
  } else {
    return new Response('Invalid method', { status: 500 });
  }
}
