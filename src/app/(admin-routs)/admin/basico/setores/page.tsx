'use client'

import React, { useEffect, useState, useRef } from 'react'

import { getAll } from '@/actions/basico/setores'
import { setoresType } from '@/types/basico/setores'

import Link from 'next/link'

import { Button } from 'primereact/button'

import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'

import { classNames } from 'primereact/utils'

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
import { comboBoxType } from '@/types/sistema/combobox'
import { Dropdown } from 'primereact/dropdown'
import { getComboBox as empresasGetComboBox } from '@/actions/basico/empresas'

import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'

export default function Grid() {

    const [dados, setDados] = useState<setoresType[]>([])
    const [isLoading, setIsLoading] = useState<Boolean>(false)
    const messages = useRef<Messages>(null)

    const router = useRouter()
    const searchParams = useSearchParams()
    const urlBase = '/admin/basico/setores'
    const pPrimeiro = Number(searchParams.get('primeiro')) || 0
    const pLinhas = Number(searchParams.get('linhas')) || 10

    const pEmpresaId = Number(searchParams.get('empresa_id')) || 0
    const pNome = searchParams.get('nome') || ''

    const [listaEmpresas, setListaEmpresas] = useState<comboBoxType[]>([])

    const botoesDataTable = (dados: setoresType) => {
        return (
            <>
                <Button type='button' icon='pi pi-pencil' size='small' onClick={() => { handleAlterar(dados.id!) }} />
            </>
        )
    }

    const formataStatus = (dados: setoresType) => {
        return (
            <>
                <Tag value={dados.status == 'A' ? 'Ativo' : 'Inativo'} severity={dados.status == 'A' ? 'success' : 'danger'}></Tag>
            </>
        )
    }

    const filtrosSchema = z.object({
        pPrimeiro: z.number(),
        pLinhas: z.number(),
        pTotalRegistros: z.number(),
        pId: z.number(),
        empresaId: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }).min(1, { message: 'Campo Obrigatório' }),
        nome: z.string(),
    })

    type filtrosType = z.infer<typeof filtrosSchema>

    const { control, handleSubmit, formState: { errors }, setValue, getValues, trigger } = useForm<filtrosType>({
        resolver: zodResolver(filtrosSchema),
        defaultValues: {
            pPrimeiro: 0,
            pLinhas: 10,
            pTotalRegistros: 0,
            pId: 0,
            empresaId: 0,
            nome: ''
        }
    })

    async function filtra(filtros: filtrosType) {

        setIsLoading(true)
        const resposta = await getAll(filtros.pPrimeiro, filtros.pLinhas, filtros.nome, filtros.empresaId)

        if (resposta.erro !== '') {
            setIsLoading(false)
            messages.current?.clear()
            messages.current?.show({ id: '1', sticky: true, severity: 'error', summary: 'Erro', detail: resposta.erro, closable: false })
            setDados([])
            setValue('pTotalRegistros', 0)
        } else {
            messages.current?.clear()
            setDados(resposta.dados)
            setValue('pTotalRegistros', resposta.total_registros)
            setIsLoading(false)
        }

    }

    function ajustaUrl() {
        router.push(urlBase + '?primeiro=' + getValues('pPrimeiro') + '&linhas=' + getValues('pLinhas') + '&empresa_id=' + getValues('empresaId') + '&nome=' + getValues('nome'))
    }

    function handleFiltrar() {
        handleSubmit(filtra)()
        ajustaUrl()
    }

    function inclui() {
        router.push(urlBase + '/0/' + getValues('empresaId'))
    }

    function handleIncluir() {
        handleSubmit(inclui)()
    }

    function altera() {
        router.push(urlBase + '/' + getValues('pId') + '/' + getValues('empresaId'))
    }

    function handleAlterar(id: number) {
        setValue('pId', id)
        handleSubmit(altera)()
    }

    const onPageChange = (event: PaginatorPageChangeEvent) => {
        setValue('pPrimeiro', event.first)
        setValue('pLinhas', event.rows)
        filtra(getValues())
        ajustaUrl()
    }

    const buscaEmpresas = async () => {
        setListaEmpresas((await empresasGetComboBox(0, '')))
    }

    useEffect(() => {

        setValue('pPrimeiro', pPrimeiro)
        setValue('pLinhas', pLinhas)
        setValue('pTotalRegistros', 0)

        setValue('nome', pNome)
        setValue('empresaId', pEmpresaId)

        buscaEmpresas()
        filtra(getValues())

    }, [])

    return (

        <div className='mx-3'>

            <PageTitle texto="Pesquisas" />
            <PageSubTitle texto="Setores" />

            <Divider />

            <Messages ref={messages} />

            <div className="flex justify-center mt-2 gap-2">

                {/* <form onSubmit={handleSubmit(pesquisar)}> */}
                <form>

                    <div className='flex flex-row gap-2'>

                        <Controller
                            name="empresaId"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <Dropdown
                                        id={field.name}
                                        value={field.value}
                                        optionLabel="nome"
                                        optionValue="id"
                                        options={listaEmpresas}
                                        focusInputRef={field.ref}
                                        onChange={(e) => {
                                            field.onChange(e.value)
                                            handleFiltrar()
                                        }}
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                        placeholder="Selecione a Empresa"
                                    // autoFocus
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />

                        <Controller
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
                                        placeholder='Nome'
                                        autoFocus
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}

                                </>
                            )}
                        />

                        <Button type='button' label="Filtrar" icon="pi pi-filter" onClick={handleFiltrar} />

                    </div>

                </form>

            </div>

            <div className="mt-2">

                <div className="md:hidden">
                    <DataTable value={dados} size="small" stripedRows showGridlines selectionMode="single" >
                        <Column field="id" header="ID" sortable></Column>
                        <Column field="nome" header="Nome" sortable></Column>
                        <Column body={formataStatus} header="Status" sortable></Column>
                        <Column body={botoesDataTable} exportable={false}></Column>
                    </DataTable>
                </div>

                <div className="hidden md:block" >
                    <DataTable value={dados} size="small" stripedRows showGridlines selectionMode="single" >
                        <Column field="id" header="ID" sortable></Column>
                        <Column field="nome" header="Nome" sortable></Column>
                        <Column body={formataStatus} header="Status" sortable></Column>
                        <Column body={botoesDataTable} exportable={false}></Column>
                    </DataTable>
                </div>

                <div className="flex justify-center mt-2 gap-2">
                    <Paginator first={getValues('pPrimeiro')} rows={getValues('pLinhas')} totalRecords={getValues('pTotalRegistros')} rowsPerPageOptions={[10, 20, 30]} onPageChange={onPageChange} />
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