'use server'

import { manutencoesType } from '@/types/veiculos/manutencoes'

import uData from '@/utils/uData'
import { acessoModulosOpcoes, getClaims } from '@/actions/sistema/acesso_sistema'
import { prisma } from '@/lib/prisma'
import { claimsType } from '@/types/sistema/claims'

export async function getAll(pPrimeiro: number, pLinhas: number, pTipo: number, pSituacao: number, pVeiculoId: number) {

    // console.log('pTipo: ', pTipo)
    // console.log('pSituacao: ', pSituacao)
    // console.log('pVeiculoId: ', pVeiculoId)

    try {

        if (await acessoModulosOpcoes('frmManutencoes', 1) == false) {
            return {
                dados: [],
                total_registros: 0,
                erro: 'Acesso Negado!'
            }
        }

        const lClaims: claimsType = await getClaims()

        const [respostaDados, respostasTotalRegistros] = await prisma.$transaction([

            prisma.tveManutencao.findMany({
                skip: pPrimeiro,
                take: pLinhas,
                where: {
                    clienteSistemaId: parseInt(lClaims.clienteSistemaId),
                    ...(pTipo > 0 && { tipo: pTipo }),
                    ...(pSituacao > 0 && { situacao: pSituacao }),
                    ...(pVeiculoId > 0 && { veiculoId: pVeiculoId }),
                },
                include: {
                    tveVeiculo: {
                        include: {
                            tveMarca: true,
                            tveModelo: true,
                        }
                    },
                },
                orderBy: [
                    { id: 'asc' },
                ]
            }),

            prisma.tveManutencao.count({
                where: {
                    clienteSistemaId: parseInt(lClaims.clienteSistemaId),
                    ...(pTipo > 0 && { tipo: pTipo }),
                    ...(pSituacao > 0 && { situacao: pSituacao }),
                    ...(pVeiculoId > 0 && { veiculoId: pVeiculoId }),
                },
            })

        ])

        return {
            dados: respostaDados ?? [],
            total_registros: respostasTotalRegistros ?? 0,
            erro: ''
        }

    } catch (error) {

        return {
            dados: [],
            total_registros: 0,
            erro: 'getAll: ' + error
        }

    }

    // revalidatePath('/')
}

export async function getById(pId: number, pOffSet: number) {

    try {

        const lClaims: claimsType = await getClaims()

        let resposta = null

        if (pId === 0) {

            if (await acessoModulosOpcoes('frmManutencoes', 2) == false) {
                return {
                    dados: {},
                    erro: 'Acesso Negado!'
                }
            }

            resposta = {

                id: 0,
                clienteSistemaId: parseInt(lClaims.clienteSistemaId),

                veiculoId: null,
                dataInicio: null,
                dataDataFim: null,
                tipo: '',
                km: null,
                memorando: '',
                situacao: null,

                status: 'A',
                usuarioSistemaId: parseInt(lClaims.usuarioSistemaId),
                usuarioSistemaNome: lClaims.usuarioSistemaNome,
                dataHora: uData.novaDataHora(null),
            }

        } else {

            if (await acessoModulosOpcoes('frmManutencoes', 1) == false) {
                return {
                    dados: {},
                    erro: 'Acesso Negado!'
                }
            }

            resposta = await prisma.tveManutencao.findUnique({
                where: {
                    clienteSistemaId: parseInt(lClaims.clienteSistemaId),
                    id: pId
                }
            })

            resposta!.dataHora = uData.dbParaFeNn(resposta!.dataHora, pOffSet)

        }

        return {
            dados: resposta ?? {},
            erro: ''
        }

    } catch (error) {

        return {
            dados: {},
            erro: 'getById: ' + error
        }

    }

}

export async function postPut(pDados: manutencoesType, pOffSet: number) {

    try {

        if (await acessoModulosOpcoes('frmManutencoes', 2) == false) {
            return {
                erro: 'Acesso Negado!'
            }
        }

        const lClaims: claimsType = await getClaims()

        pDados.usuarioSistemaId = parseInt(lClaims.usuarioSistemaId)
        pDados.usuarioSistemaNome = lClaims.usuarioSistemaNome
        pDados.dataHora = uData.feParaDbNn(uData.novaDataHora(null), pOffSet)

        if (pDados.id === 0) {

            const dadosSemId = {
                ...pDados,
                id: undefined,
            }

            const resposta = await prisma.tveManutencao.create({
                data: dadosSemId
            })

            return { erro: '' }

        } else {

            const resposta = await prisma.tveManutencao.update({
                where: {
                    clienteSistemaId: parseInt(lClaims.clienteSistemaId),
                    id: pDados.id
                },
                data: pDados
            })

            return { erro: '' }

        }

    } catch (error) {
        return { erro: 'postPut: ' + error };
    }

}

// export async function getComboBox(pId: number, pNome: string) {

//   try {

//     let resposta: any = []

//     if (pId === null) {
//       return resposta
//     }

//     const lClaims: claimsType = await getClaims()

//     if (pId > 0) {

//       resposta = await prisma.tveVeiculo.findUnique({
//         select: {
//           id: true,
//           placa: true,
//           status: true,
//         },
//         where: {
//           clienteSistemaId: parseInt(lClaims.clienteSistemaId),
//           id: pId
//         }
//       })

//       if (resposta === null) {
//         resposta = []
//       } else {
//         resposta = [resposta]
//       }

//     } else {

//       resposta = await prisma.tveVeiculo.findMany({
//         skip: 0,
//         take: 10,
//         where: {
//           clienteSistemaId: parseInt(lClaims.clienteSistemaId),
//           placa: {
//             contains: pNome,
//             mode: 'insensitive'
//           }
//         },
//         orderBy: [
//           { placa: 'asc', },
//           { id: 'asc' },
//         ]
//       })

//     }

//     //
//     let respostaComboBox: Array<comboBoxType> = []

//     if (resposta.length > 0) {
//       respostaComboBox = resposta!.map((registro: manutencoesType) => ({
//         id: registro.id,
//         nome: registro.placa,
//         status: registro.status,
//       }))
//     }

//     return respostaComboBox

//   } catch (error) {
//     // return { erro: 'getComboBox: ' + error }
//     console.log('getComboBox: ' + error)
//     return []
//   }

// }