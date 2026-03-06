'use client'

// import { useRouter } from 'next/navigation'
import { useRouter } from 'next/navigation'

import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import { deleteCookieToken } from "@/actions/sistema/acesso_sistema"

export default function ButtonLogout() {

    const router = useRouter()

    async function logOut() {
        // console.log('logOut')
        await deleteCookieToken()
        router.replace('/')
    }

    const accept = () => {
        // console.log('accept')
        logOut()
    }

    const reject = () => {
        console.log('reject')
    }

    function confirmaSair() {
        confirmDialog({
            message: 'Sair do Sistema?',
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            accept,
            reject
        });

    }

    return (
        <div>
            <ConfirmDialog />
            <Button icon="pi pi-power-off" onClick={confirmaSair} />
        </div>
    )

}