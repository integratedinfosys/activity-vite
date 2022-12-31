import { useContext, useRef, useState } from "react";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useForm, SubmitHandler } from "react-hook-form";
import validator from "validator";
import { supabase } from "../../utils/supabaseClient";
import Spinner from "../../components/Spinner";
import ModalSmall from "../../components/ModalSmall";
import { Link, useNavigate } from "react-router-dom";
import { FormLabel, FormInput, HighlightedMessage } from "../../styles/CSSClasses";
import ModalTransparent from "../../components/ModalTransparent";
import { LoadingButton } from "../../components/LoadingButton";

type Inputs = {
    email: string,
    password: string,
    confirm_pwd: string
};

export default function Register() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [openMessageModal, setOpenMessageModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const modalInfo = useRef<{
        modalHeader: string | null,
        modalContent: string | null,
        okClicked: ((e: any) => void) | null
    }>({ modalHeader: null, modalContent: null, okClicked: null })

    const { register, watch, handleSubmit, formState: { errors } } = useForm<Inputs>();
    // const onSubmit = (data: Inputs) => console.log(data);
    const onSubmit: SubmitHandler<Inputs> = async formData => {
        setLoading(true);
        const { email, password } = formData
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        })
        if (error) {
            modalInfo.current.modalHeader = 'Error occurred in Registration!'
            modalInfo.current.modalContent = error.message
            modalInfo.current.okClicked = null
            setOpenMessageModal(true);
        } else {
            modalInfo.current.modalHeader = 'Registration Successful!'
            modalInfo.current.modalContent = "We have sent you a confirmation mail to your mail id. Please visit your mail bnox and click on the link before you login."
            modalInfo.current.okClicked = () => navigate('/login')
            setOpenMessageModal(true);
        }
        setLoading(false);
    };

    return (
        <>
            {/* component */}
            <div className="flex justify-center bg-gray-100">
                <div className="container my-auto max-w-md border-2 border-gray-200 p-3 bg-white">
                    {/*  header  */}
                    <div className="text-center my-6">
                        <h1 className="text-3xl font-semibold text-gray-700">Register</h1>
                        <p className="text-gray-500">Register a new account</p>
                    </div>
                    {/*  sign-in  */}
                    <div className="m-6">
                        <form className="mb-4" onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-6">
                                <div className="flex justify-between mb-2">
                                    <label htmlFor="email" className={FormLabel}>Email Address</label>
                                </div>
                                <input type="email" id="email" placeholder="Your email address" className={FormInput}
                                    {...register('email', {
                                        required: true, maxLength: 35, validate: {
                                            isEmail: (value) => validator.isEmail(value) || "invalid",
                                        }
                                    })} />
                                {errors.email && (
                                    < p > A < span className={` ${errors.email?.type === 'isEmail' ? HighlightedMessage : ""}`}>valid Email</span> <span className={` ${errors.email?.type === 'maxLength' ? HighlightedMessage : ""}`}>of less than 35 characters</span> is <span className={` ${errors.email?.type === 'required' ? HighlightedMessage : ""}`}>required</span></p>
                                )}
                            </div>
                            <div className="mb-6">
                                <div className="flex justify-between mb-2">
                                    <label htmlFor="password" className={FormLabel}>Password</label>
                                </div>
                                <div className="relative items-center justify-end">
                                    <input type={showPassword ? "text" : "password"}
                                        id="password"
                                        placeholder="Your password"
                                        className={FormInput} {...register(
                                            'password',
                                            { required: true, minLength: 6, maxLength: 35 }
                                        )} />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <EyeIcon className="h-6 w-6" aria-hidden="true" /> :
                                            <EyeSlashIcon className="h-6 w-6" aria-hidden="true" />}
                                    </div>
                                </div>
                                {errors.password && (
                                    <p>A password of at <span className={` ${errors.password?.type === 'minLength' ? HighlightedMessage : ""}`}>least 6</span> and of <span className={` ${errors.password?.type === 'maxLength' ? HighlightedMessage : ""}`}>less than 35</span> characters is <span className={` ${errors.password?.type === 'required' ? HighlightedMessage : ""}`}>required</span>.</p>
                                )}
                            </div>
                            <div className="mb-6">
                                <div className="flex justify-between mb-2">
                                    <label htmlFor="confirm_pwd" className={FormLabel}>Confirm Password</label>
                                </div>
                                <div className="relative items-center justify-end">
                                    <input type={showConfirmPassword ? "text" : "password"}
                                        id="confirm_pwd"
                                        placeholder="Repeat password"
                                        className={FormInput} {...register('confirm_pwd', {
                                            required: true,
                                            validate: {
                                                matchPwd: (val: string) => {
                                                    if (watch('password') != val) {
                                                        return "Your passwords do no match";
                                                    }
                                                }
                                            },
                                        })} />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                        {showConfirmPassword ? <EyeIcon className="h-6 w-6" aria-hidden="true" /> :
                                            <EyeSlashIcon className="h-6 w-6" aria-hidden="true" />}
                                    </div>
                                </div>
                                {errors.confirm_pwd && (
                                    <p>Retype the password here to cofirm. <span className={` ${errors.confirm_pwd?.type === 'required' ? HighlightedMessage : ""}`}>Confirm password is required.</span> <span className={` ${errors.confirm_pwd?.type === 'matchPwd' ? HighlightedMessage : ""}`}>Your password and confirm password must match.</span></p>
                                )}
                            </div>
                            <div className="mb-6">
                                <LoadingButton loading={loading}>Register</LoadingButton>
                            </div>
                            <p className="text-sm text-center text-gray-400">
                                Already have an account?
                                <Link to="/login" className="px-1 font-semibold text-indigo-500 focus:text-indigo-600 focus:outline-none focus:underline">Login</Link>
                            </p>
                        </form>
                        {/*  seperator  */}
                        <div className="flex flex-row justify-center mb-8">
                            <span className="absolute bg-white px-4 text-gray-500">or sign-in with</span>
                            <div className="w-full bg-gray-200 mt-3 h-px"></div>
                        </div>
                        {/*  alternate sign-in  */}
                        <div className="flex flex-row gap-2">
                            <button className="bg-green-500 text-white w-full p-2 flex flex-row justify-center gap-2 items-center rounded-sm hover:bg-green-600 duration-100 ease-in-out">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" className="w-5" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12c6.627 0 12-5.373 12-12S18.627 0 12 0zm.14 19.018c-3.868 0-7-3.14-7-7.018c0-3.878 3.132-7.018 7-7.018c1.89 0 3.47.697 4.682 1.829l-1.974 1.978v-.004c-.735-.702-1.667-1.062-2.708-1.062c-2.31 0-4.187 1.956-4.187 4.273c0 2.315 1.877 4.277 4.187 4.277c2.096 0 3.522-1.202 3.816-2.852H12.14v-2.737h6.585c.088.47.135.96.135 1.474c0 4.01-2.677 6.86-6.72 6.86z" fill="currentColor" /></g></svg>
                                Google
                            </button>
                            <button className="bg-gray-700 text-white w-full p-2 flex flex-row justify-center gap-2 items-center rounded-sm hover:bg-gray-800 duration-100 ease-in-out">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" className="w-5" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385c.6.105.825-.255.825-.57c0-.285-.015-1.23-.015-2.235c-3.015.555-3.795-.735-4.035-1.41c-.135-.345-.72-1.41-1.23-1.695c-.42-.225-1.02-.78-.015-.795c.945-.015 1.62.87 1.845 1.23c1.08 1.815 2.805 1.305 3.495.99c.105-.78.42-1.305.765-1.605c-2.67-.3-5.46-1.335-5.46-5.925c0-1.305.465-2.385 1.23-3.225c-.12-.3-.54-1.53.12-3.18c0 0 1.005-.315 3.3 1.23c.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23c.66 1.65.24 2.88.12 3.18c.765.84 1.23 1.905 1.23 3.225c0 4.605-2.805 5.625-5.475 5.925c.435.375.81 1.095.81 2.22c0 1.605-.015 2.895-.015 3.3c0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" fill="currentColor" /></g></svg>
                                Github
                            </button>
                        </div>
                    </div>
                </div>
            </div >
            <ModalTransparent
                openModal={loading}
                setOpenModal={setLoading}
                isDismissable={false}
            >
                <Spinner />
            </ModalTransparent>
            <ModalTransparent
                openModal={openMessageModal}
                setOpenModal={setOpenMessageModal}
                isDismissable={true}
            >
                {/* <ModalSmall heading="Error occurred in registration" content={errorMessage!} okText="Ok" okClicked={(e) => console.log('Ok clicked')} cancelText="Cancel" cancelClicked={(e) => console.log('Cancel Clicked')} setOpenModalWindow={setOpenMessageModal} /> */}
                <ModalSmall heading={modalInfo.current.modalHeader!} content={modalInfo.current.modalContent!} okText="Ok" okClicked={modalInfo.current.okClicked!} setOpenModalWindow={setOpenMessageModal} />
            </ModalTransparent>
        </>
    )
}
