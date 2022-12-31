import { FC, useState } from "react";
import { Category } from "../../pages/Categories";
import Modal from "../Modal";
import CategoryItem from "./category.component";
// import CategoryDetail from './detail.category'

type Props = {
    category: Category;
};

const CategoryLineItem: FC<Props> = ({ category }) => {
    const [openCategoryDetailModal, setOpenCategoryDetailModal] = useState(false);

    return (
        <>
            <tr>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                    {category.name.length > 20
                        ? category.name.substring(0, 20) + "..."
                        : category.name}
                </td>

                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                    <a href="#" className="text-indigo-600 hover:text-indigo-900" onClick={() => { setOpenCategoryDetailModal(true) }}>
                        Detail<span className="sr-only">, {category.name}</span>
                    </a>

                </td>
            </tr>
            <Modal
                openModal={openCategoryDetailModal}
                setOpenModal={setOpenCategoryDetailModal}
            >
                <CategoryItem category={category} setOpenParentModal={setOpenCategoryDetailModal} />
            </Modal>
        </>
    );
};

export default CategoryLineItem;
