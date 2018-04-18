function loadFile() {
  $id = "#test";
  // Get file
  $file = $("#select")[0].options[$("#select")[0].selectedIndex].value;
  console.log($file);
	$json = null;
	$place_value = "Error parsing json file.";
	$.ajax({
    dataType: "json",
    url: $file,
    data: null,
    success: function(json) {
      console.log("Success");
      $json = json; // this will show the info it in firebug console
      console.log(typeof $json);
      if (typeof $json == 'object') {
        $place_value = JSON.stringify($json);
        $($id).html("<p>" + $place_value + "</p>");
      }
    },
    error: function(xhr, textStatus, errorThrown){
       console.log("Request failed");
    }
  }); 
	$($id).html("<p>" + $place_value + "</p>");
}
$(document).ready(function(){
  for (var i = 0; i < 500; i++ ) {
  $("#gibberish")[0].append(Math.random() + " ");
}
  $('#gibberish').bind('mousewheel', function (e) {
      var delta = e.originalEvent.wheelDelta;
      // if scrolled down
      if (delta < 0) {
        // lol im tired of this
          $("#gibberish")[0].append(Math.random() + " ");
          $("#gibberish")[0].append(Math.random() + " ");
          $("#gibberish")[0].append(Math.random() + " ");
          $("#gibberish")[0].append(Math.random() + " ");$("#gibberish")[0].append(Math.random() + " ");
          $("#gibberish")[0].append(Math.random() + " ");
          $("#gibberish")[0].append(Math.random() + " ");
          $("#gibberish")[0].append(Math.random() + " ");$("#gibberish")[0].append(Math.random() + " ");$("#gibberish")[0].append(Math.random() + " ");$("#gibberish")[0].append(Math.random() + " ");$("#gibberish")[0].append(Math.random() + " ");$("#gibberish")[0].append(Math.random() + " ");
      }
  });
});
