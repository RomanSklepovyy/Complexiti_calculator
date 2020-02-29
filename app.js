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
        development_indicators: [],
        expense_factors: []
    };


})();

const UIController = (function () {

    let DOMstrings = {
        name: '.add__name',
        language: '.add_lang',
        submit_button: '.calculate_button',
        scale_name: 'scale',
        customer_name: 'customer',
        type_name: 'type',
        dev_table_names: getNameMass('dev-table-', 5),
        exp_table_names: getNameMass('exp-table-', 7)

    };

    function getNameMass(string, amount) {
        let mass = [];
        for (let i = 0; i < amount; i++) {
            mass[i] = string + (i+1);
        }
        return mass;
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

        getDOMstrings: function () {
            return DOMstrings;
        }
    };

})();

let controller = (function (calcCtrl, UICtrl) {

    let translator = new Map();
    translator.set('others', );
    translator.set('java', );
    translator.set('cpp', );
    translator.set('cs', );
    translator.set('html', );
    translator.set('js' );
    translator.set('css', );
    translator.set('python', );

    translator.set('scale-1', );
    translator.set('scale-2', );
    translator.set('scale-3', );
    translator.set('scale-4', );
    translator.set('scale-5', );
    translator.set('scale-6', );

    translator.set('customer-1', );
    translator.set('customer-2', );
    translator.set('customer-3', );

    translator.set('type-1', );
    translator.set('type-2', );
    translator.set('type-3', );
    translator.set('type-4', );
    translator.set('type-5', );

    translator.set('dev-table-1-1',);
    translator.set('dev-table-1-2',);
    translator.set('dev-table-1-3',);
    translator.set('dev-table-2-1',);
    translator.set('dev-table-2-2',);
    translator.set('dev-table-2-3',);
    translator.set('dev-table-3-1',);
    translator.set('dev-table-3-2',);
    translator.set('dev-table-3-3',);
    translator.set('dev-table-4-1',);
    translator.set('dev-table-4-2',);
    translator.set('dev-table-4-3',);
    translator.set('dev-table-5-1',);
    translator.set('dev-table-5-2',);
    translator.set('dev-table-5-3',);

    translator.set('exp-table-1-1',);
    translator.set('exp-table-1-2',);
    translator.set('exp-table-1-3',);
    translator.set('exp-table-2-1',);
    translator.set('exp-table-2-2',);
    translator.set('exp-table-2-3',);
    translator.set('exp-table-3-1',);
    translator.set('exp-table-3-2',);
    translator.set('exp-table-3-3',);
    translator.set('exp-table-4-1',);
    translator.set('exp-table-4-2',);
    translator.set('exp-table-4-3',);
    translator.set('exp-table-5-1',);
    translator.set('exp-table-5-2',);
    translator.set('exp-table-5-3',);
    translator.set('exp-table-6-1',);
    translator.set('exp-table-6-2',);
    translator.set('exp-table-6-3',);
    translator.set('exp-table-7-1',);
    translator.set('exp-table-7-2',);
    translator.set('exp-table-7-3',);




    let setupEventListeners = function () {
        let DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.submit_button).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13 || e.which === 13) {
                ctrlAddItem();
            }
        })
    };

    let ctrlAddItem = function () {

        let input = UICtrl.getInput();
        console.log(input);

        console.log(isCorrectDataArray(input.dev_table));
        console.log(isCorrectData(input.name, input.language, input.scale, input.type));

    };

    let isCorrectDataArray = function(arr) {
        for (let i = 0; i < arr.length; i++) {
            if (!arr[i]) {
                return false;
            }
        }
        return true;
    };

    let isCorrectData = function (...values) {
      for (let i = 0; i < values.length; i++){
          if (!values[i]) {
              return false;
          }
      }
      return true;
    };

    return {
        init: function () {
            setupEventListeners();
        }
    }

})(calcController, UIController);

controller.init();