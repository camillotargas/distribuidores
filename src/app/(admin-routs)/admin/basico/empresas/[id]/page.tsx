'use client'

import { Controller, useForm } from 'react-hook-form'
import { useParams, useRouter } from 'next/navigation'

import { empresasType, empresasSchema } from '@/types/basico/empresas'
import { codigoNomeType } from '@/types/sistema/codigoNome'
import { postPut, getById } from '@/actions/basico/empresas'

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
import { getComboBox as cidadesGetComboBox } from '@/actions/sistema/cidades'
import { comboBoxType } from '@/types/sistema/combobox'
import { InputMask } from 'primereact/inputmask'

export default function Formulario() {

    const parametros = useParams<{ id: string }>()

    const offSet = uData.consultaOffSet()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState<Boolean>(false)
    const messages = useRef<Messages>(null)
    const [dados, setDados] = useState<empresasType>({} as empresasType)

    // autocompletar
    const [listaCidades, setListaCidades] = useState<comboBoxType[]>([])
    const [cidadeSelecionada, setCidadeSelecionada] = useState<comboBoxType>({} as comboBoxType)

    // const urlRetorno = '/admin/pesquisas/empresas'

    const { control, handleSubmit, formState: { errors }, setValue, getValues, trigger } = useForm<empresasType>({
        defaultValues: dados,
        values: dados,
        resolver: zodResolver(empresasSchema)
    })

    async function buscaDados() {

        setIsLoading(true)
        const retorno = await getById(parseInt(parametros.id), offSet)

        if (retorno.erro !== '') {
            setIsLoading(false)
            messages.current?.clear()
            messages.current?.show({ id: '1', sticky: true, severity: 'error', summary: 'Erro', detail: retorno.erro, closable: false })
            setDados({} as empresasType)
        } else {
            messages.current?.clear()
            setDados(retorno.dados as empresasType)
            setIsLoading(false)
        }

    }

    function handleGrava() {
        handleSubmit(onSubmit)()
    }

    async function onSubmit(dados: empresasType) {

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

    // const codigoNomeStatusLoja: codigoNomeType[] = [
    //     { codigo: 'A', nome: 'Aberta' },
    //     { codigo: 'F', nome: 'Fechada' },
    // ]

    // const codigoNomeSimNao: codigoNomeType[] = [
    //     { codigo: 'S', nome: 'Sim' },
    //     { codigo: 'N', nome: 'Não' },
    // ]

    const codigoNomeStatus: codigoNomeType[] = [
        { codigo: 'A', nome: 'Ativo' },
        { codigo: 'I', nome: 'Inativo' },
    ]

    // autocompletar
    const buscaCidades = async (event: AutoCompleteCompleteEvent) => {
        setListaCidades((await cidadesGetComboBox(0, event.query)))
    }

    // autocompletar
    async function preencheComboBox() {
        setIsLoading(true)
        setCidadeSelecionada((await cidadesGetComboBox(getValues('cidadeId'), ''))[0])
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

            <PageTitle texto="Pesquisas" />
            <PageSubTitle texto="Empresas - Edição" />

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
                            name="razaoSocial"
                            defaultValue=""
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Razão Social</label>
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
                    </div>

                    <div className="flex flex-col">
                        <Controller
                            name="nomeFantasia"
                            defaultValue=""
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Nome Fantasia</label>
                                    <InputText
                                        id={field.name}
                                        value={field.value}
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        maxLength={40}
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />
                    </div>

                    <div className="flex flex-col">
                        <Controller
                            name="inscricaoEstadual"
                            defaultValue=""
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Inscrição Estadual</label>
                                    <InputText
                                        id={field.name}
                                        value={field.value}
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        maxLength={40}
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />
                    </div>

                    <div className="flex flex-col">
                        <Controller
                            name="cnpj"
                            defaultValue=""
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>CNPJ</label>
                                    <InputMask
                                        id={field.name}
                                        value={field.value}
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        mask="99.999.999/9999-99"
                                        placeholder="99.999.999/9999-99"
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />
                    </div>

                    <div className="flex flex-col">
                        <Controller
                            name="cep"
                            defaultValue=""
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>CEP</label>
                                    <InputText
                                        id={field.name}
                                        value={field.value}
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        maxLength={40}
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />
                    </div>

                    <div className="flex flex-col">
                        <Controller
                            name="endereco"
                            defaultValue=""
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Endereço</label>
                                    <InputText
                                        id={field.name}
                                        value={field.value}
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        maxLength={40}
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />
                    </div>

                    <div className="flex flex-col">
                        <Controller
                            name="numero"
                            defaultValue=""
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Número</label>
                                    <InputText
                                        id={field.name}
                                        value={field.value}
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        maxLength={40}
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />
                    </div>

                    <div className="flex flex-col">
                        <Controller
                            name="complemento"
                            defaultValue=""
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Complemento</label>
                                    <InputText
                                        id={field.name}
                                        value={field.value}
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        maxLength={40}
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />
                    </div>

                    <div className="flex flex-col">
                        <Controller
                            name="bairro"
                            defaultValue=""
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Bairro</label>
                                    <InputText
                                        id={field.name}
                                        value={field.value}
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        maxLength={40}
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />
                    </div>

                    <div className="flex flex-col">
                        <Controller
                            name="cidadeId"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Cidade</label>
                                    <AutoComplete
                                        id={field.name}
                                        value={cidadeSelecionada}
                                        field='nome'
                                        inputId='id'
                                        suggestions={listaCidades}
                                        completeMethod={buscaCidades}
                                        onChange={(e: AutoCompleteChangeEvent) => {
                                            setCidadeSelecionada(e.value)
                                        }}
                                        onBlur={() => {
                                            setValue('cidadeId', cidadeSelecionada?.id)
                                            if (getValues('cidadeId')) {
                                                trigger(['cidadeId'])
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
                            name="telefone"
                            defaultValue=""
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Telefone</label>
                                    <InputText
                                        id={field.name}
                                        value={field.value}
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                        onChange={(e) => field.onChange(e.target.value)}
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />
                    </div>

                    <div className="flex flex-col">
                        <Controller
                            name="email"
                            defaultValue=""
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>E-Mail</label>
                                    <InputText
                                        id={field.name}
                                        value={field.value}
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                        onChange={(e) => field.onChange(e.target.value)}
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />
                    </div>

                    <div className="flex flex-col">
                        <Controller
                            name="site"
                            defaultValue=""
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Site</label>
                                    <InputText
                                        id={field.name}
                                        value={field.value}
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                        onChange={(e) => field.onChange(e.target.value)}
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />
                    </div>

                    <div className="flex flex-col">
                        <Controller
                            name="dataCadastro"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Data Cadastro</label>
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