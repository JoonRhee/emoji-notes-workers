addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {

  corsHeaders = {
    "content-type":"application/json",
    "Access-Control-Allow-Origin":"*",
    "Access-Control-Allow-Headers":"*",
    "Access-Control-Allow-Methods":"GET, POST, DELETE, OPTIONS",
  }

  if(request.method === "OPTIONS"){
    return new Response("CORS Response",
    {
      status : 200,
      headers : corsHeaders
    })
  }

  if (request.method === "POST"){
    const {headers} = request
    const contentType = headers.get("content-type") || ""
    if(!contentType.includes("application/json")){
      return new Response("404 Bad Request: Not JSON",{"status" : 400})
    }
    var reqBod
    try{
      reqBod = await request.json()
    }
    catch (error){
      return new Response("404 Bad Request: invalid JSON",{"status" : 400})
    }
    var uuid = reqBod["postID"]
    var exp = reqBod["expDate"]
    reqBod = JSON.stringify(reqBod)
    if(exp > Date.now()){
      console.log(exp/1000)
      await LIST.put(uuid,reqBod,{"expiration":exp/1000})

    }else{
      await LIST.put(uuid,reqBod)
    }
    res = new Response(reqBod, {
      status: 200,
      headers: corsHeaders
    })
  }

  if (request.method === "GET"){
    var arr = []
    var keys = (await LIST.list()).keys
    for(var i in keys){
      var key = keys[i].name
      arr.push(JSON.parse(await LIST.get(key)))
    }
    res = new Response(JSON.stringify(arr), {
      status: 200,
      headers: corsHeaders
    })
  }

  if (request.method === "DELETE"){
    var reqBod = await request.text()
    await LIST.delete(reqBod)
    res = new Response(JSON.stringify(reqBod), {
      headers: corsHeaders
    })
  }
  return res
}
