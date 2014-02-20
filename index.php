<!DOCTYPE html>
<html lang="en" dir="ltr">
	<head>
		<meta charset="UTF-8">
		<title>LifeCal</title>
		<link rel="icon" type="image/png" href="/imagery/LifeCal-ident.png" />

		<!--CSS-->
		<link rel="stylesheet" type="text/css" href="/css/style.css">
		<link rel="stylesheet" type="text/css" href="/css/fullcalendar.css">
		<link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/themes/smoothness/jquery-ui.css" />

		<!--Script-->
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
		<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min.js"></script>
		<script src="//ajax.googleapis.com/ajax/libs/mootools/1.4.5/mootools-yui-compressed.js"></script>
		<script src="//cdnjs.cloudflare.com/ajax/libs/fullcalendar/1.6.4/fullcalendar.min.js"></script>
		<script src="//cdnjs.cloudflare.com/ajax/libs/fullcalendar/1.6.4/gcal.js"></script>
		<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?libraries=places&sensor=false"></script>
		<script src="/script/gconf.js"></script>
		<script src="/script/other/bpopup.min.js"></script>
		<script src="https://apis.google.com/js/client.js?onload=OnLoadCallback"></script>
		<script src="https://apis.google.com/js/client.js?onload=handleClientLoad"></script>
		<script src="/script/other/spidergraph.js"></script>
		<script src="/script/main.js"></script>
		<script src="/script/locator.js"></script>
		<script src="/script/suggestor.js"></script>
		<script src="/script/structures.js"></script>
		
	</head>
	<body>
		<div id='header'>
			<div id="banner">
				<img src="/imagery/LifeCal-logo.png" />
			</div>
			<!-- Using jQuery spidergraph  - https://github.com/jmstriegel/jquery.spidergraph/ -->
			<div id="graphbox"><div id="spidergraph"></div></div>
		</div>

		<div id="calendar"></div>

		<div id='output' class='output'></div>
		<div id='gmap_canvas' class='gmap_canvas'></div>


		<div id='popupBox'><img src='imagery/coffee.png'></div>
		
	</body>
</html>
