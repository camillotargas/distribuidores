'use server'

import { cidadesType } from "@/types/sistema/cidades"

import { prisma } from "@/lib/prisma"
import { comboBoxType } from "@/types/sistema/combobox"
import { acessoModulosOpcoes } from "./acesso_sistema"

export async function getAll(pPrimeiro: number, pLinhas: number, pNome: string) {

  try {

    if (await acessoModulosOpcoes('frmCidades', 1) == false) {
      return {
        dados: [],
        total_registros: 0,
        erro: 'Acesso Negado!'
      }
    }

    const [respostaDados, respostasTotalRegistros] = await prisma.$transaction([

      prisma.tsiCidade.findMany({
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
          { estadoNome: 'asc' },
        ]
      }),

      prisma.tsiCidade.count({
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

    if (await acessoModulosOpcoes('frmCidades', 1) == false) {
      return {
        dados: {},
        erro: 'Acesso Negado!'
      }
    }

    const resposta = await prisma.tsiCidade.findUnique({
      where: { id: pId }
    })

    // dados['data_hora'] = uData.dbParaFe(dados.data_hora, offSet)

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

export async function postPut(pDados: any, pOffSet: number) {

  try {

    if (await acessoModulosOpcoes('frmCidades', 2) == false) {
      return {
        erro: 'Acesso Negado!'
      }
    }

    const result = await prisma.tsiCidade.upsert({
      where: {
        id: pDados.id,
      },
      update: {
        nome: pDados.nome,
        estadoId: pDados.estadoId,
        estadoNome: pDados.estadoNome,
        estadoSigla: pDados.estadoSigla,
      },
      create: {
        id: pDados.id,
        nome: pDados.nome,
        estadoId: pDados.estadoId,
        estadoNome: pDados.estadoNome,
        estadoSigla: pDados.estadoSigla,
      },
    })

    return { erro: '' }

  } catch (error) {
    return { erro: 'postPut: ' + error }
  }

}

export async function getComboBox(pId: number, pNome: string) {

  try {

    let resposta: any = []

    if (pId === null) {
      return resposta
    }

    if (pId > 0) {

      resposta = await prisma.tsiCidade.findUnique({
        select: {
          id: true,
          nome: true,
          estadoSigla: true,
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

      resposta = await prisma.tsiCidade.findMany({
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
    let respostaComboBox: Array<comboBoxType> = []

    if (resposta.length > 0) {
      respostaComboBox = resposta!.map((registro: cidadesType) => ({
        id: registro.id,
        nome: registro.nome + ' - ' + registro.estadoSigla,
        status: 'A',
      }))
    }

    return respostaComboBox

  } catch (error) {
    // return { erro: 'getComboBox: ' + error }
    return []
  }

}