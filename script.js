//const deptElement = document.getElementById("dept");
const subCodesElement = document.getElementById("subCode");
const yearElement = document.getElementById("year");
const errElement = document.getElementById("errMessage");
const uploadMessageElement = document.getElementById("uploadMessage");
const regulationElement = document.getElementById("regulation");
const form = document.getElementById('form');

var d = new Date();

const subCodes = {
    "2013": ["GE6152","GE6151","CY6151","PH6151","MA6151","HS6151","EE6201","GE6251","CY6251","PH6251","MA6251","HS6251","EE6303","EC6202","GE6351","EE6302","EE6301","MA6351","EE6404","EE6403","EE6402","CS6456","EE6401","MA6459","IC6501","EE6504","EE6503","ME6701","EE6502","EE6501","EE6002","EE6604","EE6603","EE6602","EE6601","EC6651","EE6007","EE6005","EE6004","EI6704","MG6851","EE6703","EE6702","EE6701","GE6757","GE6075","GE6083","EE6010","EE6009","EE6801"],
    "2017": ["GE8152","GE8151","CY8151","PH8151","MA8151","HS8151","GE8291","EE8251","BE8252","PH8253","MA8251","HS8251","ME8792","EC8353","EE8301","EE8391","EE8351","MA8353","IC8451","EE8451","EE8403","EE8402","EE8401","MA8491","CS8392","EE8591","EE8552","EE8551","EE8501","OAN551","OMF551","OIT552","EE8691","EE8602","EE8601","EE8005","EE8002","EE8004","EE8703","EE8702","EE8701","GE8071","GE8077","OEC753","OCS752","EE8017","MG8591","EE8015","GE8076"]
};

function changeRegulation() {
    subCodesElement.innerHTML = '';

    let optionsInsert = '';
    //console.log(optionsInsert);
    let option = document.createElement('option');
    option.text = '--Select one--';
    option.value = "none";
    subCodesElement.append(option);
    //optionsInsert.concat(option);
    //console.log(optionsInsert);

    let subjectCodes = subCodes[regulationElement.value].sort();

    for(let i = 0; i < subjectCodes.length; i++) {
        option = document.createElement('option');
        option.text = subjectCodes[i];
        option.value = subjectCodes[i];
        subCodesElement.append(option);
        optionsInsert.concat(option);
    }
    // console.log(optionsInsert);
    // subCodesElement.innerHTML = optionsInsert;
}

function deptChange(e) {
    subCodesElement.innerHTML = '';
    //let department = deptElement.value;
    
    let option = document.createElement('option');
    option.text = "--Select one--";
    option.value = "none";
    subCodesElement.append(option);

    let subjectCodes = subCodes.sort();

    for(let i = 0; i < subjectCodes.length; i++) {
        let option = document.createElement('option');
        option.text = subjectCodes[i];
        option.value = subjectCodes[i];
        subCodesElement.append(option);
    }
}

const checkInputs = () => {
    if (subCodesElement.value == "none" || yearElement.value == "none") {
        alert("Invalid year or subject code");
        return false;
    }
    return true;
}

const checkTime = () => {
    console.log("Checking the time");
    if (!(d.getHours() >= 13 && d.getHours() <= 14 || d.getHours() >= 18 && d.getHours() <= 22)) {
        errElement.style.display = "block";
        enabled = false;
        return false;
    }
    return true;
}

const checkFileNaming = (filename) => {
    let pdfCheck = filename.split(".");
    if(pdfCheck[1] != "pdf" && pdfCheck[1] != "PDF") {
        alert("Only pdf files are accepted");
        return false;
    }

    let filenaming = filename.split("-");
    console.log(filenaming);
    if (filenaming.length != 2 || filenaming[0].length != 12 || filenaming[1].length != 10) {
        alert("File name is not proper");
        alert("File name should in the format [Reg.No]-[Sub.Code] (all uppercase)");
        return false;
    }

    return true;
}

form.addEventListener('submit', e => {
    e.preventDefault();
    
    console.log(checkInputs());

    if (!checkInputs()) {
        return;
    }   

    if (!confirm("Sure to submit?")) {
        return;
    }

    if (form.filename.value.length != 12) {
        alert("Check your register number");
        return;
    }

    // if (!checkTime()) {
    //     alert("Answer Submission Time exceeded! Contact your Supervisor");
    //     return;
    // }
    const file = form.file.files[0];
    const fr = new FileReader();
    var d = new Date();

    try {
        fr.readAsArrayBuffer(file);
    } catch(err) {
        alert("Please make sure you selected the correct file or contact your supervisor");
        uploadMessageElement.innerHTML = 'UPLOADED SUCCESSFULLY';
        uploadMessageElement.style.display = 'block';
    }

    fr.onload = f => {

        if (!checkFileNaming(file.name)) {
            return;
        }
        
        uploadMessageElement.innerHTML = "Uploading... Please Wait!"
        uploadMessageElement.style.display = 'block';

        let fileName = file.name;

        let url = "https://script.google.com/macros/s/AKfycbx91uY4AcAAogC1tH0wakGvk8idjUkuqgUd8Ju2GoSHfF29UtaNfFphoz1NxULGnlST/exec";

        const qs = new URLSearchParams({filename: fileName, mimeType: file.type, subCode: form.subCode.value});
        console.log(`${url}?${qs}`);
        fetch(`${url}?${qs}`, {method: "POST", body: JSON.stringify([...new Int8Array(f.target.result)])})
        .then(res => res.json())
        .then(e => {
            console.log(e);
            if (e.commonFolder) {
                alert("It seems like your file went to the wrong folder. Contact the supervisor");
            }
            alert("File uploaded successfully!");
            form.reset();
            uploadMessageElement.innerHTML = 'UPLOADED SUCCESSFULLY';
            uploadMessageElement.style.display = 'block';
        })  // <--- You can retrieve the returned value here.
        .catch(err => {
            console.log(err);
            uploadMessageElement.innerHTML = 'UPLOADING FAILED';
            alert("Something went Wrong! Please Try again!");
            uploadMessageElement.style.display = 'block';
        });
    }
});