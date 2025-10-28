function ManualEnter() {
    const enterDC = async () => {
        const descInput = document.getElementById("EntDesc");
        const desc = descInput.value;

        let formData = new FormData();
        formData.append("Expense", desc);

        const TcostInput = document.getElementById("EntTotalc");
        const tcost = TcostInput.value;
        formData.append("TotalCost", tcost);

        const merchantNameInput = document.getElementById("EntMN");
        const mn = merchantNameInput.value;

        formData.append("MerchantName", mn);

        const expensedate = document.getElementById("EntEDate");
        const date = expensedate.value;

        formData.append("ExpenseDate", date);

        const response = await fetch("http://localhost:5020/api/Manual/EnterDC", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"  
            },
           body: JSON.stringify({
                Expense: document.getElementById("EntDesc").value,
               Total_Amount: document.getElementById("EntTotalc").value,
               MerchantName: document.getElementById("EntMN").value,
               expenseDate: document.getElementById("EntEDate").value

            })
        });

        const result = await response.json();
        console.log(result);


       
    }
    return (
        <div className="card p-4 w-75 mx-auto mt-4">
            {/* Card body */}
            <div className="card-body d-flex flex-column">
                <input
                    type="text"
                    id="EntDesc"
                    placeholder="Milk"
                    className="form-control mb-3"
                />
                <input
                    type="text"
                    id="EntTotalc"
                    placeholder="2.00"
                    className="form-control mb-3"
                />
                <input
                    type="text"
                    id="EntMN"
                    placeholder="ShopRite"
                    className="form-control mb-3"
                />
                <input
                    type="text"
                    id="EntEDate"
                    placeholder="yyyy-mm-dd"
                    className="form-control mb-3"
                />

                {/* ENTER button below all inputs */}
                <button
                    type="button"
                    className="btn btn-primary mt-2"
                    id="ENTERbttn"
                    onClick={() => enterDC()}
                >
                    ENTER
                </button>
            </div>
        </div>


    );
}
    export default ManualEnter;
