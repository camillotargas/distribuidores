"use client"

import React, { useEffect, useState } from 'react'
import { Sidebar } from 'primereact/sidebar'
import { Button } from 'primereact/button'

import { PanelMenu } from 'primereact/panelmenu'
import { MenuItem } from 'primereact/menuitem'

// import { useRouter } from 'next/navigation'
import { getClaims } from '@/actions/sistema/acesso_sistema'
import { claimsType } from '@/types/sistema/claims'

export default function MenuLeft() {

    const [menuVisible, setMenuVisible] = useState<boolean>(false);
    const [dialogVisible, setDialogVisible] = useState<boolean>(false)
    const [escondeMenuSistema, setEscondeMenuSistema] = useState(true)

    // const router = useRouter();

    const itensSistema: MenuItem[] = [
        {
            label: 'Sistema',
            icon: 'pi pi-globe',
            items: [

                { label: 'Cidades', url: '/admin/sistema/cidades' },
                { label: 'Clientes do Sistema', url: '/admin/sistema/clientes_sistema' },
                { label: 'Módulos e Opções', url: '/admin/sistema/modulos_opcoes' },

            ]
        },
    ];

    const itensPadrao: MenuItem[] = [
        {
            label: 'Início',
            icon: 'pi pi-home',
            url: '/admin'
        },
        {
            label: 'Consulta de Clientes',
            icon: 'pi pi-search',
            url: '/admin/consulta_clientes'
        },
        {
            label: 'Cadastros',
            icon: 'pi pi-file',
            items: [
                {

                    label: 'Básico',
                    // icon: 'pi pi-file',
                    items: [

                        { label: 'Usuários do Sistema', url: '/admin/basico/usuarios_sistema' },
                        { label: 'Perfis de Usuários do Sistema', url: '/admin/basico/perfis_usuarios_sistema' },
                        { label: 'Empresas', url: '/admin/basico/empresas' },
                        { label: 'Setores', url: '/admin/basico/setores' },

                    ],

                },
                {

                    label: 'Veículos',
                    // icon: 'pi pi-file',
                    items: [

                        { label: 'Marcas e Modelos', url: '/admin/veiculos/marcas_modelos' },
                        { label: 'Veículos', url: '/admin/veiculos/veiculos' },

                    ]

                }

            ]
        },
        {
            label: 'Processos',
            icon: 'pi pi-check-circle',
            items: [
                {

                    label: 'Veículos',
                    // icon: 'pi pi-file',
                    items: [

                        { label: 'Manutenções', url: '/admin/veiculos/manutencoes' },
                        { label: 'Solicitação de Saída de Veículo', url: '/admin/veiculos/solicitacao_saida/0' },
                        { label: 'Gerência de Saídas e Retorno de Veiculos', url: '/admin/veiculos/gerencia_saidas_retornos' },

                    ],

                }
            ]
        },
        {
            label: 'Relatorios',
            icon: 'pi pi-file-pdf',
            // items: [
            //     { label: 'Boletins de Leitura', url: '/admin/relatorios' },
            //     { label: 'Plano Analítico', url: '/admin/relatorios_plano_analitico' },
            //     { label: 'Acompanhamento ETE', url: '/admin/relatorios_acompanhamento_ete' },
            // ]
        },
        {
            label: 'Utilitários',
            icon: 'pi pi-cog',
            // items: [
            //     { label: 'Liga/Desliga', url: '/admin/liga_desliga' },
            //     { label: 'Configura Relatórios ETE', url: '/admin/configura_relatorios_ete' },
            //     {
            //         label: 'Linhas por Página',
            //         command: () => {
            //             recuperaLinhasPorPagina()
            //         }
            //     },
            // ]
        }

    ]

    async function ajustaMenu() {
        const lClaims: claimsType = await getClaims()
        if (lClaims.superUsuario == 'S') {
            setEscondeMenuSistema(false)
        }
    }

    useEffect(() => {
        ajustaMenu()
    }, [])

    return (
        <div className="card flex justify-content-center">

            <Sidebar visible={menuVisible} onHide={() => setMenuVisible(false)}>
                {/* <Menu model={items} className='h-full w-full' /> */}
                <PanelMenu model={itensPadrao} className="w-full md:w-20rem" />
                <PanelMenu model={itensSistema} hidden={escondeMenuSistema} className="w-full md:w-20rem" />
            </Sidebar>

            <Button icon="pi pi-bars" onClick={() => setMenuVisible(true)} />

        </div>
    )
}