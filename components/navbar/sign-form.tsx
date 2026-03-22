"use client"

import { signupActions } from "@/lib/action";
import { FormState } from "@/type/signupType";
import { clsx } from "clsx";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState, useTransition } from "react";
import { IoEye, IoEyeOffOutline } from "react-icons/io5";
import { success } from "zod";

const SignForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);
    const [formError, setIsFormError] = useState<FormState["errors"]>({})
    // const [errors, setErrors] = u seState<Record<string, string>>({});
    // const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const initialState: FormState = {
        success: false,
        message: "",
        errors: {}
    }
    const [state, formAction, isPendingsignup] = useActionState(signupActions, initialState)
    
    useEffect(() => {
        if (!isLogin) {
            setIsFormError(state.errors || {})
        }
    }, [state.errors, isLogin]);

    useEffect(() => {
        setIsFormError({})
    }, [isLogin])

    useEffect(() => {
        if (state.success && !isLogin) {
            signIn("credentials", {
                email,
                password,
                redirect: false,
            }).then((res) => {
                if (!res?.error) {
                    router.push("/");
                    router.refresh();
                }
                else alert(`Daftar berhasil email:${email}, tapi login otomatis gagal, login manual ya`)
            })
        }
    }, [state, success, email, password, router, isLogin]);

    const [isPendingsignin, startTransition] = useTransition();

    const handleSignIn = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            const res = await signIn("credentials", {
                email, password, redirect: false,
            });

            if (res?.error) {
                setAuthError("Email atau password salah")
            } else {
                router.push("/")
                router.refresh()
            }
        });
    };

    const isPending = isLogin ? isPendingsignin : isPendingsignup;

    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault()
    //     setIsLoading(true);
    //     setErrors({});

    //     if (isLogin) {
    //         const res = await signIn("credentials", {
    //             email, password, redirect: false
    //         })
    //         if (res?.error) {
    //             setErrors({ email: "Email atau password salah" })
    //         } else { router.push("/") }
    //     }
    //     else {
    //         const data = { name, email, password, confirmPassword }
    //         const validated = SignupSchema.safeParse(data);
    //         if (!validated.success) {
    //             const fieldErrors = validated.error.flatten().fieldErrors;

    //             setErrors({
    //                 name: fieldErrors.name?.[0] || "",
    //                 email: fieldErrors.email?.[0] || "",
    //                 password: fieldErrors.password?.[0] || "",
    //                 confirmPassword: fieldErrors.confirmPassword?.[0] || "",
    //             });
    //             setIsLoading(false);
    //             return;
    //         }

    //         const resApi = await fetch("/api/auth/signup/", {
    //             method: "POST",
    //             headers: { "Contents-Type": "application/json" },
    //             body: JSON.stringify(data),
    //         });

    //         const json = await resApi.json()
    //         if (!resApi.ok) {

    //             const errorMsg = typeof json.error === "string"
    //                 ? json.error
    //                 : JSON.stringify(json.error);

    //             setErrors({ email: errorMsg });
    //             setIsLoading(false);
    //             return;
    //         }

    //         const resLogin = await signIn("credentials", {
    //             email, password, redirect: false,
    //         });

    //         if (resLogin.error) {
    //             setErrors({ email: "ada kesalahan sistem" })
    //         } else {
    //             router.push("/")
    //         }
    //     }
    //     setIsLoading(false)
    // }
    const toggleMode = () => {
        setIsLogin(!isLogin);
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setShowPassword(false);
        setShowConfirm(false);
        setAuthError(null);
    }


    return (
        <div>
            <div className="flex flex-col mb-4 space-y-2 ">
                <h1 className="font-semibold text-4xl">
                    {!isLogin ? "Sign Up" : "Sign In"}
                </h1>

                <p className="capitalize text-gray-500">sign in or sig up to your account !</p>
                {authError && (
                    <div className="bg-red-100 rounded-xl text-red-700 px-4 py-3 mb-4">
                        {authError}
                    </div>
                )}
            </div>
            <form onSubmit={isLogin ? handleSignIn : undefined}
                action={isLogin ? undefined : formAction} noValidate>
                {!isLogin && (
                    <div className="mb-4">
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            type="text" name="name"
                            placeholder="Name"
                            className="border border-gray-100 p-2 rounded-sm w-full focus:border-blue-300 " />
                        {formError?.name?.[0] && <p className="text-red-500 text-sm mt-2 text-center">{formError.name[0]}</p>}
                    </div>
                )}
                <div className="mb-4">
                    <input type="email" name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="border border-gray-100 p-2 rounded-sm w-full focus:border-blue-300" />
                    {formError?.email?.[0] && <p className="text-sm text-red-500 mt-2 text-center">{formError.email[0]}</p>}
                </div>
                <div className="mb-4 relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="*******"
                        className="border border-gray-100 p-2 rounded-sm w-full focus:border-blue-300" />
                    {formError?.password?.[0] && <p className="text-sm text-red-500 mt-2 text-center">{formError.password[0]}</p>}
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/3">
                        {showPassword ? <IoEyeOffOutline size={20} /> : <IoEye size={20} />}
                    </button>
                </div>
                {!isLogin && (
                    <div className="mb-4 relative">
                        <input
                            type={showConfirm ? "text" : "password"}
                            name="confirmPassword"
                            // required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm Password"
                            className="border border-gray-100 p-2 rounded-sm w-full focus:border-blue-300"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-3 top-1/3"
                        >
                            {showConfirm ? <IoEyeOffOutline size={20} /> : <IoEye size={20} />}
                        </button>
                        {formError?.confirmPassword?.[0] && <p className=" mt-1  text-center rounded-2xl text-sm text-red-500">{formError.confirmPassword[0]}</p>}
                    </div>
                )}
                <button
                    type="submit"
                    disabled={isPending}
                    className={clsx("bg-orange-500 w-full py-2 text-white hover:bg-orange-400 transition rounded font-semibold text-xl",
                        { "opacity-50 cursor-not-allowed": isPending }
                    )}>
                    {isPending ? "Memproses.." : isLogin ? " Sign In" : " Sign Up "}
                </button>
            </form>
            <div className="flex items-center justify-center my-6" >
                <span className="text-lg text-gray-900">
                    {!isLogin ? "Sudah punya akun?" : "Belum punya Akun"}
                </span>
                <button
                    onClick={toggleMode}
                    className="ml-2 text-blue-700 font-semibold text-lg cursor-pointer">
                    {isLogin ? "Sign Up" : "Sign In"}
                </button>
            </div>
            <div className="flex items-center mb-4" >
                <hr className="grow border-t border-gray-300" />
                <span className="text-sm text-gray-400 mx-3 select-none">ATAU</span>
                <hr className="grow border-t border-gray-300" />
            </div>
        </div>
    )
}

export default SignForm