// 1️⃣ Define your component
function UploadReceipt() {

    const uploadFile = async () => {
        const fileInput = document.getElementById("FLUpload");
        const file = fileInput.files[0];

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("http://localhost:5020/api/Upload/UploadFile", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();
        console.log("Full result from API:", result);

        const lines = result?.analyzeResult?.pages?.[0]?.lines || [];
        const textLines = lines.map(line => line.content);
        const expenseLines = textLines.filter(line =>
            /\d+[@$]?\d*\.\d{2}/.test(line)
        );

        console.log("Expenses found:\n" + expenseLines.join("\n"));
    };

    return (
        <div>
            <input type='file' id='FLUpload' /><br />
            <input
                type='button'
                id='BTNUPLOAD'
                value="Upload Receipt"
                className="btn btn-primary"
                onClick={uploadFile}
            />
        </div>
    );
}

// 2️⃣ Export the component at the top level
export default UploadReceipt;
