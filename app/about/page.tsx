import { Metadata } from "next";
import HeaderSection from "@/components/header-section";
import Image from "next/image";
import { IoEyeOffOutline, IoLocateOutline } from "react-icons/io5";
export const metadata:Metadata = {
    title:"About",
    description:"Who we are"
}

const AbouPage = () => {
  return (
    <div>
        <HeaderSection title="About Us" subTitle="Lorem ipsum dolor sit amet."/>
        <div className="max-w-7xl mx-auto py-20 px-4 ">
            <div className="grid md:grid-cols-2 gap-8">
                <Image src="/about-image.jpg" width={650} height={579} alt="about"/>
                <div>
                    <h1 className="text-5xl font-semibold text-gray-900 mb-2">Who We Are</h1>
                    <p className="text-gray-700 py-5 ">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempora assumenda excepturi corrupti vel dolorem et unde animi quas repellendus illo?</p>
                    <ul className="list-item space-y-6 pt-8">
                        <li className="flex gap-5">
                            <div className="flex-none mt-1">
                                <IoEyeOffOutline className="size-7"/>
                            </div>
                            <div className="flex-1">
                                <h4 className="text-lg font-semibold mb-1">Vision :</h4>
                                <p className="text-gray-600">Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi velit consequuntur unde consequatur tempora dolorum.</p>
                            </div>
                        </li><li className="flex gap-5">
                            <div className="flex-none mt-1">
                                <IoLocateOutline className="size-7"/>
                            </div>
                            <div className="flex-1">
                                <h4 className="text-lg font-semibold mb-1">Mision :</h4>
                                <p className="text-gray-600">Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt, similique.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AbouPage