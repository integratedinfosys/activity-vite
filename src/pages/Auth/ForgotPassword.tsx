import { useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import validator from "validator";
import { supabase } from "../../utils/supabaseClient";
import Spinner from "../../components/Spinner";
import ModalSmall from "../../components/ModalSmall";
import { useNavigate } from "react-router-dom";
import { FormLabel, FormInput, HighlightedMessage } from "../../styles/CSSClasses";
import ModalTransparent from "../../components/ModalTransparent";
import { LoadingButton } from "../../components/LoadingButton";

type Inputs = {
    email: string,
};

export default function ForgotPassword() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [openMessageModal, setOpenMessageModal] = useState(false);
    const modalInfo = useRef<{
        modalHeader: string | null,
        modalContent: string | null,
        okClicked: ((e: any) => void) | null
    }>({ modalHeader: null, modalContent: null, okClicked: null })

    const { register, watch, handleSubmit, formState: { errors } } = useForm<Inputs>();
    // const onSubmit = (data: Inputs) => console.log(data);
    const onSubmit: SubmitHandler<Inputs> = async formData => {
        setLoading(true);
        const { email } = formData
        const { data, error } = await supabase.auth.resetPasswordForEmail(
            email
        )
        if (error) {
            modalInfo.current.modalHeader = 'An error has occurred!'
            modalInfo.current.modalContent = error.message
            modalInfo.current.okClicked = null
            setOpenMessageModal(true);
        } else {
            modalInfo.current.modalHeader = 'Mail sent!'
            modalInfo.current.modalContent = "We have sent you a password rest mail to your mail id. Follow the link."
            modalInfo.current.okClicked = () => navigate('/')
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
                        <h1 className="text-3xl font-semibold text-gray-700">Forgot Password</h1>
                        <p className="text-gray-500">Get a password reset Email</p>
                    </div>
                    {/*  sign-in  */}
                    <div className="m-6">
                        <form className="mb-4" onSubmit={handleSubmit(onSubmit)}>
                            {/* email  */}
                            <div>
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
                            </div>
                            <div className="mb-6">
                                <LoadingButton loading={loading}>Get Mail</LoadingButton>
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
                <ModalSmall heading={modalInfo.current.modalHeader!} content={modalInfo.current.modalContent!} okText="Ok" okClicked={modalInfo.current.okClicked!} setOpenModalWindow={setOpenMessageModal} />
            </ModalTransparent>
        </>
    )
}
