import { signIn } from "@/lib/auth";
import { FaG } from "react-icons/fa6"


export const LoginGoogleButton = ({redirectUrl}: {redirectUrl: string}) => {

    return (
        <form action={async () => {
            "use server";
            await signIn("google", {redirectTo: redirectUrl});
        }}>
            <button className='flex items-center justify-center w-full bg-blue-700 text-white
    text-base font-medium px-6 rounded-sm hover:bg-blue-500 cursor-pointer py-2 gap-2 '>
                <FaG className="size-6" />
                Sign In With Google</button>
        </form>
    )
}

