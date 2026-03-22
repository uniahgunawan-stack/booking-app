import { LoginGoogleButton } from "@/components/login-button"
import SignForm from "@/components/navbar/sign-form";
import SignreduceForm from "@/components/navbar/signreduce-form";
import { Metadata } from "next"
import Image from "next/image";

export const metadata: Metadata = {
    title: "Sign in"
}
const SigninPage = async ({
    searchParams
}: {
    searchParams?: Promise<{ redirect_url?: string }>;
}) => {

    const params = (await searchParams)?.redirect_url;
    let redirectUrl;
    if (!params) {
        redirectUrl = "/"
    } else {
        redirectUrl = `/${params}`
    }
    return (
        <div className="min-h-screen flex items-center relative justify-center">
            <div className="inset-0 z-10">
                
            </div>
            <div className="absolute inset-0 bg-black/40">
            <Image 
                src="/login-bg.png"
                fill
                alt="image-log"
                />
            </div>
            <section className="">
                <div className=" bg-white/20 w-100 backdrop-blur-md mx-auto rounded shadow-xl p-4">
                <h1 className="text-2xl font-bold capitalize text-center mb-8 ">Walcome dhalisa hotel</h1>                
                {/* <SignForm/> */}
                <SignreduceForm/>
                <div className="py-4 text-center">
                    <LoginGoogleButton redirectUrl={redirectUrl}/>
                </div>
            </div>
            </section>
            
        </div>
    )
}

export default SigninPage