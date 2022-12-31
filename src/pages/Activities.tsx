import { ReactElement, useEffect, useRef, useState } from "react"
import Spinner from "../components/Spinner"
import withAuth from "../components/withAuth"
import { Database } from "../types/supabase"
import { supabase } from "../utils/supabaseClient"
import ActivityLineItem from "../components/activities/activity.line.item"
import { toast } from "react-toastify"
import useActivityStore from "../store/activity.store"
import ModalTransparent from "../components/ModalTransparent"
import Modal from "../components/Modal"
import CreateActivity from "../components/activities/create.activity"
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import useCategoryStore from "../store/category.store"
import { useNavigate } from "react-router-dom"
import ModalSmall from "../components/ModalSmall"
import ActivitySummary from "../components/activities/activity.summary"

type Element = Database['public']['Tables']['activities']['Row']
export type Activity = Element;

function Activities() {
    const navigate = useNavigate()
    const [openActivityModal, setOpenActivityModal] = useState(false);
    const [openActivitySummaryModal, setOpenActivitySummaryModal] = useState(false)
    const [openMessageModal, setOpenMessageModal] = useState(false);
    const modalInfo = useRef<{
        modalHeader: string | null,
        modalContent: string | null,
        okClicked: ((e: any) => void) | null
    }>({ modalHeader: null, modalContent: null, okClicked: null })
    const [loading, setLoading] = useState(false);
    // https://stackoverflow.com/questions/14245339/pre-populating-date-input-field-with-javascript
    const d = new Date();
    const datestring = d.getFullYear().toString().padStart(4, '0') + '-' + (d.getMonth() + 1).toString().padStart(2, '0') + '-' + d.getDate().toString().padStart(2, '0');

    const [activity_d, setactivity_d] = useState(datestring)

    const { activities, setActivities } = useActivityStore();
    const { categories, setCategories, isCategoryStoreLoaded, setIsCategoryStoreLoaded } = useCategoryStore();

    useEffect(() => {
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
                if (fetchedData.length == 0) {
                    modalInfo.current.modalHeader = 'Create Categories'
                    modalInfo.current.modalContent = 'You don\'t have any categories yet. Create at least one category to create activities.'
                    modalInfo.current.okClicked = () => navigate('/categories')
                    setOpenMessageModal(true);
                }
            }
        }

        const getActivities = async ({ page, limit }: { page?: number; limit?: number }) => {
            setLoading(true)
            const { data: fetchedData, error } = await supabase
                .from('activities')
                .select()
                .eq('activity_d', activity_d)
            if (error) {
                toast.error(error.message, {
                    position: "bottom-right",
                });
                setLoading(false)
            } else {
                setActivities(fetchedData);
                setLoading(false)
            }
        }

        const fetchData = async () => {
            // await getCategories({ page: 1, limit: 10 })
            //     .then(() => getActivities({ page: 1, limit: 10 }))
            await getCategories({ page: 1, limit: 10 })
            await getActivities({ page: 1, limit: 10 })
        };
        fetchData();
    }, [activity_d]);

    return (
        <>
            {/* bg-gray-100 */}
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center sticky top-0 z-30 bg-gray-100 bg-opacity-100">

                    <div className="flex-auto">
                        <h1 className="text-xl font-semibold text-gray-900">Activities</h1>
                        {/* Suresh Added hidden md:block  */}
                        <p className="mt-2 text-sm text-gray-700 hidden sm:block">
                            A list of all your activities</p>
                    </div>
                    {/* <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none"> */}
                    <div className="flex justify-between">
                        <div className="sm:ml-16 sm:flex-none">
                            <button
                                type="button"
                                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-2 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto mr-5 mt-4 "
                                onClick={() => { setOpenActivityModal(true) }}
                            >
                                Add
                            </button>
                            <button
                                type="button"
                                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-2 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto mt-4"
                                onClick={() => { setOpenActivitySummaryModal(true) }}
                            >
                                Summary
                            </button>
                        </div>
                        <div className="mt-4 ml-4">
                            {/* <DatePicker
                                selected={activity_d}
                                onChange={(date: Date) => {
                                    setactivity_d(date);
                                    // console.log('supabase format', activity_d.toISOString().toLocaleString())
                                    // console.log('converted back', new Date(activity_d.toISOString().toLocaleString()))
                                }}
                                peekNextMonth
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                            /> */}

                            <input type="date" className="form-input rounded "
                                value={activity_d}
                                onChange={(e) => {
                                    setactivity_d(e.target.value)
                                }} />
                        </div>
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
                                                Started at
                                            </th>
                                            <th
                                                scope="col"
                                                className="sticky top-20 mt-20 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"

                                            >
                                                Duration
                                            </th>
                                            <th
                                                scope="col"
                                                className="sticky top-20 mt-20 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"

                                            >
                                                Name
                                            </th>
                                            <th
                                                scope="col"
                                                className="sticky top-20 mt-20 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"

                                            >
                                                Category
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
                                        {activities.map((element) => (
                                            <ActivityLineItem key={element.id} activity={element} category_name={categories.find((item) => item.id == element.category_id)!.name} />
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
                openModal={openActivityModal}
                setOpenModal={setOpenActivityModal}
            >
                <CreateActivity activity_d={activity_d} setOpenActivityModal={setOpenActivityModal} />
            </Modal>
            <Modal
                openModal={openActivitySummaryModal}
                setOpenModal={setOpenActivitySummaryModal}
            >
                <ActivitySummary setOpenActivitySummaryModal={setOpenActivitySummaryModal} />
            </Modal>
            <ModalTransparent
                openModal={openMessageModal}
                setOpenModal={setOpenMessageModal}
                isDismissable={true}
            >
                <ModalSmall heading={modalInfo.current.modalHeader!} content={modalInfo.current.modalContent!} okText="Take me to Categories" okClicked={modalInfo.current.okClicked!} setOpenModalWindow={setOpenMessageModal} />
            </ModalTransparent>
        </>
    )
}

export default withAuth(Activities)
