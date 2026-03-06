'use client'

import { Controller, useForm } from 'react-hook-form'
import { useParams, useRouter } from 'next/navigation'

import { veiculosType, veiculosSchema } from '@/types/veiculos/veiculos'
import { codigoNomeType } from '@/types/sistema/codigoNome'
import { postPut, getById } from '@/actions/veiculos/veiculos'

import { classNames } from 'primereact/utils'
import { Button } from 'primereact/button'
import { InputNumber } from 'primereact/inputnumber'
import { InputText } from 'primereact/inputtext'
import { Calendar } from 'primereact/calendar'
import { Dropdown } from 'primereact/dropdown'

import { zodResolver } from "@hookform/resolvers/zod"
import React, { useState, useRef, useEffect } from 'react'

import uData from '@/utils/uData'
import { Messages } from 'primereact/messages'
import Loading from '@/components/loading'
import PageTitle from '@/components/pageTitle'
import PageSubTitle from '@/components/pageSubTitle'
import { Divider } from 'primereact/divider'

import { AutoComplete, AutoCompleteChangeEvent, AutoCompleteCompleteEvent } from 'primereact/autocomplete'
import { comboBoxType } from '@/types/sistema/combobox'

import { getComboBox as empresasGetComboBox } from '@/actions/basico/empresas'
import { getComboBoxMarcas, getComboBoxModeos } from '@/actions/veiculos/marcas_modelos'
import { idNomeType } from '@/types/sistema/idNome'

export default function Formulario() {

    const parametros = useParams<{ id: string }>()

    const offSet = uData.consultaOffSet()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState<Boolean>(false)
    const messages = useRef<Messages>(null)
    const [dados, setDados] = useState<veiculosType>({} as veiculosType)

    // autocompletar
    const [listaEmpresas, setListaEmpresas] = useState<comboBoxType[]>([]);
    const [empresaSelecionada, setEmpresaSelecionada] = useState<comboBoxType>({} as comboBoxType);

    const [listaMarcas, setListaMarcas] = useState<comboBoxType[]>([]);
    const [marcaSelecionada, setMarcaSelecionada] = useState<comboBoxType>({} as comboBoxType);

    const [listaModelos, setListaModelos] = useState<comboBoxType[]>([]);
    const [modeloSelecionado, setModeloSelecionado] = useState<comboBoxType>({} as comboBoxType);

    const { control, handleSubmit, formState: { errors }, setValue, getValues, trigger } = useForm<veiculosType>({
        defaultValues: dados,
        values: dados,
        resolver: zodResolver(veiculosSchema)
    })

    async function buscaDados() {

        setIsLoading(true)
        const retorno = await getById(parseInt(parametros.id), offSet)

        if (retorno.erro !== '') {
            setIsLoading(false)
            messages.current?.clear()
            messages.current?.show({ id: '1', sticky: true, severity: 'error', summary: 'Erro', detail: retorno.erro, closable: false })
            setDados({} as veiculosType)
        } else {
            messages.current?.clear()
            setDados(retorno.dados as veiculosType)
            setIsLoading(false)
        }

    }

    function handleGrava() {
        handleSubmit(onSubmit)()
    }

    async function onSubmit(dados: veiculosType) {

        setIsLoading(true)
        const retorno: any = await postPut(dados, offSet)
        setIsLoading(false)

        if (retorno.erro !== '') {
            messages.current?.clear()
            messages.current?.show({ id: '1', sticky: true, severity: 'error', summary: 'Erro', detail: retorno.erro, closable: false })
        } else {
            messages.current?.clear()
            router.back()
        }

    }

    const idNomeSituacaoManutencao: idNomeType[] = [
        { id: 1, nome: '1-Manutenção em Dia' },
        { id: 2, nome: '2-Próximo de Manutenção Preventiva' },
        { id: 3, nome: '3-Em Manutenção Preventiva' },
        { id: 4, nome: '4-Em Manutenção Corretiva' },
    ]

    const codigoNomeSimNao: codigoNomeType[] = [
        { codigo: 'S', nome: 'Sim' },
        { codigo: 'N', nome: 'Não' },
    ]

    const codigoNomeStatus: codigoNomeType[] = [
        { codigo: 'A', nome: 'Ativo' },
        { codigo: 'I', nome: 'Inativo' },
    ]

    // autocompletar
    const buscaEmpresas = async (event: AutoCompleteCompleteEvent) => {
        setListaEmpresas((await empresasGetComboBox(0, event.query)))
    }

    const buscaMarcas = async (event: AutoCompleteCompleteEvent) => {
        setListaMarcas((await getComboBoxMarcas(0, event.query)))
    }

    const buscaModelos = async (event: AutoCompleteCompleteEvent) => {
        setListaModelos((await getComboBoxModeos(0, event.query, marcaSelecionada?.id)))
    }

    // autocompletar
    async function preencheComboBox() {
        setIsLoading(true)
        setEmpresaSelecionada((await empresasGetComboBox(getValues('empresaId'), ''))[0])
        setMarcaSelecionada((await getComboBoxMarcas(getValues('marcaId'), ''))[0])
        setModeloSelecionado((await getComboBoxModeos(getValues('modeloId'), '', getValues('marcaId')))[0])
        setIsLoading(false)
    }

    // autocompletar
    useEffect(() => {
        preencheComboBox()
    }, [dados])

    useEffect(() => {
        buscaDados()
    }, [])

    return (

        <div className="px-10">

            <PageTitle texto="Veículos" />
            <PageSubTitle texto="Veículos - Edição" />

            <Divider />

            <Messages ref={messages} />

            <form>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="flex flex-col">
                        <Controller
                            name="id"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>ID</label>
                                    <InputNumber
                                        id={field.name}
                                        inputRef={field.ref}
                                        value={field.value}
                                        onBlur={field.onBlur}
                                        onValueChange={(e) => field.onChange(e)}
                                        useGrouping={false}
                                        inputClassName={classNames({ 'p-invalid': fieldState.error })}
                                        disabled
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />
                    </div>

                    <div className='flex flex-col'>
                        <Controller
                            name="empresaId"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Empresa</label>
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
                    </div>

                    <div className="flex flex-col">
                        <Controller
                            name="marcaId"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Marca</label>
                                    <AutoComplete
                                        id={field.name}
                                        value={marcaSelecionada}
                                        field='nome'
                                        inputId='id'
                                        suggestions={listaMarcas}
                                        completeMethod={buscaMarcas}
                                        onChange={(e: AutoCompleteChangeEvent) => {
                                            setMarcaSelecionada(e.value)
                                            setModeloSelecionado({} as comboBoxType)
                                            setValue('modeloId', -1)
                                        }}
                                        onBlur={() => {
                                            setValue('marcaId', marcaSelecionada?.id)
                                            if (getValues('marcaId')) {
                                                trigger(['marcaId'])
                                            }
                                        }}
                                        dropdown
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />
                    </div>

                    <div className="flex flex-col">
                        <Controller
                            name="modeloId"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Modelo</label>
                                    <AutoComplete
                                        id={field.name}
                                        value={modeloSelecionado}
                                        field='nome'
                                        inputId='id'
                                        suggestions={listaModelos}
                                        completeMethod={buscaModelos}
                                        onChange={(e: AutoCompleteChangeEvent) => {
                                            setModeloSelecionado(e.value)
                                        }}
                                        onBlur={() => {
                                            setValue('modeloId', modeloSelecionado?.id)
                                            if (getValues('modeloId')) {
                                                trigger(['modeloId'])
                                            }
                                        }}
                                        dropdown
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />
                    </div>

                    <div className="flex flex-col">
                        <Controller
                            name="placa"
                            defaultValue=""
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Placa</label>
                                    <InputText
                                        id={field.name}
                                        value={field.value}
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        maxLength={8}
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />
                    </div>

                    <div className="flex flex-col">
                        <Controller
                            name="anoFabricacao"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Ano/Fabricação</label>
                                    <InputNumber
                                        id={field.name}
                                        inputRef={field.ref}
                                        value={field.value}
                                        onBlur={field.onBlur}
                                        onValueChange={(e) => field.onChange(e)} useGrouping={false}
                                        inputClassName={classNames({ 'p-invalid': fieldState.error })}
                                        minFractionDigits={0}
                                    // maxFractionDigits={2}
                                    // locale="de-BR"
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />
                    </div>

                    <div className="flex flex-col">
                        <Controller
                            name="kmAtual"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Km Atual</label>
                                    <InputNumber
                                        id={field.name}
                                        inputRef={field.ref}
                                        value={field.value}
                                        onBlur={field.onBlur}
                                        onValueChange={(e) => field.onChange(e)} useGrouping={false}
                                        inputClassName={classNames({ 'p-invalid': fieldState.error })}
                                        minFractionDigits={0}
                                    // maxFractionDigits={2}
                                    // locale="de-BR"
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />
                    </div>

                    <div className="flex flex-col">
                        <Controller
                            name="kmRecorrenciaManutencaoPreventiva"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>km Recorrência de Manutencao Preventiva</label>
                                    <InputNumber
                                        id={field.name}
                                        inputRef={field.ref}
                                        value={field.value}
                                        onBlur={field.onBlur}
                                        onValueChange={(e) => field.onChange(e)} useGrouping={false}
                                        inputClassName={classNames({ 'p-invalid': fieldState.error })}
                                        minFractionDigits={0}
                                    // maxFractionDigits={2}
                                    // locale="de-BR"
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />
                    </div>

                    <div className="flex flex-col">
                        <Controller
                            name="kmProximaManutencaoPreventiva"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Km Próxima Manutenção Preventiva</label>
                                    <InputNumber
                                        id={field.name}
                                        inputRef={field.ref}
                                        value={field.value}
                                        onBlur={field.onBlur}
                                        onValueChange={(e) => field.onChange(e)} useGrouping={false}
                                        inputClassName={classNames({ 'p-invalid': fieldState.error })}
                                        minFractionDigits={0}
                                    // maxFractionDigits={2}
                                    // locale="de-BR"
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />
                    </div>

                    <div className="flex flex-col">
                        <Controller
                            name="diasRecorrenciaManutencaoPreventiva"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Dias para Recorrência da Manutencao Preventiva</label>
                                    <InputNumber
                                        id={field.name}
                                        inputRef={field.ref}
                                        value={field.value}
                                        onBlur={field.onBlur}
                                        onValueChange={(e) => field.onChange(e)} useGrouping={false}
                                        inputClassName={classNames({ 'p-invalid': fieldState.error })}
                                        minFractionDigits={0}
                                    // maxFractionDigits={2}
                                    // locale="de-BR"
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />
                    </div>

                    <div className="flex flex-col">
                        <Controller
                            name="dataProximaManutencaoPreventiva"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Data da Próxima Manutenção Preventiva</label>
                                    <Calendar
                                        inputId={field.name}
                                        value={field.value}
                                        onChange={field.onChange}
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                        dateFormat="dd/mm/yy"
                                        showButtonBar
                                    // showTime showSeconds hourFormat="24"
                                    // disabled
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />
                    </div>

                    <div className="flex flex-col">
                        <Controller
                            name="situacaoManutencao"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Situação da Manutenção</label>
                                    <Dropdown
                                        id={field.name}
                                        value={field.value}
                                        optionLabel="nome"
                                        optionValue="id"
                                        options={idNomeSituacaoManutencao}
                                        focusInputRef={field.ref}
                                        onChange={(e) => field.onChange(e.value)}
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                    // disabled
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />
                    </div>

                    <div className="flex flex-col">
                        <Controller
                            name="disponivel"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Disponível</label>
                                    <Dropdown
                                        id={field.name}
                                        value={field.value}
                                        optionLabel="nome"
                                        optionValue="codigo"
                                        options={codigoNomeSimNao}
                                        focusInputRef={field.ref}
                                        onChange={(e) => field.onChange(e.value)}
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                    // disabled
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />
                    </div>

                    <div className="flex flex-col">
                        <Controller
                            name="status"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Status</label>
                                    <Dropdown
                                        id={field.name}
                                        value={field.value}
                                        optionLabel="nome"
                                        optionValue="codigo"
                                        options={codigoNomeStatus}
                                        focusInputRef={field.ref}
                                        onChange={(e) => field.onChange(e.value)}
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                    // disabled
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />
                    </div>

                    <div className="flex flex-col">
                        <Controller
                            name="usuarioSistemaNome"
                            defaultValue=""
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Usuário/Sistema</label>
                                    <InputText
                                        id={field.name}
                                        value={field.value}
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        disabled
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />
                    </div>

                    <div className="flex flex-col">
                        <Controller
                            name="dataHora"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Data/Hora</label>
                                    <Calendar
                                        inputId={field.name}
                                        value={field.value}
                                        onChange={field.onChange}
                                        dateFormat="dd/mm/yy"
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                        showTime showSeconds hourFormat="24"
                                        disabled
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />
                    </div>

                </div>

                <Divider />

                <div className="flex justify-center mt-2 gap-2">

                    <Button label="Gravar" type="button" icon="pi pi-check" onClick={handleGrava} />
                    <Button label="Voltar" type="button" icon="pi pi-arrow-left" onClick={router.back} />

                </div>

            </form>

            {
                isLoading && <Loading />
            }

        </div>
    )
}