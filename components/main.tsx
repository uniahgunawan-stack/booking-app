import Card from "@/components/card"
import { getRoom } from "@/lib/data"
import { notFound } from "next/navigation";
import { IoCallOutline, IoHammer, } from "react-icons/io5";


const Main = async () => {
  const rooms = await getRoom();
  if (!rooms) { notFound(); }
  if (rooms.length === 0) {
    return (
      <div className="max-w-7xl mx-auto text-center py-20 px-4 bg-slate-50">
        <div className="text-6xl mb-6 flex flex-col items-center justify-center space-y-4">
          <IoHammer className="h-40 w-40 text-orange-500 " />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Maaf , saat ini kami sedang dalam perawatan</h2>
          <p className="text-lg">untuk informasi lebih lanjut silahkan hubungi kami :</p>
          <p className="flex flex-row text-xl gap-2">
            <IoCallOutline className="size-6"/>
            <span>+68568514613</span>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl py-6 pb-20 px-4 mx-auto">
      <div className="grid gap-7 md:grid-cols-3">
        {rooms.map((item) => (
          <Card room={item} key={item.id} />
        ))}

      </div>
    </div>
  )
}

export default Main