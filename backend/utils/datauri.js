import DataURIParser from "datauri/parser.js";
import path from "path"

 

const parser = new DataURIParser();
const getDataUri = (file) =>{
    const extName = path.extname(file.originalname).toString();
    return parser.format(extName,file.buffer).content;
}

export default getDataUri;


// "status": "success",
// "message": "Documents processed successfully",
// "reference_id": "vbn87654cvb",
// "transaction_id": "TXNUDKRPH1L5U",
// "response_time_stamp": "2023-11-02T16:11:10",
// "result": {
//     "validated_data": {
//         "category": "Individual or Person",
//         "full_name": "AMBIKA N",
//         "pan_number": "DIKPA7254P"
//     },
//     "valid_pan": true,
//     "message": "PAN is valid."
//     }