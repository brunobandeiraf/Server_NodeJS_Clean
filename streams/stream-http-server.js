import http from 'node:http'
import { Transform } from 'node:stream'

class InverseNumberStream extends Transform {
    _transform(chunk, encoding, callback) {
    const transformed = Number(chunk.toString()) * -1

    console.log(transformed)

    callback(null, Buffer.from(String(transformed)))
  }
}

// req => ReadableStream
// res => WritableStream

//As portas de entrada e saída do node são stream
const server = http.createServer(async (req, res) => {
    const buffers = []

    //Percorre cada pedaço do carregamento da stream    
    for await (const chunk of req) {
        buffers.push(chunk)
    }
    //Essa ideia é útil porque é importante aguardar a leitura completa de alguns dados enviado
    //Por exemplo, 
    //{"name": "Bruno", "email":"bruno@examplo.com.br"}
    //O código abaixo é útil?
    //{"name": "Bruno", "ema
    //Não! :)

    //Só irá executar toda a stream, após percorrer todo o carregamento
    const fullStreamContent = Buffer.concat(buffers).toString()

    console.log(fullStreamContent)

    return res.end(fullStreamContent)
})

server.listen(3334)