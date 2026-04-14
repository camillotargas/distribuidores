'use server'

import { saidasRetornosVeiculosType } from '@/types/veiculos/saidas_retornos_veiculos'

import uData from '@/utils/uData'
import { acessoModulosOpcoes, getClaims } from '@/actions/sistema/acesso_sistema'
import { prisma } from '@/lib/prisma'
import { claimsType } from '@/types/sistema/claims'

export async function getById(pId: number, pOffSet: number) {

    try {

        const lClaims: claimsType = await getClaims()

        let resposta = null

        if (pId === 0) {

            // if (await acessoModulosOpcoes('frmSolicitacaoSaida', 2) == false) {
            //     return {
            //         dados: {},
            //         erro: 'Acesso Negado!'
            //     }
            // }

            resposta = {

                id: 0,
                clienteSistemaId: parseInt(lClaims.clienteSistemaId),

                empresaId: null,
                solicitanteId: null,
                dataHoraSolicitacao: null,
                veiculoId: null,
                dataHoraPrevistaSaida: null,
                destinoId: null,
                motivoSaida: '',
                ordemServico: '',
                dataHoraPrevistaRetorno: null,
                autorizadorId: null,

                autorizado: '',
                dataHoraAutorizacao: null,
                observacoesAutorizacao: '',

                porteiroSaidaId: null,
                dataHoraSaida: null,
                kmSaida: null,
                observacoesSaida: '',

                porteiroRetornoId: null,
                dataHoraRetorno: null,
                kmRetorno: null,
                observacoesRetorno: '',

                situacao: 1,

                status: 'A',
                usuarioSistemaId: parseInt(lClaims.usuarioSistemaId),
                usuarioSistemaNome: lClaims.usuarioSistemaNome,
                dataHora: uData.novaDataHora(null),
            }

        } else {

            resposta = {}

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

export async function post(pDados: saidasRetornosVeiculosType, pOffSet: number) {

    try {

        // if (await acessoModulosOpcoes('frmSolicitacaoSaidas', 2) == false) {
        //     return {
        //         erro: 'Acesso Negado!'
        //     }
        // }

        const lClaims: claimsType = await getClaims()

        pDados.dataHoraSolicitacao = uData.feParaDbNn(pDados.dataHoraSolicitacao, pOffSet)
        pDados.dataHoraPrevistaSaida = uData.feParaDbNn(pDados.dataHoraPrevistaSaida, pOffSet)
        pDados.dataHoraPrevistaRetorno = uData.feParaDbNn(pDados.dataHoraPrevistaRetorno, pOffSet)
        pDados.dataHoraSaida = uData.feParaDb(pDados.dataHoraSaida, pOffSet)
        pDados.dataHoraRetorno = uData.feParaDb(pDados.dataHoraRetorno, pOffSet)

        pDados.usuarioSistemaId = parseInt(lClaims.usuarioSistemaId)
        pDados.usuarioSistemaNome = lClaims.usuarioSistemaNome
        pDados.dataHora = uData.feParaDbNn(uData.novaDataHora(null), pOffSet)

        /// Testa se solicitante tem processo aberto
        // const resposta = await prisma.tveSaidaRetorno.findFirst({
        //     where: {
        //         clienteSistemaId: parseInt(lClaims.clienteSistemaId),
        //         solicitanteId: pDados.solicitanteId,
        //         situacao: {
        //             not: 5,
        //         }
        //     }
        // })

        // if (resposta) {
        //     if (pDados.id == 0) {
        //         // console.log('Inclusão')
        //         return { erro: 'Este solicitante tem processo em andamento no ID: ' + resposta.id }
        //     } else {
        //         if (pDados.id !== resposta.id) {
        //             // console.log('Alteração')
        //             return { erro: 'Este solicitante tem processo em andamento no ID: ' + resposta.id }
        //         }
        //     }
        // }

        /// Gravação
        if (
            pDados.id === 0) {

            const { id, ...dadosSemId } = pDados

            const resposta = await prisma.tveSaidaRetorno.create({
                data: dadosSemId
            })

            return { erro: '' }

        } else {


            return { erro: 'Registro não pode ser atualizado.' }

        }

    } catch (error) {
        return { erro: 'post: ' + error };
    }

}