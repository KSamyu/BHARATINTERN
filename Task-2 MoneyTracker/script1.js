document.getElementById('set-budget-btn').addEventListener('click', async function() {
    const bi = document.getElementById('budgInp').value;
    const response = await fetch('/setBudget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ totalBudget: parseFloat(bi) })
    });

    if (response.ok) {
        const budget = await response.json();
        document.getElementById('totbudg1').textContent = budget.totalBudget;
        updateBudgleft();
    }
});


document.getElementById('addExp').addEventListener('click', async function() {
    const name1 = document.getElementById('ename').value;
    const amt1 = document.getElementById('eamt').value;
    const date1 = document.getElementById('edate').value;

    if (name1 && amt1 && date1) {
        const response = await fetch('/addExpense', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name1, amount: amt1, date: date1 })
        });

        if (response.ok) {
            const newExp = await response.json();
            const list1 = document.getElementById('elist');
            const row1 = document.createElement('tr');

            row1.innerHTML = `
                <td>${newExp.name}</td>
                <td>${newExp.amount}</td>
                <td>${newExp.date}</td>
                <td><button class="delete-btn" data-id="${newExp._id}">DELETE</button></td>
            `;

            list1.appendChild(row1);
            updateTotExp(parseFloat(newExp.amount));
            updateBudgleft();

          
            document.getElementById('ename').value = '';
            document.getElementById('eamt').value = '';
            document.getElementById('edate').value = '';

            row1.querySelector('.delete-btn').addEventListener('click', async function() {
                const amount = parseFloat(newExp.amount);
                const response = await fetch(`/deleteExpense/${newExp._id}`, { method: 'DELETE' });

                if (response.ok) {
                    updateTotExp(-amount);
                    updateBudgleft();
                    row1.remove();
                }
            });
        }
    }
});

function updateTotExp(amount) {
    const totExpElement = document.getElementById('totexp1');
    const currentTotExp = parseFloat(totExpElement.textContent);
    totExpElement.textContent = currentTotExp + amount;
}

function updateBudgleft() {
    const totbudg = parseFloat(document.getElementById('totbudg1').textContent);
    const totExp = parseFloat(document.getElementById('totexp1').textContent);
    const budgleft = totbudg - totExp;
    document.getElementById('budgleft').textContent = budgleft;
}

