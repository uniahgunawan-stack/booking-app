import Link from "next/link"
import { HiFaceSmile } from "react-icons/hi2"


const ReservationEmpty = () => {
  return (
    <div className="max-w-7xl px-4 mx-auto py-20 mt-12">
        <div className="p-6 md:mx-auto text-center bg-green-100 rounded-sm ">
            <HiFaceSmile className="text-green-600 w-20 h-20 mx-auto my-6"/>
            <h3 className="md:text-2xl text-base text-gray-900 
            font-semibold text-center">Anda Belum memiliki Reservation</h3>
            <p className="text-gray-600 my-2">Percayakan liburan anda bersama kami</p>
            <div className="py-10 text-center">
                <Link
                href="/room"
                className="px-12 bg-green-600 hover:bg-green-500 text-white font-semibold rounded text-2xl"
                >Go To Room</Link>
            </div>
        </div>
        
    </div>
  )
}

export default ReservationEmpty