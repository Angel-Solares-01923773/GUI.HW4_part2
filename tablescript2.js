// Name: Angel Solares
// File: tableScript2.js
// Date: 12/4/23
// GUI Assignment: Creates a multiplication table generator.

$.validator.addMethod("greaterThanStart", function (value, element, param) {
    const startValue = parseInt($(param).val());
    const endValue = parseInt(value);
    return endValue >= startValue;
}, "End value should not be smaller than the start value.");

$(document).ready(function () {
    $('#tabs').tabs();
    let generatedTabs = [];

    $('#tabs').tabs();

    // Function to add a new tab
    function addTab(tabId, tabLabel, tableHTML) {
        const tabContent = `
            <div id="${tabId}">
                <p>Parameters: ${tabLabel}</p>
                <table>
                    <!-- Insert your generated table here -->
                    ${tableHTML}
                </table>
            </div>
        `;

        $('#tabs ul').append(`<li><a href="#${tabId}">Table</a><span class="ui-icon ui-icon-close" role="presentation"></span></li>`);
        $('#tabs').append(tabContent);
        $('#tabs').tabs('refresh');
        generatedTabs.push({ id: tabId, label: tabLabel });
    }

    // Event handler for dynamically added close buttons
    $('#tabs').on('click', 'span.ui-icon-close', function () {
        const tabId = $(this).parent().remove().attr('aria-controls'); // Remove the tab element and get its ID
        $(`#${tabId}`).remove(); // Remove tab content
        generatedTabs = generatedTabs.filter(tab => tab.id !== tabId); // Remove tab from the generatedTabs array
        $('#tabs').tabs('refresh');
    });
    
    // Initialize sliders and set up their synchronization with input fields
    $("#sliderMinCol").slider({
        range: "min",
        value: 0,
        min: -50,
        max: 50,
        slide: function (event, ui) {
            $("#inputMinCol_val").val(ui.value);
            $('#startMultiplier').val(ui.value);
            $('#multiplicationForm').valid();
            generateTable(); // Update table on slider slide

        }
    });

    $("#sliderMaxCol").slider({
        range: "min",
        value: 0,
        min: -50,
        max: 50,
        slide: function (event, ui) {
            $("#inputMaxCol_val").val(ui.value);
            $('#endMultiplier').val(ui.value);
            $('#multiplicationForm').valid();
            generateTable(); 

        }
    });

    $("#sliderMinRow").slider({
        range: "min",
        value: 0,
        min: -50,
        max: 50,
        slide: function (event, ui) {
            $("#inputMinRow_val").val(ui.value);
            $('#startMultiplicand').val(ui.value);
            $('#multiplicationForm').valid();
            generateTable(); 

        }
    });

    $("#sliderMaxRow").slider({
        range: "min",
        value: 0,
        min: -50,
        max: 50,
        slide: function (event, ui) {
            $("#inputMaxRow_val").val(ui.value);
            $('#endMultiplicand').val(ui.value);
            $('#multiplicationForm').valid();

            generateTable(); 

        }
    });

    // Synchronize with sliders
    $('#startMultiplier').on('input', function () {
        const value = parseInt($(this).val());
        if (!isNaN(value)) {
            $("#sliderMinCol").slider("value", value);
        }
    });

    $('#endMultiplier').on('input', function () {
        const value = parseInt($(this).val());
        if (!isNaN(value)) {
            $("#sliderMaxCol").slider("value", value);
        }
    });

    $('#startMultiplicand').on('input', function () {
        const value = parseInt($(this).val());
        if (!isNaN(value)) {
            $("#sliderMinRow").slider("value", value);
        }
    });

    $('#endMultiplicand').on('input', function () {
        const value = parseInt($(this).val());
        if (!isNaN(value)) {
            $("#sliderMaxRow").slider("value", value);
        }
    });

    
    $('#multiplicationForm').validate({
        rules: {
            startMultiplier: {
                required: true,
                number: true
            },
            endMultiplier: {
                required: true,
                number: true,
                greaterThanStart: "#startMultiplier" // Validate against the startMultiplier field
            },
            startMultiplicand: {
                required: true,
                number: true
            },
            endMultiplicand: {
                required: true,
                number: true,
                greaterThanStart: "#startMultiplicand" // Validate against the startMultiplicand field
            }
        },
        messages: {
            startMultiplier: {
                required: "&nbsp;&nbsp; Please enter a start multiplier.&nbsp;&nbsp;",
                number: "&nbsp;&nbsp;Please enter a valid number.; &nbsp;&nbsp;"
            },
            endMultiplier: {
                required: "&nbsp;&nbsp; Please enter an end multiplier.",
                number: "&nbsp;&nbsp; Please enter a valid number."
            },
            startMultiplicand: {
                required: "&nbsp;&nbsp;Please enter a start multiplicand.&nbsp;&nbsp;",
                number: "&nbsp;&nbsp;Please enter a valid number."
            },
            endMultiplicand: {
                required: "&nbsp;&nbsp;Please enter an end multiplicand. ",
                number: "Please enter a valid number."
            }
        },
        errorPlacement: function (error, element) {
            error.insertAfter(element); // Position error messages after the input
        },
        submitHandler: function (form) {
            if ($('#multiplicationForm').valid()) {
                generateTable(); // Table generation if valid
            } else {
                alert("Please fill all fields correctly."); // Show an error message if invalid
            }
            return false; 
        }

    });

    function generateTable() {
        const startMultiplier = parseInt($('#startMultiplier').val());
        const endMultiplier = parseInt($('#endMultiplier').val());
        const startMultiplicand = parseInt($('#startMultiplicand').val());
        const endMultiplicand = parseInt($('#endMultiplicand').val());

        const minRange = -50;
        const maxRange = 50;

        const validStartMultiplier = Math.max(minRange, Math.min(maxRange, startMultiplier));
        const validEndMultiplier = Math.max(minRange, Math.min(maxRange, endMultiplier));
        const validStartMultiplicand = Math.max(minRange, Math.min(maxRange, startMultiplicand));
        const validEndMultiplicand = Math.max(minRange, Math.min(maxRange, endMultiplicand));

        let tableHTML = '<tr><th></th>';

        for (let i = validStartMultiplier; i <= validEndMultiplier; i++) {
            tableHTML += `<th>${i}</th>`;
        }
        tableHTML += '</tr>';

        for (let i = validStartMultiplicand; i <= validEndMultiplicand; i++) {
            tableHTML += `<tr><th>${i}</th>`;
            for (let j = validStartMultiplier; j <= validEndMultiplier; j++) {
                tableHTML += `<td>${i * j}</td>`;
            }
            tableHTML += '</tr>';
        }

        $('#tableBody').html(tableHTML);
        event.preventDefault();


        const tabLabel = `Multipliers: ${validStartMultiplier}-${validEndMultiplier}, Multiplicands: ${validStartMultiplicand}-${validEndMultiplicand}`;

        // Check if the tab already exists
        const existingTab = generatedTabs.find(tab => tab.label === tabLabel);
        if (existingTab) {
            $('#tabs ul li a[href="#' + existingTab.id + '"]').trigger('click');
            return;
        }

        const tabId = `tab-${Date.now()}`;
        addTab(tabId, tabLabel, tableHTML);

    const tabContent = `
        <div id="tab-${Date.now()}">
            <p>Parameters: ${tabLabel}</p>
            <table>
                <!-- Insert your generated table here -->
                ${tableHTML}
            </table>
        </div>
    `;

    $('#tabs ul').append(`<li><a href="#tab-${Date.now()}">Table</a></li>`);
    $('#tabs').append(tabContent);
    $('#tabs').tabs('refresh');
    }
});