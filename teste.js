
function funcao(pNumero) {
    let lValor = 0
    lValor = Number(pNumero)
    console.log('Valor: ' + Intl.NumberFormat('pt-br', { minimumFractionDigits: 2 }).format(lValor))
}

funcao('1124355')