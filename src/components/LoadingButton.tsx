import React from "react";
import { twMerge } from "tailwind-merge";
import EmbeddedSpinner from "./EmbeddedSpinner";

type LoadingButtonProps = {
    loading: boolean;
    btnColor?: string;
    textColor?: string;
    children: React.ReactNode;
};

export const LoadingButton: React.FC<LoadingButtonProps> = ({
    textColor = "text-white",
    // btnColor = "bg-ct-blue-700",
    btnColor = "bg-indigo-600",
    children,
    loading = false,
}) => {
    // font-semibold replaced with fornt-normat
    // Lading replaced with busy..
    return (
        <button
            type="submit"
            className={twMerge(
                `w-full py-3 font-normal ${btnColor} rounded-lg outline-none border-none flex justify-center`,
                `${loading && "bg-[#ccc]"}`
            )}
        >
            {loading ? (
                <div className="flex items-center gap-3">
                    <EmbeddedSpinner />
                    <span className="text-white inline-block">Working...</span>
                </div>
            ) : (
                <span className={`text-lg font-normal ${textColor}`}>{children}</span>
            )}
        </button>
    );
};
