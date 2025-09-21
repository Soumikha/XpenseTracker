function ManualEnter() {
    const enterDC = async () => {
        const descInput = document.getElementById("EntDesc");
        const desc = descInput.value;

        let formData = new FormData();
        formData.append("Expense", desc);

        const costInput = document.getElementById("EntCost");
        const cost = costInput.value;

        formData.append("Cost", cost);

        const response = await fetch("http://localhost:5020/api/Manual/EnterDC", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"  
            },
           body: JSON.stringify({
                expense: document.getElementById("EntDesc").value,
                cost: document.getElementById("EntCost").value
            })
        });

        const result = await response.json();
        console.log(result);


       
    }
    return (
        <div>
            <input type='text' id='EntDesc' placeholder="Milk" /><br /><br />
            <input type='text' id='EntCost' placeholder="2.00" /> <br /><br />
            <input type='button' class="btn btn-primary" id='ENTERbttn' value="ENTER" onClick={() => enterDC()} />

        </div>
    );
}
    export default ManualEnter;
