import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import internal from "stream";
import useActivityStore from "../../store/activity.store";
import useCategoryStore from "../../store/category.store";
import { supabase } from "../../utils/supabaseClient";
import ModalTransparent from "../ModalTransparent";
import Spinner from "../Spinner";

type Props = {
    setOpenActivitySummaryModal: (open: boolean) => void;
};
type ActivitySummary = {
    category_id: number;
    category_name: string;
    duration_hours: number;
    duration_minutes: number;
}
export default function ActivitySummary({ setOpenActivitySummaryModal }: Props) {

    const [activitySummaryState, setActivitySummaryState] = useState<ActivitySummary[]>([])
    const [loading, setLoading] = useState(false);
    const { activities } = useActivityStore(); //activities doesn't need loading as this is being called from Activities
    const { categories, setCategories, isCategoryStoreLoaded, setIsCategoryStoreLoaded } = useCategoryStore();
    useEffect(() => {
        const getCategories = async () => {
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
            }
        }
        const fetchData = async () => {
            let activity_summary: ActivitySummary[] = []
            await getCategories()
            console.log("1", activity_summary)
            activities.forEach(activity => {
                let activity_summary_row = activity_summary.find(el => el.category_id === activity.category_id);
                if (!activity_summary_row) {
                    const category_name = categories.find((item) => item.id == activity.category_id)!.name
                    activity_summary.push(
                        { category_id: activity.category_id, category_name: category_name, duration_hours: activity.duration_hours, duration_minutes: activity.duration_minutes }
                    )
                } else {
                    let newMinutes = activity_summary_row.duration_minutes + activity.duration_minutes
                    let newHours = activity_summary_row.duration_hours + activity.duration_hours
                    if (newMinutes >= 60) {
                        newMinutes = newMinutes - 60
                        newHours = newHours + 1
                    }
                    activity_summary_row.duration_hours = newHours
                    activity_summary_row.duration_minutes = newMinutes
                }
            });
            setActivitySummaryState([...activity_summary].sort((a, b) => (a.category_name > b.category_name) ? 1 : -1))
        }
        fetchData()
    }, []);


    return (
        <>
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
                <h2 className="text-2xl text-ct-dark-600 font-semibold">Summary of Activity</h2>
                <div
                    onClick={() => setOpenActivitySummaryModal(false)}
                    className="text-2xl text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg p-1.5 ml-auto inline-flex items-center cursor-pointer"
                >
                    <i className="bx bx-x"></i>
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
                                            Category
                                        </th>
                                        <th
                                            scope="col"
                                            className="sticky top-20 mt-20 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                                        >
                                            Duration
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {activitySummaryState.map((element) => (
                                        <tr key={element.category_id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                                                {element.category_name.length > 20
                                                    ? element.category_name.substring(0, 20) + "..."
                                                    : element.category_name}
                                            </td>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                                                {element.duration_hours}{":"}
                                                {element.duration_minutes < 10 ? "0" + element.duration_minutes.toString() : element.duration_minutes}
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
        </>
    )
}
