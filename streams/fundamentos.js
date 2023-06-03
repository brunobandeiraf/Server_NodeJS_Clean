import { Readable, Writable, Transform } from 'node:stream'

//tream de leitura
class OneToHundredStream extends Readable {

    index = 1
    _read(){
        const i = this.index++

        setTimeout(() => {
            if(i > 5){
                this.push(null)
            }else{
    
                const buf = Buffer.from(String(i))
                this.push(buf)
            }
        }, 1000)
    }
}

//Ler dados de algum lugar e escrever dados em outro lugar
//Utilizada para comunicação entre duas streams
class InverseNumberStream extends Transform {
        _transform(chunk, encoding, callback) {
        const transformed = Number(chunk.toString()) * -1
        callback(null, Buffer.from(String(transformed)))
      }
}


//Stream de escrita
class MultiplyByTenStream extends Writable {
    //chunck é o pedaço da stream de leitura
    //encoding é como essa informação é codificada
    //callback é uma função que é chamada quando é concluída
    _write(chunk, encoding, callback) {
        console.log(Number(chunk.toString()) * 10)
        callback()
    }
}

new OneToHundredStream()//stream de leitura
.pipe(new InverseNumberStream())//stream de transformação
.pipe(new MultiplyByTenStream())//stream de escrita (processar dados)