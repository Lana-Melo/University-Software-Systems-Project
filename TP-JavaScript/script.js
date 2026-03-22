function load(){
    let submmitBtn = document.getElementById("addRow");
    let form = document.forms.namedItem("form1");
    let tbody = document.getElementsByTagName("table")[0].tBodies[0]; // tBodies to add elems to that part of the table
    let mainDiv = document.getElementsByTagName("main")[0]    
    
    let calculateBtn = document.createElement("button");
    calculateBtn.setAttribute('type', 'button');
    calculateBtn.setAttribute('id', 'calculateTotal');
    calculateBtn.innerText = 'Calcular Total';
    mainDiv.appendChild(calculateBtn);
        
    submmitBtn.addEventListener("click", function submmit() {validateAndAddRow(form, tbody, mainDiv)});
    
    calculateBtn.addEventListener("click", function calculateTotal() {
        console.log("BOTAO PRESSIONADO");
        calculate(tbody);
    })
}

function calculate(tbody){
    let total = 0;
    //numRows = len(tbody.rows);
    //console.log(numRows);
    for(var i = 0, row; row = tbody.rows[i]; i++) {
        console.log(row);
        let cell = row.cells[2];
        total += Number(row.cells[2].textContent);
        console.log(row.cells[2]);
    }
    console.log(`TOTAL: ${total}`);
    
    let newRow = tbody.insertRow();
    totalRow = newRow.insertCell(0);
    totalRow.setAttribute('colspan', '100%');
    totalRow.setAttribute('align', 'right');
    
    totalRow.innerHTML = "Total dos custos: " + total;
}

function addRow(tbody, data, mainDiv) {
    let newRow = tbody.insertRow();

    let produto = newRow.insertCell(0);
    produto.innerHTML = data.get("produto");

    let origem = newRow.insertCell(1);
    origem.innerHTML = data.get("origem");

    let custo = newRow.insertCell(2);
    custo.innerHTML = data.get("custo");

}

function validateAndAddRow(form, tbody) {
    let produto = form["productName"].value;
    let custo = form["productCost"].value;
    let selectedOrigem = form.querySelector('input[name="origin"]:checked');
    let origem = "";

    if(selectedOrigem) {
        origem = form.querySelector(`label[for="${selectedOrigem.id}"]`).textContent;
    }

    if(produto != "" && custo != "" && origem != "") {
        let data = new Map();
        data.set("produto", produto);
        data.set("origem", origem);
        data.set("custo", custo);
        addRow(tbody, data)
    } else {
        window.alert("Por favor, preencha todos os campos do formulário!")
    }
}