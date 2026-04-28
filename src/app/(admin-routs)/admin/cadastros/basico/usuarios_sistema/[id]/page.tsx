'use client'

import { Controller, useForm } from 'react-hook-form'
import { useParams, useRouter } from 'next/navigation'

import { usuariosSistemaType, usuariosSistemaSchema } from '@/types/basico/usuarios_sistema'
import { codigoNomeType } from '@/types/sistema/codigoNome'
import { postPut, getById } from '@/actions/basico/usuarios_sistema'

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

import { AutoComplete, AutoCompleteChangeEvent, AutoCompleteCompleteEvent } from 'primereact/autocomplete'
import { getComboBox as getComboBoxPerUsuSis } from '@/actions/basico/perfis_usuarios_sistema'
import { getComboBox as getComboBoxEmpresas } from '@/actions/basico/empresas'
import { getComboBox as getComboBoxSetores } from '@/actions/basico/setores'
import { comboBoxType } from '@/types/sistema/combobox'
import { InputMask } from 'primereact/inputmask'
import { Password } from 'primereact/password'
import { Panel } from 'primereact/panel'
import { setoresType } from '@/types/basico/setores'

export default function Formulario() {

    const parametros = useParams<{ id: string }>()

    const offSet = uData.consultaOffSet()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState<Boolean>(false)
    const messages = useRef<Messages>(null)
    const [dados, setDados] = useState<usuariosSistemaType>({} as usuariosSistemaType)

    // autocompletar
    const [listaPerUsuSis, setListaPerUsuSis] = useState<comboBoxType[]>([])
    const [perUsuSisSelecionado, setPerUsuSisSelecionado] = useState<comboBoxType>({} as comboBoxType)

    const [listaEmpresas, setListaEmpresas] = useState<comboBoxType[]>([])
    const [empresaSelecionada, setEmpresaSelecionada] = useState<comboBoxType>({} as comboBoxType)

    const [listaSetores, setListaSetores] = useState<comboBoxType[]>([])
    const [setorSelecionado, setSetorSelecionado] = useState<comboBoxType>({} as comboBoxType)

    const { control, handleSubmit, formState: { errors }, setValue, getValues, trigger } = useForm<usuariosSistemaType>({
        defaultValues: dados,
        values: dados,
        resolver: zodResolver(usuariosSistemaSchema)
    })

    async function buscaDados() {

        setIsLoading(true)
        const retorno = await getById(parseInt(parametros.id), offSet)

        console.log('retorno: ', retorno)

        if (retorno.erro !== '') {
            setIsLoading(false)
            messages.current?.clear()
            messages.current?.show({ id: '1', sticky: true, severity: 'error', summary: 'Erro', detail: retorno.erro, closable: false })
            setDados({} as usuariosSistemaType)
        } else {
            messages.current?.clear()
            setDados(retorno.dados as usuariosSistemaType)
            setIsLoading(false)
        }

    }

    function handleGravar() {
        handleSubmit(onSubmit)()
    }

    async function onSubmit(dados: usuariosSistemaType) {

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

    const codigoNomeSimNao: codigoNomeType[] = [
        { codigo: 'S', nome: 'Sim' },
        { codigo: 'N', nome: 'Não' },
    ]

    const codigoNomeStatus: codigoNomeType[] = [
        { codigo: 'A', nome: 'Ativo' },
        { codigo: 'I', nome: 'Inativo' },
    ]

    // autocompletar
    const buscaPerUsuSis = async (event: AutoCompleteCompleteEvent) => {
        setListaPerUsuSis((await getComboBoxPerUsuSis(0, event.query)))
    }

    const buscaEmpresas = async (event: AutoCompleteCompleteEvent) => {
        setListaEmpresas((await getComboBoxEmpresas(0, event.query)))
    }

    const buscaSetores = async (event: AutoCompleteCompleteEvent) => {
        setListaSetores((await getComboBoxSetores(0, event.query, empresaSelecionada.id)))
    }

    // autocompletar
    async function preencheComboBox() {
        setIsLoading(true)
        setPerUsuSisSelecionado((await getComboBoxPerUsuSis(getValues('perfilUsuarioSistemaId'), ''))[0])
        setEmpresaSelecionada((await getComboBoxEmpresas(getValues('empresaId'), ''))[0])
        setSetorSelecionado((await getComboBoxSetores(getValues('setorId'), '', getValues('empresaId')))[0])
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

            <PageTitle texto="Básico" />
            <PageSubTitle texto="Cadastro de Usuários do Sistema - Edição" />

            <Messages ref={messages} />

            <form>

                <Panel header="Dados Básicos" className='mt-3'>

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
                                name="cpf"
                                defaultValue=""
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name}>CPF</label>
                                        <InputMask
                                            id={field.name}
                                            value={field.value}
                                            className={classNames({ 'p-invalid': fieldState.error })}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            mask="999.999.999-99"
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
                                            maxLength={100}
                                        />
                                        {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                    </>
                                )}
                            />
                        </div>

                        <div className="flex flex-col">
                            <Controller
                                name="usuario"
                                defaultValue=""
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name}>Usuário</label>
                                        <InputText
                                            id={field.name}
                                            value={field.value}
                                            className={classNames({ 'p-invalid': fieldState.error })}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            maxLength={20}
                                        />
                                        {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                    </>
                                )}
                            />
                        </div>

                        <div className="flex flex-col">
                            <Controller
                                name="senha"
                                defaultValue=""
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name}>Senha</label>
                                        <Password
                                            id={field.name}
                                            value={field.value}
                                            className={classNames({ 'p-invalid': fieldState.error })}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            maxLength={20}
                                            feedback={false}
                                            // toggleMask
                                            inputStyle={{ width: "100%" }} style={{ width: "100%" }}
                                        />
                                        {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                    </>
                                )}
                            />
                        </div>

                        <div className="flex flex-col">
                            <Controller
                                name="perfilUsuarioSistemaId"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name}>Perfil de Usuário</label>
                                        <AutoComplete
                                            id={field.name}
                                            value={perUsuSisSelecionado}
                                            field='nome'
                                            inputId='id'
                                            suggestions={listaPerUsuSis}
                                            completeMethod={buscaPerUsuSis}
                                            onChange={(e: AutoCompleteChangeEvent) => {
                                                setPerUsuSisSelecionado(e.value)
                                            }}
                                            onBlur={() => {
                                                setValue('perfilUsuarioSistemaId', perUsuSisSelecionado?.id || null)
                                                if (getValues('perfilUsuarioSistemaId')) {
                                                    trigger(['perfilUsuarioSistemaId'])
                                                }
                                            }}
                                            dropdown
                                            // autoFocus
                                            className={classNames({ 'p-invalid': fieldState.error })}
                                        />
                                        {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                    </>
                                )}
                            />
                        </div>

                        {/* <div className="flex flex-col">
                        <Controller
                            name="empresa_padrao_id"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Empresa Padrão</label>
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
                                            setValue('empresa_padrao_id', empresaSelecionada?.id || null)
                                            if (getValues('empresa_padrao_id')) {
                                                trigger(['empresa_padrao_id'])
                                            }
                                        }}
                                        dropdown
                                        // autoFocus
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />
                    </div> */}

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
                                                setSetorSelecionado({} as setoresType)
                                                setValue('setorId', -1)
                                            }}
                                            onBlur={() => {
                                                setValue('empresaId', empresaSelecionada?.id)
                                                if (getValues('empresaId')) {
                                                    trigger(['empresaId'])
                                                }
                                            }}
                                            dropdown
                                            // autoFocus
                                            className={classNames({ 'p-invalid': fieldState.error })}
                                        />
                                        {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                    </>
                                )}
                            />
                        </div>

                        <div className="flex flex-col">
                            <Controller
                                name="setorId"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name}>Setor</label>
                                        <AutoComplete
                                            id={field.name}
                                            value={setorSelecionado}
                                            field='nome'
                                            inputId='id'
                                            suggestions={listaSetores}
                                            completeMethod={buscaSetores}
                                            onChange={(e: AutoCompleteChangeEvent) => {
                                                setSetorSelecionado(e.value)
                                            }}
                                            onBlur={() => {
                                                setValue('setorId', setorSelecionado?.id)
                                                if (getValues('setorId')) {
                                                    trigger(['setorId'])
                                                }
                                            }}
                                            dropdown
                                            // autoFocus
                                            className={classNames({ 'p-invalid': fieldState.error })}
                                        />
                                        {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                    </>
                                )}
                            />
                        </div>

                        <div className="flex flex-col">
                            <Controller
                                name="administradorSistema"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name}>Administrador do Sistema</label>
                                        <Dropdown
                                            id={field.name}
                                            value={field.value}
                                            optionLabel="nome"
                                            optionValue="codigo"
                                            options={codigoNomeSimNao}
                                            focusInputRef={field.ref}
                                            onChange={(e) => field.onChange(e.value)}
                                            className={classNames({ 'p-invalid': fieldState.error })}
                                        />
                                        {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                    </>
                                )}
                            />
                        </div>

                        {/* <div className="flex flex-col">
                        <Controller
                            name="acesso_restrito_matriz_filial"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Acesso Restrito Matriz/Filial</label>
                                    <Dropdown
                                        id={field.name}
                                        value={field.value}
                                        optionLabel="nome"
                                        optionValue="codigo"
                                        options={codigoNomeSimNao}
                                        focusInputRef={field.ref}
                                        onChange={(e) => field.onChange(e.value)}
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />
                    </div> */}

                        {/* <div className="flex flex-col">
                        <Controller
                            name="autorizador_compras"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Autorizador de Compras</label>
                                    <Dropdown
                                        id={field.name}
                                        value={field.value}
                                        optionLabel="nome"
                                        optionValue="codigo"
                                        options={codigoNomeSimNao}
                                        focusInputRef={field.ref}
                                        onChange={(e) => field.onChange(e.value)}
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />
                    </div> */}

                        {/* <div className="flex flex-col">
                        <Controller
                            name="valor_maximo_autorizacao"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Valor Máximo Autorização</label>
                                    <InputNumber
                                        id={field.name}
                                        inputRef={field.ref}
                                        value={field.value}
                                        onBlur={field.onBlur}
                                        onValueChange={(e) => field.onChange(e)}
                                        useGrouping={true}
                                        inputClassName={classNames({ 'p-invalid': fieldState.error })}
                                        // minFractionDigits={0}
                                        maxFractionDigits={2}
                                        locale="de-BR"
                                    // locale="jp-JP"
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />
                    </div> */}

                        {/* <div className="flex flex-col">
                        <Controller
                            name="gerente_viagens"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Gerente de Viagens</label>
                                    <Dropdown
                                        id={field.name}
                                        value={field.value}
                                        optionLabel="nome"
                                        optionValue="codigo"
                                        options={codigoNomeSimNao}
                                        focusInputRef={field.ref}
                                        onChange={(e) => field.onChange(e.value)}
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />
                    </div> */}

                        {/* <div className="flex flex-col">
                        <Controller
                            name="secretario_viagens"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Secretário de Viagens</label>
                                    <Dropdown
                                        id={field.name}
                                        value={field.value}
                                        optionLabel="nome"
                                        optionValue="codigo"
                                        options={codigoNomeSimNao}
                                        focusInputRef={field.ref}
                                        onChange={(e) => field.onChange(e.value)}
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />
                    </div> */}

                        {/* <div className="flex flex-col">
                        <Controller
                            name="auxiliar_viagens"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Auxiliar de Viagens</label>
                                    <Dropdown
                                        id={field.name}
                                        value={field.value}
                                        optionLabel="nome"
                                        optionValue="codigo"
                                        options={codigoNomeSimNao}
                                        focusInputRef={field.ref}
                                        onChange={(e) => field.onChange(e.value)}
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />
                    </div> */}

                        {/* <div className="flex flex-col">
                        <Controller
                            name="comprador"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Comprador</label>
                                    <Dropdown
                                        id={field.name}
                                        value={field.value}
                                        optionLabel="nome"
                                        optionValue="codigo"
                                        options={codigoNomeSimNao}
                                        focusInputRef={field.ref}
                                        onChange={(e) => field.onChange(e.value)}
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />
                    </div>
 */}
                        {/* <div className="flex flex-col">
                        <Controller
                            name="dados_bancarios"
                            defaultValue=""
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Dados Bancários</label>
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
                    </div> */}

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

                    </div>

                </Panel>

                <Panel header="Dados de Saídas e Retornos de Veículos" className='mt-3'>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div className="flex flex-col">
                            <Controller
                                name="saidasRetornosVeiculosAutorizador"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name}>Autorizador</label>
                                        <Dropdown
                                            id={field.name}
                                            value={field.value}
                                            optionLabel="nome"
                                            optionValue="codigo"
                                            options={codigoNomeSimNao}
                                            focusInputRef={field.ref}
                                            onChange={(e) => field.onChange(e.value)}
                                            className={classNames({ 'p-invalid': fieldState.error })}
                                        />
                                        {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                    </>
                                )}
                            />
                        </div>

                        <div className="flex flex-col">
                            <Controller
                                name="saidasRetornosVeiculosPorteiro"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name}>Porteiro</label>
                                        <Dropdown
                                            id={field.name}
                                            value={field.value}
                                            optionLabel="nome"
                                            optionValue="codigo"
                                            options={codigoNomeSimNao}
                                            focusInputRef={field.ref}
                                            onChange={(e) => field.onChange(e.value)}
                                            className={classNames({ 'p-invalid': fieldState.error })}
                                        />
                                        {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                    </>
                                )}
                            />
                        </div>

                    </div>

                </Panel>

                <Panel header="Dados de Log" className='mt-3'>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">

                        <div className="flex flex-col">
                            <Controller
                                name="dataHoraCadastro"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name}>Data/Hora Cadastro</label>
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

                        <div className="flex flex-col">
                            <Controller
                                name="dataHoraUltimoAcesso"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name}>Data/Hora Último Acesso</label>
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

                        <div className="flex flex-col">
                            <Controller
                                name="usuarioSistemaNome"
                                defaultValue=""
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name}>Usuário do Sistema</label>
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

                </Panel>

                <div className="flex justify-center mt-2 gap-2">

                    <Button label="Gravar" type="button" icon="pi pi-check" onClick={handleGravar} />
                    <Button label="Voltar" type="button" icon="pi pi-arrow-left" onClick={router.back} />

                </div>

            </form>

            {
                isLoading && <Loading />
            }

        </div>
    )
}