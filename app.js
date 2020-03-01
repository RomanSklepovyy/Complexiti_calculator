const calcController = (function () {

    let data = {
        k1: 0,
        k2: 0,
        k3: 0,
        functional_size: 0,
        code_size: 0,
        language_coefficient: 0,
        scale_index: 0,
        expanse_index: 0,
        complexity_index: 0,
        development_indicators: [],
        expense_factors: []
    };

    function calculateFuncSize() {
        data.functional_size = Math.pow((data.k1 + data.k2 + data.k3), 2.35);
    }

    function calculateCodeSize() {
        data.code_size = (data.functional_size * data.language_coefficient)/1000;
    }

    function calculateScaleIndex() {
        let temp = 0;

        for (let i = 0; i < data.development_indicators.length; i++) {
            temp += data.development_indicators[i];
        }

        data.scale_index = 0.91 + 0.01 * temp;
    }

    function calculateExpenseIndex() {
        let temp = 1;

        for (let i = 0; i < data.development_indicators.length; i++) {
            temp *= data.expense_factors[i];
        }

        data.expanse_index = temp;
    }

    function calculateComplexityIndex() {
        data.complexity_index = 2.94 * Math.pow(data.code_size, data.scale_index) * data.expanse_index;
    }

    return {

        setData: function (obj) {
            data.k1 = obj.scale;
            data.k2 = obj.customer;
            data.k3 = obj.type;
            data.language_coefficient = obj.language;
            data.development_indicators = obj.dev_table;
            data.expense_factors = obj.exp_table;
        },

        calculateComplexity: function () {

            // Calculate functional size
            calculateFuncSize();

            // Calculate code size
            calculateCodeSize();

            // Calculate scale index
            calculateScaleIndex();

            // Calculate expanse index
            calculateExpenseIndex();

            // Calculate T (complexity index)
            calculateComplexityIndex();
        },

        getMessageData: function () {
            return {
                complexity: data.complexity_index,
                code_size: data.code_size,
                scale: data.scale_index,
                expense: data.expanse_index
            }
        },
    }
})();


// UI ------------------------------------------------------------------------------------------------------------

const UIController = (function () {

    let DOMstrings = {
        name: '.add__name',
        language: '.add_lang',
        submit_button: '.calculate_button',
        scale_name: 'scale',
        customer_name: 'customer',
        type_name: 'type',
        dev_table_names: getNameMass('dev-table-', 5),
        exp_table_names: getNameMass('exp-table-', 7),
        last_container: '.last_container',
        error: 'error',
        scale_class: '.scale',
        customer_class: '.customer',
        type_class: '.type'
    };

    function getNameMass(string, amount) {
        let mass = [];
        for (let i = 0; i < amount; i++) {
            mass[i] = string + (i+1);
        }
        return mass;
    }

    function setCheckedFalse(...arr) {
        let temp = [];

        for (let i = 0; i < arr.length; i++) {

            temp = document.getElementsByName(arr[i]);

            for (let i = 0; i < temp.length; i++) {
                if (temp[i].checked) {
                    temp[i].checked = false;
                    break;
                }
            }
        }
    }



    function getCheckedValue(name) {
        let list = document.getElementsByName(name);

        for (let i = 0; i < list.length; i++) {
            if (list[i].checked) {
                return list[i].value;
            }
        }
    }

    function getCheckedValues(names) {
        let resultArr = [];
        for (let i = 0; i < names.length; i++) {
            resultArr[i] = getCheckedValue(names[i]);
        }
        return resultArr;
    }

    return {
        getInput: function() {

            return {
                name: document.querySelector(DOMstrings.name).value,
                language: document.querySelector(DOMstrings.language).value,
                scale: getCheckedValue(DOMstrings.scale_name),
                customer: getCheckedValue(DOMstrings.customer_name),
                type: getCheckedValue(DOMstrings.type_name),
                dev_table: getCheckedValues(DOMstrings.dev_table_names),
                exp_table: getCheckedValues(DOMstrings.exp_table_names)
            }
        },

        clearData: function() {

            setCheckedFalse(DOMstrings.scale_name, DOMstrings.customer_name, DOMstrings.type_name,
                ...DOMstrings.dev_table_names, ...DOMstrings.exp_table_names);

            document.querySelector(DOMstrings.name).value = '';
            document.querySelector(DOMstrings.language).value = 'others';
        },

        displayResult: function(name, obj) {
            let html, newHtml, element;

            element = DOMstrings.last_container;

            html = '<div class="alert_result">\n' +
                    '    <h2>Результат розрахунку для "%name%":</h2>\n' +
                    '    <p>Очікувана кількість рядків коду: %size% (тис. логічних рядків вихідного коду)</p>\n' +
                    '    <p>Показник витрат: %exp%</p>\n' +
                    '    <p>Показник масштабу: %scale%</p>\n' +
                    '    <p>Трудомісткість розробки: %complexity% (людино-місяці)</p>\n' +
                    '</div>';


            // Replace placeholder text
            newHtml = html.replace('%name%', name);
            newHtml = newHtml.replace('%size%', obj.code_size.toFixed(3));
            newHtml = newHtml.replace('%exp%', obj.expense.toFixed(3));
            newHtml = newHtml.replace('%scale%', obj.scale.toFixed(3));
            newHtml = newHtml.replace('%complexity%', obj.complexity.toFixed(3));

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('afterend', newHtml);
        },

        displayError: function(input) {
            if (!input.name) document.querySelector(DOMstrings.name).parentNode.parentNode.classList.add(DOMstrings.error);
            if (!input.scale) document.querySelector(DOMstrings.scale_class).classList.add(DOMstrings.error);
            if (!input.customer) document.querySelector(DOMstrings.customer_class).classList.add(DOMstrings.error);
            if (!input.type) document.querySelector(DOMstrings.type_class).classList.add(DOMstrings.error);

            document.querySelector('.error').scrollIntoView(true);
            window.scrollBy(0, -50);


        },

        getDOMstrings: function () {
            return DOMstrings;
        }
    };

})();


// Controller --------------------------------------------------------------------------------------------

let controller = (function (calcCtrl, UICtrl) {

    let translator = new Map();
    translator.set('others', 105.0);
    translator.set('java', 55.0);
    translator.set('cpp', 53.0);
    translator.set('cs', 58.0);
    translator.set('html', 15.0);
    translator.set('js', 54.0);
    translator.set('sql', 13.0);

    translator.set('scale-1', 1);
    translator.set('scale-2', 8);
    translator.set('scale-3', 9);
    translator.set('scale-4', 10);
    translator.set('scale-5', 12);
    translator.set('scale-6', 13);

    translator.set('customer-1', 8);
    translator.set('customer-2', 14);
    translator.set('customer-3', 15);

    translator.set('type-1', 1);
    translator.set('type-2', 6);
    translator.set('type-3', 8);
    translator.set('type-4', 11);
    translator.set('type-5', 15);

    translator.set('dev-table-1-1', 4.96);
    translator.set('dev-table-1-2', 3.72);
    translator.set('dev-table-1-3', 2.48);
    translator.set('dev-table-2-1', 4.05);
    translator.set('dev-table-2-2', 3.04);
    translator.set('dev-table-2-3', 2.03);
    translator.set('dev-table-3-1', 5.65);
    translator.set('dev-table-3-2', 4.24);
    translator.set('dev-table-3-3', 2.83);
    translator.set('dev-table-4-1', 4.38);
    translator.set('dev-table-4-2', 3.29);
    translator.set('dev-table-4-3', 2.19);
    translator.set('dev-table-5-1', 6.24);
    translator.set('dev-table-5-2', 4.68);
    translator.set('dev-table-5-3', 3.12);

    translator.set('exp-table-1-1', 1.2);
    translator.set('exp-table-1-2', 1.0);
    translator.set('exp-table-1-3', 0.83);
    translator.set('exp-table-2-1', 0.83);
    translator.set('exp-table-2-2', 1.0);
    translator.set('exp-table-2-3', 1.33);
    translator.set('exp-table-3-1', 0.87);
    translator.set('exp-table-3-2', 1.0);
    translator.set('exp-table-3-3', 1.29);
    translator.set('exp-table-4-1', 0.95);
    translator.set('exp-table-4-2', 1.0);
    translator.set('exp-table-4-3', 1.07);
    translator.set('exp-table-5-1', 1.22);
    translator.set('exp-table-5-2', 1.0);
    translator.set('exp-table-5-3', 0.87);
    translator.set('exp-table-6-1', 1.1);
    translator.set('exp-table-6-2', 1.0);
    translator.set('exp-table-6-3', 0.87);
    translator.set('exp-table-7-1', 1.14);
    translator.set('exp-table-7-2', 1.0);
    translator.set('exp-table-7-3', 1.0);




    let setupEventListeners = function () {
        let DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.submit_button).addEventListener('click', ctrlAddData);

        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13 || e.which === 13) {
                ctrlAddData();
            }
        })
    };

    let ctrlAddData = function () {

        // Get input from the UI
        let input = UICtrl.getInput();

        //If all data available replace to numbers it
        let  inputNumbers;

        // If data is true do calc else find and display error
        if (isCorrectData(input.name, input.language, input.scale, input.type)
                          && isCorrectData(...input.dev_table) && isCorrectData(...input.exp_table)) {

            inputNumbers = getItemWithNumbers(input);

            // Do calculations
            calcCtrl.setData(inputNumbers);
            calcCtrl.calculateComplexity();

            //Clear fields
            UICtrl.clearData();

            // Display it to the UI
            UICtrl.displayResult(input.name, calcCtrl.getMessageData());

        } else {
            UICtrl.displayError(input);
        }


    };

    let getItemWithNumbers = function(obj) {
        return {
            language: translator.get(obj.language),
            scale: translator.get(obj.scale),
            customer: translator.get(obj.customer),
            type: translator.get(obj.type),
            dev_table: replaceToNumbers(obj.dev_table),
            exp_table: replaceToNumbers(obj.exp_table)
        }
    };

    let isCorrectData = function (...values) {
      for (let i = 0; i < values.length; i++){
          if (!values[i]) {
              return false;
          }
      }
      return true;
    };

    let replaceToNumbers = function (arr) {
        let temp = [];
        for (let i = 0; i < arr.length; i++){
            temp[i] = translator.get(arr[i]);
        }
        return temp;
    };

    return {
        init: function () {
            setupEventListeners();
        }
    }

})(calcController, UIController);

controller.init();