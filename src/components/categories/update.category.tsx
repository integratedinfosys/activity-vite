import { FC, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "../LoadingButton";
import { toast } from "react-toastify";
import { ICategory } from "../../types";
import useCategoryStore from "../../store/category.store";
import { supabase } from "../../utils/supabaseClient";
import ModalTransparent from "../ModalTransparent";
import Spinner from "../Spinner";

type IUpdateCategoryProps = {
    category: ICategory;
    setOpenCategoryModal: (open: boolean) => void;
};

const updateCategorySchema = object({
    name: string().min(1, "Name is required"),
});

export type UpdateCategoryInput = TypeOf<typeof updateCategorySchema>;

const UpdateCategory: FC<IUpdateCategoryProps> = ({ category, setOpenCategoryModal }) => {
    const [loading, setLoading] = useState(false);
    const categoryStore = useCategoryStore();
    const methods = useForm<UpdateCategoryInput>({
        resolver: zodResolver(updateCategorySchema),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = methods;

    useEffect(() => {
        if (category) {
            methods.reset({ name: category.name });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateCategory = async ({
        id,
        newCategory,
    }: {
        id: number;
        newCategory: UpdateCategoryInput;
    }) => {
        try {
            setLoading(true);
            const { error } = await supabase
                .from('categories')
                .update(newCategory)
                .eq('id', id)

            if (error) {
                setLoading(false);
                setOpenCategoryModal(false);
                toast.error(error.message, {
                    position: "bottom-right",
                });
            } else {
                setLoading(false);
                setOpenCategoryModal(false);
                toast("Category updated successfully", {
                    type: "success",
                    position: "bottom-right",
                });
                categoryStore.updateCategory({ ...category, ...newCategory });
            }
        } catch (error: any) {

        }
    };

    const onSubmitHandler: SubmitHandler<UpdateCategoryInput> = async (data) => {
        updateCategory({ id: category.id, newCategory: data });
    };
    return (
        <section>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl text-ct-dark-600 font-semibold">Update Category</h2>
                <div
                    onClick={() => setOpenCategoryModal(false)}
                    className="text-2xl text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg p-1.5 ml-auto inline-flex items-center cursor-pointer"
                >
                    <i className="bx bx-x"></i>
                </div>
            </div>{" "}
            <form className="w-full" onSubmit={handleSubmit(onSubmitHandler)}>
                <div className="mb-2">
                    <label className="block text-gray-700 text-lg mb-2" htmlFor="name">
                        Name
                    </label>
                    <input
                        className={twMerge(
                            `appearance-none border border-gray-400 rounded w-full py-3 px-3 text-gray-700 mb-2 leading-tight focus:outline-none`,
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
                <LoadingButton loading={loading}>Update Category</LoadingButton>
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

export default UpdateCategory;
