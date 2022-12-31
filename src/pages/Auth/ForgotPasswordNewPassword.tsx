import { useRef, useState } from "react";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useForm, SubmitHandler } from "react-hook-form";
import { supabase } from "../../utils/supabaseClient";
import Spinner from "../../components/Spinner";
import ModalSmall from "../../components/ModalSmall";
import { useNavigate } from "react-router-dom";
import { FormLabel, FormInput, HighlightedMessage } from "../../styles/CSSClasses";
import { toast } from "react-toastify";
import ModalTransparent from "../../components/ModalTransparent";
import { LoadingButton } from "../../components/LoadingButton";

type Inputs = {
    password: string,
    confirm_pwd: string
};

export default function ForgotPasswordNewPassword() {
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
        const { password } = formData
        const { data, error } = await supabase.auth.updateUser({
            password
        })
        if (error) {
            modalInfo.current.modalHeader = 'Error occurred in setting new password!'
            modalInfo.current.modalContent = error.message
            modalInfo.current.okClicked = null
            setOpenMessageModal(true);
        } else {
            toast("Your new password is set. Logging In!")
            navigate('/welcome')
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
                        <h1 className="text-3xl font-semibold text-gray-700">New Password</h1>
                        <p className="text-gray-500">Set new password to your account</p>
                    </div>
                    {/*  sign-in  */}
                    <div className="m-6">
                        <form className="mb-4" onSubmit={handleSubmit(onSubmit)}>
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
                                <LoadingButton loading={loading}>Set Password</LoadingButton>
                            </div>
                        </form>
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
