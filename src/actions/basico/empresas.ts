'use server'

import { empresasType } from '@/types/basico/empresas'

import uData from '@/utils/uData'
import { acessoModulosOpcoes, getClaims } from '@/actions/sistema/acesso_sistema'
import { prisma } from '@/lib/prisma'
import { claimsType } from '@/types/sistema/claims'
import { comboBoxType } from '@/types/sistema/combobox'

export async function getAll(pPrimeiro: number, pLinhas: number, pNome: string) {

  try {

    if (await acessoModulosOpcoes('frmEmpresas', 1) == false) {
      return {
        dados: [],
        total_registros: 0,
        erro: 'Acesso Negado!'
      }
    }

    const lClaims: claimsType = await getClaims()

    const [respostaDados, respostasTotalRegistros] = await prisma.$transaction([

      prisma.tbaEmpresa.findMany({
        skip: pPrimeiro,
        take: pLinhas,
        where: {
          clienteSistemaId: parseInt(lClaims.clienteSistemaId),
          razaoSocial: {
            contains: pNome,
            mode: 'insensitive'
          }
        },
        orderBy: [
          { razaoSocial: 'asc', },
          { id: 'asc' },
        ]
      }),

      prisma.tbaEmpresa.count({
        where: {
          clienteSistemaId: parseInt(lClaims.clienteSistemaId),
          razaoSocial: {
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

    if (pId === 0) {

      if (await acessoModulosOpcoes('frmEmpresas', 2) == false) {
        return {
          dados: {},
          erro: 'Acesso Negado!'
        }
      }

      resposta = {

        id: 0,
        clienteSistemaId: parseInt(lClaims.clienteSistemaId),

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
        dataCadastro: uData.novaDataHora(null),

        status: 'A',
        usuarioSistemaId: parseInt(lClaims.usuarioSistemaId),
        usuarioSistemaNome: lClaims.usuarioSistemaNome,
        dataHora: uData.novaDataHora(null),
      }

    } else {

      if (await acessoModulosOpcoes('frmEmpresas', 1) == false) {
        return {
          dados: {},
          erro: 'Acesso Negado!'
        }
      }

      resposta = await prisma.tbaEmpresa.findUnique({
        where: {
          clienteSistemaId: parseInt(lClaims.clienteSistemaId),
          id: pId
        }
      })

      resposta!.dataHora = uData.dbParaFeNn(resposta!.dataHora, pOffSet)
      resposta!.dataCadastro = uData.dbParaFeNn(resposta!.dataCadastro, pOffSet)

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

export async function postPut(pDados: empresasType, pOffSet: number) {

  try {

    if (await acessoModulosOpcoes('frmEmpresas', 2) == false) {
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

      const resposta = await prisma.tbaEmpresa.create({
        data: dadosSemId
      })

      return { erro: '' }

    } else {

      const resposta = await prisma.tbaEmpresa.update({
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

export async function getComboBox(pId: number, pNome: string) {

  try {

    let resposta: any = []

    if (pId === null) {
      return resposta
    }

    if (pId < 0) {
      return resposta
    }

    const lClaims: claimsType = await getClaims()

    if (pId > 0) {

      resposta = await prisma.tbaEmpresa.findUnique({
        select: {
          id: true,
          nomeFantasia: true,
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

      resposta = await prisma.tbaEmpresa.findMany({
        skip: 0,
        take: 10,
        where: {
          clienteSistemaId: parseInt(lClaims.clienteSistemaId),
          nomeFantasia: {
            contains: pNome,
            mode: 'insensitive'
          }
        },
        orderBy: [
          { nomeFantasia: 'asc', },
          { id: 'asc' },
        ]
      })

    }

    //
    let respostaComboBox: Array<comboBoxType> = []

    if (resposta.length > 0) {
      respostaComboBox = resposta!.map((registro: empresasType) => ({
        id: registro.id,
        nome: registro.nomeFantasia,
        status: registro.status,
      }))
    }

    return respostaComboBox

  } catch (error) {
    // return { erro: 'getComboBox: ' + error }
    console.log('getComboBox: ' + error)
    return []
  }

}