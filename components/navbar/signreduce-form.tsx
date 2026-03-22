"use client"

import { signupActions } from "@/lib/action";
import { formReducer, FormState, initialLocalState } from "@/type/signupType"
import clsx from "clsx";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useReducer, useState, useTransition } from "react"
import { IoEye, IoEyeOffOutline } from "react-icons/io5";


const SignreduceForm = () => {
    const [isLogin, setIsLogin] = useState(true)
    const [local, dispatch] = useReducer(formReducer, initialLocalState);
    const initialState: FormState = { success: false, message: "", errors: {} }
    const [serverState, formAction, isPendingsignup] = useActionState(signupActions, initialState)
    const [isPendingsignin, startTransition] = useTransition()
    const router = useRouter()
    const isPending = isLogin ? isPendingsignin : isPendingsignup;

    useEffect(() => {
        if (!isLogin)
            dispatch({ type: 'SET_DISPLAY_ERROR', errors: serverState.errors || {} })
    }, [serverState])

    useEffect(() => {
        if (serverState.success && !isLogin) {
            signIn("credentials",{
                email: local.email,
                password: local.password,
                redirect:false  
            }).then((res) => {
                if (!res?.error){
                    router.push("/")
                    router.refresh()
                } else {
                    alert('Daftar berhasil tapi login otomatis gagala, login manual ya')
                }
            })
        }
    }, [serverState.success, local.email, local.password, router])

    const toggleMode = () => {
        setIsLogin(!isLogin)
        dispatch({ type: 'TOGGLE_MODE' })
    }

    const handleSignIn = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            const res = await signIn("credentials", {
                redirect: false,
                email: local.email,
                password: local.password,
            });

            if (res?.error) {
                dispatch({type: "SET_AUTH_ERROR", error: "Email atau password salah"})
            } else {
                router.push("/")
                router.refresh()
            }
        });
    }

    

    return (
        <div>
            <div className="flex flex-col mb-4 space-y-2">
                <h1 className="font-semibold text-4xl">
                    {!isLogin ? "Sign Up" : "Sign In"}
                </h1>
                <p className="capitalize text-gray-500">sign in or sign up to your account !</p>

                {local.authError && (
                    <div className="bg-red-100 rounded-xl text-red-700 px-4 py-3 mb-4">
                        {local.authError}
                    </div>
                )}
            </div>

            <form onSubmit={isLogin ? handleSignIn : undefined} action={isLogin ? undefined : formAction} noValidate>
                {/* NAME */}
                {!isLogin && (
                    <div className="mb-4">
                        <input
                            value={local.name}
                            onChange={(e) => dispatch({ type: 'SET_FIELD', field: "name", value: e.target.value })}
                            name="name"
                            type="text"
                            placeholder="Name"
                            className="border border-gray-100 p-2 rounded-sm w-full focus:border-blue-300"
                        />
                        {local.displayErrors?.name?.[0] && (
                            <p className="text-red-500 text-sm mt-2 text-center">{local.displayErrors.name[0]}</p>
                        )}
                    </div>
                )}

                {/* EMAIL */}
                <div className="mb-4">
                    <input
                        value={local.email}
                        onChange={(e) => dispatch({ type: "SET_FIELD", field: "email", value: e.target.value })}
                        name="email"
                        type="email"
                        placeholder="Email"
                        className="border border-gray-100 p-2 rounded-sm w-full focus:border-blue-300"
                    />
                    {local.displayErrors?.email?.[0] && (
                        <p className="text-sm text-red-500 mt-2 text-center">{local.displayErrors.email[0]}</p>
                    )}
                </div>

                {/* PASSWORD */}
                <div className="mb-4 relative">
                    <input
                        type={local.showPassword ? "text" : "password"}
                        value={local.password}
                        onChange={(e) => dispatch({ type: "SET_FIELD", field: "password", value: e.target.value })}
                        name="password"
                        placeholder="*******"
                        className="border border-gray-100 p-2 rounded-sm w-full focus:border-blue-300"
                    />
                    <button
                        type="button"
                        onClick={() => dispatch({ type: "TOGGLE_PASSWORD", which: "password" })}
                        className="absolute right-3 top-1/3"
                    >
                        {local.showPassword ? <IoEyeOffOutline size={20} /> : <IoEye size={20} />}
                    </button>
                    {local.displayErrors?.password?.[0] && (
                        <p className="text-sm text-red-500 mt-2 text-center">{local.displayErrors.password[0]}</p>
                    )}
                </div>

                {/* CONFIRM PASSWORD */}
                {!isLogin && (
                    <div className="mb-4 relative">
                        <input
                            type={local.showConfirm ? "text" : "password"}
                            value={local.confirmPassword}
                            onChange={(e) => dispatch({ type: "SET_FIELD", field: 'confirmPassword', value:e.target.value })}
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            className="border border-gray-100 p-2 rounded-sm w-full focus:border-blue-300"
                        />
                        <button
                            type="button"
                            onClick={() => dispatch({ type: "TOGGLE_PASSWORD", which: 'confirm'})}
                            className="absolute right-3 top-1/3"
                        >
                            {local.showConfirm ? <IoEyeOffOutline size={20} /> : <IoEye size={20} />}
                        </button>
                        {local.displayErrors?.confirmPassword?.[0] && (
                            <p className="mt-1 text-center rounded-2xl text-sm text-red-500">
                                {local.displayErrors.confirmPassword[0]}
                            </p>
                        )}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isPending}
                    className={clsx(
                        "bg-orange-500 w-full py-2 text-white hover:bg-orange-400 transition rounded font-semibold text-xl",
                        { "opacity-50 cursor-not-allowed": isPending }
                    )}
                >
                    {isPending ? "Memproses.." : isLogin ? "Sign In" : "Sign Up"}
                </button>
            </form>

            <div className="flex items-center justify-center my-6">
                <span className="text-lg text-gray-900">
                    {!isLogin ? "Sudah punya akun?" : "Belum punya Akun"}
                </span>
                <button onClick={toggleMode} className="ml-2 text-blue-700 font-semibold text-lg cursor-pointer">
                    {isLogin ? "Sign Up" : "Sign In"}
                </button>
            </div>

            <div className="flex items-center mb-4">
                <hr className="grow border-t border-gray-300" />
                <span className="text-sm text-gray-400 mx-3 select-none">ATAU</span>
                <hr className="grow border-t border-gray-300" />
            </div>
        </div>
    )
}

export default SignreduceForm