'use server'

import { loginType } from '@/types/sistema/acesso_sistema'
import { cookies } from 'next/headers'
import { jwtDecode } from "jwt-decode"
import { claimsType } from '@/types/sistema/claims'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import uTexto from '@/utils/uTexto'
import { updateDataHoraCadastroById } from '../basico/usuarios_sistema'
import uData from '@/utils/uData'

export async function getCookiesLogin() {

  const dados: loginType = {
    cliente: "",
    usuario: "",
    senha: "",
    lembrarMe: false
  }

  try {

    const lCookies = (await cookies())

    if (lCookies.has('cDistribuidorLembrarMe')) {

      if (lCookies.get('cDistribuidorLembrarMe')?.value == "S") {

        dados.lembrarMe = true

        if (lCookies.has('cDistribuidorCliente')) {
          dados.cliente = String(lCookies.get('cDistribuidorCliente')?.value)
        }

        if (lCookies.has('cDistribuidorUsuario')) {
          dados.usuario = String(lCookies.get('cDistribuidorUsuario')?.value)
        }

      } else {
        dados.lembrarMe = false
      }
    }

    // console.log('dados cookie:', dados)

    return dados

  } catch (error) {
    console.log('erro catch: ' + error)
    // return { 'erro': 'Ocorreu o seguinte erro: ' + error };
    return dados
  }

}

export async function setCookieToken(token: string) {

  try {

    // console.log('setCookieToken')

    const wMaxAge = 43200 // 12 horas

    const lCookies = (await cookies())

    lCookies.set({
      name: 'cDistribuidorToken',
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: wMaxAge
    })

  } catch (error) {
    console.log('erro catch: ' + error)
    // return { 'erro': 'Ocorreu o seguinte erro: ' + error };
  }

}

export async function getCookieToken() {

  try {

    // console.log('getCookieToken')

    const lCookies = (await cookies())

    if (lCookies.has('cDistribuidorToken')) {
      return String(lCookies.get('cDistribuidorToken')?.value)
    } else {
      return ""
    }

  } catch (error) {
    console.log('erro catch: ' + error)
    return "" // { 'erro': 'Ocorreu o seguinte erro: ' + error };
  }

}

export async function deleteCookieToken() {

  try {

    // console.log('deleteCookieToken')

    const lCookies = (await cookies())

    if (lCookies.has('cDistribuidorToken')) {
      lCookies.delete('cDistribuidorToken')
    }

  } catch (error) {
    console.log('erro catch: ' + error)
  }

}

export async function acesso(dados: loginType, pOffSet: number) {

  try {

    let payload = {
      clienteSistemaId: 0,
      clienteSistemaNome: '',
      usuarioSistemaId: 0,
      usuarioSistemaNome: '',
      administradorSistema: 'N',
      superUsuario: 'N',
      dataHoraUltimoAcesso: '',
    }

    //
    dados.cliente = uTexto.removerCaracteresNaoNumericos(dados.cliente)

    //
    const respostaClienteSistema = await prisma.tsiClienteSistema.findUnique({
      where: { cnpj: dados.cliente }
    })

    if (respostaClienteSistema) {
      payload.clienteSistemaId = respostaClienteSistema.id
      payload.clienteSistemaNome = respostaClienteSistema.razaoSocial
    } else {
      payload.clienteSistemaId = 0
      payload.clienteSistemaNome = 'Cliente Indefinido'
    }

    if ((dados.usuario.toUpperCase() === process.env.SU_NOME) && (dados.senha === process.env.SU_SENHA)) {

      payload.administradorSistema = 'N'
      payload.superUsuario = 'S'
      payload.usuarioSistemaNome = 'Super Usuário'
      payload.usuarioSistemaId = 0
      payload.dataHoraUltimoAcesso = ''

    } else {

      if (!respostaClienteSistema) {
        return { erro: 'Acesso não autorizado' }
      }

      const respostaUsuarioSistema = await prisma.tbaUsuarioSistema.findFirst({
        where: {
          clienteSistemaId: respostaClienteSistema.id,
          usuario: {
            contains: dados.usuario,
            mode: 'insensitive'
          },
          senha: dados.senha,
        }
      })

      if (!respostaUsuarioSistema) {
        return { erro: 'Acesso não autorizado' }
      }

      let lUltimoDataHoraUltimoAcesso = uData.dbParaFe(respostaUsuarioSistema.dataHoraUltimoAcesso, pOffSet) || null

      payload.administradorSistema = respostaUsuarioSistema.administradorSistema
      payload.superUsuario = 'N'
      payload.usuarioSistemaNome = respostaUsuarioSistema.nome
      payload.usuarioSistemaId = respostaUsuarioSistema.id

      if (lUltimoDataHoraUltimoAcesso !== null) {
        payload.dataHoraUltimoAcesso = uData.formataDataHora(respostaUsuarioSistema!.dataHoraUltimoAcesso!) || ''
      } else {
        payload.dataHoraUltimoAcesso = ''
      }

      await updateDataHoraCadastroById(payload.usuarioSistemaId, pOffSet)

    }

    const token = jwt.sign(payload, process.env.JWT_SECRET || '123', { expiresIn: '1h' })

    // console.log('token: ', token)

    return {
      token: token,
      erro: ''
    }

  } catch (error) {

    return {
      token: '',
      erro: 'acesso: ' + error
    }

  }

}

export async function setCookieCreditial(cliente: string, usuario: string, lembrarMe: boolean) {

  try {

    // console.log('setCookieCreditial')

    const lCookies = (await cookies())

    if (lembrarMe) {

      const wMaxAge = 60 * 60 * 24 * 30 // segundos * minutos * horas * dias

      lCookies.set({
        name: 'cDistribuidorCliente',
        value: cliente,
        httpOnly: true,
        path: '/',
        maxAge: wMaxAge
      })

      lCookies.set({
        name: 'cDistribuidorUsuario',
        value: usuario,
        httpOnly: true,
        path: '/',
        maxAge: wMaxAge
      })

      lCookies.set({
        name: 'cDistribuidorLembrarMe',
        value: 'S',
        httpOnly: true,
        path: '/',
        maxAge: wMaxAge
      })

    } else {

      if (lCookies.has('cDistribuidorCliente')) {
        lCookies.delete('cDistribuidorCliente')
      }

      if (lCookies.has('cDistribuidorUsuario')) {
        lCookies.delete('cDistribuidorUsuario')
      }

      if (lCookies.has('cDistribuidorLembrarMe')) {
        lCookies.delete('cDistribuidorLembrarMe')
      }

    }

  } catch (error) {
    console.log('erro catch: ' + error)
    // return { 'erro': 'Ocorreu o seguinte erro: ' + error };
  }

}

export async function getClaims() {

  // try {

  const token = await getCookieToken()
  const retorno = jwtDecode<claimsType>(token);
  // console.log('getClaims: ', retorno.AdministradorSistema)
  return retorno

  // } catch (error) {
  //   console.log('getClaims: ' + error)
  //   return { erro: 'getClaims: ' + error };
  // }

}

export async function acessoModulosOpcoes(pRecurso: string, pDireito: number) {

  try {

    const lClaims: claimsType = await getClaims()

    // console.log('pRecurso: ', pRecurso)
    // console.log('pDireito: ', pDireito)
    // console.log('lClaims: ', lClaims)

    // Se for Super Usuário
    if (lClaims.superUsuario == 'S') {
      return true
    }

    // Se for Administrador do Sistema
    if (lClaims.administradorSistema == 'S') {

      const respostaContaOpcoes = await prisma.tsiOpcao.count({
        where: {
          recurso: pRecurso,
        }
      })

      // console.log('respostaContaOpcao: ', respostaContaOpcoes)

      if (respostaContaOpcoes > 0) {
        return true
      } else {
        return false
      }

    }

    // Se for Usuário Normal
    const respostaUsuarioSistema = await prisma.tbaUsuarioSistema.findUnique({
      select: {
        perfilUsuarioSistemaId: true,
      },
      where: {
        id: Number(lClaims.usuarioSistemaId)
      }
    })

    // console.log('respostaUsuarioSistema!.perfilUsuarioSistemaId: ', respostaUsuarioSistema!.perfilUsuarioSistemaId)

    if ((respostaUsuarioSistema!.perfilUsuarioSistemaId == 0) || (respostaUsuarioSistema!.perfilUsuarioSistemaId == null)) {
      // console.log('<<< retorna falso >>>')
      return false
    }

    const respostaOpcoes = await prisma.tsiOpcao.findUnique({
      where: {
        recurso: pRecurso,
      }
    })

    // console.log('respostaOpcoes: ', respostaOpcoes)

    const respostaContaDireitos = await prisma.tbaDireitoPerfilUsuarioSistema.count({
      where: {
        clienteSistemaId: Number(lClaims.clienteSistemaId),
        perfilUsuarioSistemaId: respostaUsuarioSistema!.perfilUsuarioSistemaId,
        opcaoId: respostaOpcoes!.id,
        direito: {
          gte: pDireito, // >=
        }
      }
    })

    // console.log('respostaContaDireitos: ', respostaContaDireitos)

    if (respostaContaDireitos > 0) {
      return true
    } else {
      return false
    }

  } catch (error) {

    console.log('acessoModulosOpcoes: ' + error)
    return false

  }

}