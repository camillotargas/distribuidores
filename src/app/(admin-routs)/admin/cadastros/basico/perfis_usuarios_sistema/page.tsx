'use client'

import React, { useEffect, useState, useRef } from 'react'

import { getAll } from '@/actions/basico/perfis_usuarios_sistema'

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
import { Divider } from 'primereact/divider'
import { Tag } from 'primereact/tag'
import { useRouter, useSearchParams } from 'next/navigation'

export default function Grid() {

    const [dados, setDados] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState<Boolean>(false)
    const messages = useRef<Messages>(null)

    const router = useRouter()
    const searchParams = useSearchParams()
    const urlBase = '/admin/cadastros/basico/perfis_usuarios_sistema'
    const pPrimeiro = Number(searchParams.get('primeiro')) || 0
    const pLinhas = Number(searchParams.get('linhas')) || 10

    const pNome = searchParams.get('nome') || ''

    const botoesDataTable = (dados: any) => {
        return (
            <>
                <Button type='button' icon='pi pi-pencil' size='small' onClick={() => { handleAlterar(dados.id!) }} />
            </>
        )
    }

    const formataStatus = (dados: any) => {
        return (
            <>
                <Tag value={dados.status == 'A' ? 'Ativo' : 'Inativo'} severity={dados.status == 'A' ? 'success' : 'danger'}></Tag>
            </>
        )
    }

    const filtrosSchema = z.object({
        primeiro: z.number(),
        linhas: z.number(),
        totalRegistros: z.number(),
        id: z.number(),
        nome: z.string(),
    })

    type filtrosType = z.infer<typeof filtrosSchema>

    const { control, handleSubmit, formState: { errors }, getValues, setValue } = useForm<filtrosType>({
        resolver: zodResolver(filtrosSchema),
        defaultValues: {
            primeiro: 0,
            linhas: 10,
            totalRegistros: 0,
            id: 0,
            nome: ''
        }
    })

    async function filtra(filtros: filtrosType) {

        setIsLoading(true)
        const resposta = await getAll(filtros.primeiro, filtros.linhas, filtros.nome)

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
        router.push(urlBase + '?primeiro=' + getValues('primeiro') + '&linhas=' + getValues('linhas') + '&nome=' + getValues('nome'))
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

    useEffect(() => {

        setValue('primeiro', pPrimeiro)
        setValue('linhas', pLinhas)
        setValue('totalRegistros', 0)

        setValue('nome', pNome)

        filtra(getValues())

    }, [])

    return (

        <div className='mx-3'>

            <PageTitle texto="Básico" />
            <PageSubTitle texto="Cadastro de Perfis de Usuários do Sistema" />

            <Divider />

            <Messages ref={messages} />

            <div className="flex justify-center mt-2 gap-2">

                <form>

                    <div className='flex flex-row gap-2'>

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
                                        maxLength={40}
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