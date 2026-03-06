import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

// import timezone from 'dayjs/plugin/timezone';
// dayjs.extend(timezone);

// Define a timezone padrão
// dayjs.tz.setDefault('Etc/GMT');

const uData = {

    // Recebe uma data, retira o timezone e devolve uma string formatada    
    formataData: function (data: Date | null | undefined) {
        if (data == null && data == undefined) {
            return ''
        } else {
            return dayjs(data).utc().format('DD/MM/YYYY')
        }
    },

    formataDataAmericana: function (data: Date | null | undefined) {
        if (data == null && data == undefined) {
            return ''
        } else {
            return dayjs(data).utc().format('MM/DD/YYYY')
        }
    },

    // Recebe uma data/hora, retira o timezone e devolve uma string formatada
    formataDataHora: function (data: Date | null | undefined) {
        if (data == null && data == undefined) {
            return null
        } else {
            return dayjs(data).utc().format('DD/MM/YYYY HH:mm:ss')
        }
    },

    // consultaTimeZone: function () {
    //     return Intl.DateTimeFormat().resolvedOptions().timeZone
    // },

    consultaOffSet: function () {
        return dayjs().utcOffset()
    },

    dbParaFe: function (data: Date | null | undefined, offSet: number) {

        if (data) {

            if (offSet < 0) {
                offSet = offSet * -1
            }

            // console.log( '<<< dbParaFe >>>' ) 
            // console.log('data', data ) 
            // console.log('offSet', offSet ) 
            // console.log('return', dayjs(data).add(offSet, 'minute').toDate() ) 

            return dayjs(data).add(offSet, 'minute').toDate()

        } else {
            return null
        }
    },

    dbParaFeNn: function (data: Date, offSet: number) {

        if (offSet < 0) {
            offSet = offSet * -1
        }

        return dayjs(data).add(offSet, 'minute').toDate()
    },

    feParaDb: function (data: Date | null | undefined, offSet: number) {

        if (data) {

            // console.log( '<<< feParaDb >>>' ) 

            if (offSet < 0) {
                offSet = offSet * -1
            }
            // console.log( off_set ) 

            return dayjs(data).subtract(offSet, 'minute').toDate()

        } else {
            return null
        }
    },

    feParaDbNn: function (data: Date, offSet: number) {

        if (offSet < 0) {
            offSet = offSet * -1
        }

        return dayjs(data).subtract(offSet, 'minute').toDate()

    },

    novaDataHora: function (data: string | null | undefined) {

        // console.log('data ' + dayjs().toDate())
        // console.log('data utc ' + dayjs().utc().toDate())

        if (data == null && data == undefined) {
            return dayjs().toDate()
        } else {
            return dayjs(data).toDate()
        }

    },

    diaSemana: function (data: Date | null) {
        switch (dayjs(data).day()) {
            case 0: return 'domingo'
            case 1: return 'segunda'
            case 2: return 'terca'
            case 3: return 'quarta'
            case 4: return 'quinta'
            case 5: return 'sexta'
            case 6: return 'sabado'
            default: ''
        }
    }

}

export default uData
