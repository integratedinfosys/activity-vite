import { FC, useState } from "react";
import { format, parseISO } from "date-fns";
import { twMerge } from "tailwind-merge";
import CategoryModal from "../Modal";
import UpdateCategory from "./update.category";
import { toast } from "react-toastify";
import { ICategory } from "../../types";
import useCategoryStore from "../../store/category.store";
import { supabase } from "../../utils/supabaseClient";
import ModalTransparent from "../ModalTransparent";
import Spinner from "../Spinner";


type CategoryItemProps = {
    category: ICategory;
    setOpenParentModal?: (open: boolean) => void;
};

const CategoryItem: FC<CategoryItemProps> = ({ category, setOpenParentModal }) => {
    const categoryStore = useCategoryStore();
    const [openSettings, setOpenSettings] = useState(false);
    const [openCategoryModal, setOpenCategoryModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const deleteCategory = async (categoryId: number) => {
        setLoading(true);
        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', categoryId)
        if (error) {
            setOpenCategoryModal(false);
            toast.error(error.message, {
                position: "bottom-right",
            });
            setLoading(false)
        } else {
            categoryStore.deleteCategory(categoryId);
            setOpenCategoryModal(false);
            setLoading(false)
            toast("Category deleted successfully", {
                type: "warning",
                position: "bottom-right",
            });
        }
    };

    const onDeleteHandler = (categoryId: number) => {
        if (window.confirm("Are you sure")) {
            deleteCategory(categoryId);
        }
    };
    return (
        <>
            <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-md flex flex-col justify-between overflow-hidden ">
                <div className="details">
                    <h4 className="mb-2 pb-2 text-2xl font-semibold tracking-tight text-gray-900">
                        {category.name.length > 40
                            ? category.name.substring(0, 40) + "..."
                            : category.name}
                    </h4>
                    <p className="mb-3 font-normal text-ct-dark-200">
                        {/* Have it to accomodate menu  */}
                        {/* {note.content.length > 210
              ? note.content.substring(0, 210) + "..."
              : note.content} */}
                        &nbsp;
                    </p>
                </div>
                <div className="relative border-t border-slate-300 flex justify-between items-center">
                    <span className="text-ct-dark-100 text-sm">
                        {format(parseISO(String(category.inserted_at)), "PPP")}
                    </span>
                    <div
                        onClick={() => setOpenSettings(!openSettings)}
                        className="text-ct-dark-100 text-lg cursor-pointer"
                    >
                        <i className="bx bx-dots-horizontal-rounded"></i>
                    </div>
                    <div
                        id="settings-dropdown"
                        className={twMerge(
                            `absolute right-0 bottom-3 z-10 w-28 text-base list-none bg-white rounded divide-y divide-gray-100 shadow`,
                            `${openSettings ? "block" : "hidden"}`
                        )}
                    >
                        <ul className="py-1" aria-labelledby="dropdownButton">
                            <li
                                onClick={() => {
                                    setOpenSettings(false);
                                    setOpenCategoryModal(true);
                                }}
                                className="py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            >
                                <i className="bx bx-pencil"></i> Edit
                            </li>
                            <li
                                onClick={() => {
                                    setOpenSettings(false);
                                    onDeleteHandler(category.id);
                                }}
                                className="py-2 px-4 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
                            >
                                <i className="bx bx-trash"></i> Delete
                            </li>
                            <li
                                onClick={() => {
                                    setOpenSettings(false);
                                    if (!!setOpenParentModal) {
                                        setOpenParentModal(false)
                                    }

                                }}
                                className="py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            >
                                <i className="bx bx-trash"></i> Done
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <CategoryModal
                openModal={openCategoryModal}
                setOpenModal={setOpenCategoryModal}
            >
                <UpdateCategory category={category} setOpenCategoryModal={setOpenCategoryModal} />
            </CategoryModal>
            <ModalTransparent
                openModal={loading}
                setOpenModal={setLoading}
                isDismissable={false}
            >
                <Spinner />
            </ModalTransparent>
        </>
    );
};

export default CategoryItem;
