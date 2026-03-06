'use client'

import React, { useEffect, useState, useRef } from 'react'

import { getAll } from '@/actions/veiculos/manutencoes'
import { manutencoesType } from '@/types/veiculos/manutencoes'

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
import uTexto from '@/utils/uTexto'
import { useRouter, useSearchParams } from 'next/navigation'
import uData from '@/utils/uData'
import { comboBoxType } from '@/types/sistema/combobox'
import { getComboBox as getComboBoxVeiculos } from '@/actions/veiculos/veiculos'
import { Dropdown } from 'primereact/dropdown'
import { classNames } from 'primereact/utils'
import { idNomeType } from '@/types/sistema/idNome'
import { codigoNomeType } from '@/types/sistema/codigoNome'

export default function Grid() {

    const [dados, setDados] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState<Boolean>(false)
    const messages = useRef<Messages>(null)

    const router = useRouter()
    const searchParams = useSearchParams()
    const urlBase = '/admin/veiculos/manutencoes'
    const pPrimeiro = Number(searchParams.get('primeiro')) || 0
    const pLinhas = Number(searchParams.get('linhas')) || 10
    const pNome = searchParams.get('nome') || ''
    const pVeiculoId = Number(searchParams.get('veiculo_id')) || 0
    const pTipo = Number(searchParams.get('tipo')) || 0
    const pSituacao = Number(searchParams.get('situacao')) || 0

    const [listaVeiculos, setListaVeiculos] = useState<comboBoxType[]>([])

    const botoesDataTable = (dados: manutencoesType) => {
        return (
            <>
                <Button type='button' icon='pi pi-pencil' size='small' onClick={() => { handleAlterar(dados.id!) }} />
            </>
        )
    }

    const formataVeiculo = (dados: any) => {
        return <> {dados.tveVeiculo.tveMarca.nome} {dados.tveVeiculo.tveModelo.nome} {dados.tveVeiculo.placa} </>
    }

    const formataDataInicio = (dados: any) => {
        return <> {uData.formataData(dados.dataInicio)} </>
    }

    const formataDataFim = (dados: any) => {
        return <> {uData.formataData(dados.dataFim)} </>
    }


    const formataSituacao = (dados: manutencoesType) => {

        if (dados.situacao == 1) {
            return <Tag value={'1-Manutenção em Adamento'} severity={'warning'}></Tag>
        } else if (dados.situacao == 2) {
            return <Tag value={'2-Manutenção Concluída'} severity={'success'}></Tag>
        }

    }

    const formataTipo = (dados: manutencoesType) => {

        if (dados.tipo == 1) {
            return <Tag value={'1-Preventiva'} severity={'success'}></Tag>
        } else if (dados.tipo == 2) {
            return <Tag value={'2-Corretiva'} severity={'danger'} ></Tag>
        }

    }

    // const formataStatus = (dados: manutencoesType) => {
    //     return (
    //         <>
    //             <Tag value={dados.status == 'A' ? 'Ativo' : 'Inativo'} severity={dados.status == 'A' ? 'success' : 'danger'}></Tag>
    //         </>
    //     )
    // }

    const idNomeSituacao: idNomeType[] = [
        { id: 0, nome: '0-Todas as Situações' },
        { id: 1, nome: '1-Manutenção em Andamento' },
        { id: 2, nome: '2-Manutenção Concluída' },
    ]

    const codigoNomeTipo: idNomeType[] = [
        { id: 0, nome: '0-Todos os Tipos' },
        { id: 1, nome: '1-Preventiva' },
        { id: 2, nome: '2-Corretiva' },
    ]

    const filtrosSchema = z.object({
        primeiro: z.number(),
        linhas: z.number(),
        totalRegistros: z.number(),
        id: z.number(),
        veiculoId: z.number(),
        tipo: z.number(),
        situacao: z.number(),
    })

    type filtrosType = z.infer<typeof filtrosSchema>

    const { control, handleSubmit, reset, formState: { errors }, setValue, getValues } = useForm<filtrosType>({
        resolver: zodResolver(filtrosSchema),
        defaultValues: {
            primeiro: 0,
            linhas: 10,
            totalRegistros: 0,
            id: 0,
            veiculoId: 0,
            tipo: 0,
            situacao: 1
        }
    })

    async function filtra(filtros: filtrosType) {

        setIsLoading(true)
        const resposta = await getAll(filtros.primeiro, filtros.linhas, filtros.tipo, filtros.situacao, filtros.veiculoId)

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
        router.push(urlBase + '?primeiro=' + getValues('primeiro') + '&linhas=' + getValues('linhas') + '&veiculoId=' + getValues('veiculoId') + '&tipo=' + getValues('tipo') + '&situacao=' + getValues('situacao'))
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

    const buscaVeiculos = async () => {
        setListaVeiculos((await getComboBoxVeiculos(0, '')))
    }

    useEffect(() => {

        setValue('primeiro', pPrimeiro)
        setValue('linhas', pLinhas)
        setValue('totalRegistros', 0)

        setValue('veiculoId', pVeiculoId)

        buscaVeiculos()
        filtra(getValues())

    }, [])

    return (

        <div className='mx-3'>

            <PageTitle texto="Veículos" />
            <PageSubTitle texto="Manutenções" />

            <Divider />

            <Messages ref={messages} />

            <div className="flex justify-center mt-2 gap-2">

                <form>

                    <div className='flex flex-row gap-2 flex-wrap'>

                        <Controller
                            name="tipo"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <Dropdown
                                        id={field.name}
                                        value={field.value}
                                        optionLabel="nome"
                                        optionValue="id"
                                        options={codigoNomeTipo}
                                        focusInputRef={field.ref}
                                        onChange={(e) => field.onChange(e.value)}
                                        className={classNames({ 'p-invalid': fieldState.error })}
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

                        <Controller
                            name="veiculoId"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <Dropdown
                                        id={field.name}
                                        value={field.value}
                                        optionLabel="nome"
                                        optionValue="id"
                                        options={listaVeiculos}
                                        focusInputRef={field.ref}
                                        onChange={(e) => {
                                            field.onChange(e.value)
                                            if (e.value == undefined) {
                                                setValue('veiculoId', 0)
                                            }
                                            handleFiltrar()
                                        }}
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                        placeholder="Selecione o Veículo"
                                        showClear
                                    // autoFocus
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
                        <Column body={formataSituacao} header="Situação" sortable align={'center'}></Column>
                        <Column body={formataVeiculo} header="Veículo" sortable></Column>
                        <Column body={botoesDataTable} exportable={false}></Column>
                    </DataTable>
                </div>

                <div className="hidden md:block" >
                    <DataTable value={dados} size="small" stripedRows showGridlines selectionMode="single" >
                        <Column field="id" header="ID" sortable></Column>
                        <Column body={formataTipo} header="Tipo" sortable align={'center'}></Column>
                        <Column body={formataSituacao} header="Situação" sortable align={'center'}></Column>
                        <Column body={formataVeiculo} header="Veículo" sortable></Column>
                        <Column body={formataDataInicio} header="Data Início" sortable align={'center'}></Column>
                        <Column body={formataDataFim} header="Data Fim" sortable align={'center'}></Column>
                        {/* <Column body={formataStatus} header="Status" sortable></Column> */}
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