'use client'

import { Controller, Form, useForm, useFieldArray } from 'react-hook-form'
import { useParams, useRouter } from 'next/navigation'

import { perfisType, perfisSchema, direitosType } from '@/types/basico/perfis_usuarios_sistema'
import { codigoNomeType } from '@/types/sistema/codigoNome'
import { postPut, getById } from '@/actions/basico/perfis_usuarios_sistema'

import { classNames } from 'primereact/utils'
import { Button } from 'primereact/button'
import { InputNumber } from 'primereact/inputnumber'
import { InputText } from 'primereact/inputtext'
import { Calendar } from 'primereact/calendar'
import { Dropdown } from 'primereact/dropdown'

import { zodResolver } from "@hookform/resolvers/zod"
import React, { useState, useRef, useEffect } from 'react'

import uData from '@/utils/uData';
import { Messages } from 'primereact/messages'
import Loading from '@/components/loading'
import PageTitle from '@/components/pageTitle'
import PageSubTitle from '@/components/pageSubTitle'

import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Divider } from 'primereact/divider'

import { Dialog } from 'primereact/dialog'
import FrmDireitos from './frmDireitos'

export default function Formulario() {

    const parametros = useParams<{ id: string }>()

    const offSet = uData.consultaOffSet()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState<Boolean>(false)
    const messages = useRef<Messages>(null)
    const [dados, setDados] = useState<perfisType>({} as perfisType)

    // Direitos
    const [dialogoDireitos, setDialogoDireitos] = useState<boolean>(false);
    const [dadosDireitos, setDadosDireitos] = useState<direitosType>({} as direitosType)
    const [indiceDireitos, setIndiceDireitos] = useState<number>(0)

    let idDireitos = 0

    const { control, handleSubmit, formState: { errors }, setValue, getValues, trigger, watch } = useForm<perfisType>({
        defaultValues: dados,
        values: dados,
        mode: "onChange",
        reValidateMode: "onChange",
        shouldUnregister: false,
        resolver: zodResolver(perfisSchema)
    })

    const { fields, append, update, remove } = useFieldArray({
        control,
        name: 'tbaDireitoPerfilUsuarioSistema',

    })

    const formataDireito = (dados: any) => {
        return (
            <>
                {dados.direito == 1 ? '1-Leitura' : '2-Leitura/Gravação'}
            </>
        )
    }

    const formataDeletado = (dados: any) => {
        if (dados.flagDelete === true) {
            return <> <i className='pi pi-times-circle' style={{ color: 'red', fontSize: '1.2rem' }}></i> </>
        } else {
            return <> <i className='pi pi-check-circle' style={{ color: 'green', fontSize: '1.2rem' }}></i> </>
        }
    }

    async function buscaDados() {

        setIsLoading(true)
        const retorno = await getById(parseInt(parametros.id), offSet)

        // console.log('buscaDados retorno: ', retorno)

        if (retorno.erro !== '') {
            setIsLoading(false)
            messages.current?.clear();
            messages.current?.show({ id: '1', sticky: true, severity: 'error', summary: 'Erro', detail: retorno.erro, closable: false });
            setDados({} as perfisType)
        } else {
            messages.current?.clear();
            setDados(retorno.dados as perfisType)
            setIsLoading(false)
        }

    }

    function handleIncluiDireitos() {

        const direito: any = {
            id: 0,
            clienteSistemaId: dados.clienteSistemaId,
            perfilUsuarioSistemaId: dados.id,
            moduloId: null,
            moduloNome: '',
            opcaoId: null,
            opcaoNome: '',
            direito: null,
            flagInsertUpdate: true,
            flagDelete: false,
        }

        setDadosDireitos(direito)
        setDialogoDireitos(true)

    }

    function handleApagaDireito(pRowIndex: number, pDados: direitosType) {

        let lDados: direitosType = pDados

        if ((lDados.flagDelete === false) || (lDados.flagDelete === undefined)) {
            lDados.flagDelete = true
        } else {
            lDados.flagDelete = false
        }

        setDadosDireitos(lDados)
        update(pRowIndex, lDados)

    }

    const watchDireitos = watch('tbaDireitoPerfilUsuarioSistema')

    async function handleGravaDireitos(dadosRetorno: direitosType) {

        if (dadosRetorno) {

            if (dadosRetorno.id == 0) {

                idDireitos = idDireitos - 1
                dadosRetorno.id = idDireitos
                append(dadosRetorno)

            } else {

                update(indiceDireitos, dadosRetorno)

            }

        }

        setDialogoDireitos(false)

    }

    function handleGravar() {
        // console.log('handleGravar: ', dados)
        handleSubmit(onSubmit)()
    }

    async function onSubmit(dados: perfisType) {

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

            <PageTitle texto="Básico" />
            <PageSubTitle texto="Cadastro de Perfis de Usuários do Sistema - Edição" />

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

                        <h2 className='text-center mb-2'>Direitos</h2>

                        <DataTable value={watchDireitos} size="small" stripedRows showGridlines selectionMode="single" paginator rows={20} >

                            <Column field="id" header="ID"></Column>
                            <Column field="moduloNome" header="Módulo"></Column>
                            <Column field="opcaoNome" header="Opção"></Column>
                            <Column body={formataDireito} header="Direito" sortable></Column>
                            <Column body={formataDeletado} header=""></Column>

                            <Column body={(data, props) =>
                                <div className='flex flex-row gap-2'>

                                    <Button
                                        icon="pi pi-pencil"
                                        type='button'
                                        size="small"
                                        onClick={(e) => {
                                            setDadosDireitos(data)
                                            setIndiceDireitos(props.rowIndex)
                                            setDialogoDireitos(true)
                                        }}
                                    >
                                    </Button>

                                    <Button
                                        icon="pi pi-trash"
                                        type='button'
                                        size="small"
                                        onClick={(e) => {
                                            handleApagaDireito(props.rowIndex, data)
                                        }}
                                    >
                                    </Button>

                                </div>
                            }>
                            </Column>

                        </DataTable>

                        {/* {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)} */}
                        {errors.tbaDireitoPerfilUsuarioSistema && (<small className='p-error'>{errors.tbaDireitoPerfilUsuarioSistema?.message}</small>)}

                        <Button className='mt-2' label="Incluir Direito" type="button" icon="pi pi-plus" onClick={handleIncluiDireitos} />

                    </div>

                </div>

            </form>

            <Divider />

            <div className="flex justify-center mt-2 gap-2">

                <Button label="Gravar" type="button" icon="pi pi-check" onClick={handleGravar} />
                <Button label="Voltar" type="button" icon="pi pi-arrow-left" onClick={router.back} />

            </div>

            <Dialog modal header="Direitos" visible={dialogoDireitos} style={{ width: '80vw' }} onHide={() => { if (!dialogoDireitos) return; setDialogoDireitos(false); }}>
                <FrmDireitos dadosEnvio={dadosDireitos} dadosGerais={dados} dadosRetorno={handleGravaDireitos} />
            </Dialog>

            {/* </form> */}

            {
                isLoading && <Loading />
            }

        </div>
    )
}