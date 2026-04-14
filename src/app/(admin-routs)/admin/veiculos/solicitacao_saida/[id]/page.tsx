'use client'

import { Controller, useForm } from 'react-hook-form'
import { useParams, useRouter } from 'next/navigation'

import { saidasRetornosVeiculosType, saidasRetornosVeiculosSchema } from '@/types/veiculos/saidas_retornos_veiculos'
import { codigoNomeType } from '@/types/sistema/codigoNome'
import { post, getById } from '@/actions/veiculos/solicitacao_saida'

import { classNames } from 'primereact/utils'
import { Button } from 'primereact/button'
import { InputNumber } from 'primereact/inputnumber'
import { InputText } from 'primereact/inputtext'
import { Calendar } from 'primereact/calendar'

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
import { getByIdFree, getComboBox as getComboBoxSolicitantes } from '@/actions/basico/usuarios_sistema'
import { getComboBoxSaidasRetornosVeiculosAutorizadores as getComboBoxAutorizadores } from '@/actions/basico/usuarios_sistema'
import { getComboBox as getComboBoxEmpresas } from '@/actions/basico/empresas'
import Link from 'next/link'
import { claimsType } from '@/types/sistema/claims'
import { getClaims } from '@/actions/sistema/acesso_sistema'
import { usuariosSistemaType } from '@/types/basico/usuarios_sistema'

export default function Formulario() {

    const parametros = useParams<{ id: string }>()

    const offSet = uData.consultaOffSet()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState<Boolean>(false)
    const messages = useRef<Messages>(null)
    const [dados, setDados] = useState<saidasRetornosVeiculosType>({} as saidasRetornosVeiculosType)

    // autocompletar
    const [listaVeiculos, setListaVeiculos] = useState<comboBoxType[]>([]);
    const [veiculoSelecionado, setVeiculoSelecionado] = useState<comboBoxType>({} as comboBoxType);

    const [listaDestinos, setListaDestinos] = useState<comboBoxType[]>([]);
    const [destinoSelecionado, setDestinoSelecionado] = useState<comboBoxType>({} as comboBoxType);

    const [listaSolicitantes, setListaSolicitantes] = useState<comboBoxType[]>([]);
    const [solicitanteSelecionado, setSolicitanteSelecionado] = useState<comboBoxType>({} as comboBoxType);

    const [listaAutorizadores, setListaAutorizadores] = useState<comboBoxType[]>([]);
    const [autorizadorSelecionado, setAutorizadorSelecionado] = useState<comboBoxType>({} as comboBoxType);

    const [listaEmpresas, setListaEmpresas] = useState<comboBoxType[]>([]);
    const [empresaSelecionada, setEmpresaSelecionada] = useState<comboBoxType>({} as comboBoxType);

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

    function handleGrava() {
        handleSubmit(onSubmit)()
    }

    async function onSubmit(dados: saidasRetornosVeiculosType) {

        setIsLoading(true)
        const retorno: any = await post(dados, offSet)
        setIsLoading(false)

        if (retorno.erro !== '') {
            messages.current?.clear()
            messages.current?.show({ id: '1', sticky: true, severity: 'error', summary: 'Erro', detail: retorno.erro, closable: false })
        } else {
            messages.current?.clear()
            // router.back()
            router.push('/admin/veiculos/solicitacao_saida/sucesso')
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

    const buscaDestinos = async (event: AutoCompleteCompleteEvent) => {
        setListaDestinos((await getComboBoxDestinos(0, event.query)))
    }

    const buscaSolicitantes = async (event: AutoCompleteCompleteEvent) => {
        setListaSolicitantes((await getComboBoxSolicitantes(0, event.query)))
    }

    const buscaAutorizadores = async (event: AutoCompleteCompleteEvent) => {
        setListaAutorizadores((await getComboBoxAutorizadores(0, event.query)))
    }

    const buscaEmpresas = async (event: AutoCompleteCompleteEvent) => {
        setListaEmpresas((await getComboBoxEmpresas(0, event.query)))
    }

    // const showSuccess = () => {
    //     toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Solicitação enviada com sucesso....', life: 3000 });
    // }

    // Após Carga dos Dados
    useEffect(() => {

        async function aposCargaDados() {

            setIsLoading(true)

            const lClaims: claimsType = await getClaims()

            const retornoUsuarioSistema = await getByIdFree(Number(lClaims.usuarioSistemaId), offSet)
            let lUsuarioSistema: usuariosSistemaType = {} as usuariosSistemaType

            if (retornoUsuarioSistema.erro !== '') {
                setIsLoading(false)
                messages.current?.clear()
                messages.current?.show({ id: '1', sticky: true, severity: 'error', summary: 'Erro', detail: retornoUsuarioSistema.erro, closable: false })
                lUsuarioSistema = {} as usuariosSistemaType
            } else {
                messages.current?.clear()
                lUsuarioSistema = retornoUsuarioSistema.dados as usuariosSistemaType
                setIsLoading(false)
            }

            // autocompletar
            // setVeiculoSelecionado((await getComboBoxVeiculos(getValues('veiculoId'), ''))[0])
            // setDestinoSelecionado((await getComboBoxDestinos(getValues('destinoId'), ''))[0])
            setSolicitanteSelecionado((await getComboBoxSolicitantes(Number(lClaims.usuarioSistemaId), ''))[0])
            // setAutorizadorSelecionado((await getComboBoxAutorizadores(getValues('autorizadorId'), ''))[0])
            setEmpresaSelecionada((await getComboBoxEmpresas(lUsuarioSistema.empresaId, ''))[0])

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
            <PageSubTitle texto="Solicitação de Saída de Veículo" />

            <Messages ref={messages} />
            {/*
            <Toast ref={toast} position="center" />
            */}

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
                                        // autoFocus
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
                                        // autoFocus
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
                                            // autoFocus
                                            className={classNames({ 'p-invalid': fieldState.error })}
                                        />
                                        {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                    </>
                                )}
                            />
                        </div>

                    </div>

                </Panel>

                <Divider />

                <div className="flex justify-center mt-2 mb-2 gap-2">

                    <Button label="Gravar" type="button" icon="pi pi-check" onClick={handleGrava} />

                    <Link href="/admin">
                        <Button label="Início" icon="pi pi-home" />
                    </Link>

                </div>

            </form>

            {
                isLoading && <Loading />
            }

        </div>
    )
}