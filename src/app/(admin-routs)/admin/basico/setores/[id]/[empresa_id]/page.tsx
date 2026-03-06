'use client'

import { Controller, useForm } from 'react-hook-form'
import { useParams, useRouter } from 'next/navigation'

import { setoresType, setoresSchema } from '@/types/basico/setores'
import { codigoNomeType } from '@/types/sistema/codigoNome'
import { postPut, getById } from '@/actions/basico/setores'

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
import { getComboBox as empresasGetComboBox } from '@/actions/basico/empresas'
import { comboBoxType } from '@/types/sistema/combobox'

export default function Formulario() {

    const params = useParams<{ id: string; empresa_id: string }>()

    const offSet = uData.consultaOffSet()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState<Boolean>(false)
    const messages = useRef<Messages>(null);
    const [dados, setDados] = useState<setoresType>({} as setoresType);

    // autocompletar
    const [listaEmpresas, setListaEmpresas] = useState<comboBoxType[]>([])
    const [empresaSelecionada, setEmpresaSelecionada] = useState<comboBoxType>({} as comboBoxType)

    const { control, handleSubmit, formState: { errors }, setValue, getValues, trigger } = useForm<setoresType>({
        defaultValues: dados,
        values: dados,
        resolver: zodResolver(setoresSchema)
    })

    async function buscaDados() {

        setIsLoading(true)
        const retorno = await getById(Number(params.id), offSet)

        if (retorno.erro !== '') {
            setIsLoading(false)
            messages.current?.clear()
            messages.current?.show({ id: '1', sticky: true, severity: 'error', summary: 'Erro', detail: retorno.erro, closable: false })
            setDados({} as setoresType)
        } else {
            messages.current?.clear()
            setDados(retorno.dados as setoresType)
            setIsLoading(false)
        }

    }

    function gravar() {
        handleSubmit(onSubmit)()
    }

    async function onSubmit(dados: setoresType) {

        setIsLoading(true)
        const retorno: any = await postPut(dados, offSet)
        setIsLoading(false)

        if (retorno.erro !== '') {
            messages.current?.clear();
            messages.current?.show({ id: '1', sticky: true, severity: 'error', summary: 'Erro', detail: retorno.erro, closable: false });
        } else {
            messages.current?.clear();
            router.back()
        }

    }

    const codigoNomeStatus: codigoNomeType[] = [
        { codigo: 'A', nome: 'Ativo' },
        { codigo: 'I', nome: 'Inativo' },
    ]

    // autocompletar
    const buscaEmpresas = async (event: AutoCompleteCompleteEvent) => {
        setListaEmpresas((await empresasGetComboBox(0, event.query)))
    }

    // autocompletar
    // async function preencheComboBox() {
    //     setIsLoading(true)
    //     setEmpresaSelecionada((await empresasGetComboBox(getValues('empresaId'), ''))[0])
    //     setIsLoading(false)
    // }

    // autocompletar
    // useEffect(() => {
    //     // setValue('empresaId', params.empresa_id)
    //     preencheComboBox()
    // }, [dados])

    // useEffect(() => {
    // setValue('empresaId', params.empresa_id)
    // preencheComboBox()
    // }, [dados])

    useEffect(() => {
        async function aposCargaDados() {
            setIsLoading(true)
            setValue('empresaId', Number(params.empresa_id))
            setEmpresaSelecionada((await empresasGetComboBox(getValues('empresaId'), ''))[0])
            setIsLoading(false)
        }
        aposCargaDados()
    }, [dados])

    useEffect(() => {
        buscaDados()
    }, [])

    return (

        <div className="px-10">

            <PageTitle texto="Pesquisas" />
            <PageSubTitle texto="Setores - Edição" />

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

                    <div className="flex flex-col">
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
                                        disabled
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />
                    </div>

                    <div className="flex flex-col">
                        <Controller
                            name="nome"
                            defaultValue=""
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Nome</label>
                                    <InputText
                                        id={field.name}
                                        value={field.value}
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        maxLength={60}
                                        autoFocus
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

                    <Button label="Gravar" type="button" icon="pi pi-check" onClick={gravar} />
                    <Button label="Voltar" type="button" icon="pi pi-arrow-left" onClick={router.back} />

                </div>

            </form>

            {
                isLoading && <Loading />
            }

        </div>
    )
}