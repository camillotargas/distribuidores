'use client'

import React, { useEffect, useState, useRef } from 'react'

import { getAll } from '@/actions/veiculos/saidas_retornos_veiculos'
import { saidasRetornosVeiculosType } from '@/types/veiculos/saidas_retornos_veiculos'

import Link from 'next/link'

import { Button } from 'primereact/button'

import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'

import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"

import { Messages } from 'primereact/messages'
import Loading from '@/components/loading'
import PageTitle from '@/components/pageTitle'
import PageSubTitle from '@/components/pageSubTitle'

import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator'
import { InputText } from 'primereact/inputtext'
import { Tag } from 'primereact/tag'
import { Divider } from 'primereact/divider'
import { useRouter, useSearchParams } from 'next/navigation'
import uData from '@/utils/uData'
import { comboBoxType } from '@/types/sistema/combobox'
import { getComboBox as getComboBoxEmpresas } from '@/actions/basico/empresas'
import { Dropdown } from 'primereact/dropdown'
import { classNames } from 'primereact/utils'
import { idNomeType } from '@/types/sistema/idNome'
import { AutoComplete, AutoCompleteChangeEvent } from 'primereact/autocomplete'

export default function Grid() {

    const [dados, setDados] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState<Boolean>(false)
    const messages = useRef<Messages>(null)

    const router = useRouter()
    const searchParams = useSearchParams()
    const urlBase = '/admin/processos/veiculos/gerencia_saidas_retornos'
    const pPrimeiro = Number(searchParams.get('primeiro')) || 0
    const pLinhas = Number(searchParams.get('linhas')) || 10

    const pEmpresaId = Number(searchParams.get('empresaId')) || -1
    const pSolicitante = searchParams.get('solicitante') || ''
    const pAutorizador = searchParams.get('autorizador') || ''
    const pSituacao = Number(searchParams.get('situacao')) || 1

    const [listaEmpresas, setListaEmpresas] = useState<comboBoxType[]>([])
    const [empresaSelecionada, setEmpresaSelecionada] = useState<comboBoxType>({} as comboBoxType);

    const botoesDataTable = (dados: saidasRetornosVeiculosType) => {
        return (
            <>
                <Button type='button' icon='pi pi-pencil' size='small' onClick={() => { handleAlterar(dados.id!) }} />
            </>
        )
    }

    const formataDataHoraPrevistaSaida = (dados: saidasRetornosVeiculosType) => {
        return (
            <>
                {uData.formataDataHora(dados.dataHoraPrevistaSaida)}
            </>
        )
    }

    const formataSituacao = (dados: saidasRetornosVeiculosType) => {

        switch (dados.situacao) {
            case 1: return (<Tag value='1-Aguardando Autorização' severity='danger'></Tag>)
            case 2: return (<Tag value='2-Autorizado' severity='success'></Tag>)
            case 3: return (<Tag value='3-Não Autorizado' severity='secondary'></Tag>)
            case 4: return (<Tag value='4-Saiu' severity='warning'></Tag>)
            case 5: return (<Tag value='5-Retornou' severity='info'></Tag>)
        }

    }

    const idNomeSituacao: idNomeType[] = [
        { id: 1, nome: '1-Aguardando Autorização' },
        { id: 2, nome: '2-Autorizado' },
        { id: 3, nome: '3-Não Autorizado' },
        { id: 4, nome: '4-Saiu' },
        { id: 5, nome: '5-Retornou' },
    ]

    const filtrosSchema = z.object({
        primeiro: z.number(),
        linhas: z.number(),
        totalRegistros: z.number(),
        id: z.number(),
        empresaId: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
        solicitante: z.string(),
        autorizador: z.string(),
        situacao: z.number(),
    })

    type filtrosType = z.infer<typeof filtrosSchema>

    const { control, handleSubmit, formState: { errors }, setValue, getValues, trigger } = useForm<filtrosType>({
        resolver: zodResolver(filtrosSchema),
        defaultValues: {
            primeiro: 0,
            linhas: 10,
            totalRegistros: 0,
            id: 0,
            empresaId: 0,
            solicitante: '',
            autorizador: '',
            situacao: 0
        }
    })

    async function filtra(filtros: filtrosType) {

        console.log('filtros: ', filtros)

        setIsLoading(true)
        const resposta = await getAll(filtros.primeiro, filtros.linhas, filtros.empresaId, filtros.solicitante, filtros.autorizador, filtros.situacao)

        if (resposta.erro !== '') {
            setIsLoading(false)
            messages.current?.clear()
            messages.current?.show({ id: '1', sticky: true, severity: 'error', summary: 'Erro', detail: resposta.erro, closable: false })
            setDados([])
            setValue('totalRegistros', 0)
        } else {
            messages.current?.clear()
            setDados(resposta.dados)
            setValue('totalRegistros', resposta.total_registros)
            setIsLoading(false)
        }

    }

    function ajustaUrl() {
        router.push(urlBase + '?primeiro=' + getValues('primeiro') + '&linhas=' + getValues('linhas') + '&empresaId=' + getValues('empresaId') + '&solicitante=' + getValues('solicitante') + '&autorizador=' + getValues('autorizador') + '&situacao=' + getValues('situacao'))
    }

    const onPageChange = (event: PaginatorPageChangeEvent) => {
        setValue('primeiro', event.first)
        setValue('linhas', event.rows)
        filtra(getValues())
        ajustaUrl()
    }

    function handleFiltrar() {
        handleSubmit(filtra)()
        ajustaUrl()
    }

    function inclui() {
        router.push(urlBase + '/0')
    }

    function handleIncluir() {
        handleSubmit(inclui)()
    }

    function altera() {
        router.push(urlBase + '/' + getValues('id'))
    }

    function handleAlterar(id: number) {
        setValue('id', id)
        handleSubmit(altera)()
    }

    const buscaEmpresas = async () => {
        setListaEmpresas((await getComboBoxEmpresas(0, '')))
    }

    // Após Carga dos Dados
    useEffect(() => {

        async function aposCargaDados() {

            console.log('aposCargaDados:', getValues('empresaId'))

            setIsLoading(true)

            // autocompletar
            setEmpresaSelecionada((await getComboBoxEmpresas(getValues('empresaId'), ''))[0])

            setIsLoading(false)

        }

        aposCargaDados()

    }, [dados])


    useEffect(() => {

        setValue('primeiro', pPrimeiro)
        setValue('linhas', pLinhas)
        setValue('totalRegistros', 0)

        setValue('empresaId', pEmpresaId)
        setValue('solicitante', pSolicitante)
        setValue('autorizador', pAutorizador)
        setValue('situacao', pSituacao)

        // buscaEmpresas()

        filtra(getValues())

    }, [])

    return (

        <div className='mx-3'>

            <PageTitle texto="Veículos" />
            <PageSubTitle texto="Gerência de Saídas e Retornos de Veículos" />

            <Divider />

            <Messages ref={messages} />

            <div className="flex justify-center mt-2 gap-2">

                <form>

                    <div className='flex flex-row gap-2 flex-wrap'>

                        <Controller
                            name="empresaId"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>

                                    <AutoComplete
                                        id={field.name}
                                        value={empresaSelecionada}
                                        field='nome'
                                        inputId='id'
                                        suggestions={listaEmpresas}
                                        completeMethod={buscaEmpresas}
                                        onChange={(e: AutoCompleteChangeEvent) => {
                                            setEmpresaSelecionada(e.value)
                                        }}
                                        onBlur={() => {
                                            setValue('empresaId', empresaSelecionada?.id)
                                            if (getValues('empresaId')) {
                                                trigger(['empresaId'])
                                            }
                                        }}
                                        dropdown
                                        autoFocus
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}

                                </>
                            )}
                        />

                        <Controller
                            name="solicitante"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <InputText
                                        id={field.name}
                                        value={field.value}
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        maxLength={40}
                                        autoFocus
                                        placeholder='Solicitante'
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}

                                </>
                            )}
                        />

                        <Controller
                            name="autorizador"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <InputText
                                        id={field.name}
                                        value={field.value}
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        maxLength={40}
                                        autoFocus
                                        placeholder='Autorizador'
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}

                                </>
                            )}
                        />

                        <Controller
                            name="situacao"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <Dropdown
                                        id={field.name}
                                        value={field.value}
                                        optionLabel="nome"
                                        optionValue="id"
                                        options={idNomeSituacao}
                                        focusInputRef={field.ref}
                                        onChange={(e) => field.onChange(e.value)}
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />

                        {/* <Controller
                            name="nome"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <InputText
                                        id={field.name}
                                        value={field.value}
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        maxLength={30}
                                        placeholder='Placa'
                                        autoFocus
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}

                                </>
                            )}
                        /> */}

                        <Button type='button' label="Filtrar" icon="pi pi-filter" onClick={handleFiltrar} />

                    </div>

                </form>

            </div>

            <div className="mt-2">

                <div className="md:hidden">
                    <DataTable value={dados} size="small" stripedRows showGridlines selectionMode="single" >
                        <Column field="id" header="ID" sortable></Column>
                        <Column field="tbaEmpresa.nomeFantasia" header="Empresa" sortable></Column>
                        <Column field="tbaUsuarioSistemaSolicitante.nome" header="Solicitante" sortable></Column>
                        <Column field="tbaUsuarioSistemaAutorizador.nome" header="Autorizador" sortable></Column>
                        <Column body={formataSituacao} header="Situação" sortable></Column>
                        <Column body={botoesDataTable} exportable={false}></Column>
                    </DataTable>
                </div>

                <div className="hidden md:block" >
                    <DataTable value={dados} size="small" stripedRows showGridlines selectionMode="single" >
                        <Column field="id" header="ID" sortable></Column>
                        <Column field="tbaEmpresa.nomeFantasia" header="Empresa" sortable></Column>
                        <Column field="tbaUsuarioSistemaSolicitante.nome" header="Solicitante" sortable></Column>
                        <Column body={formataDataHoraPrevistaSaida} header="Data/Hora Prevista Saída" sortable></Column>
                        <Column field="tveVeiculo.placa" header="Veículo" sortable></Column>
                        <Column field="tbaUsuarioSistemaAutorizador.nome" header="Autorizador" sortable></Column>
                        <Column body={formataSituacao} header="Situação" sortable></Column>
                        <Column body={botoesDataTable} exportable={false} className='flex flex-row gap-2'></Column>
                    </DataTable>
                </div>

                <div className="flex justify-center mt-2 gap-2">
                    <Paginator first={getValues('primeiro')} rows={getValues('linhas')} totalRecords={getValues('totalRegistros')} rowsPerPageOptions={[10, 20, 30]} onPageChange={onPageChange} />
                </div>

                <Divider />

                <div className="flex justify-center mt-2 gap-2">

                    <Button label="Incluir" type="button" icon="pi pi-plus" onClick={handleIncluir} />

                    <Link href="/admin">
                        <Button label="Início" icon="pi pi-home" />
                    </Link>

                </div>

            </div>

            {
                isLoading && <Loading />
            }

        </div>

    )
}