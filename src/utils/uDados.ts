import { cpf, cnpj } from 'cpf-cnpj-validator'

const uDados = {

    calculaPagina(pagina: number, linhasPorPagina: number) {

        if (pagina == 0) {
            pagina = 1
        }
        else if (pagina > 0) {
            pagina = (pagina / linhasPorPagina) + 1
        }

        // console.log('Pagina', pagina)
        // console.log('linhasPorPagina', linhasPorPagina)

        return pagina

    },

    validaCpfCnpj(cpfCnpj: string) {

        cpfCnpj = cpfCnpj.trim()

        if (cpfCnpj.length === 11) {
            if (cpf.isValid(cpfCnpj)) {
                return true
            } else {
                return false
            }
        } else if (cpfCnpj.length === 14) {
            if (cnpj.isValid(cpfCnpj)) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }

    }

}

export default uDados