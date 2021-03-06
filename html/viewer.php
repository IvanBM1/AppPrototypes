<?php
/// Include DataLatte
include 'latte/latte.php';

// Load app
LatteModule::loadMain('app.viewer','es');


/// Create document
$doc = new Document(true);

tag("meta")->attr("charset", "utf-8")->addTo($doc->head);

tag("meta")
	->attr("http-equiv", "X-UA-Compatible")
	->attr("content", "IE=edge")
	->addTo($doc->head);

$metas = array(
	array("viewport", "width=device-width, initial-scale=1.0"),
	array("mobile-web-app-capable", "yes"),
	array("apple-mobile-web-app-capable", "yes"),
	array("theme-color", "#303F9F"),
	array("msapplication-navbutton-color", "#303F9F"),
	array("apple-mobile-web-app-status-bar-style", "black-translucent"),
	array("apple-mobile-web-app-title", $appName),
	array("format-detection", "telephone=no")
);

foreach ($metas as $meta) {
	// Extract data
	list($name, $content) = $meta;

	tag("meta")
		->attr("name", "$name")
		->attr("content", "$content")->addTo($doc->head);
}

/// Title of document
$doc->title->text($strings['appName']);

/// Add core and app tags
foreach(LatteModule::$loadedModules as $module){
	$doc->head->add($module->getTags());
}

$doc->addCss('../support/addFonts.css');

// Mount point
$doc->body->add(tag('div.mount-point'));

//Get info
$guid = isset($_GET['guid'])? $_GET['guid']	: null;

/// Load javascript main
$doc->addScript("window['idproject'] = '$idproject'");
$doc->addScript("window['idcategory'] = '$idcategory'");
$doc->addScript("window['guid'] = '$guid' ");
$doc->addScript("window.addEventListener('load', function() { new latte.Viewer() });");