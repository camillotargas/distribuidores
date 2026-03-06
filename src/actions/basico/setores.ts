'use server'

import uData from '@/utils/uData'
import { acessoModulosOpcoes, getClaims } from '@/actions/sistema/acesso_sistema'
import { prisma } from '@/lib/prisma'
import { claimsType } from '@/types/sistema/claims'
import { setoresType } from '@/types/basico/setores'

export async function getAll(pPrimeiro: number, pLinhas: number, pNome: string, pEmpresaId: number) {

  try {

    if (await acessoModulosOpcoes('frmSetores', 1) == false) {
      return {
        dados: [],
        total_registros: 0,
        erro: 'Acesso Negado!'
      }
    }

    const lClaims: claimsType = await getClaims()

    const [respostaDados, respostasTotalRegistros] = await prisma.$transaction([

      prisma.tbaSetor.findMany({
        skip: pPrimeiro,
        take: pLinhas,
        where: {
          clienteSistemaId: parseInt(lClaims.clienteSistemaId),
          empresaId: pEmpresaId,
          nome: {
            contains: pNome,
            mode: 'insensitive'
          }
        },
        orderBy: [
          { nome: 'asc', },
          { id: 'asc' },
        ]
      }),

      prisma.tbaSetor.count({
        where: {
          clienteSistemaId: parseInt(lClaims.clienteSistemaId),
          empresaId: pEmpresaId,
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

    if (pId === 0) {

      if (await acessoModulosOpcoes('frmSetores', 2) == false) {
        return {
          dados: {},
          erro: 'Acesso Negado!'
        }
      }

      resposta = {
        id: 0,
        clienteSistemaId: parseInt(lClaims.clienteSistemaId),

        empresaId: null,
        nome: '',

        status: 'A',
        usuarioSistemaId: parseInt(lClaims.usuarioSistemaId),
        usuarioSistemaNome: lClaims.usuarioSistemaNome,
        dataHora: uData.novaDataHora(null),
      }

    } else {

      if (await acessoModulosOpcoes('frmSetores', 1) == false) {
        return {
          dados: {},
          erro: 'Acesso Negado!'
        }
      }

      resposta = await prisma.tbaSetor.findUnique({
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

export async function postPut(pDados: setoresType, pOffSet: number) {

  try {

    if (await acessoModulosOpcoes('frmSetores', 2) == false) {
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

      const resposta = await prisma.tbaSetor.create({
        data: dadosSemId
      })

      return { erro: '' }

    } else {

      const resposta = await prisma.tbaSetor.update({
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

// export async function getComboBox(pId: number | null, pNome: string, pClienteSistemaId: number, pEmpresaId: number) {
export async function getComboBox(pId: number | null, pNome: string, pEmpresaId: number) {

  try {

    let resposta: any = []

    if (pId === null) {
      return resposta
    }

    if (pEmpresaId === undefined) {
      return resposta
    }

    //
    // let lClienteSistemaId: number = 0

    // if (pClienteSistemaId == 0) {
    //   const lClaims: claimsType = await getClaims()
    //   lClienteSistemaId = parseInt(lClaims.clienteSistemaId)
    // } else {
    //   lClienteSistemaId = pClienteSistemaId
    // }

    const lClaims: claimsType = await getClaims()

    if (pId > 0) {

      resposta = await prisma.tbaSetor.findUnique({
        select: {
          id: true,
          nome: true,
          status: true,
        },
        where: {
          clienteSistemaId: Number(lClaims.clienteSistemaId),
          empresaId: pEmpresaId,
          id: pId
        }
      })

      if (resposta === null) {
        resposta = []
      } else {
        resposta = [resposta]
      }

    } else {

      resposta = await prisma.tbaSetor.findMany({
        skip: 0,
        take: 10,
        where: {
          clienteSistemaId: Number(lClaims.clienteSistemaId),
          empresaId: pEmpresaId,
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
    console.log('getComboBox: ' + error)
    return []
  }

}