'use server'

import uData from '@/utils/uData'
import { acessoModulosOpcoes, getClaims } from "./acesso_sistema"
import { prisma } from "@/lib/prisma"
import { claimsType } from "@/types/sistema/claims"
import uTexto from "@/utils/uTexto"
import { clientesSistemaType } from '@/types/sistema/clientes_sistema'

export async function getAll(pPrimeiro: number, pLinhas: number, pNome: string) {

  try {

    if (await acessoModulosOpcoes('frmClientesSistema', 1) == false) {
      return {
        dados: [],
        total_registros: 0,
        erro: 'Acesso Negado!'
      }
    }

    const [respostaDados, respostasTotalRegistros] = await prisma.$transaction([

      prisma.tsiClienteSistema.findMany({
        skip: pPrimeiro,
        take: pLinhas,
        select: {
          id: true,
          razaoSocial: true,
          nomeFantasia: true,
          cnpj: true,
          dataFimLicenca: true,
          status: true,
        },
        where: {
          razaoSocial: {
            contains: pNome,
            mode: 'insensitive'
          }
        },
        orderBy: [
          { razaoSocial: 'asc', },
          { nomeFantasia: 'asc' },
          { id: 'asc' },
        ]
      }),

      prisma.tsiClienteSistema.count({
        where: {
          razaoSocial: {
            contains: pNome,
            mode: 'insensitive'
          }
        },
      })

    ])

    // const respostaDadosAjustado = respostaDados.map(({ valorMensal, ...resto }) => ({
    //   ...resto,
    //   valorMensal: valorMensal.toFixed(2),
    // }))

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

      if (await acessoModulosOpcoes('frmClientesSistema', 2) == false) {
        return {
          dados: {},
          erro: 'Acesso Negado!'
        }
      }

      resposta = {
        id: 0,

        razaoSocial: '',
        nomeFantasia: '',
        inscricaoEstadual: '',
        cnpj: '',
        cep: '',
        endereco: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidadeId: null,
        telefone: '',
        email: '',
        site: '',
        valorMensal: 0,
        dataPrimeiraMensalidade: uData.novaDataHora(null),
        diaCobranca: null,
        dataFimLicenca: uData.novaDataHora(null),
        dataCadastro: uData.novaDataHora(null),

        status: 'A',
        usuarioSistemaId: parseInt(lClaims.usuarioSistemaId),
        usuarioSistemaNome: lClaims.usuarioSistemaNome,
        dataHora: uData.novaDataHora(null),
      }

    } else {

      if (await acessoModulosOpcoes('frmClientesSistema', 1) == false) {
        return {
          dados: {},
          erro: 'Acesso Negado!'
        }
      }

      resposta = await prisma.tsiClienteSistema.findUnique({
        where: { id: pId }
      })

      resposta!.dataHora = uData.dbParaFeNn(resposta!.dataHora, pOffSet)

    }

    respostaAjustada = {
      ...resposta,
      valorMensal: resposta!.valorMensal.toFixed(2),
    }

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

export async function postPut(pDados: clientesSistemaType, pOffSet: number) {

  try {

    if (await acessoModulosOpcoes('frmClientesSistema', 2) == false) {
      return {
        erro: 'Acesso Negado!'
      }
    }

    const lClaims: claimsType = await getClaims()

    pDados.cnpj = uTexto.removerCaracteresNaoNumericos(pDados.cnpj)
    pDados.dataCadastro = uData.feParaDbNn(pDados.dataCadastro, pOffSet)
    pDados.dataFimLicenca = uData.feParaDbNn(pDados.dataFimLicenca, pOffSet)
    pDados.dataPrimeiraMensalidade = uData.feParaDbNn(pDados.dataPrimeiraMensalidade, pOffSet)

    pDados.usuarioSistemaId = parseInt(lClaims.usuarioSistemaId)
    pDados.usuarioSistemaNome = lClaims.usuarioSistemaNome
    pDados.dataHora = uData.feParaDbNn(uData.novaDataHora(null), pOffSet)

    if (pDados.id === 0) {

      const dadosSemId = {
        ...pDados,
        id: undefined,
      }

      const resposta = await prisma.tsiClienteSistema.create({
        data: dadosSemId
      })

      return { erro: '' }

    } else {

      const resposta = await prisma.tsiClienteSistema.update({
        where: { id: pDados.id },
        data: pDados
      })

      return { erro: '' }

    }

  } catch (error) {
    return { erro: 'postPut: ' + error };
  }

}