'use client'

import { Controller, Form, useForm, useFieldArray } from 'react-hook-form'
import { useParams, useRouter } from 'next/navigation'

import { modulosType, modulosSchema, opcoesType } from '@/types/sistema/modulos_opcoes'
import { codigoNomeType } from '@/types/sistema/codigoNome'
import { postPut, getById } from '@/actions/sistema/modulos_opcoes'

import { classNames } from 'primereact/utils'
import { Button } from 'primereact/button'
import { InputNumber } from 'primereact/inputnumber'
import { InputText } from 'primereact/inputtext'
import { Calendar } from 'primereact/calendar'
import { Dropdown } from 'primereact/dropdown'

import { zodResolver } from "@hookform/resolvers/zod"
import React, { useState, useRef, useEffect } from 'react'

import uData from '@/utils/uData';
import { Messages } from 'primereact/messages';
import Loading from '@/components/loading'
import PageTitle from '@/components/pageTitle'
import PageSubTitle from '@/components/pageSubTitle'

import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Divider } from 'primereact/divider'

import { Dialog } from 'primereact/dialog'
import FrmOpcoes from './frmOpcoes'
import { Tag } from 'primereact/tag'

let idOpcoes = 0

export default function Formulario() {

    const parametros = useParams<{ id: string }>()

    const offSet = uData.consultaOffSet()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState<Boolean>(false)
    const messages = useRef<Messages>(null);
    const [dados, setDados] = useState<modulosType>({} as modulosType)

    // Opções
    const [dialogoOpcoes, setDialogoOpcoes] = useState<boolean>(false);
    const [dadosOpcoes, setDadosOpcoes] = useState<opcoesType>({} as opcoesType)
    const [indiceOpcoes, setIndiceOpcoes] = useState<number>(0)

    const { control, handleSubmit, formState: { errors }, setValue, getValues, trigger, watch } = useForm<modulosType>({
        defaultValues: dados,
        values: dados,
        mode: "onChange",
        reValidateMode: "onChange",
        shouldUnregister: false,
        resolver: zodResolver(modulosSchema)
    })

    const { fields, append, remove, update, insert } = useFieldArray({
        control,
        name: 'opcoes',

    })

    const formataStatus = (dados: modulosType) => {
        return (
            <>
                <Tag value={dados.status == 'A' ? 'Ativo' : 'Inativo'} severity={dados.status == 'A' ? 'success' : 'danger'}></Tag>
            </>
        )
    }

    async function buscaDados() {

        setIsLoading(true)
        const retorno = await getById(parseInt(parametros.id), offSet)

        if (retorno.erro !== '') {
            setIsLoading(false)
            messages.current?.clear();
            messages.current?.show({ id: '1', sticky: true, severity: 'error', summary: 'Erro', detail: retorno.erro, closable: false });
            setDados({} as modulosType)
        } else {
            messages.current?.clear();
            setDados(retorno.dados as modulosType)
            setIsLoading(false)
        }

    }

    function handleIncluiOpcoes() {

        const opcao: opcoesType = {
            id: 0,
            moduloId: dados.id,
            nome: '',
            recurso: '',
            tipo: 0,
            status: 'A',
            flagInsertUpdate: true
        }

        setDadosOpcoes(opcao)
        setDialogoOpcoes(true)

    }

    const watchOpcoes = watch('opcoes')

    async function handleGravaOpcoes(dadosRetorno: opcoesType) {

        if (dadosRetorno) {

            if (dadosRetorno.id == 0) {

                idOpcoes = idOpcoes - 1
                dadosRetorno.id = idOpcoes
                append(dadosRetorno)

            } else {

                update(indiceOpcoes, dadosRetorno)

            }

        }

        setDialogoOpcoes(false)

    }

    function handleGravar() {
        handleSubmit(onSubmit)()
    }

    async function onSubmit(dados: modulosType) {

        // console.log('onSubmit: ', dados)

        setIsLoading(true)
        const retorno: any = await postPut(dados, offSet)

        if (retorno.erro !== '') {
            setIsLoading(false)
            messages.current?.clear();
            messages.current?.show({ id: '1', sticky: true, severity: 'error', summary: 'Erro', detail: retorno.erro, closable: false });
        } else {
            messages.current?.clear();
            router.back()
            setIsLoading(false)
        }

    }

    const codigoNomeStatus: codigoNomeType[] = [
        { codigo: 'A', nome: 'Ativo' },
        { codigo: 'I', nome: 'Inativo' },
    ]

    const codigoNomeSimNao: codigoNomeType[] = [
        { codigo: 'S', nome: 'Sim' },
        { codigo: 'N', nome: 'Não' },
    ]

    useEffect(() => {
        buscaDados()
    }, [])

    return (

        <div className="px-10">

            <PageTitle texto="Sistema" />
            <PageSubTitle texto="Cadastro de Módulos e Opções - Edição" />

            <Divider />

            <Messages ref={messages} />

            <form>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="flex flex-col">

                        <h2 className='text-center'>Módulo</h2>

                        {/* <form> */}

                        <div className="grid grid-cols-1 gap-4">

                            <div className='flex flex-col'>
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
                                    name="realizaVendas"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <>
                                            <label htmlFor={field.name}>Realiza Vendas</label>
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
                                    name="temAtendentes"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <>
                                            <label htmlFor={field.name}>Tem Atendentes</label>
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

                        {/* </form> */}

                    </div>

                    <div className="flex flex-col">

                        <h2 className='text-center mb-2'>Opções</h2>

                        <DataTable value={watchOpcoes} size="small" stripedRows showGridlines selectionMode="single" paginator rows={20} >

                            <Column field="id" header="ID"></Column>
                            <Column field="nome" header="Nome"></Column>
                            <Column field="recurso" header="Recurso"></Column>
                            <Column body={formataStatus} header="Status" sortable></Column>

                            <Column body={(data, props) =>
                                <div>

                                    <Button
                                        label='Editar'
                                        icon="pi pi-pencil"
                                        type='button'
                                        size="small"
                                        onClick={(e) => {
                                            setDadosOpcoes(data)
                                            setIndiceOpcoes(props.rowIndex)
                                            setDialogoOpcoes(true)
                                        }}
                                    >
                                    </Button>

                                </div>
                            }>
                            </Column>

                        </DataTable>

                        {errors.opcoes && (<small className='p-error'>{errors.opcoes?.message}</small>)}

                        <Button className='mt-2' label="Incluir Manuteção" type="button" icon="pi pi-plus" onClick={handleIncluiOpcoes} />

                    </div>

                </div>

            </form>

            <Divider />

            <div className="flex justify-center mt-2 gap-2">

                <Button label="Gravar" type="button" icon="pi pi-check" onClick={handleGravar} />
                <Button label="Voltar" type="button" icon="pi pi-arrow-left" onClick={router.back} />

            </div>

            <Dialog modal header="Opções" visible={dialogoOpcoes} style={{ width: '80vw' }} onHide={() => { if (!dialogoOpcoes) return; setDialogoOpcoes(false); }}>
                <FrmOpcoes dadosEnvio={dadosOpcoes} dadosRetorno={handleGravaOpcoes} />
            </Dialog>

            {/* </form> */}

            {
                isLoading && <Loading />
            }

        </div>
    )
}