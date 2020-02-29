const calcController = (function () {



})();

const UIController = (function () {

    let DOMstrings = {
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
    };

    function getCheckedValue(list) {
        for (let i = 0; i < list.length; i++) {
            if (list[i].checked) {
                return list[i].value;
            }
        }
    };

    return {
        getInput: function() {

            return {
                scale: getCheckedValue(document.getElementsByName(DOMstrings.scale_name)),

                customer: getCheckedValue(document.getElementsByName(DOMstrings.customer_name)),

                type: getCheckedValue(document.getElementsByName(DOMstrings.type_name)),
            }
        },

        getDOMstrings: function () {
            return DOMstrings;
        }
    };

})();

let controller = (function (calcCtrl, UICtrl) {

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
    };

    return {
        init: function () {
            setupEventListeners();
        }
    }

})(calcController, UIController);

controller.init();