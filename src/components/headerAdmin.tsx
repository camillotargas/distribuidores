
'use client'

import MenuLeft from "@/components/menuLeft"
import ButtonLogout from "@/components/buttonLogout"
import { useEffect, useState } from "react"
import { getClaims } from "@/actions/sistema/acesso_sistema"
import uTexto from "@/utils/uTexto"

export default function HeaderAdmin() {

    const [cliente, setCliente] = useState<string>('')
    const [usuario, setUsuario] = useState<string>('')

    async function buscaCredenciais() {
        const lClaims = await getClaims()
        setCliente(lClaims.clienteSistemaNome)

        const usuarioSemId = uTexto.extrairDepoisCaracter(lClaims.usuarioSistemaNome, '-')
        setUsuario(usuarioSemId)
    }

    useEffect(() => {
        buscaCredenciais()
    }, [])

    return (
        // flex justify-between items-center w-screen sticky top-0 h-16 p-3 bg-card
        <div className="flex items-center justify-between px-4">

            <MenuLeft />

            <div className="flex flex-col items-center p-0 text-white">
                {/* <Image className="ml-3" src="/images/pokeball.png" width="30" height="30" alt="Logo PokeNext" /> */}
                {/* <HeaderTitle /> */}
                <h1 className="font-semibold text-card-foreground">Targas - Distribuidor</h1>
                <h2 className="text-xs">{cliente}</h2>
                <h3 className="text-xs">{usuario}</h3>

                {/* <p className="text-xs">{cliente}</p>
                <p className="text-xs">{usuario}</p> */}
            </div>

            <ButtonLogout />

        </div>

    )
}