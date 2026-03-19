

const CardSkeleton = () => {
  return (
    <div className="bg-white shadow-lg rounded-sm animate-pulse overflow-hidden">
        <div className="h-48 w-full bg-gray-200"></div>
        {/* Konten body */}
        <div className="p-5">
            {/* judul */}
            <div className="mb-4">
                <div className="h-5 w-3/4 rounded-lg bg-gray-200"></div>
            </div>
            <div className="mb-6">
                <div className="h-5 w-1/2 rounded-lg bg-gray-200"></div>
            </div>
            {/* Footer card */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                    <div className="h-4 w-12 rounded-full bg-gray-200"></div>
                </div>
                {/* placeholder tombol */}
                <div className="h-10 w-28 rounded bg-gray-200"></div>
            </div>
        </div>
    </div>
  )
}

export default CardSkeleton;