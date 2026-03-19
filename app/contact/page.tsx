import { Metadata } from "next";
import HeaderSection from "@/components/header-section";
import {
    IoMailOutline, IoCallOutline, IoLocateOutline
} from "react-icons/io5";
import ContactForm from "@/components/contact-form";

export const metadata: Metadata = {
    title: "Contact"
}

const ContactPage = () => {
    return (
        <div>
            <HeaderSection title="Contack us" subTitle="Lorem ipsum dolor sit amet." />
            <div className="max-w-7xl mx-auto py-2 px-4">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="">
                        <h1 className="text-lg text-gray-500 mb-3">Contact Us</h1>
                        <h1 className="text-5xl font-semibold text-gray-900 mb-4">Get In Touch Today </h1>
                        <p className="text-gray-700 py-5">Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo, dolor voluptatibus. Nostrum vel debitis fugit.</p>
                        <ul className="list-item space-y-6 pt-8">
                            <li className="flex gap-5">
                                <div className="flex-none bg-gray-300 p-3 shadow-sm rounded-sm ">
                                    <IoMailOutline className="size-7" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-lg font-semibold mb-1">Email :</h4>
                                    <p>email-us@example.com</p>
                                </div>
                            </li>
                            <li className="flex gap-5">
                                <div className="flex-none bg-gray-300 p-3 shadow-sm rounded-sm ">
                                    <IoCallOutline className="size-7" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-lg font-semibold mb-1">Phone Number :</h4>
                                    <p>+6285770636253, +628568513614</p>
                                </div>
                            </li>
                            <li className="flex gap-5">
                                <div className="flex-none bg-gray-300 p-3 shadow-sm rounded-sm ">
                                    <IoLocateOutline className="size-7" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-lg font-semibold mb-1">Addres :</h4>
                                    <p>Rancabango rajeg, indonesia</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    {/* Contact form */}
                    <ContactForm/>
                </div>
            </div>
        </div>
    )
}

export default ContactPage