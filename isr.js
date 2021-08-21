const incomeButton = document.getElementById('income-button');

/**
 * Initializes our App
 *
 * @constructor
 */
const isrApp = () => {
	incomeButton.addEventListener('click', function () {
		const incomeInput    = document.getElementById('income-input'),
			year             = document.getElementById('year-input'),
			isrResult        = document.getElementById('isr-result'),
			perceptionResult = document.getElementById('perception-result'),
			effectiveTaxRate = document.getElementById('effective-tax-rate-result'),
			taxResult        = getTaxesPerceptions(incomeInput.value, parseInt(year.options[year.selectedIndex].value)),
			resultsContainer = document.getElementById('calculator-results');

		isrResult.innerHTML            = taxResult.isr;
		perceptionResult.innerHTML     = taxResult.perception;
		effectiveTaxRate.innerHTML     = taxResult.effectiveTaxRate;
		resultsContainer.style.display = 'flex';
	});
}

/**
 * Adds neccesary formatting to MXN currency.
 *
 * @param x
 * @param symbol
 * @returns {string}
 */
function addSymbolAndCommas(x, symbol) {
	let number = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

	if ( '$' === symbol ) {
		number = symbol + number;
	} else if ( '%' === symbol ) {
		number = number + symbol;
	}

	return number;
}

/**
 * Gets the total perception, ISR and effective Tax Rate.
 *
 * @param annualIncome
 * @param year
 * @returns {{effectiveTaxRate: string, isr: string, perception: string}|{isr: string, perception: string}}
 */
const getTaxesPerceptions = (annualIncome, year = 2021) => {
	if (isNaN(annualIncome)) {
		return {
			isr: '¡Intenta con un número!',
			perception: ''
		}
	}

	const isr  = parseFloat(calculateAnnualISR(annualIncome, year)),
	perception = parseFloat(calculatePerception(annualIncome, isr)),
	effectiveTaxRate = parseFloat(calculateEffectiveTaxRate(annualIncome, isr));

	return {
		isr: addSymbolAndCommas(isr.toFixed(2), '$'),
		perception: addSymbolAndCommas(perception.toFixed(2), '$'),
		effectiveTaxRate: addSymbolAndCommas(effectiveTaxRate.toFixed(2), '%'),
	}
}

/**
 * Calculates ISR.
 *
 * @param annualIncome
 * @param year
 * @returns {*}
 */
const calculateAnnualISR = (annualIncome, year) => {
	let taxBrackets;

	if (2021 === year) {
		taxBrackets = brackets2021();
	} else if (2020 === year || 2019 === year) {
		taxBrackets = brackets202019();
	}

	const payerBracket = taxBrackets.find(element => annualIncome < element.limiteSuperior);
	return (annualIncome - payerBracket.limiteinferior) * (payerBracket.tasa / 100) + payerBracket.cuotaFija;
}

/**
 * Calculate perception after ISR.
 *
 * @param annualIncome
 * @param ISR
 * @returns int|float Annual Income.
 */
const calculatePerception = (annualIncome, isr) => {
	return annualIncome - isr;
}

/**
 * Calculates the effective Tax Rate.
 *
 * @param annualIncome
 * @param isr
 * @returns {number}
 */
const calculateEffectiveTaxRate = (annualIncome, isr) => {
	return isr / ( annualIncome / 100 );
}

/**
 * Anual Tax brackets 2021
 */
const brackets2021 = () => {
	return [
		{
			"limiteinferior": 0.01,
			"limiteSuperior": 7735,
			"cuotaFija": 0,
			"tasa": 1.92
		},
		{
			"limiteinferior": 7735.01,
			"limiteSuperior": 65651.07,
			"cuotaFija": 148.51,
			"tasa": 6.4
		},
		{
			"limiteinferior": 65651.08,
			"limiteSuperior": 115375.9,
			"cuotaFija": 3855.14,
			"tasa": 10.88
		},
		{
			"limiteinferior": 115375.91,
			"limiteSuperior": 134119.41,
			"cuotaFija": 9265.2,
			"tasa": 16
		},
		{
			"limiteinferior": 134119.42,
			"limiteSuperior": 160577.65,
			"cuotaFija": 12264.16,
			"tasa": 17.92
		},
		{
			"limiteinferior": 160577.66,
			"limiteSuperior": 323862,
			"cuotaFija": 17005.47,
			"tasa": 21.36
		},
		{
			"limiteinferior": 323862.01,
			"limiteSuperior": 510451,
			"cuotaFija": 51883.01,
			"tasa": 23.52
		},
		{
			"limiteinferior": 510451.01,
			"limiteSuperior": 974535.03,
			"cuotaFija": 95768.74,
			"tasa": 30
		},
		{
			"limiteinferior": 974535.04,
			"limiteSuperior": 1299380.04,
			"cuotaFija": 234993.95,
			"tasa": 32
		},
		{
			"limiteinferior": 1299380.05,
			"limiteSuperior": 3898140.12,
			"cuotaFija": 338944.34,
			"tasa": 34
		},
		{
			"limiteinferior": 3898140.13,
			"limiteSuperior": Infinity,
			"cuotaFija": 1222522.76,
			"tasa": 35
		}
	];
};

/**
 * Anual Tax brackets 2019-2020
 */
const brackets202019 = () => {
	return [
		{
			"limiteinferior": 0.01,
			"limiteSuperior": 6942.20,
			"cuotaFija": 0,
			"tasa": 1.92
		},
		{
			"limiteinferior": 6942.21,
			"limiteSuperior": 58922.16,
			"cuotaFija": 133.28,
			"tasa": 6.4
		},
		{
			"limiteinferior": 58922.17,
			"limiteSuperior": 103550.44,
			"cuotaFija": 3460.01,
			"tasa": 10.88
		},
		{
			"limiteinferior": 103550.45,
			"limiteSuperior": 120372.83,
			"cuotaFija": 8315.57,
			"tasa": 16
		},
		{
			"limiteinferior": 120372.84,
			"limiteSuperior": 144119.23,
			"cuotaFija": 11007.14,
			"tasa": 17.92
		},
		{
			"limiteinferior": 144119.24,
			"limiteSuperior": 290667.75,
			"cuotaFija": 15262.49,
			"tasa": 21.36
		},
		{
			"limiteinferior": 290667.76,
			"limiteSuperior": 458132.29,
			"cuotaFija": 46565.26,
			"tasa": 23.52
		},
		{
			"limiteinferior": 458132.30,
			"limiteSuperior": 874650.00,
			"cuotaFija": 85952.92,
			"tasa": 30
		},
		{
			"limiteinferior": 874650.01,
			"limiteSuperior": 1166200.00,
			"cuotaFija": 210908.23,
			"tasa": 32
		},
		{
			"limiteinferior": 1166200.01,
			"limiteSuperior": 3498600.00,
			"cuotaFija": 304204.21,
			"tasa": 34
		},
		{
			"limiteinferior": 3498600.01,
			"limiteSuperior": Infinity,
			"cuotaFija": 1097220.21,
			"tasa": 35
		}
	]
};

isrApp();
