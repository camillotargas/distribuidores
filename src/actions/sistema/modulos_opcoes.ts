'use server'

import uData from '@/utils/uData'
import { acessoModulosOpcoes, getClaims, getCookieToken } from '@/actions/sistema/acesso_sistema'
import { prisma } from '@/lib/prisma'
import { claimsType } from '@/types/sistema/claims'
import { modulosType } from '@/types/sistema/modulos_opcoes'

export async function getAll(pPrimeiro: number, pLinhas: number, pNome: string) {

    try {

        if (await acessoModulosOpcoes('frmModulosOpcoes', 1) == false) {
            return {
                dados: [],
                total_registros: 0,
                erro: 'Acesso Negado!'
            }
        }

        const [respostaDados, respostasTotalRegistros] = await prisma.$transaction([

            prisma.tsiModulo.findMany({
                skip: pPrimeiro,
                take: pLinhas,
                where: {
                    nome: {
                        contains: pNome,
                        mode: 'insensitive'
                    }
                },
                orderBy: [
                    { nome: 'asc', },
                ]
            }),

            prisma.tsiModulo.count({
                where: {
                    nome: {
                        contains: pNome,
                        mode: 'insensitive'
                    }
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
        let respostaAjustada = null

        if (pId === 0) {

            if (await acessoModulosOpcoes('frmModulosOpcoes', 2) == false) {
                return {
                    dados: {},
                    erro: 'Acesso Negado!'
                }
            }

            resposta = {
                id: 0,

                nome: '',
                realizaVendas: '',
                temAtendentes: '',

                opcoes: [],

                status: 'A',
                usuarioSistemaId: lClaims.usuarioSistemaId,
                usuarioSistemaNome: lClaims.usuarioSistemaNome,
                dataHora: new Date(),
            }

            respostaAjustada = resposta

        } else {

            if (await acessoModulosOpcoes('frmModulosOpcoes', 1) == false) {
                return {
                    dados: {},
                    erro: 'Acesso Negado!'
                }
            }

            resposta = await prisma.tsiModulo.findUnique({
                relationLoadStrategy: 'join', // or 'query'
                where: { id: pId },
                include: { tsiOpcao: true },
            })

            resposta!.dataHora = uData.dbParaFeNn(resposta!.dataHora, pOffSet)

            respostaAjustada = {
                ...resposta,
                opcoes: resposta!.tsiOpcao,
            }

            delete respostaAjustada.tsiOpcao

        }

        // if (dados.manutencoes) {
        //     Object.keys(dados.manutencoes).forEach(function (item) {
        //         dados.manutencoes[item].data_manutencao = uData.dbParaFe(dados.manutencoes[item].data_manutencao, offSet)
        //         dados.manutencoes[item].data_hora = uData.dbParaFe(dados.manutencoes[item].data_hora, offSet)
        //     })
        // }

        // console.log('getById respostaAjustada: ', respostaAjustada)

        return {
            dados: respostaAjustada ?? {},
            erro: ''
        }

    } catch (error) {

        return {
            dados: {},
            erro: 'getById: ' + error
        }

    }

}

export async function postPut(pDados: modulosType, pOffSet: number) {

    // console.log('postPut pDados: ', pDados)

    try {

        if (await acessoModulosOpcoes('frmModulosOpcoes', 2) == false) {
            return {
                erro: 'Acesso Negado!'
            }
        }

        pDados.dataHora = uData.feParaDbNn(uData.novaDataHora(null), pOffSet)

        // if (dados.manutencoes) {
        //     Object.keys(dados.manutencoes).forEach(function (item) {
        //         dados.manutencoes[item].data_manutencao = uData.feParaDb(dados.manutencoes[item].data_manutencao, offSet)
        //         dados.manutencoes[item].data_hora = uData.feParaDb(dados.manutencoes[item].data_hora, offSet)
        //     })
        // }

        if (pDados.id == 0) {

            // const lDados: any = pDados
            // lDados.id = undefined

            const resposta = await prisma.$transaction(async (t: any) => {

                const respostaModulo = await prisma.tsiModulo.create({
                    data: {
                        nome: pDados.nome,
                        realizaVendas: pDados.realizaVendas,
                        temAtendentes: pDados.temAtendentes,
                        status: pDados.status,
                        usuarioSistemaId: pDados.usuarioSistemaId,
                        usuarioSistemaNome: pDados.usuarioSistemaNome,
                        dataHora: pDados.dataHora,
                    },
                })

                if (pDados.opcoes) {

                    if (pDados!.opcoes!.length > 0) {

                        for (let i = 0; i < pDados.opcoes.length; i++) {

                            await prisma.tsiOpcao.create({
                                data: {
                                    moduloId: respostaModulo.id,
                                    nome: pDados.opcoes[i].nome,
                                    recurso: pDados.opcoes[i].recurso,
                                    tipo: pDados.opcoes[i].tipo,
                                    status: pDados.opcoes[i].status,
                                }
                            })

                        }

                    }

                }

            })

            return { erro: '' }

        } else {

            // await prisma.tsiModulo.update({
            //     where: { id: pDados.id },
            //     data: pDados,
            // })

            const resposta = await prisma.$transaction(async (t: any) => {

                await t.tsiModulo.update({
                    where: { id: pDados.id },
                    data: {
                        id: pDados.id,
                        nome: pDados.nome,
                        realizaVendas: pDados.realizaVendas,
                        temAtendentes: pDados.temAtendentes,
                        status: pDados.status,
                        usuarioSistemaId: pDados.usuarioSistemaId,
                        usuarioSistemaNome: pDados.usuarioSistemaNome,
                        dataHora: pDados.dataHora,
                    },
                })

                if (pDados!.opcoes) {

                    // console.log('Oções')

                    if (pDados!.opcoes!.length > 0) {
                        // if (pDados!.opcoes!.filter((campo) => campo.flagInsertUpdate == true).length > 0) {

                        for (let i = 0; i < pDados.opcoes.length; i++) {
                            // for (let i = 0; i < pDados.opcoes.filter((campo: any) => campo.flagInsertUpdate == true).length; i++) {

                            // console.log("Insere/Atualiza Opções")

                            if (pDados.opcoes[i].id > 0) {

                                await t.tsiOpcao.update({
                                    where: { id: pDados.opcoes[i].id },
                                    data: {
                                        nome: pDados.opcoes[i].nome,
                                        recurso: pDados.opcoes[i].recurso,
                                        tipo: pDados.opcoes[i].tipo,
                                        status: pDados.opcoes[i].status,
                                    }
                                })

                            } else {

                                await t.tsiOpcao.create({
                                    data: {
                                        moduloId: pDados.id,
                                        nome: pDados.opcoes[i].nome,
                                        recurso: pDados.opcoes[i].recurso,
                                        tipo: pDados.opcoes[i].tipo,
                                        status: pDados.opcoes[i].status,
                                    }
                                })

                            }

                        }
                    }

                }

            })

            return { erro: '' }

        }

    } catch (error) {
        return { erro: 'postPut: ' + error };
    }

}

export async function getComboBoxModulos(pId: number, pNome: string) {

    // console.log('pId: ', pId)

    try {

        let resposta: any = []

        // if ((pId === null) || (pId === 0)) {
        if (pId === null) {
            return resposta
        }

        if (pId < 0) {
            return resposta
        }

        if (pId > 0) {

            resposta = await prisma.tsiModulo.findUnique({
                select: {
                    id: true,
                    nome: true,
                    status: true,
                },
                where: {
                    id: pId
                }
            })

            if (resposta === null) {
                resposta = []
            } else {
                resposta = [resposta]
            }

        } else {

            // console.log('busca por nome')

            resposta = await prisma.tsiModulo.findMany({
                skip: 0,
                take: 10,
                where: {
                    nome: {
                        contains: pNome,
                        mode: 'insensitive'
                    }
                },
                orderBy: [
                    { nome: 'asc', },
                    { id: 'asc' },
                ]
            })

        }

        //
        // let respostaComboBox: Array<comboBoxType> = []

        // if (resposta.length > 0) {
        //   respostaComboBox = resposta!.map((registro: cidadesType) => ({
        //     id: registro.id,
        //     nome: registro.nome + ' - ' + registro.estadoSigla,
        //     status: 'A',
        //   }))
        // }

        return resposta

    } catch (error) {
        // return { erro: 'getComboBox: ' + error }
        return []
    }

}

export async function getComboBoxOpcoes(pId: number, pNome: string, pModuloId: number) {

    // console.log('pId: ', pId)

    try {

        let resposta: any = []

        // if ((pId === null) || (pId === 0)) {
        if (pId === null) {
            return resposta
        }

        if (pId < 0) {
            return resposta
        }

        if (pModuloId < 0) {
            return resposta
        }

        if (pId > 0) {

            resposta = await prisma.tsiOpcao.findUnique({
                select: {
                    id: true,
                    nome: true,
                    status: true,
                },
                where: {
                    id: pId,
                    moduloId: pModuloId,
                }
            })

            if (resposta === null) {
                resposta = []
            } else {
                resposta = [resposta]
            }

        } else {

            // console.log('busca por nome')

            resposta = await prisma.tsiOpcao.findMany({
                skip: 0,
                take: 10,
                where: {
                    moduloId: pModuloId,
                    nome: {
                        contains: pNome,
                        mode: 'insensitive'
                    }
                },
                orderBy: [
                    { nome: 'asc', },
                    { id: 'asc' },
                ]
            })

        }

        //
        // let respostaComboBox: Array<comboBoxType> = []

        // if (resposta.length > 0) {
        //   respostaComboBox = resposta!.map((registro: cidadesType) => ({
        //     id: registro.id,
        //     nome: registro.nome + ' - ' + registro.estadoSigla,
        //     status: 'A',
        //   }))
        // }

        return resposta

    } catch (error) {
        // return { erro: 'getComboBox: ' + error }
        return []
    }

}