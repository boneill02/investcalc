const inputs = document.getElementById("inputs");
const car = document.getElementById("car");
const carPrice = document.getElementById("carPrice");
const result = document.getElementById("results");
const wrapper = document.getElementById("wrapper");

let carName = "car";
const interestRates = {
	"Poor": 0.1879,
	"Fair": 0.1259,
	"Good": 0.0709,
	"Excellent": 0.0429
};
const loanTerm = 7; // years

function calculate() {
	carName = document.getElementById("car").value.trim();
	const creditScore = parseInt(document.getElementById("creditScore").value);
	const price = parseInt(carPrice.value);
	const results = {};

	for (const key in interestRates) {
		const interestRate = interestRates[key];
		const monthlyPayment = PMT(interestRate / 12, loanTerm * 12, price * -1);
		const interest = monthlyPayment * loanTerm * 12 - price;
		const total = price + interest;

		results[key] = {
			rate: parseFloat(interestRate * 100).toFixed(2),
			payment: monthlyPayment,
			interest: interest,
			total: total
		};
	}

	const scoreRange = getCreditScoreRange(creditScore);
	display(scoreRange, price, results);
}

function display(scoreRange, carPrice, results) {

	if (wrapper.contains(inputs)) inputs.remove();
	if (!wrapper.contains(result)) wrapper.appendChild(result);

	document.getElementById("scoreRange").innerHTML = scoreRange;
	document.getElementById("carName").innerHTML = carName;

	for (const score in interestRates) {
		document.getElementById("rate" + score).innerHTML = results[score].rate + "%";
		document.getElementById("monthly" + score).innerHTML = formatNumber(results[score].payment);
		document.getElementById("interest" + score).innerHTML = formatNumber(results[score].interest);
		document.getElementById("total" + score).innerHTML = formatNumber(results[score].total);
	}

	document.getElementById(scoreRange).classList.add("highlighted");
	document.getElementById("rate" + scoreRange).classList.add("highlighted");
	document.getElementById("monthly" + scoreRange).classList.add("highlighted");
	document.getElementById("interest" + scoreRange).classList.add("highlighted");
	document.getElementById("total" + scoreRange).classList.add("highlighted");
}

function findFieldValuesBySubstring(arr, field, substring) {
  return arr
    .filter(obj => typeof obj[field] === 'string' && obj[field].toLowerCase().includes(substring.toLowerCase()));
    //.map(obj => obj[field]);
}

function formatNumber(n) {
	return "$" + Math.floor(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getCreditScoreRange(n) {
	if (n > 750) return "Excellent";
	if (n > 700) return "Good";
	if (n > 600) return "Fair";
	return "Poor";
}

function getInputs() {
	if (wrapper.contains(result)) result.remove();
	if (!wrapper.contains(inputs)) wrapper.appendChild(inputs);
}

/* Excel PMT function */
function PMT(ir, np, pv, fv, type) {
	let pmt;
	fv || (fv = 0);
	type || (type = 0);

	if (ir === 0)
		return -(pv + fv)/np;

	const pvif = Math.pow(1 + ir, np);
	pmt = - ir * (pv * pvif + fv) / (pvif - 1);

	if (type === 1)
		pmt /= (1 + ir);

	return pmt;
}

car.addEventListener('keydown', function () {
	const query = this.value.trim();
	suggestions.innerHTML = '';
	if (query.length === 0) {
		suggestions.classList.remove('show');
		return;
	}

	const matches = findFieldValuesBySubstring(data, 'name', query);
	if (matches.length === 0) {
		suggestions.classList.remove('show');
		return;
	}

	matches.forEach(item => {
		const li = document.createElement('li');
		li.innerHTML = `<a class="dropdown-item" href="#">${item["name"]}</a>`;
		li.addEventListener('click', function () {
			car.value = item["name"];
			carPrice.value = item["price"];
			suggestions.classList.remove('show');
		});
		suggestions.appendChild(li);
	});

	suggestions.classList.add('show');
});

const defaultCar = findFieldValuesBySubstring(data, "name", "2017 Mercedes-Benz E-Clas")[0];
car.value = defaultCar["name"];
carPrice.value = defaultCar["price"];

getInputs();
