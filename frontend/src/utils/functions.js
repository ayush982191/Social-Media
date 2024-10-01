import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
export const showSuccessToast = (text) => {
   
    toast.success(text);
  };

  export const showFailureToast = (text) =>{
    console.log("text coming is ",text)
    toast.error(text,{
      
    })
  }

