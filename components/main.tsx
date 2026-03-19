import Card from "@/components/card"
import { getRoom } from "@/lib/data"
import { notFound } from "next/navigation";


const Main =async () => {
  const rooms = await getRoom();
  if(!rooms) return notFound();
  return (
    <div className="max-w-7xl py-6 pb-20 px-4 mx-auto">
        <div className="grid gap-7 md:grid-cols-3">
          {rooms.map((item) => (
            <Card room={item} key={item.id}/>
          ))}
            
        </div>
    </div>
  )
}

export default Main