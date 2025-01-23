document.addEventListener('DOMContentLoaded', () => {
    const dropdown = document.querySelectorAll('.dropdown-container select');
    const fromCurr = document.querySelector('form select[name="from"]');
    const toCurr = document.querySelector('form select[name="to"]');
    const baseUrl = "https://api.exchangerate-api.com/v4/latest";
    const amountInput = document.querySelector('.amount input');
    const resultElement = document.querySelector('.msg');

    // Ensure country_list is loaded
    if (!country_list) {
        console.error("country_list is not defined");
        return;
    }

    // Populate dropdowns
    for (let select of dropdown) {
        for (let Code in country_list) {
            let newOption = document.createElement('option');
            newOption.innerHTML = Code;
            newOption.value = Code;

            // Set default selections
            if (select.name === 'from' && Code === 'USD') {
                newOption.selected = 'selected';
            } else if (select.name === 'to' && Code === 'INR') {
                newOption.selected = 'selected';
            }
            select.append(newOption);
        }

        // Attach flag update listener
        select.addEventListener('change', (event) => {
            UpdateFlag(event.target);
        });
    }

    // Update flag images
    const UpdateFlag = (ele) => {
        const currcode = ele.value;
        const countrycode = country_list[currcode];
        if (countrycode) {
            const newSrc = `https://flagsapi.com/${countrycode}/flat/64.png`;
            const img = ele.parentElement.querySelector('img');
            if (img) {
                img.src = newSrc;
            } else {
                console.error("Image element not found");
            }
        } else {
            console.error(`No country code found for ${currcode}`);
        }
    };

    // Handle conversion
    const convertCurrency = () => {
        let amountVal = amountInput.value;
        if (amountVal === '' || amountVal < 0) {
            amountInput.value = '1';
            amountVal = '1';
        }

        console.log(`Converting ${amountVal} from ${fromCurr.value} to ${toCurr.value}`);

        // Fetch exchange rates
        fetch(`${baseUrl}/${fromCurr.value}`)
            .then(response => response.json())
            .then(data => {
                const rate = data.rates[toCurr.value];
                if (rate) {
                    const convertedAmount = amountVal * rate;
                    if (resultElement) {
                        resultElement.innerHTML = `${amountVal} ${fromCurr.value} = ${convertedAmount.toFixed(2)} ${toCurr.value}`;
                    }
                } else {
                    console.error(`Rate not found for ${toCurr.value}`);
                }
            })
            .catch(error => {
                console.error('Error fetching conversion:', error);
                if (resultElement) {
                    resultElement.innerHTML = "Error fetching conversion rates. Please try again later.";
                }
            });
    };

    // Attach conversion event
    const btn = document.querySelector('form button');
    btn.addEventListener('click', (evt) => {
        evt.preventDefault();
        convertCurrency();
    });
});
