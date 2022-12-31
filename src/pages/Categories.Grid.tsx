import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CategoryModal from "../components/Modal";
import CreateCategory from "../components/categories/create.category";
import CategoryItem from "../components/categories/category.component";
import useCategoryStore from "../store/category.store";
import { supabase } from "../utils/supabaseClient";
import withAuth from "../components/withAuth";
import ModalTransparent from "../components/ModalTransparent";
import Spinner from "../components/Spinner";


function CategoriesGrid() {
    const [openCategoryModal, setOpenCategoryModal] = useState(false);
    const { categories, setCategories, isCategoryStoreLoaded, setIsCategoryStoreLoaded } = useCategoryStore();
    const [loading, setLoading] = useState(false);
    const getCategories = async ({ page, limit }: { page: number; limit: number }) => {
        if (isCategoryStoreLoaded) {
            return
        }
        setLoading(true);
        const { data: fetchedData, error } = await supabase
            .from('categories')
            .select()
        if (error) {
            toast.error(error.message, {
                position: "bottom-right",
            });
            setLoading(false);
        } else {
            setCategories(fetchedData);
            setIsCategoryStoreLoaded(true);
            setLoading(false);
        }
    }
    useEffect(() => {
        getCategories({ page: 1, limit: 10 });
    }, []);

    return (
        <div className="2xl:max-w-[90rem] max-w-[68rem] mx-auto">
            <div className="m-8 grid grid-cols-[repeat(auto-fill,_320px)] gap-7 grid-rows-[1fr]">
                <div className="p-4 min-h-[18rem] bg-white rounded-lg border border-gray-200 shadow-md flex flex-col items-center justify-center">
                    <div
                        onClick={() => setOpenCategoryModal(true)}
                        className="flex items-center justify-center h-20 w-20 border-2 border-dashed border-ct-blue-600 rounded-full text-ct-blue-600 text-5xl cursor-pointer"
                    >
                        <i className="bx bx-plus"></i>
                    </div>
                    <h4
                        onClick={() => setOpenCategoryModal(true)}
                        className="text-lg font-medium text-ct-blue-600 mt-5 cursor-pointer"
                    >
                        Add new category
                    </h4>
                </div>
                {/* Category Items */}

                {categories?.map((category) => (
                    <CategoryItem key={category.id} category={category} />
                ))}

                {/* Create Category Modal */}
                <CategoryModal
                    openModal={openCategoryModal}
                    setOpenModal={setOpenCategoryModal}
                >
                    <CreateCategory setOpenCategoryModal={setOpenCategoryModal} />
                </CategoryModal>
                <ModalTransparent
                    openModal={loading}
                    setOpenModal={setLoading}
                    isDismissable={false}
                >
                    <Spinner />
                </ModalTransparent>
            </div>
        </div>
    );
}

export default withAuth(CategoriesGrid)