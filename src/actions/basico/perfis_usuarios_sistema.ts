'use server'

import uData from '@/utils/uData'
import { acessoModulosOpcoes, getClaims, getCookieToken } from '@/actions/sistema/acesso_sistema'
import { prisma } from '@/lib/prisma'
import { claimsType } from '@/types/sistema/claims'
import { perfisType } from '@/types/basico/perfis_usuarios_sistema'

export async function getAll(pPrimeiro: number, pLinhas: number, pNome: string) {

  try {

    if (await acessoModulosOpcoes('frmPerfisUsuariosSistema', 1) == false) {
      return {
        dados: [],
        total_registros: 0,
        erro: 'Acesso Negado!'
      }
    }

    const lClaims: claimsType = await getClaims()

    const [respostaDados, respostasTotalRegistros] = await prisma.$transaction([

      prisma.tbaPerfilUsuarioSistema.findMany({
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

      prisma.tbaPerfilUsuarioSistema.count({
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

  // revalidatePath('/')
}

export async function getById(pId: number, pOffSet: number) {

  try {

    const lClaims: claimsType = await getClaims()

    let resposta = null
    let respostaAjustada = null

    if (pId == 0) {

      if (await acessoModulosOpcoes('frmPerfisUsuariosSistema', 2) == false) {
        return {
          dados: {},
          erro: 'Acesso Negado!'
        }
      }

      resposta = {
        id: 0,
        clienteSistemaId: parseInt(lClaims.clienteSistemaId),

        nome: '',

        direitosPerfisUsuariosSistema: [],

        status: 'A',
        usuarioSistemaId: lClaims.usuarioSistemaId,
        usuarioSistemaNome: lClaims.usuarioSistemaNome,
        dataHora: new Date(),
      }

      respostaAjustada = resposta

    } else {

      if (await acessoModulosOpcoes('frmPerfisUsuariosSistema', 1) == false) {
        return {
          dados: {},
          erro: 'Acesso Negado!'
        }
      }

      resposta = await prisma.tbaPerfilUsuarioSistema.findUnique({
        relationLoadStrategy: 'join', // or 'query'
        where: {
          clienteSistemaId: parseInt(lClaims.clienteSistemaId),
          id: pId
        },
        // include: {
        //   tbaDireitoPerfilUsuarioSistema: true,
        // },
        include: {
          tbaDireitoPerfilUsuarioSistema: {
            include: {
              tsiModulo: true,
              tsiOpcao: true,
            },
          },
        },
      })

      resposta!.dataHora = uData.dbParaFeNn(resposta!.dataHora, pOffSet)

      respostaAjustada = {
        ...resposta,
        tbaDireitoPerfilUsuarioSistema: resposta!.tbaDireitoPerfilUsuarioSistema.map(item => ({
          ...item,
          moduloNome: item.tsiModulo.nome,
          opcaoNome: item.tsiOpcao.nome,
        }))
      }

    }

    console.log('getById respostaAjustada: ', respostaAjustada)

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

export async function postPut(pDados: perfisType, pOffSet: number) {

  try {

    if (await acessoModulosOpcoes('frmPerfisUsuariosSistema', 2) == false) {
      return {
        erro: 'Acesso Negado!'
      }
    }

    const lClaims: claimsType = await getClaims()

    pDados.usuarioSistemaId = parseInt(lClaims.usuarioSistemaId)
    pDados.usuarioSistemaNome = lClaims.usuarioSistemaNome
    pDados.dataHora = uData.feParaDbNn(uData.novaDataHora(null), pOffSet)


    if (pDados.id === 0) {

      const { tbaDireitoPerfilUsuarioSistema, ...dadosSemDireitos } = pDados
      const { id, ...dadosSemId } = dadosSemDireitos

      const resposta = await prisma.$transaction(async (t: any) => {

        const respostaPerfil = await t.tbaPerfilUsuarioSistema.create({
          // data: {
          //   clienteSistemaId: pDados.clienteSistemaId,
          //   nome: pDados.nome,
          //   status: pDados.status,
          //   usuarioSistemaId: pDados.usuarioSistemaId,
          //   usuarioSistemaNome: pDados.usuarioSistemaNome,
          //   dataHora: pDados.dataHora,
          // }
          data: dadosSemId,
        })

        if (pDados.tbaDireitoPerfilUsuarioSistema) {

          if (pDados!.tbaDireitoPerfilUsuarioSistema!.length > 0) {

            for (let i = 0; i < pDados.tbaDireitoPerfilUsuarioSistema.length; i++) {

              if (pDados.tbaDireitoPerfilUsuarioSistema[i].flagDelete == false) {

                await t.tbaDireitoPerfilUsuarioSistema.create({
                  data: {
                    clienteSistemaId: respostaPerfil.clienteSistemaId,
                    perfilUsuarioSistemaId: respostaPerfil.id,
                    moduloId: pDados.tbaDireitoPerfilUsuarioSistema[i].moduloId,
                    opcaoId: pDados.tbaDireitoPerfilUsuarioSistema[i].opcaoId,
                    direito: pDados.tbaDireitoPerfilUsuarioSistema[i].direito,
                  }
                })

              }

            }

          }

        }

      })

      return { erro: '' }

    } else {

      const resposta = await prisma.$transaction(async (t: any) => {

        const { tbaDireitoPerfilUsuarioSistema, ...dadosSemDireitos } = pDados

        const respostaPerfil = await t.tbaPerfilUsuarioSistema.update({
          where: {
            clienteSistemaId: parseInt(lClaims.clienteSistemaId),
            id: pDados.id
          },
          data: dadosSemDireitos,
        })

        if (pDados!.tbaDireitoPerfilUsuarioSistema) {

          if (pDados!.tbaDireitoPerfilUsuarioSistema!.length > 0) {

            for (let i = 0; i < pDados.tbaDireitoPerfilUsuarioSistema.length; i++) {

              if (pDados.tbaDireitoPerfilUsuarioSistema[i].id > 0) {

                if (pDados.tbaDireitoPerfilUsuarioSistema[i].flagDelete == true) {

                  await t.tbaDireitoPerfilUsuarioSistema.delete({
                    where: {
                      clienteSistemaId: parseInt(lClaims.clienteSistemaId),
                      id: pDados.tbaDireitoPerfilUsuarioSistema[i].id
                    }
                  })

                } else {

                  if (pDados.tbaDireitoPerfilUsuarioSistema[i].flagInsertUpdate) {

                    await t.tbaDireitoPerfilUsuarioSistema.update({
                      where: {
                        clienteSistemaId: parseInt(lClaims.clienteSistemaId),
                        id: pDados.tbaDireitoPerfilUsuarioSistema[i].id
                      },
                      data: {
                        perfilUsuarioSistemaId: respostaPerfil.id,
                        moduloId: pDados.tbaDireitoPerfilUsuarioSistema[i].moduloId,
                        opcaoId: pDados.tbaDireitoPerfilUsuarioSistema[i].opcaoId,
                        direito: pDados.tbaDireitoPerfilUsuarioSistema[i].direito,
                      }
                    })

                  }

                }

              } else {

                if (pDados.tbaDireitoPerfilUsuarioSistema[i].flagDelete == false) {

                  await t.tbaDireitoPerfilUsuarioSistema.create({
                    data: {
                      clienteSistemaId: respostaPerfil.clienteSistemaId,
                      perfilUsuarioSistemaId: respostaPerfil.id,
                      moduloId: pDados.tbaDireitoPerfilUsuarioSistema[i].moduloId,
                      opcaoId: pDados.tbaDireitoPerfilUsuarioSistema[i].opcaoId,
                      direito: pDados.tbaDireitoPerfilUsuarioSistema[i].direito,
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
    console.log('erro: ', error)
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

      resposta = await prisma.tbaPerfilUsuarioSistema.findUnique({
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

      resposta = await prisma.tbaPerfilUsuarioSistema.findMany({
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
    //   respostaComboBox = resposta!.map((registro: empresasType) => ({
    //     id: registro.id,
    //     nome: registro.razaoSocial,
    //     status: registro.status,
    //   }))
    // }

    // return respostaComboBox

    return resposta

  } catch (error) {
    // return { erro: 'getComboBox: ' + error }
    console.log('getComboBox: ' + error)
    return []
  }

}