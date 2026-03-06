'use server'

import uData from '@/utils/uData'
import { prisma } from '@/lib/prisma'
import { claimsType } from '@/types/sistema/claims'
import { acessoModulosOpcoes, getClaims } from '../sistema/acesso_sistema'
import { usuariosSistemaType } from '@/types/basico/usuarios_sistema'

export async function getAll(pPrimeiro: number, pLinhas: number, pNome: string) {

  try {

    if (await acessoModulosOpcoes('frmUsuariosSistema', 1) == false) {
      return {
        dados: [],
        total_registros: 0,
        erro: 'Acesso Negado!'
      }
    }

    const lClaims: claimsType = await getClaims()

    const [respostaDados, respostasTotalRegistros] = await prisma.$transaction([

      prisma.tbaUsuarioSistema.findMany({
        skip: pPrimeiro,
        take: pLinhas,
        where: {
          clienteSistemaId: parseInt(lClaims.clienteSistemaId),
          nome: {
            contains: pNome,
            mode: 'insensitive'
          }
        },
        include: {
          tbaEmpresa: {
            select: {
              nomeFantasia: true,
            },
          },
          tbaSetor: {
            select: {
              nome: true,
            },
          },
        },
        orderBy: [
          { nome: 'asc', },
          { id: 'asc' },
        ]
      }),

      prisma.tbaUsuarioSistema.count({
        where: {
          clienteSistemaId: parseInt(lClaims.clienteSistemaId),
          nome: {
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

    if (pId === 0) {

      if (await acessoModulosOpcoes('frmUsuariosSistema', 2) == false) {
        return {
          dados: {},
          erro: 'Acesso Negado!'
        }
      }

      resposta = {
        id: 0,
        clienteSistemaId: parseInt(lClaims.clienteSistemaId),

        nome: '',
        cpf: '',
        email: '',
        usuario: '',
        senha: '',
        administradorSistema: 'N',
        perfilUsuarioSistemaId: null,
        dataHoraCadastro: uData.novaDataHora(null),
        dataHoraUltimoAcesso: null,

        saidasRetornosVeiculosAutorizador: 'N',
        saidasRetornosVeiculosPorteiro: 'N',

        status: 'A',
        usuarioSistemaId: parseInt(lClaims.usuarioSistemaId),
        usuarioSistemaNome: lClaims.usuarioSistemaNome,
        dataHora: uData.novaDataHora(null),
      }

    } else {

      if (await acessoModulosOpcoes('frmUsuariosSistema', 1) == false) {
        return {
          dados: {},
          erro: 'Acesso Negado!'
        }
      }

      resposta = await prisma.tbaUsuarioSistema.findUnique({
        where: {
          clienteSistemaId: parseInt(lClaims.clienteSistemaId),
          id: pId
        }
      })

      resposta!.dataHoraCadastro = uData.dbParaFeNn(resposta!.dataHoraCadastro, pOffSet)
      resposta!.dataHoraUltimoAcesso = uData.dbParaFe(resposta!.dataHoraUltimoAcesso, pOffSet)
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

export async function postPut(pDados: usuariosSistemaType, pOffSet: number) {

  try {

    if (await acessoModulosOpcoes('frmUsuariosSistema', 2) == false) {
      return {
        erro: 'Acesso Negado!'
      }
    }

    const lClaims: claimsType = await getClaims()

    pDados.usuarioSistemaId = parseInt(lClaims.usuarioSistemaId)
    pDados.usuarioSistemaNome = lClaims.usuarioSistemaNome
    pDados.dataHoraCadastro = uData.feParaDbNn(pDados.dataHoraCadastro, pOffSet)
    pDados.dataHoraUltimoAcesso = uData.feParaDb(pDados.dataHoraUltimoAcesso, pOffSet)
    pDados.dataHora = uData.feParaDbNn(uData.novaDataHora(null), pOffSet)

    if (pDados.id === 0) {

      const dadosSemId = {
        ...pDados,
        id: undefined,
      }

      const resposta = await prisma.tbaUsuarioSistema.create({
        data: dadosSemId
      })

      return { erro: '' }

    } else {

      const resposta = await prisma.tbaUsuarioSistema.update({
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

export async function getComboBox(pId: number | null, pNome: string) {

  try {

    let resposta: any = []

    if (pId === null) {
      return resposta
    }

    const lClaims: claimsType = await getClaims()

    if (pId > 0) {

      resposta = await prisma.tbaUsuarioSistema.findUnique({
        select: {
          id: true,
          nome: true,
          status: true,
        },
        where: {
          clienteSistemaId: parseInt(lClaims.clienteSistemaId),
          id: pId
        },
      })

      if (resposta === null) {
        resposta = []
      } else {
        resposta = [resposta]
      }

    } else {

      resposta = await prisma.tbaUsuarioSistema.findMany({
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

    //
    // let respostaComboBox: Array<comboBoxType> = []

    // if (resposta.length > 0) {
    //   respostaComboBox = resposta!.map((registro: veiculosType) => ({
    //     id: registro.id,
    //     nome: registro.placa,
    //     status: registro.status,
    //   }))
    // }

    return resposta

  } catch (error) {
    // return { erro: 'getComboBox: ' + error }
    console.log('getComboBox: ' + error)
    return []
  }

}

export async function getComboBoxSaidasRetornosVeiculosAutorizadores(pId: number | null, pNome: string) {

  try {

    let resposta: any = []

    if (pId === null) {
      return resposta
    }

    const lClaims: claimsType = await getClaims()

    if (pId > 0) {

      resposta = await prisma.tbaUsuarioSistema.findUnique({
        select: {
          id: true,
          nome: true,
          status: true,
        },
        where: {
          clienteSistemaId: parseInt(lClaims.clienteSistemaId),
          id: pId,
          saidasRetornosVeiculosAutorizador: 'S',
        },
      })

      if (resposta === null) {
        resposta = []
      } else {
        resposta = [resposta]
      }

    } else {

      resposta = await prisma.tbaUsuarioSistema.findMany({
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
    console.log('getComboBoxSaidasRetornosVeiculosAutorizadores: ' + error)
    return []
  }

}

export async function getComboBoxSaidasRetornosVeiculosPorteiros(pId: number | null, pNome: string) {

  try {

    let resposta: any = []

    if (pId === null) {
      return resposta
    }

    const lClaims: claimsType = await getClaims()

    if (pId > 0) {

      resposta = await prisma.tbaUsuarioSistema.findUnique({
        select: {
          id: true,
          nome: true,
          status: true,
        },
        where: {
          clienteSistemaId: parseInt(lClaims.clienteSistemaId),
          id: pId,
          saidasRetornosVeiculosPorteiro: 'S',
        },
      })

      if (resposta === null) {
        resposta = []
      } else {
        resposta = [resposta]
      }

    } else {

      resposta = await prisma.tbaUsuarioSistema.findMany({
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
    console.log('getComboBoxSaidasRetornosVeiculosPorteiros: ' + error)
    return []
  }

}

export async function updateDataHoraUltimoAcessoById(pId: number, pOffSet: number) {

  try {

    const respostaUsuarioSistema = await prisma.tbaUsuarioSistema.update({
      data: {
        dataHoraUltimoAcesso: uData.feParaDbNn(uData.novaDataHora(null), pOffSet),
      },
      where: {
        id: pId,
      }
    })

    // console.log('respostaUsuarioSistema: ', respostaUsuarioSistema)

  } catch (error) {
    return { erro: 'updateDataHoraUltimoAcessoById: ' + error };
  }

}

export async function updateDataHoraCadastroById(pId: number, pOffSet: number) {

  try {

    const respostaUsuarioSistema = await prisma.tbaUsuarioSistema.update({
      data: {
        dataHoraUltimoAcesso: uData.feParaDbNn(uData.novaDataHora(null), pOffSet),
      },
      where: {
        id: pId,
      }
    })

    // console.log('respostaUsuarioSistema: ', respostaUsuarioSistema)

  } catch (error) {
    return { erro: 'updateDataHoraCadastroById: ' + error };
  }

}

export async function getFreeById(pId: number, pOffSet: number) {

  try {

    const lClaims: claimsType = await getClaims()

    const resposta = await prisma.tbaUsuarioSistema.findUnique({
      where: {
        clienteSistemaId: parseInt(lClaims.clienteSistemaId),
        id: pId
      }
    })

    resposta!.dataHoraCadastro = uData.dbParaFeNn(resposta!.dataHoraCadastro, pOffSet)
    resposta!.dataHoraUltimoAcesso = uData.dbParaFe(resposta!.dataHoraUltimoAcesso, pOffSet)
    resposta!.dataHora = uData.dbParaFeNn(resposta!.dataHora, pOffSet)

    return {
      dados: resposta ?? {},
      erro: ''
    }

  } catch (error) {

    return {
      dados: {},
      erro: 'getFreeById: ' + error
    }

  }

}