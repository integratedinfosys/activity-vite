import { ReactElement, useContext, useEffect, useRef, useState } from "react"
import Spinner from "../components/Spinner"
import withAuth from "../components/withAuth"
import { Database } from "../types/supabase"
import { supabase } from "../utils/supabaseClient"
import CategoryLineItem from "../components/categories/category.line.item"
import { toast } from "react-toastify"
import useCategoryStore from "../store/category.store"
import ModalTransparent from "../components/ModalTransparent"
import Modal from "../components/Modal"
import CreateCategory from "../components/categories/create.category"
import ModalSmall from "../components/ModalSmall"
import { UserInfoContext } from "../utils/user-context"

type Element = Database['public']['Tables']['categories']['Row']
export type Category = Element;

function Categories() {
    const categoryStore = useCategoryStore();
    const { session } = useContext(UserInfoContext)
    const user_id = session?.user.id
    const [openCategoryModal, setOpenCategoryModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const { categories, setCategories, isCategoryStoreLoaded, setIsCategoryStoreLoaded } = useCategoryStore();
    const [openMessageModal, setOpenMessageModal] = useState(false);
    const modalInfo = useRef<{
        modalHeader: string | null,
        modalContent: string | null,
        okClicked: ((e: any) => void) | null,
        okText: string | undefined,
        cancelClicked: ((e: any) => void) | null
        cancelText: string | undefined,
    }>({ modalHeader: null, modalContent: null, okClicked: null, okText: undefined, cancelClicked: null, cancelText: undefined })

    const getCategories = async ({ page, limit }: { page: number; limit: number }) => {
        if (isCategoryStoreLoaded) {
            return
        }
        setLoading(true)
        const { data: fetchedData, error } = await supabase
            .from('categories')
            .select()
        if (error) {
            toast.error(error.message, {
                position: "bottom-right",
            });
            setLoading(false)
        } else {
            setCategories(fetchedData);
            setIsCategoryStoreLoaded(true)
            setLoading(false)
            //The following has to be done here because there is a delay in setting categories by zustlands  
            if (fetchedData.length == 0) {
                modalInfo.current.modalHeader = 'Create Some Categories'
                modalInfo.current.modalContent = "Should we create some categories for you as a starting point? You may modify them later to your choice."
                modalInfo.current.okClicked = async () => await createDefaultCategories()
                modalInfo.current.okText = "Go ahead!"
                modalInfo.current.cancelClicked = () => null
                modalInfo.current.cancelText = "Skip!"
                setOpenMessageModal(true);
            }
        }
    }

    const createDefaultCategories = async () => {

        try {
            setLoading(true)
            const { data: insertedData1 } = await supabase
                .from('categories')
                .insert({ name: "Desk Work", user_id: user_id! })
                .select();
            categoryStore.createCategory(insertedData1![0]);
            const { data: insertedData2 } = await supabase
                .from('categories')
                .insert({ name: "Physical Exercise", user_id: user_id! })
                .select();
            categoryStore.createCategory(insertedData2![0]);
            const { data: insertedData3 } = await supabase
                .from('categories')
                .insert({ name: "Entertainment", user_id: user_id! })
                .select();
            categoryStore.createCategory(insertedData3![0]);
            toast.info("Categories Created", {
                position: "bottom-right",
            });
        } catch (error: any) {
            modalInfo.current.modalHeader = 'Error occurred in Creating Categories!'
            modalInfo.current.modalContent = error.message
            modalInfo.current.okClicked = null
            setOpenMessageModal(true);
        } finally {
            setLoading(false)
        }

    }

    useEffect(() => {
        getCategories({ page: 1, limit: 10 })
    }, []);

    return (
        <>
            {/* bg-gray-100 */}
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center sticky top-0 z-30 bg-gray-100 bg-opacity-100">

                    <div className="flex-auto">
                        <h1 className="text-xl font-semibold text-gray-900">Categories</h1>
                        {/* Suresh Added hidden md:block  */}
                        <p className="mt-2 text-sm text-gray-700 hidden sm:block">
                            A list of all the categories for your activities</p>
                    </div>
                    {/* <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none"> */}
                    <div className="mt-4 sm:ml-16 sm:flex-none">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                            onClick={() => { setOpenCategoryModal(true) }}
                        >
                            Add
                        </button>
                    </div>
                </div>

                <div className="mt-4 flex flex-col">
                    <div className="-my-2 -mx-4 sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle">
                            <div className="shadow-sm ring-1 ring-black ring-opacity-5">
                                <table className="min-w-full border-separate" style={{ borderSpacing: 0 }}>
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="sticky top-20 mt-20 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                                            >
                                                Name
                                            </th>

                                            <th
                                                scope="col"
                                                className="sticky top-20 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pr-4 pl-3 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
                                            >
                                                <span className="sr-only">Edit</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white">
                                        {categories.map((element) => (
                                            <CategoryLineItem key={element.id} category={element} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ModalTransparent
                openModal={loading}
                setOpenModal={setLoading}
                isDismissable={false}
            >
                <Spinner />
            </ModalTransparent>
            <Modal
                openModal={openCategoryModal}
                setOpenModal={setOpenCategoryModal}
            >
                <CreateCategory setOpenCategoryModal={setOpenCategoryModal} />
            </Modal>
            <ModalTransparent
                openModal={openMessageModal}
                setOpenModal={setOpenMessageModal}
                isDismissable={true}
            >
                <ModalSmall heading={modalInfo.current.modalHeader!} content={modalInfo.current.modalContent!} okText={modalInfo.current.okText} okClicked={modalInfo.current.okClicked!} cancelText={modalInfo.current.cancelText} setOpenModalWindow={setOpenMessageModal} />
            </ModalTransparent>
        </>
    )
}

export default withAuth(Categories)
