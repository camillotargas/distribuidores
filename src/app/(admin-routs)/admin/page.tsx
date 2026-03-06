// 'use client'

import { getClaims } from '@/actions/sistema/acesso_sistema'
import uData from '@/utils/uData'
import React from 'react'

export default async function Page() {

    const lClaims = await getClaims()

    return (

        <div className="flex flex-col items-center justify-center h-full">

            <div className="bg-surface-0 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20">
                <div className="text-surface-700 dark:text-surface-100 text-center flex flex-col items-center gap-3">
                    <i className="pi pi-user" style={{ fontSize: '3rem' }}></i>
                    <div className="text-surface-900 dark:text-surface-0 font-bold text-2xl leading-tight">Olá {lClaims.usuarioSistemaNome}.</div>

                    {lClaims.dataHoraUltimoAcesso == '' ?
                        <>
                            <div className="text-surface-700 dark:text-surface-100 text-xl leading-normal">Seja bem vindo, este é seu primeiro acesso. </div>
                        </>
                        :
                        <>
                            <div className="text-surface-700 dark:text-surface-100 text-xl leading-normal">Seja bem vindo, seu ultimo acesso foi em: {lClaims.dataHoraUltimoAcesso}. </div>
                            <div className="text-surface-700 dark:text-surface-100 text-l leading">Caso não foi você, comunique imediatamente o administrador do sistema.</div>
                        </>
                    }

                </div>
            </div>

        </div>

    )
}