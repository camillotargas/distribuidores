'use server'

import uData from '@/utils/uData'
import { acessoModulosOpcoes, getClaims, getCookieToken } from '@/actions/sistema/acesso_sistema'
import { prisma } from '@/lib/prisma'
import { claimsType } from '@/types/sistema/claims'
import { marcasType } from '@/types/veiculos/marcas_modelos'

export async function getAll(pPrimeiro: number, pLinhas: number, pNome: string) {

    try {

        if (await acessoModulosOpcoes('frmMarcasModelos', 1) == false) {
            return {
                dados: [],
                total_registros: 0,
                erro: 'Acesso Negado!'
            }
        }

        const lClaims: claimsType = await getClaims()

        const [respostaDados, respostasTotalRegistros] = await prisma.$transaction([

            prisma.tveMarca.findMany({
                skip: pPrimeiro,
                take: pLinhas,
                where: {
                    clienteSistemaId: parseInt(lClaims.clienteSistemaId),
                    nome: {
                        contains: pNome,
                        mode: 'insensitive'
                    }
                },
                orderBy: [
                    { nome: 'asc', },
                ]
            }),

            prisma.tveMarca.count({
                where: {
                    clienteSistemaId: parseInt(lClaims.clienteSistemaId),
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

}

export async function getById(pId: number, pOffSet: number) {

    try {

        const lClaims: claimsType = await getClaims()

        let resposta = null
        let respostaAjustada = null

        if (pId == 0) {

            if (await acessoModulosOpcoes('frmMarcasModelos', 2) == false) {
                return {
                    dados: {},
                    erro: 'Acesso Negado!'
                }
            }

            resposta = {
                id: 0,

                clienteSistemaId: parseInt(lClaims.clienteSistemaId),
                nome: '',

                modelos: [],

                status: 'A',
                usuarioSistemaId: parseInt(lClaims.usuarioSistemaId),
                usuarioSistemaNome: lClaims.usuarioSistemaNome,
                dataHora: uData.novaDataHora(null),
            }

            respostaAjustada = resposta

        } else {

            if (await acessoModulosOpcoes('frmMarcasModelos', 1) == false) {
                return {
                    dados: {},
                    erro: 'Acesso Negado!'
                }
            }

            resposta = await prisma.tveMarca.findUnique({
                relationLoadStrategy: 'join', // or 'query'
                where: {
                    clienteSistemaId: parseInt(lClaims.clienteSistemaId),
                    id: pId
                },
                include: { tveModelo: true },
            })

            resposta!.dataHora = uData.dbParaFeNn(resposta!.dataHora, pOffSet)

            respostaAjustada = {
                ...resposta,
                modelos: resposta!.tveModelo,
            }

            delete respostaAjustada.tveModelo

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

export async function postPut(pDados: marcasType, pOffSet: number) {

    // console.log('postPut pDados: ', pDados)

    try {

        if (await acessoModulosOpcoes('frmMarcasModelos', 2) == false) {
            return {
                erro: 'Acesso Negado!'
            }
        }

        const lClaims: claimsType = await getClaims()

        // pDados.dataHora = uData.feParaDb(uData.novaDataHora(null), pOffSet)

        // if (dados.manutencoes) {
        //     Object.keys(dados.manutencoes).forEach(function (item) {
        //         dados.manutencoes[item].data_manutencao = uData.feParaDb(dados.manutencoes[item].data_manutencao, offSet)
        //         dados.manutencoes[item].data_hora = uData.feParaDb(dados.manutencoes[item].data_hora, offSet)
        //     })
        // }

        if (pDados.id === 0) {

            // const lDados: any = pDados
            // lDados.id = undefined

            const resposta = await prisma.$transaction(async (t: any) => {

                const respostaMarcas = await prisma.tveMarca.create({
                    data: {
                        clienteSistemaId: pDados.clienteSistemaId,
                        nome: pDados.nome,
                        status: pDados.status,
                        usuarioSistemaId: pDados.usuarioSistemaId,
                        usuarioSistemaNome: pDados.usuarioSistemaNome,
                        dataHora: pDados.dataHora,
                    },
                })

                if (pDados.modelos) {

                    if (pDados!.modelos!.length > 0) {

                        for (let i = 0; i < pDados.modelos.length; i++) {

                            await prisma.tveModelo.create({
                                data: {
                                    clienteSistemaId: respostaMarcas.clienteSistemaId,
                                    marcaId: respostaMarcas.id,
                                    nome: pDados.modelos[i].nome,
                                    status: pDados.modelos[i].status,
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

                await t.tveMarca.update({
                    where: {
                        clienteSistemaId: parseInt(lClaims.clienteSistemaId),
                        id: pDados.id
                    },
                    data: {
                        clienteSistemaId: pDados.clienteSistemaId,
                        nome: pDados.nome,
                        status: pDados.status,
                        usuarioSistemaId: pDados.usuarioSistemaId,
                        usuarioSistemaNome: pDados.usuarioSistemaNome,
                        dataHora: pDados.dataHora,
                    },
                })

                if (pDados!.modelos) {

                    if (pDados!.modelos!.length > 0) {

                        for (let i = 0; i < pDados.modelos.length; i++) {

                            if (pDados.modelos[i].flagInsertUpdate == true) {

                                if (pDados.modelos[i].id > 0) {

                                    await t.tveMarcaModelo.update({
                                        where: { id: pDados.modelos[i].id },
                                        data: {
                                            nome: pDados.modelos[i].nome,
                                            status: pDados.modelos[i].status,
                                        }
                                    })

                                } else {

                                    await t.tveMarcaModelo.create({
                                        data: {
                                            marcaId: pDados.id,
                                            nome: pDados.modelos[i].nome,
                                            status: pDados.modelos[i].status,
                                        }
                                    })

                                }

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

export async function getComboBoxMarcas(pId: number | null, pNome: string) {

    try {

        let resposta: any = []

        if (pId === null) {
            return resposta
        }

        const lClaims: claimsType = await getClaims()

        if (pId > 0) {

            resposta = await prisma.tveMarca.findUnique({
                select: {
                    id: true,
                    nome: true,
                    status: true,
                },
                where: {
                    clienteSistemaId: parseInt(lClaims.clienteSistemaId),
                    id: pId
                }
            })

            if (resposta === null) {
                resposta = []
            } else {
                resposta = [resposta]
            }

        } else {

            resposta = await prisma.tveMarca.findMany({
                skip: 0,
                take: 10,
                where: {
                    clienteSistemaId: parseInt(lClaims.clienteSistemaId),
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

        return resposta

    } catch (error) {
        // return { erro: 'getComboBox: ' + error }
        console.log('getComboBoxMarca: ' + error)
        return []
    }

}

export async function getComboBoxModeos(pId: number | null, pNome: string, pMarcaId: number) {

    try {

        let resposta: any = []

        if ((pId === null) || (pMarcaId === null)) {
            return resposta
        }

        const lClaims: claimsType = await getClaims()

        if (pId > 0) {

            resposta = await prisma.tveModelo.findUnique({
                select: {
                    id: true,
                    nome: true,
                    status: true,
                },
                where: {
                    clienteSistemaId: parseInt(lClaims.clienteSistemaId),
                    marcaId: pMarcaId,
                    id: pId
                }
            })

            if (resposta === null) {
                resposta = []
            } else {
                resposta = [resposta]
            }

        } else {

            resposta = await prisma.tveModelo.findMany({
                skip: 0,
                take: 10,
                where: {
                    clienteSistemaId: parseInt(lClaims.clienteSistemaId),
                    marcaId: pMarcaId,
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

        return resposta

    } catch (error) {
        // return { erro: 'getComboBox: ' + error }
        console.log('getComboBoxModelo: ' + error)
        return []
    }

}