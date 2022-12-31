import { FC, useContext, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { date, number, object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "../LoadingButton";
import { toast } from "react-toastify";
import useActivityStore from "../../store/activity.store";
import { supabase } from "../../utils/supabaseClient";
import { UserInfoContext } from "../../utils/user-context";
import ModalTransparent from "../ModalTransparent";
import Spinner from "../Spinner";
import useCategoryStore from "../../store/category.store";
// import DatePicker, { ReactDatePicker } from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

type ICreateActivityProps = {
    activity_d: string
    setOpenActivityModal: (open: boolean) => void;
};

const createActivitySchema = object({
    activity_d: string(),
    name: string().min(3, "Name is required"),
    // start_time: date(),
    start_time: string(),
    duration_hours: number().int().positive().lte(100),
    duration_minutes: number().int().positive().lte(59),
    category_id: number()
});

export type CreateActivityInput = TypeOf<typeof createActivitySchema>;

const CreateActivity: FC<ICreateActivityProps> = ({ activity_d, setOpenActivityModal }) => {
    const [loading, setLoading] = useState(false);
    const activityStore = useActivityStore();
    const methods = useForm<CreateActivityInput>({
        resolver: zodResolver(createActivitySchema),
    });

    const { categories, setCategories, isCategoryStoreLoaded, setIsCategoryStoreLoaded } = useCategoryStore();

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

    const { session } = useContext(UserInfoContext)
    const user_id = session?.user.id

    const {
        register,
        handleSubmit,
        formState: { errors },
        control
    } = methods;

    useEffect(() => {

        methods.reset({
            activity_d: activity_d
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const createActivity = async (activity: CreateActivityInput) => {
        setLoading(true);

        const { data: insertedData, error } = await supabase
            .from('activities')
            .insert({
                activity_d: activity_d,
                start_time: activity.start_time,
                duration_hours: activity.duration_hours,
                duration_minutes: activity.duration_minutes,
                name: activity.name,
                category_id: activity.category_id,
                user_id: user_id!
            })
            .select()

        if (error) {
            // throw error ? error : "Something bad happended";
            setLoading(false);
            setOpenActivityModal(false);
            toast.error(error.message, {
                position: "bottom-right",
            });
        } else {
            setLoading(false);
            setOpenActivityModal(false);
            toast("Activity created successfully", {
                type: "success",
                position: "bottom-right",
            });
            activityStore.createActivity(insertedData[0]);
        }

    };

    useEffect(() => {
        getCategories();
    }, []);

    const onSubmitHandler: SubmitHandler<CreateActivityInput> = async (data) => {
        createActivity(data);
    };
    return (
        <section>
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
                <h2 className="text-2xl text-ct-dark-600 font-semibold">Create Activity</h2>
                <div
                    onClick={() => setOpenActivityModal(false)}
                    className="text-2xl text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg p-1.5 ml-auto inline-flex items-center cursor-pointer"
                >
                    <i className="bx bx-x"></i>
                </div>
            </div>
            <form className="w-full" onSubmit={handleSubmit(onSubmitHandler)}>
                <div className="mb-2">
                    <label className="block text-gray-700 text-lg mb-2" htmlFor="name">
                        Activity Date
                    </label>
                    <input type="date" className="form-input rounded border border-gray-200" disabled
                        value={activity_d}
                    />
                </div>

                <div className="mb-2">
                    <label className="block text-gray-700 text-lg mb-2" htmlFor="name">
                        Started at
                    </label>
                    <input type="time" {...methods.register("start_time")} className={twMerge(
                        `form-input appearance-none border border-gray-400 rounded w-full py-3 px-3 text-gray-700 mb-2  leading-tight focus:outline-none`,
                        `${errors["start_time"] && "border-red-500"}`,
                    )}
                    />
                    {/* <Controller
                        control={control}
                        name='start_time'
                        render={({ field }) => (
                            <DatePicker
                                // placeholderText='Select date'
                                className={twMerge(
                                    `appearance-none border border-gray-400 rounded w-full py-3 px-3 text-gray-700 mb-2  leading-tight focus:outline-none`,
                                    `${errors["start_time"] && "border-red-500"}`
                                )}
                                onChange={(date) => field.onChange(date)}
                                selected={field.value}
                            />
                        )}
                    /> */}
                    <p
                        className={twMerge(
                            `text-red-500 text-xs italic mb-2 invisible`,
                            `${errors["start_time"] && "visible"}`
                        )}
                    >
                        {errors["start_time"]?.message as string}
                    </p>
                </div>
                <div className="mb-2">
                    <label className="block text-gray-700 text-lg mb-2" htmlFor="name">
                        Duration
                    </label>
                    <span>
                        <input
                            type="number"
                            className={twMerge(
                                `appearance-none border border-gray-400 rounded w-16 py-3 px-3 text-gray-700 mb-2  leading-tight focus:outline-none`,
                                `${errors["duration_hours"] && "border-red-500"}`
                            )}
                            {...methods.register("duration_hours", {
                                valueAsNumber: true
                            })}
                        />
                    </span>
                    <span>{" : "}</span>
                    <span>
                        <input
                            type="number"
                            className={twMerge(
                                `appearance-none border border-gray-400 rounded w-16 py-3 px-3 text-gray-700 mb-2  leading-tight focus:outline-none`,
                                `${errors["duration_minutes"] && "border-red-500"}`
                            )}
                            {...methods.register("duration_minutes", {
                                valueAsNumber: true
                            })}
                        />
                    </span>

                    <p
                        className={twMerge(
                            `text-red-500 text-xs italic mb-2 invisible`,
                            `${errors["duration_hours"] && "visible"}`
                        )}
                    >
                        {errors["duration_hours"]?.message as string}
                    </p>
                    <p
                        className={twMerge(
                            `text-red-500 text-xs italic mb-2 invisible`,
                            `${errors["duration_minutes"] && "visible"}`
                        )}
                    >
                        {errors["duration_minutes"]?.message as string}
                    </p>
                </div>
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
                <div className="mb-2">
                    <label className="block text-gray-700 text-lg mb-2" htmlFor="name">
                        Category
                    </label>
                    <Controller
                        control={control}
                        name='category_id'
                        render={({ field }) => (
                            <select
                                className={twMerge(
                                    `appearance-none border border-gray-400 rounded w-full py-3 px-3 text-gray-700 mb-2  leading-tight focus:outline-none`,
                                )}
                                onChange={(e) => {
                                    // field.onChange(parseInt(e.target.value)) 
                                    methods.setValue("category_id", parseInt(e.target.value))
                                }}
                                value={field.value as number}
                                defaultValue={'DEFAULT'}
                            >
                                <option value="DEFAULT" disabled hidden>Select an Option</option>
                                {categories.map((item) => (
                                    <option value={item.id} key={item.id}>{item.name}</option>
                                ))}
                            </select>
                        )}
                    />
                    {/* <select name="category_id">
                        {categories.map((item) => (
                            <option value={item.id} >{item.name}</option>
                        ))}
                    </select> */}
                    <p
                        className={twMerge(
                            `text-red-500 text-xs italic mb-2 invisible`,
                            `${errors["category_id"] && "visible"}`
                        )}
                    >
                        {errors["category_id"]?.message as string}
                    </p>
                </div>
                <LoadingButton loading={loading}>Create Activity</LoadingButton>
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

export default CreateActivity;
