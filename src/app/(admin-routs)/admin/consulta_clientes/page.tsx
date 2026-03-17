'use client'

import React, { useEffect, useState, useRef } from 'react'

import { getAll, getById, getCrednetPP, postPut } from '@/actions/consulta_clientes/consulta_clientes'
import { consultaClientesType } from '@/types/consulta_clientes/consulta_clientes'

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

import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import uData from '@/utils/uData'
import { InputMask } from 'primereact/inputmask'
import uDados from '@/utils/uDados'
import uNumero from '@/utils/uNumeros'

export default function Grid() {

    const [dados, setDados] = useState<consultaClientesType[]>([])
    const [isLoading, setIsLoading] = useState<Boolean>(false)
    const messages = useRef<Messages>(null)

    const router = useRouter()
    const searchParams = useSearchParams()
    const urlBase = '/admin/consulta_clientes'
    const pPrimeiro = Number(searchParams.get('primeiro')) || 0
    const pLinhas = Number(searchParams.get('linhas')) || 10

    const pNome = searchParams.get('nome') || ''
    const pCpfCnpj = searchParams.get('cpfCnpj') || ''
    const pUsuarioSistema = searchParams.get('usuario_sistema') || ''

    const refCpfCnpj = useRef<any>(null)
    const offSet = uData.consultaOffSet()

    const botoesDataTable = (dados: consultaClientesType) => {
        return (
            <>
                <Button type='button' icon='pi pi-eye' size='small' onClick={() => { handleConsultar(dados.id!) }} />
            </>
        )
    }

    const formataConstaOcorrencia = (dados: consultaClientesType) => {
        return (
            <>
                <Tag value={dados.constaOcorrencias == true ? 'Sim' : 'Não'} severity={dados.constaOcorrencias == true ? 'danger' : 'success'} icon={dados.constaOcorrencias == true ? 'pi pi-times' : 'pi pi-check'} ></Tag>
            </>
        )
    }

    const formataDataHoraConsulta = (dados: consultaClientesType) => {
        return (
            <>
                {uData.formataDataHora(dados.dataHoraConsulta)}
            </>
        )
    }

    const filtrosSchema = z.object({
        primeiro: z.number(),
        linhas: z.number(),
        totalRegistros: z.number(),
        id: z.number(),
        nome: z.string(),
        cpfCnpj: z.string(),
        usuarioSistema: z.string(),
    })

    type filtrosType = z.infer<typeof filtrosSchema>

    const { control, handleSubmit, formState: { errors }, setValue, getValues, trigger } = useForm<filtrosType>({
        resolver: zodResolver(filtrosSchema),
        defaultValues: {
            primeiro: 0,
            linhas: 10,
            totalRegistros: 0,
            id: 0,
            nome: '',
            cpfCnpj: '',
            usuarioSistema: ''
        }
    })

    async function filtra(filtros: filtrosType) {

        setIsLoading(true)
        const resposta = await getAll(filtros.primeiro, filtros.linhas, filtros.nome, filtros.cpfCnpj, filtros.usuarioSistema)

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

    function teste() {

    }

    function ajustaUrl() {
        router.push(urlBase + '?primeiro=' + getValues('primeiro') + '&linhas=' + getValues('linhas') + '&nome=' + getValues('nome') + '&cpf_cnpj=' + getValues('cpfCnpj'))
    }

    function handleFiltrar() {
        handleSubmit(filtra)()
        ajustaUrl()
    }

    function inclui() {
        router.push(urlBase + '/0')
    }

    function geraTextoResultadoConsulta(pDados: any) {

        let texto = ''
        texto = texto + 'ID da Consulta: ' + pDados.ProtocoloB49C.IdConsulta
        texto = texto + '\n'

        let lDataHoraConsulta = uData.feParaDbNn(pDados.ProtocoloB49C.DataHoraConsulta, offSet)
        texto = texto + 'Data Hora Consulta: ' + uData.formataDataHora(lDataHoraConsulta)
        texto = texto + '\n'

        texto = texto + 'Consta Ocorrência: ' + (pDados.ProtocoloB49C.IsConstaOcorrencia ? 'Sim' : 'Não')
        texto = texto + '\n'
        texto = texto + 'Protesto Estadual: ' + (pDados.ProtocoloB49C.IsProtestoEstadual ? 'Sim' : 'Não')
        texto = texto + '\n'

        texto = texto + 'Nome: ' + pDados.ProtocoloB49C.N200_00_OUT.NomePessoa
        texto = texto + '\n'
        texto = texto + 'Situação do Documento: ' + pDados.ProtocoloB49C.N200_00_OUT.SituacaoDocumento
        texto = texto + '\n'
        texto = texto + 'Data Situação: ' + uData.formataData(pDados.ProtocoloB49C.N200_00_OUT.DataSituacao)
        texto = texto + '\n'

        if (pDados.ProtocoloB49C.TipoDocumento == 'F') {

            texto = texto + 'Data Nascimento: ' + uData.formataData(pDados.ProtocoloB49C.N200_00_OUT.DataNascimento)
            texto = texto + '\n'
            texto = texto + 'Nome Mãe: ' + pDados.ProtocoloB49C.N200_01_OUT.NomeMae
            texto = texto + '\n'

        }

        texto = texto + '\n'
        texto = texto + '<<<<<<<<<< Protestos >>>>>>>>>>'
        texto = texto + '\n'
        if (pDados.ProtocoloB49C.N210_99_OUT.Mensagem) {
            texto = texto + pDados.ProtocoloB49C.N210_99_OUT.Mensagem
            texto = texto + '\n'
        }

        texto = texto + '\n'
        texto = texto + '<<<<<<<<<< Falencia/Recuperação Judicial >>>>>>>>>>'
        texto = texto + '\n'
        if (pDados.ProtocoloB49C.N220_00_OUT !== null) {
            texto = texto + pDados.ProtocoloB49C.N220_00_OUT
            texto = texto + '\n'
        }

        texto = texto + '\n'
        texto = texto + '<<<<<<<<<< Ações Judiciais >>>>>>>>>>'
        texto = texto + '\n'
        if (pDados.ProtocoloB49C.N230_99_OUT.Mensagem) {
            texto = texto + pDados.ProtocoloB49C.N230_99_OUT.Mensagem
            texto = texto + '\n'
        }

        texto = texto + '\n'
        texto = texto + '<<<<<<<<<< Pendências Financeiras >>>>>>>>>>'
        texto = texto + '\n'
        if (pDados.ProtocoloB49C.N240_00_OUTs_V) {

            pDados.ProtocoloB49C.N240_00_OUTs_V.map((item: any) => {
                console.log('item: ', item)
                texto = texto + 'Data Ocorrêmcia: ' + uData.formataData(item.DataOcorrencia)
                texto = texto + '\n'
                texto = texto + 'Modalidade: ' + item.Modalidade
                texto = texto + '\n'
                texto = texto + 'Avalista: ' + (item.Avalista ? 'Sim' : 'Não')
                texto = texto + '\n'
                texto = texto + 'Tipo de Moeda: ' + item.TipoMoeda
                texto = texto + '\n'

                let lValor = 0
                lValor = Number(item.Valor) / 100
                texto = texto + 'Valor: ' + uNumero.formataNumero(lValor, 2, false)
                texto = texto + '\n'

                texto = texto + 'Oringem: ' + item.Origem
                texto = texto + '\n'
                texto = texto + '----------------------------------------'
                texto = texto + '\n'
            })

        }

        if (pDados.ProtocoloB49C.N240_00_OUTs_5) {

            pDados.ProtocoloB49C.N240_00_OUTs_5.map((item: any) => {
                console.log('item: ', item)
                texto = texto + 'Data Ocorrêmcia: ' + uData.formataData(item.DataOcorrencia)
                texto = texto + '\n'
                texto = texto + 'Modalidade: ' + item.Modalidade
                texto = texto + '\n'
                texto = texto + 'Avalista: ' + (item.Avalista ? 'Sim' : 'Não')
                texto = texto + '\n'
                texto = texto + 'Tipo de Moeda: ' + item.TipoMoeda
                texto = texto + '\n'

                let lValor = 0
                lValor = Number(item.Valor) / 100
                texto = texto + 'Valor: ' + uNumero.formataNumero(lValor, 2, false)
                texto = texto + '\n'

                texto = texto + 'Oringem: ' + item.Origem
                texto = texto + '\n'
                texto = texto + '----------------------------------------'
                texto = texto + '\n'
            })

        }

        texto = texto + '\n'
        texto = texto + '<<<<<<<<<< Cheques sem Fundo >>>>>>>>>>'
        texto = texto + '\n'
        if (pDados.ProtocoloB49C.N250_90_OUT) {
            texto = texto + 'Total de Ocorrências: ' + pDados.ProtocoloB49C.N250_90_OUT.TotalOcorrencia
            texto = texto + '\n'
            texto = texto + 'Data de Ocorrências Antigas: ' + pDados.ProtocoloB49C.N250_90_OUT.DataOcorrenciaAntiga
            texto = texto + '\n'
            texto = texto + 'Data de Ocorrências Recentes: ' + pDados.ProtocoloB49C.N250_90_OUT.DataOcorrenciaRecente
            texto = texto + '\n'
            texto = texto + 'Moeda: ' + pDados.ProtocoloB49C.N250_90_OUT.Moeda
            texto = texto + '\n'

            let lValor = 0
            lValor = Number(pDados.ProtocoloB49C.N250_90_OUT.ValorTotal) / 100
            texto = texto + 'Valor Total: ' + uNumero.formataNumero(lValor, 2, false)
            texto = texto + '\n'
        }

        texto = texto + '\n'
        texto = texto + '<<<<<<<<<< Análise de Crédito >>>>>>>>>>'
        texto = texto + '\n'
        if (pDados.ProtocoloB49C.N500_00_OUT !== null) {
            if (pDados.ProtocoloB49C.N500_00_OUT.Pontuacao) {
                texto = texto + 'Serasa Score: ' + pDados.ProtocoloB49C.N500_00_OUT.Pontuacao || '0'
                texto = texto + '\n'
            }
        }

        return texto

    }

    async function handleIncluir() {

        if (getValues('cpfCnpj') == '') {
            messages.current?.clear()
            messages.current?.show({ id: '1', sticky: true, severity: 'error', summary: 'Erro', detail: 'Para Nova Consulta, informe o CPF/CNPJ.', closable: false })
            refCpfCnpj.current?.focus()
            return
        }

        if (uDados.validaCpfCnpj(getValues('cpfCnpj'))) {

            // Consulta Serasa
            setIsLoading(true)
            const respostaConsulta = await getCrednetPP(getValues('cpfCnpj'))
            setIsLoading(false)

            if (respostaConsulta.erro !== '') {
                messages.current?.clear()
                messages.current?.show({ id: '1', sticky: true, severity: 'error', summary: 'Erro', detail: respostaConsulta.erro, closable: false })
                refCpfCnpj.current?.focus()
                return
            } else {
                messages.current?.clear()
            }

            console.log('respostaConsulta.dados: ', respostaConsulta.dados)

            // Pega registro novo
            setIsLoading(true)
            const respostaGetById = await getById(0, offSet)
            setIsLoading(false)

            if (respostaGetById.erro !== '') {
                messages.current?.clear()
                messages.current?.show({ id: '1', sticky: true, severity: 'error', summary: 'Erro', detail: respostaGetById.erro, closable: false })
                refCpfCnpj.current?.focus()
                return
            } else {
                messages.current?.clear()
            }

            let lNovaConsulta: any = respostaGetById.dados

            // Atribui dados da consulta ao Serasa
            lNovaConsulta.cpfCnpj = getValues('cpfCnpj')
            lNovaConsulta.idConsulta = respostaConsulta.dados.ProtocoloB49C.IdConsulta

            // lNovaConsulta.dataHoraConsulta = uData.novaDataHora(respostaConsulta.dados.ProtocoloB49C.DataHoraConsulta)
            lNovaConsulta.dataHoraConsulta = uData.feParaDbNn(respostaConsulta.dados.ProtocoloB49C.DataHoraConsulta, offSet)
            // lNovaConsulta.dataHoraConsulta = uData.dbParaFeNn(respostaConsulta.dados.ProtocoloB49C.DataHoraConsulta, offSet)

            lNovaConsulta.nomeRazaoSocial = respostaConsulta.dados.ProtocoloB49C.N200_00_OUT.NomePessoa
            lNovaConsulta.constaOcorrencias = respostaConsulta.dados.ProtocoloB49C.IsConstaOcorrencia
            lNovaConsulta.resultadoConsulta = geraTextoResultadoConsulta(respostaConsulta.dados)
            lNovaConsulta.resultadoCompletoConsulta = JSON.stringify(respostaConsulta.dados)
            // lNovaConsulta.score = 0

            if (respostaConsulta.dados.ProtocoloB49C.N500_00_OUT !== null) {
                if (respostaConsulta.dados.ProtocoloB49C.N500_00_OUT.Pontuacao) {
                    lNovaConsulta.score = Number(respostaConsulta.dados.ProtocoloB49C.N500_00_OUT.Pontuacao)
                } else {
                    lNovaConsulta.score = 0
                }
            } else {
                lNovaConsulta.score = 0
            }

            // Inclui o resultado da consulta no DB
            setIsLoading(true)
            const respostaInclusao = await postPut(lNovaConsulta, offSet)

            if (respostaInclusao!.erro !== '') {
                setIsLoading(false)
                messages.current?.clear()
                messages.current?.show({ id: '1', sticky: true, severity: 'error', summary: 'Erro', detail: respostaInclusao!.erro, closable: false })
                refCpfCnpj.current?.focus()
                return
            } else {
                messages.current?.clear()
                handleConsultar(Number(respostaInclusao!.id))
                setIsLoading(false)
            }

        } else {

            messages.current?.clear()
            messages.current?.show({ id: '1', sticky: true, severity: 'error', summary: 'Erro', detail: 'CPF/CNPJ inválido.', closable: false })
            refCpfCnpj.current?.focus()

        }

    }

    function consulta() {
        router.push(urlBase + '/' + getValues('id'))
    }

    function handleConsultar(id: number) {
        setValue('id', id)
        handleSubmit(consulta)()
    }

    const onPageChange = (event: PaginatorPageChangeEvent) => {
        setValue('primeiro', event.first)
        setValue('linhas', event.rows)
        filtra(getValues())
        ajustaUrl()
    }

    useEffect(() => {

        setValue('primeiro', pPrimeiro)
        setValue('linhas', pLinhas)
        setValue('totalRegistros', 0)

        setValue('nome', pNome)
        setValue('cpfCnpj', pCpfCnpj)
        setValue('usuarioSistema', pUsuarioSistema)

        filtra(getValues())

    }, [])

    return (

        <div className='mx-3'>

            <PageTitle texto="Consulta de Clientes" />
            {/* <PageSubTitle texto="Setores" /> */}

            <Divider />

            <Messages ref={messages} />

            <div className="flex justify-center mt-2 gap-2">

                {/* <form onSubmit={handleSubmit(pesquisar)}> */}
                <form>

                    <div className='flex flex-row gap-2'>

                        <Controller
                            name="cpfCnpj"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <InputMask
                                        id={field.name}
                                        value={field.value}
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        mask="99999999999?999"
                                        placeholder="CPF/CNPJ"
                                        ref={refCpfCnpj}
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
                                        maxLength={60}
                                        placeholder='Nome/Razão Social'
                                        autoFocus
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}

                                </>
                            )}
                        />

                        <Controller
                            name="usuarioSistema"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <InputText
                                        id={field.name}
                                        value={field.value}
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        maxLength={60}
                                        placeholder='Usuário do Sistema'
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
                        <Column body={formataDataHoraConsulta} header="Data/Hora Consulta" sortable></Column>
                        <Column field="cpfCnpj" header="CPF/CNPJ" sortable></Column>
                        <Column field="nomeRazaoSocial" header="Nome/Razão Social" sortable></Column>
                        <Column body={formataConstaOcorrencia} header="Consta Ocorrências" sortable></Column>
                        <Column body={botoesDataTable} exportable={false}></Column>
                    </DataTable>
                </div>

                <div className="hidden md:block" >
                    <DataTable value={dados} size="small" stripedRows showGridlines selectionMode="single" >
                        <Column field="id" header="ID" sortable></Column>
                        <Column body={formataDataHoraConsulta} header="Data/Hora Consulta" sortable></Column>
                        <Column field="cpfCnpj" header="CPF/CNPJ" sortable></Column>
                        <Column field="nomeRazaoSocial" header="Nome/Razão Social" sortable></Column>
                        <Column body={formataConstaOcorrencia} header="Consta Ocorrências" sortable bodyClassName="text-center"></Column>
                        <Column field="usuarioSistemaNome" header="Usuário/Sistema" sortable></Column>
                        <Column body={botoesDataTable} exportable={false}></Column>
                    </DataTable>
                </div>

                <div className="flex justify-center mt-2 gap-2">
                    <Paginator first={getValues('primeiro')} rows={getValues('linhas')} totalRecords={getValues('totalRegistros')} rowsPerPageOptions={[10, 20, 30]} onPageChange={onPageChange} />
                </div>

                <Divider />

                <div className="flex justify-center mt-2 gap-2">

                    <Button label="Nova Consulta" type="button" icon="pi pi-plus" onClick={handleIncluir} />

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