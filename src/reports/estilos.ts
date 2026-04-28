import { StyleSheet } from '@react-pdf/renderer'

export const styles = StyleSheet.create({

    page: {
        paddingTop: 60,
        paddingBottom: 45,
        paddingHorizontal: 20,
    },

    cabecalho: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
    },

    rodape: {
        position: 'absolute',
        bottom: 10,
        left: 20,
        right: 20,
    },

    titulo: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 2,
        marginBottom: 2,
    },

    subtitulo: {
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 2,
        marginBottom: 2,

    },

    textoTamanho10: {
        fontSize: 10,
        marginTop: 2,
        marginBottom: 2,
    },

    textoTamanho8: {
        fontSize: 8,
        marginTop: 1.5,
        marginBottom: 1.5,
    },

    textoNegrito: {
        fontWeight: 'bold',
    },

    linha: {
        flexDirection: "row",
    },

    linhaHorizontal: {
        borderBottomWidth: 1,
        marginTop: 2,
        marginBottom: 2,
    },

    linhaEmBranco: {
        marginTop: 2,
        marginBottom: 2,
    },

    linhaDistribuida: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    cinza300: {
        backgroundColor: '#d1d5db',
    },

    cinza400: {
        backgroundColor: '#9ca3af',
    },

})