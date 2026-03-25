"use client"

interface Props{
    isOpen: boolean,
    onClose: () => void,
    onConfirm:() => void,
}

export default function ConfirmForm ({
    isOpen,
    onClose,
    onConfirm,    
}:Props
   ) {
    if (!isOpen) return null    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 text-center shadow-2xl">
                <h2 className="text-2xl font-bold text-red-600 mb-2">Batalkan perubahan</h2>
                <p className="mb-3 text-gray-600">Semua Perubahan yang belum di simpan akan Hilang, apakah anda yakin?</p>
                <div className="mt-8 flex gap-3 font-semibold mb-2">
                    <button className="flex-1 py-3 text-white rounded-xl cursor-pointer bg-orange-400 hover:bg-orange-300"
                    onClick={onClose}>
                    Lanjutkan, Edit
                </button>
                <button
                onClick={onConfirm}
                className="flex-1 rounded-xl cursor-pointer bg-none text-orange-500 font-normal ring ring-orange-500 hover:font-bold"
                >ya, Batalkan</button>
                </div>
                
            </div>
        </div>
    )
}