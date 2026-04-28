import { View, Text } from '@react-pdf/renderer'
import { styles } from '@/reports/estilos'

export function Rodape({ usuarioSistema }: { usuarioSistema: string }) {

    const agora = new Date()
    const dataHora = agora.toLocaleString('pt-BR')

    return (

        <View fixed style={styles.rodape}>

            <View style={styles.linhaHorizontal} />

            <View style={styles.linhaDistribuida}>

                <Text style={styles.textoTamanho10}>
                    {usuarioSistema}
                </Text>

                <Text style={styles.textoTamanho10}>
                    www.locsrv.com.br
                </Text>

                <Text style={styles.textoTamanho10}>
                    {dataHora}
                </Text>

            </View>

        </View>

    )
}