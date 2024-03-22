frase = "Otro titulo de producto aun mas largo, tan largo que me va a fastidiar el layout y tendre que lidiar con el"

console.log(frase.length)

function fraseador(frase){
    if (frase.length >= 50){
        frase = `${frase.slice(0,50)}...`
        //return frase
        console.log(frase)
    }else{
        //return frase
        console.log(frase)
    }
}

fraseador(frase)