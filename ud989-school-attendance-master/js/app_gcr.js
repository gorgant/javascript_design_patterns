/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */
(function() {
    if (!localStorage.attendance) {
        console.log('Creating attendance records...');
        function getRandom() {
            return (Math.random() >= 0.5);
        }

        var nameColumns = $('tbody .name-col'),
            attendance = {};

        nameColumns.each(function() {
            var name = this.innerText;
            attendance[name] = [];

            for (var i = 0; i <= 11; i++) {
                attendance[name].push(getRandom());
            }
        });

        localStorage.attendance = JSON.stringify(attendance);
    }
}());


/* STUDENT APPLICATION */
$(function() {

    var octopus = {

        init: function() {
            view.init();
        },

        // Retrieve attendance data from database
        getAttendance: function() {
            var attendance = JSON.parse(localStorage.attendance);
            return attendance;
        },

        // Count a student's missed days
        countMissing: function() {
            var $allMissed = $('tbody .missed-col')
            $allMissed.each(function() {
                var studentRow = $(this).parent('tr'),
                    dayChecks = $(studentRow).children('td').children('input'),
                    numMissed = 0;

                dayChecks.each(function() {
                    if (!$(this).prop('checked')) {
                        numMissed++;
                    }
                });

                $(this).text(numMissed);
            });
        },

        // When a checkbox is clicked, update localStorage
        updateAttendance: function(newAttendance) {
            localStorage.attendance = JSON.stringify(newAttendance);
        },

    };

    var view = {

        init: function() {
            view.applyBoxChecks();
            octopus.countMissing();
            view.setCheckBoxListeners();
        },

        // Check boxes, based on attendace records
        applyBoxChecks: function() {
            var attendance = octopus.getAttendance();
            $.each(attendance, function(name, days) {
                var studentRow = $('tbody .name-col:contains("' + name + '")').parent('tr'),
                    dayChecks = $(studentRow).children('.attend-col').children('input');

                dayChecks.each(function(i) {
                    $(this).prop('checked', days[i]);
                });
            });
        },

        setCheckBoxListeners: function() {
            var $allCheckboxes = $('tbody input');
            $allCheckboxes.on('click', function() {
                var studentRows = $('tbody .student'),
                    newAttendance = {};

                studentRows.each(function() {
                    var name = $(this).children('.name-col').text(),
                        $allCheckboxes = $(this).children('td').children('input');

                    newAttendance[name] = [];

                    $allCheckboxes.each(function() {
                        newAttendance[name].push($(this).prop('checked'));
                    });
                });

                octopus.countMissing();

                octopus.updateAttendance(newAttendance);
            });
        },
    };

    octopus.init();

}());
