const uNumero = {

    formataNumero(numero: number | null, casas: number, moeda: boolean) {

        // if(moeda) {
        //     return numero?.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
        // } else {
        //     return numero?.toLocaleString('pt-br', {minimumFractionDigits: casas});
        // }

        if (numero == null) {
            numero = 0
        }

        if (moeda) {
            return Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' }).format(numero!)
        } else {
            return Intl.NumberFormat('pt-br', { minimumFractionDigits: casas }).format(numero!)
        }

    }

}

export default uNumero