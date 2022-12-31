import create from "zustand";
import { IActivity } from "../types";

type ActivityStore = {
  activities: IActivity[] | [];
  setActivities: (activities: IActivity[]) => void;
  createActivity: (activity: IActivity) => void;
  updateActivity: (activity: IActivity) => void;
  deleteActivity: (activityId: number|string) => void;
};

const useActivityStore = create<ActivityStore>((set) => ({
  activities: [],
  // setActivities: (activities) => set((state) => ({ activities })),
  setActivities: (activities) => set((state) => ({ activities: activities.sort((a,b)=>(a.start_time > b.start_time)? 1: -1)})),
  // createActivity: (activity) => set((state) => ({ activities: [...state.activities, activity] })),
  createActivity: (activity) => set((state) => ({ activities: [...state.activities, activity].sort((a,b)=>(a.start_time > b.start_time)? 1: -1) })),
  
  deleteActivity: (activityId) =>
    set((state) => ({
      activities: state.activities.filter((item) => item.id != activityId),
    })),
  updateActivity: (activity) =>
    set((state) => ({
      activities: state.activities.map((item) => {
        if (item.id === activity.id) {
          return Object.assign(item, activity);
        }
        return item;
      }),
    })),
}));

export default useActivityStore;
