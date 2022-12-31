import { FC, useState } from "react";
import { format, parseISO } from "date-fns";
import { twMerge } from "tailwind-merge";
import ActivityModal from "../Modal";
// import UpdateActivity from "./update.activity";
import { toast } from "react-toastify";
import { IActivity } from "../../types";
import useActivityStore from "../../store/activity.store";
import { supabase } from "../../utils/supabaseClient";
import ModalTransparent from "../ModalTransparent";
import Spinner from "../Spinner";
import UpdateActivity from "./update.activity";
import format24toampm from "../../utils/format24toampm";


type ActivityItemProps = {
    activity: IActivity;
    category_name: string;
    setOpenParentModal?: (open: boolean) => void;
};

const ActivityItem: FC<ActivityItemProps> = ({ activity, category_name, setOpenParentModal }) => {
    const activityStore = useActivityStore();
    const [openSettings, setOpenSettings] = useState(false);
    const [openActivityModal, setOpenActivityModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const deleteActivity = async (activityId: number) => {
        setLoading(true);
        const { error } = await supabase
            .from('activities')
            .delete()
            .eq('id', activityId)
        if (error) {
            setOpenActivityModal(false);
            toast.error(error.message, {
                position: "bottom-right",
            });
            setLoading(false)
        } else {
            activityStore.deleteActivity(activityId);
            setOpenActivityModal(false);
            setLoading(false)
            toast("Activity deleted successfully", {
                type: "warning",
                position: "bottom-right",
            });
        }
    };

    const onDeleteHandler = (activityId: number) => {
        if (window.confirm("Are you sure")) {
            deleteActivity(activityId);
        }
    };
    return (
        <>
            <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-md flex flex-col justify-between overflow-hidden ">
                <div className="details">
                    <h4 className="mb-2 pb-2 text-2xl font-semibold tracking-tight text-gray-900">
                        {activity.name.length > 40
                            ? activity.name.substring(0, 40) + "..."
                            : activity.name}
                    </h4>
                    <p className="font-semibold text-ct-dark-200">
                        Date
                    </p>
                    <p className="mb-3 font-normal text-ct-dark-200">
                        {activity.activity_d}
                    </p>
                    <p className="font-semibold text-ct-dark-200">
                        Started at
                    </p>
                    <p className="mb-3 font-normal text-ct-dark-200">
                        {format24toampm(activity.start_time)}
                    </p>
                    <p className="font-semibold text-ct-dark-200">
                        Duration
                    </p>
                    <p className="mb-3 font-normal text-ct-dark-200">
                        {activity.duration_hours}{":"}
                        {activity.duration_minutes < 10 ? "0" + activity.duration_minutes.toString() : activity.duration_minutes}
                    </p>
                    <p className="font-semibold text-ct-dark-200">
                        Category
                    </p>
                    <p className="mb-3 font-normal text-ct-dark-200">
                        {category_name}
                    </p>
                </div>
                <div className="relative border-t border-slate-300 flex justify-between items-center">
                    <span className="text-ct-dark-100 text-sm">
                        {format(parseISO(String(activity.inserted_at)), "PPP")}
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
                                    setOpenActivityModal(true);
                                }}
                                className="py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            >
                                <i className="bx bx-pencil"></i> Edit
                            </li>
                            <li
                                onClick={() => {
                                    setOpenSettings(false);
                                    onDeleteHandler(activity.id);
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
            <ActivityModal
                openModal={openActivityModal}
                setOpenModal={setOpenActivityModal}
            >
                <UpdateActivity activity={activity} setOpenActivityModal={setOpenActivityModal} />
            </ActivityModal>
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

export default ActivityItem;
