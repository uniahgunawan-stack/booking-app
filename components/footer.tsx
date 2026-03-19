import Image from "next/image"
import Link from "next/link"

const Footer = () => {
    return (
        <footer className="bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 w-full py-10 md:py-16">
                <div className="grid md:grid-cols-3 gap-7">
                    <div>
                        <Link href="/" className="mb-10 block">
                            <Image src="/logo.png" width={128} height={28} alt="logo" />
                        </Link>
                        <p className="text-gray-400">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Id quam molestias modi odio laboriosam. Deleniti.
                        </p>
                    </div>
                    <div>
                        <div className="flex gap-20">
                            <div className="flex-1 md:flex-none">
                                <h4 className="mb-8 text-xl font-semibold text-white">Links</h4>
                                <ul className="list-item space-py-5 text-gray-400">
                                    <li><Link href="/">Home</Link></li>
                                    <li><Link href="/about">About Us</Link></li>
                                    <li><Link href="/room">Room</Link></li>
                                    <li><Link href="/contact">Contact Us</Link></li>
                                </ul>
                            </div>
                            <div className="flex-1 md:flex-none">
                                <h4 className="mb-8 text-xl font-semibold text-white">Legals</h4>
                                <ul className="list-item space-py-5 text-gray-400">
                                    <li><Link href="#">Legal</Link></li>
                                    <li><Link href="#">Term & Conditions</Link></li>
                                    <li><Link href="#">Payment Method</Link></li>
                                    <li><Link href="#">Privacy Police</Link></li>
                                </ul>
                            </div>

                        </div>
                    </div>
                    <div>
                        <h4 className="mb-8 text-xl font-semibold text-white">Newsletter</h4>
                        <p className="text-gray-400">Lorem ipsum dolor sit amet consectetur adipisicing.</p>
                        <form action="" className="mt-5">
                            <div className="mb-5">
                                <input type="text" name="email" className="w-full text-sm p-3 rounded-sm bg-white" placeholder="jhondo@email.com" />
                            </div>
                            <button className="bg-orange-400 p-3 font-bold text-white w-full text-center rounded-sm hover:bg-orange-500">Subscribe</button>
                        </form>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 border-t border-r-gray-500 py-8 text-center text-base text-gray-500">
                &copy; copyright 2026 | Dhalisa-id | All Right Reserved
            </div>
        </footer>
    )
}

export default Footer