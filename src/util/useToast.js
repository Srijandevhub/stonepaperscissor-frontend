import { useNavigate } from "react-router-dom";
import { Flip, toast } from "react-toastify";

const useToast = () => {
    const navigate = useNavigate();
    const makeToast = (status, message, redirect = false, redirecturl = "") => {
    
        const handleRedirect = () => {
            if (redirect && redirecturl) {
                navigate(redirecturl);
            }
        }
        if (status === 200) {
            toast.success(message, {
                position: "top-right",
                transition: Flip,
                pauseOnHover: false,
                progress: false,
                autoClose: 1000,
                onClose: handleRedirect
            });
        } else if (status === 400) {
            toast.warning(message, {
                position: "top-right",
                transition: Flip,
                pauseOnHover: false,
                progress: false,
                onClose: handleRedirect
            });
        } else if (status === 500) {
            toast.error(message, {
                position: "top-right",
                transition: Flip,
                pauseOnHover: false,
                progress: false,
                onClose: handleRedirect
            });
        }
    }
    return makeToast;
}
export default useToast;