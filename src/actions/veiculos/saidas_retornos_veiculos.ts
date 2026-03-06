'use server'

import { saidasRetornosVeiculosType } from '@/types/veiculos/saidas_retornos_veiculos'

import uData from '@/utils/uData'
import { acessoModulosOpcoes, getClaims } from '@/actions/sistema/acesso_sistema'
import { prisma } from '@/lib/prisma'
import { claimsType } from '@/types/sistema/claims'
import { getFreeById } from '../basico/usuarios_sistema'
import { usuariosSistemaType } from '@/types/basico/usuarios_sistema'

export async function getAll(pPrimeiro: number, pLinhas: number, pEmpresaId: number, pSolicitante: string, pAutorizador: string, pSituacao: number) {

  try {

    if (await acessoModulosOpcoes('frmGerenciaSaidasRetornos', 1) == false) {
      return {
        dados: [],
        total_registros: 0,
        erro: 'Acesso Negado!'
      }
    }

    const lClaims: claimsType = await getClaims()

    const [respostaDados, respostasTotalRegistros] = await prisma.$transaction([

      prisma.tveSaidaRetorno.findMany({
        relationLoadStrategy: 'join', // or 'query'
        skip: pPrimeiro,
        take: pLinhas,
        include: {
          tbaEmpresa: {
            select: {
              nomeFantasia: true,
            }
          },
          tveVeiculo: {
            select: {
              placa: true,
            }
          },
          tbaUsuarioSistemaSolicitante: {
            select: {
              nome: true,
            }
          },
          tbaUsuarioSistemaAutorizador: {
            select: {
              nome: true,
            }
          },
        },
        where: {
          clienteSistemaId: parseInt(lClaims.clienteSistemaId),
          empresaId: pEmpresaId,
          ...(pSolicitante !== '' && {
            tbaUsuarioSistemaSolicitante: {
              nome: {
                contains: pSolicitante,
                mode: 'insensitive',
              }
            }
          }),
          ...(pAutorizador !== '' && {
            tbaUsuarioSistemaAutorizador: {
              nome: {
                contains: pAutorizador,
                mode: 'insensitive',
              }
            }
          }),
          situacao: pSituacao,
        },
        orderBy: [
          { id: 'asc' },
        ]
      }),

      prisma.tveSaidaRetorno.count({
        where: {
          clienteSistemaId: parseInt(lClaims.clienteSistemaId),
          empresaId: pEmpresaId,
          ...(pSolicitante !== '' && {
            tbaUsuarioSistemaSolicitante: {
              nome: {
                contains: pSolicitante,
                mode: 'insensitive',
              }
            }
          }),
          ...(pAutorizador !== '' && {
            tbaUsuarioSistemaAutorizador: {
              nome: {
                contains: pAutorizador,
                mode: 'insensitive',
              }
            }
          }),
          situacao: pSituacao,
        },
      })

    ])

    // console.log('respostaDados: ', respostaDados)

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

      if (await acessoModulosOpcoes('frmGerenciaSaidasRetornos', 2) == false) {
        return {
          dados: {},
          erro: 'Acesso Negado!'
        }
      }

      let lDadosUsuario: usuariosSistemaType = {} as usuariosSistemaType

      const lRetornoUsuario = await getFreeById(parseInt(lClaims.usuarioSistemaId), pOffSet)
      if (lRetornoUsuario.erro !== '') {
        lDadosUsuario = lRetornoUsuario.dados as usuariosSistemaType
      }

      resposta = {

        id: 0,
        clienteSistemaId: parseInt(lClaims.clienteSistemaId),

        empresaId: lDadosUsuario.empresaId,
        solicitanteId: parseInt(lClaims.usuarioSistemaId),
        dataHoraSolicitacao: uData.novaDataHora(null),
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

      if (await acessoModulosOpcoes('frmGerenciaSaidasRetornos', 1) == false) {
        return {
          dados: {},
          erro: 'Acesso Negado!'
        }
      }

      resposta = await prisma.tveSaidaRetorno.findUnique({
        where: {
          clienteSistemaId: parseInt(lClaims.clienteSistemaId),
          id: pId
        }
      })

      resposta!.dataHoraSolicitacao = uData.dbParaFeNn(resposta!.dataHoraSolicitacao, pOffSet)
      resposta!.dataHoraPrevistaSaida = uData.dbParaFeNn(resposta!.dataHoraPrevistaSaida, pOffSet)
      resposta!.dataHoraPrevistaRetorno = uData.dbParaFeNn(resposta!.dataHoraPrevistaRetorno, pOffSet)
      resposta!.dataHoraSaida = uData.dbParaFe(resposta!.dataHoraSaida, pOffSet)
      resposta!.dataHoraRetorno = uData.dbParaFe(resposta!.dataHoraRetorno, pOffSet)

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

export async function postPut(pDados: saidasRetornosVeiculosType, pOffSet: number) {

  try {

    if (await acessoModulosOpcoes('frmGerenciaSaidasRetornos', 2) == false) {
      return {
        erro: 'Acesso Negado!'
      }
    }

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

    const resposta = await prisma.tveSaidaRetorno.findFirst({
      where: {
        clienteSistemaId: parseInt(lClaims.clienteSistemaId),
        solicitanteId: pDados.solicitanteId,
        situacao: {
          not: 5,
        }
      }
    })

    if (resposta) {
      if (pDados.id == 0) {
        console.log('Inclusão')
        return { erro: 'Este solicitante tem processo em andamento no ID: ' + resposta.id }
      } else {
        if (pDados.id !== resposta.id) {
          console.log('Alteração')
          return { erro: 'Este solicitante tem processo em andamento no ID: ' + resposta.id }
        }
      }
    }

    /// Gravação
    if (
      pDados.id === 0) {

      const { id, ...dadosSemId } = pDados

      const resposta = await prisma.tveSaidaRetorno.create({
        data: dadosSemId
      })

      return { erro: '' }

    } else {

      const resposta = await prisma.tveSaidaRetorno.update({
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

export async function getBySolicitante(pSolicitanteId: number) {

  try {

    const lClaims: claimsType = await getClaims()

    let resposta = null

    resposta = await prisma.tveSaidaRetorno.findFirst({
      where: {
        clienteSistemaId: parseInt(lClaims.clienteSistemaId),
        solicitanteId: pSolicitanteId,
        situacao: 4,
      }
    })

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


// export async function getComboBox(pId: number, pNome: string) {

//   try {

//     let resposta: any = []

//     if (pId === null) {
//       return resposta
//     }

//     const lClaims: claimsType = await getClaims()

//     if (pId > 0) {

//       resposta = await prisma.tveVeiculo.findUnique({
//         select: {
//           id: true,
//           placa: true,
//           status: true,
//         },
//         where: {
//           clienteSistemaId: parseInt(lClaims.clienteSistemaId),
//           id: pId
//         }
//       })

//       if (resposta === null) {
//         resposta = []
//       } else {
//         resposta = [resposta]
//       }

//     } else {

//       resposta = await prisma.tveVeiculo.findMany({
//         skip: 0,
//         take: 10,
//         where: {
//           clienteSistemaId: parseInt(lClaims.clienteSistemaId),
//           placa: {
//             contains: pNome,
//             mode: 'insensitive'
//           }
//         },
//         orderBy: [
//           { placa: 'asc', },
//           { id: 'asc' },
//         ]
//       })

//     }

//     //
//     let respostaComboBox: Array<comboBoxType> = []

//     if (resposta.length > 0) {
//       respostaComboBox = resposta!.map((registro: manutencoesType) => ({
//         id: registro.id,
//         nome: registro.placa,
//         status: registro.status,
//       }))
//     }

//     return respostaComboBox

//   } catch (error) {
//     // return { erro: 'getComboBox: ' + error }
//     console.log('getComboBox: ' + error)
//     return []
//   }

// }

export async function getBySolicitanteId(pSolicitanteId: number, pOffSet: number) {

  try {

    const lClaims: claimsType = await getClaims()

    let resposta = null

    resposta = await prisma.tveSaidaRetorno.findFirst({
      where: {
        clienteSistemaId: parseInt(lClaims.clienteSistemaId),
        solicitanteId: pSolicitanteId,
        situacao: {
          not: 5,
        }
      }
    })

    resposta!.dataHoraSolicitacao = uData.dbParaFeNn(resposta!.dataHoraSolicitacao, pOffSet)
    resposta!.dataHoraPrevistaSaida = uData.dbParaFeNn(resposta!.dataHoraPrevistaSaida, pOffSet)
    resposta!.dataHoraPrevistaRetorno = uData.dbParaFeNn(resposta!.dataHoraPrevistaRetorno, pOffSet)
    resposta!.dataHoraSaida = uData.dbParaFe(resposta!.dataHoraSaida, pOffSet)
    resposta!.dataHoraRetorno = uData.dbParaFe(resposta!.dataHoraRetorno, pOffSet)

    resposta!.dataHora = uData.dbParaFeNn(resposta!.dataHora, pOffSet)

    return {
      dados: resposta ?? {},
      erro: ''
    }

  } catch (error) {

    return {
      dados: {},
      erro: 'getBySolicitanteId: ' + error
    }

  }

}