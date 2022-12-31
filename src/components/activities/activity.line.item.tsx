import { FC, useState } from "react";
import { string } from "zod";
import { Activity } from "../../pages/Activities";
import format24toampm from "../../utils/format24toampm";
import Modal from "../Modal";
import ActivityItem from "./activity.component";

type Props = {
    activity: Activity;
    category_name: string;
};

const ActivityLineItem: FC<Props> = ({ activity, category_name }) => {
    const [openActivityDetailModal, setOpenActivityDetailModal] = useState(false);
    return (
        <>
            <tr>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                    {format24toampm(activity.start_time)}
                </td>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                    {activity.duration_hours}{":"}
                    {activity.duration_minutes < 10 ? "0" + activity.duration_minutes.toString() : activity.duration_minutes}
                </td>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                    {activity.name.length > 20
                        ? activity.name.substring(0, 20) + "..."
                        : activity.name}
                </td>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                    {category_name}
                </td>

                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                    <a href="#" className="text-indigo-600 hover:text-indigo-900" onClick={() => { setOpenActivityDetailModal(true) }}>
                        Detail<span className="sr-only">, {activity.name}</span>
                    </a>

                </td>
            </tr>
            <Modal
                openModal={openActivityDetailModal}
                setOpenModal={setOpenActivityDetailModal}
            >
                <ActivityItem activity={activity} setOpenParentModal={setOpenActivityDetailModal} category_name={category_name} />
            </Modal>
        </>
    );
};

export default ActivityLineItem;
