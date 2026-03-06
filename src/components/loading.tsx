import { ProgressSpinner } from 'primereact/progressspinner';

export default function Loading() {
    return (
        // flex flex-col items-center justify-center h-full
        //flex flex-col items-center justify-center h-full
        <div className="fixed top-0 h-full w-full flex items-center justify-center bg-opacity-50 bg-gray-700">
            <ProgressSpinner />
        </div>
    )
}