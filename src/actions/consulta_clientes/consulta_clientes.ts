'use server'

import uData from '@/utils/uData'
import { acessoModulosOpcoes, getClaims } from '@/actions/sistema/acesso_sistema'
import { prisma } from '@/lib/prisma'
import { claimsType } from '@/types/sistema/claims'
import { consultaClientesType } from '@/types/consulta_clientes/consulta_clientes'

export async function getAll(pPrimeiro: number, pLinhas: number, pNome: string, pCpfCnpj: string, pUsuarioSistema: string) {

    try {

        if (await acessoModulosOpcoes('frmConsultaClientes', 1) == false) {
            return {
                dados: [],
                total_registros: 0,
                erro: 'Acesso Negado!'
            }
        }

        const lClaims: claimsType = await getClaims()

        const [respostaDados, respostasTotalRegistros] = await prisma.$transaction([

            prisma.tccConsultaCliente.findMany({
                skip: pPrimeiro,
                take: pLinhas,
                where: {
                    clienteSistemaId: parseInt(lClaims.clienteSistemaId),
                    nomeRazaoSocial: {
                        contains: pNome,
                        mode: 'insensitive'
                    },
                    ...(pCpfCnpj !== '' && {
                        cpfCnpj: pCpfCnpj
                    }),
                    usuarioSistemaNome: {
                        contains: pUsuarioSistema,
                        mode: 'insensitive'
                    },
                },
                orderBy: [
                    { dataHoraConsulta: 'asc', },
                    { nomeRazaoSocial: 'asc', },
                    { id: 'asc' },
                ]
            }),

            prisma.tccConsultaCliente.count({
                where: {
                    clienteSistemaId: parseInt(lClaims.clienteSistemaId),
                    nomeRazaoSocial: {
                        contains: pNome,
                        mode: 'insensitive'
                    },
                    ...(pCpfCnpj !== '' && {
                        cpfCnpj: pCpfCnpj
                    }),
                    usuarioSistemaNome: {
                        contains: pUsuarioSistema,
                        mode: 'insensitive'
                    },
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

        if (pId === 0) {

            if (await acessoModulosOpcoes('frmConsultaClientes', 2) == false) {
                return {
                    dados: {},
                    erro: 'Acesso Negado!'
                }
            }

            resposta = {
                id: 0,
                clienteSistemaId: parseInt(lClaims.clienteSistemaId),

                idConsulta: null,
                dataHoraConsulta: null,
                cpfCnpj: '',
                nomeRazaoSocial: '',
                constaOcorrencias: null,
                resultadoConsulta: '',

                usuarioSistemaId: parseInt(lClaims.usuarioSistemaId),
                usuarioSistemaNome: lClaims.usuarioSistemaNome,
                dataHora: uData.novaDataHora(null),
            }

        } else {

            if (await acessoModulosOpcoes('frmConsultaClientes', 1) == false) {
                return {
                    dados: {},
                    erro: 'Acesso Negado!'
                }
            }

            resposta = await prisma.tccConsultaCliente.findUnique({
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

export async function postPut(pDados: consultaClientesType, pOffSet: number) {

    // console.log('postPut dados: ', pDados)

    try {

        if (await acessoModulosOpcoes('frmConsultaClientes', 2) == false) {
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

            const resposta = await prisma.tccConsultaCliente.create({
                data: dadosSemId
            })

            // console.log('putPost resposta: ', resposta)

            return {
                id: resposta.id,
                erro: ''
            }

        } else {

            // const resposta = await prisma.tccConsultaCliente.update({
            //     where: {
            //         clienteSistemaId: parseInt(lClaims.clienteSistemaId),
            //         id: pDados.id
            //     },
            //     data: pDados
            // })

            // return { erro: '' }

        }

    } catch (error) {
        return {
            id: null,
            erro: 'postPut: ' + error
        };
    }

}

export async function getCrednetPP(pCpfCnpj: string) {

    try {

        const baseUrl = process.env.API_GREGLINE_URL
        const apiKey = process.env.API_GREGLINE_KEY
        const apiChave = process.env.API_GREGLINE_CHAVE
        const basicaKeyChave = 'BASIC ' + apiKey + ':' + apiChave

        let lCpfCnpj = ""
        if (pCpfCnpj.length == 11) {
            lCpfCnpj = "CPF"
        } else {
            lCpfCnpj = "CNPJ"
        }

        let lParametros = {
            "opcoes": {
                "formato": "json",
            },
            "Cabecalho": {
                "CpfOuCnpjConsultante": "07301609000140",
                "CnpjOuCpf": "",
                "NumeroDocumento": "",
            },
            "CrednetPP": {
                "AnotacoesCompletas": true,
                "SerasaScorePF": true,
                "RendaProPF": true,
                "SerasaScorePJ": true,
                "FaturamentoPresumidoPJ_PP": true
            }
        }

        lParametros.Cabecalho.CnpjOuCpf = lCpfCnpj
        lParametros.Cabecalho.NumeroDocumento = pCpfCnpj

        console.log('lParametros: ', lParametros)

        // Homologacao
        // const urlQuery = baseUrl + '/api/homologacao/CrednetPP'
        // Producao
        const urlQuery = baseUrl + '/api/CrednetPP'

        const res = await fetch(urlQuery, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': basicaKeyChave,
                // 'accept-encoding': 'gzip',
            },
            cache: 'no-store',
            body: JSON.stringify(lParametros),
        })

        const dados = await res.json()

        return {
            dados: dados ?? {},
            erro: ''
        }

    } catch (error) {

        console.log('Erro getCrednetPP: ' + error)

        return {
            dados: {},
            erro: 'getCrednetPP: ' + error
        }

    }

}