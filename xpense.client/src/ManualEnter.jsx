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
        <div>
            <input type='text' id='EntDesc' placeholder="Milk" /><br /><br />
            <input type='text' id='EntTotalc' placeholder="2.00" /> <br /><br />
            <input type='text' id='EntMN' placeholder="ShopRite" /> <br /><br />
            <input type='text' id='EntEDate' placeholder="yyyy-mm-dd" /> <br /><br />
            <input type='button' class="btn btn-primary" id='ENTERbttn' value="ENTER" onClick={() => enterDC()} />

        </div>
    );
}
    export default ManualEnter;
