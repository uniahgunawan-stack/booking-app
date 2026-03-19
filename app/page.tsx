import Hero from "@/components/hero";
import Main from "@/components/main";

export default function Home() {
  return (
    <div className="">
      <Hero/>
      <div className="mt-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold uppercase">Rooms & rate</h1> 
          <p className="py-3 ">Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis, at!</p>
        </div> 
        {/* <h3 className="text-5xl text-center font-bold text-red-500">tonton vidio di menit 7.03.50</h3>        */}
        <Main/>
      </div>
      
    </div>
  );
}
