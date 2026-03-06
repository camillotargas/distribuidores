import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';

export default function ButtonAlter() {
    return (
        <>
            <div className="md:hidden">
                <Button icon="pi pi-pencil" size="small" />                  
            </div>

            <div className="hidden md:block" >
                {/* <Badge value="Editar" severity="success"></Badge> */}
                <Button icon="pi pi-pencil" label='Editar' size="small" />
            </div>
        </>
    )
}