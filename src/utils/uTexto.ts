const uTexto = {

    snParaSimNao(texto: string) {

        if (texto == "S") {
            return "Sim"
        } else if (texto == "N") {
            return "Não"
        } else {
            return ""
        }

    },

    pcParaPendenteConcluido(texto: string) {

        if (texto == "P") {
            return "Pendente"
        } else if (texto == "C") {
            return "Concluído"
        } else {
            return ""
        }

    },

    formataTipoOpcoes(texto: string) {

        if (texto == "C") {
            return "Cadastro"
        } else if (texto == "P") {
            return "Processo"
        } else if (texto == "R") {
            return "Relatório"
        } else if (texto == "G") {
            return "Gráfico"
        } else if (texto == "U") {
            return "Utilitário"
        } else if (texto == "O") {
            return "Opção"
        }

    },

    formataPreventivaCorretiva(texto: string) {

        if (texto == "P") {
            return "Preventiva"
        } else if (texto == "C") {
            return "Corretiva"
        }

    },

    amParaAutomaticoManual(texto: string) {

        if (texto == "A") {
            return "Automático"
        } else if (texto == "M") {
            return "Manual"
        } else {
            return ""
        }

    },

    isObject(value: any) {
        if ((value !== null) && (typeof value === 'object')) {
            return true
        } else {
            return false
        }
    },

    isJsonString(str: any) {
        try {
            const parsed = JSON.parse(str);
            return typeof parsed === "object" && parsed !== null;
        } catch (e) {
            return false;
        }
    },

    removerCaracteresNaoNumericos(texto: string) {
        return texto.replace(/[^0-9]/g, "");
    },

    // detectaTipo(value: any) {
    //     if (typeof value === "string" && isJsonString(value)) {
    //         return "JSON String";
    //       } else if (isObject(value)) {
    //         return "JavaScript Object";
    //       } else {
    //         return "Other Type";
    //       }
    // }

    formataCnpj(texto: string) {
        return texto.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
    },

    formataCpf(texto: string) {
        return texto.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    },

    extrairAteCaracter(str: string, caracter: string) {
        const index = str.indexOf(caracter);
        if (index === -1) {
            return str; // Retorna a string original se o caractere não for encontrado
        }
        return str.substring(0, index);
    },

    extrairDepoisCaracter(str: string, caracter: string) {
        const index = str.indexOf(caracter);
        // console.log('index', index)
        if (index === -1) {
            return str; // Retorna a string original se o caractere não for encontrado
        }
        return str.substring(index + 1);
    },


}

export default uTexto
