document.addEventListener('DOMContentLoaded', () => {
    const baseUrl = "https://2024-03-06.currency-api.pages.dev/v1/currencies/eur.json";
    const dropdown = document.querySelectorAll('.dropdown-container select');
    const fromCurr = document.querySelector('form select[name="from"]');
    const toCurr = document.querySelector('form select[name="to"]');

    for (let select of dropdown) {
        for (let Code in country_list) {
            let newOption = document.createElement('option');
            newOption.innerHTML = Code;
            newOption.value = Code;
            if (select.name === 'from' && Code === 'USD') {
                newOption.selected = 'selected';
            } else if (select.name === 'to' && Code === 'INR') {
                newOption.selected = 'selected';
            }
            select.append(newOption);
        }

        select.addEventListener('change', (ent) => {
            UpdateFlag(ent.target);
        });
    }

    const UpdateFlag = (ele) => {
        let currcode = ele.value;
        let countrycode = country_list[currcode];
        let newSrc = `https://flagsapi.com/${countrycode}/flat/64.png`;
        let img = ele.parentElement.querySelector('img');
        img.src = newSrc;
    };

    const btn = document.querySelector('form button');
    btn.addEventListener('click', (evt) => {
        evt.preventDefault();
        let amount = document.querySelector('.amount input');
        let amountVal = amount.value;
        if (amountVal === '' || amountVal < 0) {
            amount.value = '1';
            amountVal = '1';
        }

        fetch(`${baseUrl}?from=${fromCurr.value}&to=${toCurr.value}&amount=${amountVal}`)
            .then((response) => response.json())
            .then((data) => {
                const convertedAmount = data.convertedAmount || 0;
                const resultElement = document.querySelector('.msg'); // Changed from .result to .msg
                if (resultElement) {
                    resultElement.innerHTML = `${amountVal} ${fromCurr.value} = ${convertedAmount} ${toCurr.value}`;
                } else {
                    console.error('Result element not found');
                }
            })
            .catch((error) => {
                console.error('Error fetching conversion:', error);
                const resultElement = document.querySelector('.msg'); // Changed from .result to .msg
                if (resultElement) {
                    resultElement.innerHTML = `
                        Failed to fetch conversion. Please try again.
                    `;
                }
            });
    });
});