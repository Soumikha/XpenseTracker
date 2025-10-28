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
            <div class="d-flex flex-column align-items-center mt-3 mb-4">
                <img src="./up.png" width="350" class="mb-3" />

                <div class="mb-3 text-center">
                    <label for="FLUpload" class="form-label fw-semibold ">Upload your file</label>
                    <input class="form-control w-auto mx-auto" type="file" id="FLUpload" />

                </div>
                <input
                    type="button"
                    id="BTNUPLOAD"
                    value="Upload Receipt"
                    class="btn btn-primary"
                    onClick={uploadFile}
                />
            </div>

          
        </div>
    );
}

// 2️⃣ Export the component at the top level
export default UploadReceipt;
