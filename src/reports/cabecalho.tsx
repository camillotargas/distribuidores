import { View, Text } from '@react-pdf/renderer'
import { styles } from '@/reports/estilos'

export function Cabecalho({ empresa, titulo }: { empresa: string, titulo: string }) {
    return (

        <View fixed style={styles.cabecalho}>

            <Text style={styles.titulo}>
                {empresa}
            </Text>

            <View style={styles.linhaDistribuida}>

                <Text style={styles.subtitulo}>
                    {titulo}
                </Text>

                <Text style={styles.textoTamanho10} render={({ pageNumber, totalPages }) => (
                    `${pageNumber} / ${totalPages}`
                )} fixed />

            </View>

            <View style={styles.linhaHorizontal} />

        </View>

    )
}