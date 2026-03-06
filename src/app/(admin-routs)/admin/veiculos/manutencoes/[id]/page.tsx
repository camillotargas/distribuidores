'use client'

import { Controller, useForm } from 'react-hook-form'
import { useParams, useRouter } from 'next/navigation'

import { manutencoesType, manutencoesSchema } from '@/types/veiculos/manutencoes'
import { codigoNomeType } from '@/types/sistema/codigoNome'
import { postPut, getById } from '@/actions/veiculos/manutencoes'

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

import { getComboBox as getComboBoxVeiculos } from '@/actions/veiculos/veiculos'
import { idNomeType } from '@/types/sistema/idNome'
import { InputTextarea } from 'primereact/inputtextarea'

export default function Formulario() {

    const parametros = useParams<{ id: string }>()

    const offSet = uData.consultaOffSet()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState<Boolean>(false)
    const messages = useRef<Messages>(null)
    const [dados, setDados] = useState<manutencoesType>({} as manutencoesType)

    // autocompletar
    const [listaVeiculos, setListaVeiculos] = useState<comboBoxType[]>([]);
    const [veiculoSelecionado, setVeiculoSelecionado] = useState<comboBoxType>({} as comboBoxType);

    const { control, handleSubmit, formState: { errors }, setValue, getValues, trigger } = useForm<manutencoesType>({
        defaultValues: dados,
        values: dados,
        resolver: zodResolver(manutencoesSchema)
    })

    async function buscaDados() {

        setIsLoading(true)
        const retorno = await getById(parseInt(parametros.id), offSet)

        if (retorno.erro !== '') {
            setIsLoading(false)
            messages.current?.clear()
            messages.current?.show({ id: '1', sticky: true, severity: 'error', summary: 'Erro', detail: retorno.erro, closable: false })
            setDados({} as manutencoesType)
        } else {
            messages.current?.clear()
            setDados(retorno.dados as manutencoesType)
            setIsLoading(false)
        }

    }

    function handleGrava() {
        handleSubmit(onSubmit)()
    }

    async function onSubmit(dados: manutencoesType) {

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

    const idNomeSituacao: idNomeType[] = [
        { id: 1, nome: '1-Manutenção em Andamento' },
        { id: 2, nome: '2-Manutenção Concluída' },
    ]

    const codigoNomeSimNao: codigoNomeType[] = [
        { codigo: 'S', nome: 'Sim' },
        { codigo: 'N', nome: 'Não' },
    ]

    const codigoNomeTipo: idNomeType[] = [
        { id: 1, nome: '1-Preventiva' },
        { id: 2, nome: '2-Corretiva' },
    ]

    const codigoNomeStatus: codigoNomeType[] = [
        { codigo: 'A', nome: 'Ativo' },
        { codigo: 'I', nome: 'Inativo' },
    ]

    // autocompletar
    const buscaVeiculos = async (event: AutoCompleteCompleteEvent) => {
        setListaVeiculos((await getComboBoxVeiculos(0, event.query)))
    }

    // autocompletar
    async function preencheComboBox() {
        setIsLoading(true)
        setVeiculoSelecionado((await getComboBoxVeiculos(getValues('veiculoId'), ''))[0])
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
            <PageSubTitle texto="Manutenções - Edição" />

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
                            name="veiculoId"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Veículo</label>
                                    <AutoComplete
                                        id={field.name}
                                        value={veiculoSelecionado}
                                        field='nome'
                                        inputId='id'
                                        suggestions={listaVeiculos}
                                        completeMethod={buscaVeiculos}
                                        onChange={(e: AutoCompleteChangeEvent) => {
                                            setVeiculoSelecionado(e.value)
                                        }}
                                        onBlur={() => {
                                            setValue('veiculoId', veiculoSelecionado?.id)
                                            if (getValues('veiculoId')) {
                                                trigger(['veiculoId'])
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
                            name="dataInicio"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Data Início</label>
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
                            name="dataFim"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Data Fim</label>
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
                            name="tipo"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Tipo</label>
                                    <Dropdown
                                        id={field.name}
                                        value={field.value}
                                        optionLabel="nome"
                                        optionValue="id"
                                        options={codigoNomeTipo}
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
                            name="km"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Km</label>
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
                            name="memorando"
                            defaultValue=""
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Memorando</label>
                                    <InputTextarea
                                        id={field.name}
                                        value={field.value}
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                        onChange={(e) => field.onChange(e.target.value)}
                                    // maxLength={250}
                                    // autoFocus
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />
                    </div>

                    <div className="flex flex-col">
                        <Controller
                            name="situacao"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Situação</label>
                                    <Dropdown
                                        id={field.name}
                                        value={field.value}
                                        optionLabel="nome"
                                        optionValue="id"
                                        options={idNomeSituacao}
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

                    {/* <div className="flex flex-col">
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
                    </div> */}

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