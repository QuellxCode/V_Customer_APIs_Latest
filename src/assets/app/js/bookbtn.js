var checkboxes = $("input[type='checkbox']"),
    BookButt = $("input[type='submit']");

checkboxes.click(function() {
    BookButt.attr("disabled", !checkboxes.is(":checked"));
});