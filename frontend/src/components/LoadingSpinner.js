import React from "react";
import { usePromiseTracker } from "react-promise-tracker";
import Loader from "react-loader-spinner";

const LoadingSpinner = (props) => {
    const { promiseInProgress } = usePromiseTracker({ area: props.area, delay: 200 });

    return (
        promiseInProgress && (
            <div className="spinner">
                <Loader type="ThreeDots" color="#2BAD60" height="100" width="100" />
            </div>
        )
    );
};

export default LoadingSpinner;