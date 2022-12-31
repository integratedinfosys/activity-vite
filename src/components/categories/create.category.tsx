import { FC, useContext, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "../LoadingButton";
import { toast } from "react-toastify";
import useCategoryStore from "../../store/category.store";
import { supabase } from "../../utils/supabaseClient";
import { UserInfoContext } from "../../utils/user-context";
import ModalTransparent from "../ModalTransparent";
import Spinner from "../Spinner";

type ICreateCategoryProps = {
    setOpenCategoryModal: (open: boolean) => void;
};

const createCategorySchema = object({
    name: string().min(1, "Name is required"),
});

export type CreateCategoryInput = TypeOf<typeof createCategorySchema>;

const CreateCategory: FC<ICreateCategoryProps> = ({ setOpenCategoryModal }) => {
    const [loading, setLoading] = useState(false);
    const categoryStore = useCategoryStore();
    const methods = useForm<CreateCategoryInput>({
        resolver: zodResolver(createCategorySchema),
    });

    const { session } = useContext(UserInfoContext)
    const user_id = session?.user.id

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = methods;

    const createCategory = async (category: CreateCategoryInput) => {
        setLoading(true);

        const { data: insertedData, error } = await supabase
            .from('categories')
            .insert({ ...category, user_id: user_id! })
            .select()

        if (error) {
            // throw error ? error : "Something bad happended";
            setLoading(false);
            setOpenCategoryModal(false);
            toast.error(error.message, {
                position: "bottom-right",
            });
        } else {
            setLoading(false);
            setOpenCategoryModal(false);
            toast("Category created successfully", {
                type: "success",
                position: "bottom-right",
            });
            categoryStore.createCategory(insertedData[0]);
        }

    };

    const onSubmitHandler: SubmitHandler<CreateCategoryInput> = async (data) => {
        createCategory(data);
    };
    return (
        <section>
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
                <h2 className="text-2xl text-ct-dark-600 font-semibold">Create Category</h2>
                <div
                    onClick={() => setOpenCategoryModal(false)}
                    className="text-2xl text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg p-1.5 ml-auto inline-flex items-center cursor-pointer"
                >
                    <i className="bx bx-x"></i>
                </div>
            </div>
            <form className="w-full" onSubmit={handleSubmit(onSubmitHandler)}>
                <div className="mb-2">
                    <label className="block text-gray-700 text-lg mb-2" htmlFor="name">
                        Name
                    </label>
                    <input
                        className={twMerge(
                            `appearance-none border border-gray-400 rounded w-full py-3 px-3 text-gray-700 mb-2  leading-tight focus:outline-none`,
                            `${errors["name"] && "border-red-500"}`
                        )}
                        {...methods.register("name")}
                    />
                    <p
                        className={twMerge(
                            `text-red-500 text-xs italic mb-2 invisible`,
                            `${errors["name"] && "visible"}`
                        )}
                    >
                        {errors["name"]?.message as string}
                    </p>
                </div>
                <LoadingButton loading={loading}>Create Category</LoadingButton>
            </form>
            <ModalTransparent
                openModal={loading}
                setOpenModal={setLoading}
                isDismissable={false}
            >
                <Spinner />
            </ModalTransparent>
        </section>
    );
};

export default CreateCategory;
