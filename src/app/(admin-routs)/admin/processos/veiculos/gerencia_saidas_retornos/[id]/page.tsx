'use client'

import { Controller, useForm } from 'react-hook-form'
import { useParams, useRouter } from 'next/navigation'

import { saidasRetornosVeiculosType, saidasRetornosVeiculosSchema } from '@/types/veiculos/saidas_retornos_veiculos'
import { codigoNomeType } from '@/types/sistema/codigoNome'
import { postPut, getById, getBySolicitanteId } from '@/actions/veiculos/saidas_retornos_veiculos'

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
import { idNomeType } from '@/types/sistema/idNome'
import { Panel } from 'primereact/panel'

import { getComboBox as getComboBoxVeiculos } from '@/actions/veiculos/veiculos'
import { getComboBox as getComboBoxDestinos } from '@/actions/sistema/cidades'
import { getComboBox as getComboBoxSolicitantes } from '@/actions/basico/usuarios_sistema'
import { getComboBoxSaidasRetornosVeiculosAutorizadores } from '@/actions/basico/usuarios_sistema'
import { getComboBoxSaidasRetornosVeiculosPorteiros } from '@/actions/basico/usuarios_sistema'
import { getComboBox as getComboBoxEmpresas } from '@/actions/basico/empresas'
import { getClaims } from '@/actions/sistema/acesso_sistema'
import { usuariosSistemaType } from '@/types/basico/usuarios_sistema'
import { getByIdFree as getByIdFreeUsuariosSistema } from '@/actions/basico/usuarios_sistema'
import { confirmDialog } from 'primereact/confirmdialog'
import { getRandomValues } from 'crypto'

export default function Formulario() {

    const parametros = useParams<{ id: string }>()

    const offSet = uData.consultaOffSet()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState<Boolean>(false)
    const messages = useRef<Messages>(null)
    const [dados, setDados] = useState<saidasRetornosVeiculosType>({} as saidasRetornosVeiculosType)

    // autocompletar
    const [listaVeiculos, setListaVeiculos] = useState<comboBoxType[]>([])
    const [veiculoSelecionado, setVeiculoSelecionado] = useState<comboBoxType>({} as comboBoxType)

    const [listaDestinos, setListaDestinos] = useState<comboBoxType[]>([])
    const [destinoSelecionado, setDestinoSelecionado] = useState<comboBoxType>({} as comboBoxType)

    const [listaSolicitantes, setListaSolicitantes] = useState<comboBoxType[]>([])
    const [solicitanteSelecionado, setSolicitanteSelecionado] = useState<comboBoxType>({} as comboBoxType)

    const [listaAutorizadores, setListaAutorizadores] = useState<comboBoxType[]>([])
    const [autorizadorSelecionado, setAutorizadorSelecionado] = useState<comboBoxType>({} as comboBoxType)

    const [listaPorteiros, setListaPorteiros] = useState<comboBoxType[]>([])
    const [porteiroSaidaSelecionado, setPorteiroSaidaSelecionado] = useState<comboBoxType>({} as comboBoxType)
    const [porteiroRetornoSelecionado, setPorteiroRetornoSelecionado] = useState<comboBoxType>({} as comboBoxType)

    const [listaEmpresas, setListaEmpresas] = useState<comboBoxType[]>([])
    const [empresaSelecionada, setEmpresaSelecionada] = useState<comboBoxType>({} as comboBoxType)

    // Ajusta Acesso
    const [hiddenSaida, setHiddenSaida] = useState(true)
    const [hiddenRetorno, setHiddenRetorno] = useState(true)
    const [hiddenOutros, setHiddenOutros] = useState(true)

    const [visibleEstorno, setVisibleEstorno] = useState(false)
    const [visibleGravar, setVisibleGravar] = useState(true)

    const [disabledSolicitacao, setDisabledSolicitacao] = useState(false)
    const [disabledAutorizacao, setDisabledAutorizacao] = useState(false)
    const [disabledSaida, setDisabledSaida] = useState(true)
    const [disabledRetorno, setDisabledRetorno] = useState(true)

    const { control, handleSubmit, formState: { errors }, setValue, getValues, trigger } = useForm<saidasRetornosVeiculosType>({
        defaultValues: dados,
        values: dados,
        resolver: zodResolver(saidasRetornosVeiculosSchema)
    })

    async function buscaDados() {

        setIsLoading(true)
        const retorno = await getById(parseInt(parametros.id), offSet)

        if (retorno.erro !== '') {
            setIsLoading(false)
            messages.current?.clear()
            messages.current?.show({ id: '1', sticky: true, severity: 'error', summary: 'Erro', detail: retorno.erro, closable: false })
            setDados({} as saidasRetornosVeiculosType)
        } else {
            messages.current?.clear()
            setDados(retorno.dados as saidasRetornosVeiculosType)
            setIsLoading(false)
        }

    }

    async function handleGravar() {

        // se estiver 1-Aguardando Autorização
        if (getValues('situacao') == 1) {
            if (getValues('autorizado') == 'S') {
                setValue('situacao', 2) // 2-Autorizado
            } else if (getValues('autorizado') == 'N') {
                setValue('situacao', 3) // 3-Não Autorizado
            }
        }

        handleSubmit(onSubmit)()

    }

    const estorno = () => {

        if ((getValues('situacao') == 2) || (getValues('situacao') == 3)) {

            setValue('situacao', 1)
            setValue('autorizado', '')
            setValue('dataHoraAutorizacao', null)
            setValue('observacoesAutorizacao', '')

        } else if (getValues('situacao') == 4) {

            setValue('situacao', 2)
            setValue('porteiroSaidaId', null)
            setValue('dataHoraSaida', null)
            setValue('kmSaida', null)
            setValue('observacoesSaida', '')

        } else if (getValues('situacao') == 5) {

            setValue('situacao', 4)
            setValue('porteiroRetornoId', null)
            setValue('dataHoraRetorno', null)
            setValue('kmRetorno', null)
            setValue('observacoesRetorno', '')

        }

        handleSubmit(onSubmit)()

    }

    const reject = () => {
    }

    function handleExtornar() {

        let lMensagem = ''

        // 
        messages.current?.clear()

        if (getValues('situacao') == 1) {
            lMensagem = 'Situação "1-Aguardando Autorização" não tem estorno!'
            messages.current?.show({ id: '1', sticky: true, severity: 'error', summary: 'Erro', detail: 'Situação "1-Aguardando Autorização" não tem estorno!', closable: false })
            return
        }

        if (getValues('situacao') == 2) {
            lMensagem = 'Estornar de "2-Autorizado" para "1-Aguardando Autorização" ?'
        } else if (getValues('situacao') == 3) {
            lMensagem = 'Estornar de "3-Não Autorizado" para "1-Aguardando Autorização" ?'
        } else if (getValues('situacao') == 4) {
            lMensagem = 'Estornar de "4-Saiu" para "2-Autorizado" ?'
        } else if (getValues('situacao') == 5) {
            lMensagem = 'Estornar de "5-Retornou" para "4-Saiu" ?'
        }

        confirmDialog({
            message: lMensagem,
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            accept: estorno,
            reject
        })

    }

    async function onSubmit(dados: saidasRetornosVeiculosType) {

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
        { id: 1, nome: '1-Aguardando Autorização' },
        { id: 2, nome: '2-Autorizado' },
        { id: 3, nome: '3-Não Autorizado' },
        { id: 4, nome: '4-Saiu' },
        { id: 5, nome: '5-Retornou' },
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

    const buscaDestinos = async (event: AutoCompleteCompleteEvent) => {
        setListaDestinos((await getComboBoxDestinos(0, event.query)))
    }

    const buscaSolicitantes = async (event: AutoCompleteCompleteEvent) => {
        setListaSolicitantes((await getComboBoxSolicitantes(0, event.query)))
    }

    const buscaAutorizadores = async (event: AutoCompleteCompleteEvent) => {
        setListaAutorizadores((await getComboBoxSaidasRetornosVeiculosAutorizadores(0, event.query)))
    }

    const buscaPorteiros = async (event: AutoCompleteCompleteEvent) => {
        setListaPorteiros((await getComboBoxSaidasRetornosVeiculosPorteiros(0, event.query)))
    }

    const buscaEmpresas = async (event: AutoCompleteCompleteEvent) => {
        setListaEmpresas((await getComboBoxEmpresas(0, event.query)))
    }

    // Após Carga dos Dados
    useEffect(() => {

        async function aposCargaDados() {

            setIsLoading(true)

            // autocompletar
            setVeiculoSelecionado((await getComboBoxVeiculos(getValues('veiculoId'), ''))[0])
            setDestinoSelecionado((await getComboBoxDestinos(getValues('destinoId'), ''))[0])
            setSolicitanteSelecionado((await getComboBoxSolicitantes(getValues('solicitanteId'), ''))[0])
            setAutorizadorSelecionado((await getComboBoxSaidasRetornosVeiculosAutorizadores(getValues('autorizadorId'), ''))[0])
            setPorteiroSaidaSelecionado((await getComboBoxSaidasRetornosVeiculosPorteiros(getValues('porteiroSaidaId'), ''))[0])
            setPorteiroRetornoSelecionado((await getComboBoxSaidasRetornosVeiculosPorteiros(getValues('porteiroSaidaId'), ''))[0])
            setEmpresaSelecionada((await getComboBoxEmpresas(getValues('empresaId'), ''))[0])

            // Ajusta Acesso
            const lClaims = await getClaims()
            let lDadosUsuario: usuariosSistemaType

            if (Number(lClaims.usuarioSistemaId) == 0) {

                setHiddenSaida(false)
                setHiddenRetorno(false)
                setHiddenOutros(false)

                setVisibleEstorno(true)
                setVisibleGravar(true)

                setDisabledSolicitacao(false)
                setDisabledAutorizacao(false)
                setDisabledSaida(false)
                setDisabledRetorno(false)

            } else if (Number(lClaims.usuarioSistemaId) > 0) {

                const retornoUsuarioSistema = (await getByIdFreeUsuariosSistema(Number(lClaims.usuarioSistemaId), offSet))

                if (retornoUsuarioSistema.erro !== '') {

                    messages.current?.clear()
                    messages.current?.show({ id: '1', sticky: true, severity: 'error', summary: 'Erro', detail: retornoUsuarioSistema.erro, closable: false })
                    setIsLoading(false)
                    return

                } else {

                    messages.current?.clear()
                    lDadosUsuario = retornoUsuarioSistema.dados as usuariosSistemaType

                    if (lDadosUsuario.administradorSistema.toUpperCase() == 'S') {

                        setHiddenSaida(true)
                        setHiddenRetorno(true)
                        setHiddenOutros(true)

                        setVisibleEstorno(true)

                        setDisabledSolicitacao(true)
                        setDisabledAutorizacao(true)
                        setDisabledSaida(true)
                        setDisabledRetorno(true)

                        if (getValues('situacao') == 1) {
                            setDisabledSolicitacao(false)
                            setDisabledAutorizacao(false)
                            setVisibleGravar(true)
                        } else {
                            setDisabledSolicitacao(true)
                            setDisabledAutorizacao(true)
                            setVisibleGravar(true)
                        }


                    } else if (lDadosUsuario.administradorSistema.toUpperCase() == 'N') {

                        setHiddenSaida(true)
                        setHiddenRetorno(true)
                        setHiddenOutros(true)

                        setVisibleEstorno(false)
                        setVisibleGravar(true)

                        setDisabledSolicitacao(true)
                        setDisabledAutorizacao(true)
                        setDisabledSaida(true)
                        setDisabledRetorno(true)

                        if (getValues('situacao') == 1) {
                            setDisabledSolicitacao(false)
                            setDisabledAutorizacao(false)
                            setVisibleGravar(true)
                        } else {
                            setDisabledSolicitacao(true)
                            setDisabledAutorizacao(true)
                            setVisibleGravar(false)
                        }

                    }

                }

            }

            setIsLoading(false)

        }

        aposCargaDados()

    }, [dados])

    useEffect(() => {
        buscaDados()
    }, [])

    return (

        <div className="px-10">

            <PageTitle texto="Veículos" />
            <PageSubTitle texto="Gerência Saídas e Retornos de Veículos - Edição" />

            <Divider />

            <Messages ref={messages} />

            <form>

                <Panel header="Solicitação" className='mt-3'>

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
                                            autoFocus
                                            disabled={disabledSolicitacao}
                                            className={classNames({ 'p-invalid': fieldState.error })}
                                        />
                                        {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                    </>
                                )}
                            />
                        </div>

                        <div className="flex flex-col">
                            <Controller
                                name="solicitanteId"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name}>Solicitante</label>
                                        <AutoComplete
                                            id={field.name}
                                            value={solicitanteSelecionado}
                                            field='nome'
                                            inputId='id'
                                            suggestions={listaSolicitantes}
                                            completeMethod={buscaSolicitantes}
                                            onChange={(e: AutoCompleteChangeEvent) => {
                                                setSolicitanteSelecionado(e.value)
                                            }}
                                            onBlur={() => {
                                                setValue('solicitanteId', solicitanteSelecionado?.id)
                                                if (getValues('solicitanteId')) {
                                                    trigger(['solicitanteId'])
                                                }
                                            }}
                                            dropdown
                                            disabled={disabledSolicitacao}
                                            className={classNames({ 'p-invalid': fieldState.error })}
                                        />
                                        {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                    </>
                                )}
                            />
                        </div>

                        <div className="flex flex-col">
                            <Controller
                                name="dataHoraSolicitacao"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name}>Data/Hora Solicitação</label>
                                        <Calendar
                                            inputId={field.name}
                                            value={field.value}
                                            onChange={field.onChange}
                                            // onChange={(e) => field.onChange(e.value)} 
                                            dateFormat="dd/mm/yy"
                                            className={classNames({ 'p-invalid': fieldState.error })}
                                            showTime
                                            showSeconds
                                            hourFormat="24"
                                            hideOnDateTimeSelect
                                            showButtonBar
                                            disabled={disabledSolicitacao}
                                        />
                                        {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                    </>
                                )}
                            />
                        </div>

                        <div className="flex flex-col">
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
                                            disabled={disabledSolicitacao}
                                            className={classNames({ 'p-invalid': fieldState.error })}
                                        />
                                        {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                    </>
                                )}
                            />
                        </div>

                        <div className="flex flex-col">
                            <Controller
                                name="dataHoraPrevistaSaida"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name}>Data/Hora Prevista Saída</label>
                                        <Calendar
                                            inputId={field.name}
                                            value={field.value}
                                            onChange={field.onChange}
                                            dateFormat="dd/mm/yy"
                                            className={classNames({ 'p-invalid': fieldState.error })}
                                            showTime
                                            showSeconds
                                            hourFormat="24"
                                            hideOnDateTimeSelect
                                            showButtonBar
                                            disabled={disabledSolicitacao}
                                        />
                                        {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                    </>
                                )}
                            />
                        </div>

                        <div className="flex flex-col">
                            <Controller
                                name="destinoId"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name}>Destino</label>
                                        <AutoComplete
                                            id={field.name}
                                            value={destinoSelecionado}
                                            field='nome'
                                            inputId='id'
                                            suggestions={listaDestinos}
                                            completeMethod={buscaDestinos}
                                            onChange={(e: AutoCompleteChangeEvent) => {
                                                setDestinoSelecionado(e.value)
                                            }}
                                            onBlur={() => {
                                                setValue('destinoId', destinoSelecionado?.id)
                                                if (getValues('destinoId')) {
                                                    trigger(['destinoId'])
                                                }
                                            }}
                                            dropdown
                                            disabled={disabledSolicitacao}
                                            className={classNames({ 'p-invalid': fieldState.error })}
                                        />
                                        {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                    </>
                                )}
                            />
                        </div>

                        <div className="flex flex-col">
                            <Controller
                                name="motivoSaida"
                                defaultValue=""
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name}>Motivo da Saída</label>
                                        <InputText
                                            id={field.name}
                                            value={field.value}
                                            className={classNames({ 'p-invalid': fieldState.error })}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            maxLength={1000}
                                            disabled={disabledSolicitacao}
                                        />
                                        {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                    </>
                                )}
                            />
                        </div>

                        <div className="flex flex-col">
                            <Controller
                                name="ordemServico"
                                defaultValue=""
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name}>Ordem de Serviço.</label>
                                        <InputText
                                            id={field.name}
                                            value={field.value}
                                            className={classNames({ 'p-invalid': fieldState.error })}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            maxLength={10}
                                            disabled={disabledSolicitacao}
                                        />
                                        {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                    </>
                                )}
                            />
                        </div>

                        <div className="flex flex-col">
                            <Controller
                                name="dataHoraPrevistaRetorno"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name}>Data/Hora Prevista Retorno</label>
                                        <Calendar
                                            inputId={field.name}
                                            value={field.value}
                                            onChange={field.onChange}
                                            dateFormat="dd/mm/yy"
                                            className={classNames({ 'p-invalid': fieldState.error })}
                                            showTime
                                            showSeconds
                                            hourFormat="24"
                                            hideOnDateTimeSelect
                                            showButtonBar
                                            disabled={disabledSolicitacao}
                                        />
                                        {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                    </>
                                )}
                            />
                        </div>

                        <div className="flex flex-col">
                            <Controller
                                name="autorizadorId"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name}>Autorizador</label>
                                        <AutoComplete
                                            id={field.name}
                                            value={autorizadorSelecionado}
                                            field='nome'
                                            inputId='id'
                                            suggestions={listaAutorizadores}
                                            completeMethod={buscaAutorizadores}
                                            onChange={(e: AutoCompleteChangeEvent) => {
                                                setAutorizadorSelecionado(e.value)
                                            }}
                                            onBlur={() => {
                                                setValue('autorizadorId', autorizadorSelecionado?.id)
                                                if (getValues('autorizadorId')) {
                                                    trigger(['autorizadorId'])
                                                }
                                            }}
                                            dropdown
                                            disabled={disabledSolicitacao}
                                            className={classNames({ 'p-invalid': fieldState.error })}
                                        />
                                        {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                    </>
                                )}
                            />
                        </div>

                    </div>

                </Panel>

                <Panel header="Autorização" className='mt-3'>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div className="flex flex-col">
                            <Controller
                                name="autorizado"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name}>Autorizado</label>
                                        <Dropdown
                                            id={field.name}
                                            value={field.value}
                                            optionLabel="nome"
                                            optionValue="codigo"
                                            options={codigoNomeSimNao}
                                            focusInputRef={field.ref}
                                            onChange={(e) => field.onChange(e.value)}
                                            className={classNames({ 'p-invalid': fieldState.error })}
                                            onBlur={() => {
                                                if (getValues('autorizado') !== null) {
                                                    setValue('dataHoraAutorizacao', new Date())
                                                    trigger(['dataHoraAutorizacao'])
                                                }
                                            }}
                                            disabled={disabledAutorizacao}
                                        />
                                        {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                    </>
                                )}
                            />
                        </div>

                        <div className="flex flex-col">
                            <Controller
                                name="dataHoraAutorizacao"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name}>Data/Hora Autorização</label>
                                        <Calendar
                                            inputId={field.name}
                                            value={field.value}
                                            onChange={field.onChange}
                                            dateFormat="dd/mm/yy"
                                            className={classNames({ 'p-invalid': fieldState.error })}
                                            showTime
                                            showSeconds
                                            hourFormat="24"
                                            hideOnDateTimeSelect
                                            showButtonBar
                                            disabled
                                        />
                                        {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                    </>
                                )}
                            />
                        </div>

                        <div className="flex flex-col">
                            <Controller
                                name="observacoesAutorizacao"
                                defaultValue=""
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name}>Observações Autorização</label>
                                        <InputText
                                            id={field.name}
                                            value={field.value}
                                            className={classNames({ 'p-invalid': fieldState.error })}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            maxLength={1000}
                                            disabled={disabledAutorizacao}
                                        />
                                        {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                    </>
                                )}
                            />
                        </div>

                    </div>

                </Panel>

                <Panel header="Saída" className='mt-3' hidden={hiddenSaida}>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div className="flex flex-col">
                            <Controller
                                name="porteiroSaidaId"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name}>Porteiro Saída</label>
                                        <AutoComplete
                                            id={field.name}
                                            value={porteiroSaidaSelecionado}
                                            field='nome'
                                            inputId='id'
                                            suggestions={listaPorteiros}
                                            completeMethod={buscaPorteiros}
                                            onChange={(e: AutoCompleteChangeEvent) => {
                                                setPorteiroSaidaSelecionado(e.value)
                                            }}
                                            onBlur={() => {
                                                setValue('porteiroSaidaId', porteiroSaidaSelecionado?.id)
                                                if (getValues('porteiroSaidaId')) {
                                                    trigger(['porteiroSaidaId'])
                                                }
                                            }}
                                            dropdown
                                            disabled={disabledSaida}
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
                                name="dataHoraSaida"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name}>Data/Hora Saída</label>
                                        <Calendar
                                            inputId={field.name}
                                            value={field.value}
                                            onChange={field.onChange}
                                            dateFormat="dd/mm/yy"
                                            className={classNames({ 'p-invalid': fieldState.error })}
                                            showTime
                                            showSeconds
                                            hourFormat="24"
                                            hideOnDateTimeSelect
                                            showButtonBar
                                            disabled={disabledSaida}
                                        // disabled
                                        // autoFocus
                                        />
                                        {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                    </>
                                )}
                            />
                        </div>

                        <div className="flex flex-col">
                            <Controller
                                name='kmSaida'
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name}>Km da Saída</label>
                                        <InputNumber
                                            id={field.name}
                                            inputRef={field.ref}
                                            value={field.value}
                                            onBlur={field.onBlur}
                                            onValueChange={(e) => field.onChange(e)}
                                            useGrouping={false}
                                            inputClassName={classNames({ 'p-invalid': fieldState.error })}
                                            disabled={disabledSaida}
                                        // disabled
                                        // minFractionDigits={0}
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
                                name="observacoesSaida"
                                defaultValue=""
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name}>Observações da Saída</label>
                                        <InputText
                                            id={field.name}
                                            value={field.value}
                                            className={classNames({ 'p-invalid': fieldState.error })}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            // maxLength={1000}
                                            disabled={disabledSaida}
                                        // autoFocus
                                        />
                                        {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                    </>
                                )}
                            />
                        </div>

                    </div>

                </Panel>

                <Panel header="Retorno" className='mt-3' hidden={hiddenRetorno}>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div className="flex flex-col">
                            <Controller
                                name="porteiroRetornoId"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name}>Porteiro Retorno</label>
                                        <AutoComplete
                                            id={field.name}
                                            value={porteiroRetornoSelecionado}
                                            field='nome'
                                            inputId='id'
                                            suggestions={listaPorteiros}
                                            completeMethod={buscaPorteiros}
                                            onChange={(e: AutoCompleteChangeEvent) => {
                                                setPorteiroRetornoSelecionado(e.value)
                                            }}
                                            onBlur={() => {
                                                setValue('porteiroRetornoId', porteiroRetornoSelecionado?.id)
                                                if (getValues('porteiroRetornoId')) {
                                                    trigger(['porteiroRetornoId'])
                                                }
                                            }}
                                            dropdown
                                            disabled={disabledRetorno}
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
                                name="dataHoraRetorno"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name}>Data/Hora Retorno</label>
                                        <Calendar
                                            inputId={field.name}
                                            value={field.value}
                                            onChange={field.onChange}
                                            dateFormat="dd/mm/yy"
                                            className={classNames({ 'p-invalid': fieldState.error })}
                                            showTime
                                            showSeconds
                                            hourFormat="24"
                                            hideOnDateTimeSelect
                                            showButtonBar
                                            disabled={disabledRetorno}
                                        // disabled
                                        // autoFocus
                                        />
                                        {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                    </>
                                )}
                            />
                        </div>

                        <div className="flex flex-col">
                            <Controller
                                name='kmRetorno'
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name}>Km do Retorno</label>
                                        <InputNumber
                                            id={field.name}
                                            inputRef={field.ref}
                                            value={field.value}
                                            onBlur={field.onBlur}
                                            onValueChange={(e) => field.onChange(e)}
                                            useGrouping={false}
                                            inputClassName={classNames({ 'p-invalid': fieldState.error })}
                                            disabled={disabledRetorno}
                                        // disabled
                                        // minFractionDigits={0}
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
                                name="observacoesRetorno"
                                defaultValue=""
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name}>Observações do Retorno</label>
                                        <InputText
                                            id={field.name}
                                            value={field.value}
                                            className={classNames({ 'p-invalid': fieldState.error })}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            // maxLength={1000}
                                            disabled={disabledRetorno}
                                        // autoFocus
                                        />
                                        {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                    </>
                                )}
                            />
                        </div>

                    </div>

                </Panel>

                <Panel header="Outros" className='mt-3' hidden={hiddenOutros}>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

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
                                            disabled
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
                                            showTime
                                            showSeconds
                                            hourFormat="24"
                                            disabled
                                        />
                                        {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                    </>
                                )}
                            />
                        </div>

                    </div>

                </Panel>



                <Divider />

                <div className="flex justify-center mt-2 gap-2">

                    <Button label="Gravar" type="button" icon="pi pi-check" onClick={handleGravar} visible={visibleGravar} />
                    <Button label="Voltar" type="button" icon="pi pi-arrow-left" onClick={router.back} />
                    <Button label="Estornar" type="button" icon="pi pi-replay" onClick={handleExtornar} visible={visibleEstorno} />


                </div>

            </form>

            {
                isLoading && <Loading />
            }

        </div>
    )
}