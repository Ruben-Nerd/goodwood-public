console.log("Starting");
$(document).ready(function () {
	$("#incanda-cb").prop("disabled", true),
		$("#elk-cb").prop("disabled", true),
		$("#myPlace-cb").prop("disabled", true),
		$("#bond-price-cb").prop("disabled", true),
		$("#viewGameNowBtn").hide(),
		$("#viewGameNowBtn").on("click", function () {
			startGame();
		});
});

let totalNumberOfAddons = 2;

var addonsSelected = [],
	additionalAddonsSelected = [];

let totalUnitCostDiv = $(".total_unit_cost"),
	totalCostHiddenInput = $("#totalCostHiddenInput"),
	unitIDInput = $("#unitIDInput");

var unityGame,
	totalUnitCost = 0,
	unitCostValues = {addOn: 0},
	selectedUnitNo = "",
	selectedUnitID = "",
	unitImage = "",
	gameLoaded = false,
	selectedUnitXraiIframeLink = "";

$("a[data-unit-floor-plan-button='true']").click(function () {
	//console.log("input[data-unit-button='unitButton" + $(this).attr("data-unit-number") + "']");
	$("input[data-unit-button='unitButton" + $(this).attr("data-unit-number") + "']").click();
});

$("a[data-unit-floor-select-button='true']").mouseup(function () {
	if ( $("a[data-configurator-floor-number='" + $(this).attr("data-selection-floor-number") + "']").hasClass('w--current') == false ) {
		$("a[data-configurator-floor-number='" + $(this).attr("data-floor-number") + "']").click();
		event.preventDefault();
	}
	if ( $("a[data-selection-floor-number='" + $(this).attr("data-selection-floor-number") + "']").hasClass('w--current') == false ) {
		$("a[data-selection-floor-number='" + $(this).attr("data-floor-number") + "']").click();
		event.preventDefault();
	}
});

$("a[data-unit-selection-floor-select-button='true']").mouseup(function () {
	if ( $("a[data-configurator-floor-number='" + $(this).attr("data-selection-floor-number") + "']").hasClass('w--current') == false ) {
		$("a[data-configurator-floor-number='" + $(this).attr("data-selection-floor-number") + "']").click();
		event.preventDefault();
	}
});

$("a[data-unit-configurator-floor-select-button='true']").mouseup(function ( e ) {
	if ( $("a[data-selection-floor-number='" + $(this).attr("data-configurator-floor-number") + "']").hasClass('w--current') == false ) {
		$("a[data-selection-floor-number='" + $(this).attr("data-configurator-floor-number") + "']").click();
		event.preventDefault();
	}
});

window.addEventListener("message", function ( e ) {
	switch ( e.data ) {
		case "furnitureInGamePressedOn":
			document.getElementById("xrai-iframe").contentWindow.postMessage("turnFurnitureOn", "*");
			if ( $("#upgrade-1-cb").prop("checked") == false ) {
				$("#upgrade-1-cb").click();
			}
			break;
		case "furnitureInGamePressedOff":
			document.getElementById("xrai-iframe").contentWindow.postMessage("turnFurnitureOff", "*");
			if ( $("#upgrade-1-cb").prop("checked") ) {
				$("#upgrade-1-cb").click();
			}
			break;
		case "upgradeInGamePressedOn":
			document.getElementById("xrai-iframe").contentWindow.postMessage("turnUpgradeOn", "*");
			if ( $("#upgrade-2-cb").prop("checked") == false ) {
				$("#upgrade-2-cb").click();
			}
			break;
		case "upgradeInGamePressedOff":
			document.getElementById("xrai-iframe").contentWindow.postMessage("turnUpgradeOff", "*");
			if ( $("#upgrade-2-cb").prop("checked") ) {
				$("#upgrade-2-cb").click();
			}
			break;
		case "gameLoaded":

			setTimeout(function () {
				addonsSelected.forEach(function ( addonName ) {
					switch ( addonName ) {
						case "upgrade-1":
							//Furniture
							document.getElementById("xrai-iframe").contentWindow.postMessage("turnFurnitureOn", "*");
							break;
						case "upgrade-2":
							//Appliance
							document.getElementById("xrai-iframe").contentWindow.postMessage("turnUpgradeOn", "*");
							break;
					}
				});
			}, 1000);

			break;
	}
});

window.FurniturePressed = function () {
	console.log("Furniture pressed inside game");
}

window.Upgrade = function () {
	console.log("Upgrade pressed inside game");
}

$("input[data-total-contribute='true']").click(function () {
	switch ($(this).data("class")) {
		case "unit":
			selectedUnitXraiIframeLink = $(this).attr('data-xrai-iframe-link');

			$(".furniture-info").css("display", "none");

			$("#appliance-info-wrapper").fadeIn(250);

			$("input[data-filter-unit-type-name='" + $(this).attr('data-unit-type-name') + "']").click();

			$("#xrai-iframe").src = "";
			$("#3d-walkthrough-curtain").css("display", "flex");
			$("#3d-walkthrough-curtain").css("opacity", "1");

			/*$("#unit-image").fadeOut(500);
			$("#unit-image").attr("src", $(this).data('base-image'));
			$("#unit-image").attr("srcset", $(this).data('base-image'));
			$("#unit-image").fadeIn(500);*/

			var unitRadio = $(this);
			$("#unit-image").fadeOut(0, function () {
				$(this).attr("src", unitRadio.data('base-image')).attr("srcset", unitRadio.data('base-image')).fadeIn(0);
			});

			$("#upgrade-1-cb").prop("disabled", false);
			$("#upgrade-2-cb").prop("disabled", false);
			$("#bond-price-cb").prop("disabled", false);
			$("#viewGameNowBtn").prop("disabled", false);
			$("#myPlace-cb").prop("disabled", false);
			$("#viewGameNowBtn").html("View Now");
			$("#game-disabled-text").hide();
			$("#viewGameNowBtn").show();

			//$("#cart-container").css("display", "block");
			$("#cart-container").fadeIn(500);

			$("#cart-unit-price").html("R " + numberWithSpaces($(this).data("price")));

			unitIDInput.val($(this).data("unit-id"));
			unitCostValues.unit = $(this).data("price");

			$("#upgrade-1-cb").attr("data-price", $(this).data("upgrade-1-price"));
			$("#upgrade-2-cb").attr("data-price", $(this).data("upgrade-2-price"));
			$("#bond-price-cb").attr("data-price", $(this).data("bond-price"));
			$('#myPlace-cb').attr('data-price', $(this).data('myplace-price'));

			//$("#incanda-cb").attr("data-image", $(this).data(''));

			$("#upgrade-1-price-label").html("R " + numberWithSpaces($(this).data("upgrade-1-price")));
			$("#upgrade-2-price-label").html("R " + numberWithSpaces($(this).data("upgrade-2-price")));

			// Set upgrade data image attributes
			$("#upgrade-1-cb").attr("data-upgrade-image", $(this).attr("data-upgrade-1-image"));
			$("#upgrade-2-cb").attr("data-upgrade-image", $(this).attr("data-upgrade-2-image"));

			$("#upgrade-1-cb").attr("data-upgrade-both-image", $(this).attr("data-upgrade-both-image"));
			$("#upgrade-2-cb").attr("data-upgrade-both-image", $(this).attr("data-upgrade-both-image"));

			$("#upgrade-1-cb").attr("data-base-unit-image", $(this).attr("data-base-image"));
			$("#upgrade-2-cb").attr("data-base-unit-image", $(this).attr("data-base-image"));

			$("#bond-price-label").html("R " + numberWithSpaces($(this).data("bond-price")));
			$("#myplace-price-label").html("R " + numberWithSpaces($(this).data('myplace-price')));

			for (let i = 1; i < 100; i++) {
				if ($(".unit-" + i).length <= 0) {
					break;
				}
				$(".unit-" + i).css("display", "none");
			}

			$(".unit-" + $(this).data("unit-number")).fadeIn(500);

			unitCostValues.addOn = 0;
			addonsSelected.forEach(function (item, index, arr) {
				addOnSelected($("input[data-image-class-name='" + item + "']"));
			});

			additionalAddonsSelected.forEach(function (item, index, arr) {
				addOnSelected($("input[data-image-class-name='" + item + "']"));
			});

			selectedUnitNo = $(this).data("unit-number");
			selectedUnitID = $(this).data("unit-id");

			$(".unitIDInput").each(function (i, obj) {
				$(obj).val(selectedUnitID);
			});

			$(".unitNameNumberHiddenInput").each(function (i, obj) {
				$(obj).val(selectedUnitNo);
			});

			break;
		case "add-on":
			addOnSelected($(this));
			break;
	}

	totalUnitCost = 0;
	for (const key in unitCostValues) {
		var price = unitCostValues[key];
		var type = key;
		totalUnitCost += price;
	}

	totalUnitCostDiv.each(function (i, obj) {
		$(obj).html("R " + numberWithSpaces(totalUnitCost));
	});
	totalCostHiddenInput.val("R " + numberWithSpaces(totalUnitCost));

	$(".totalCostHiddenInput").each(function (i, obj) {
		$(obj).val("R " + numberWithSpaces(totalUnitCost));
	});
});

function numberWithSpaces(n) {
	var r = n.toString().split(".");
	return (r[0] = r[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ")), r.join(".");
}

function addOnSelected ( addonCheck ) {

	/*console.log(addonCheck);
	console.log(addonCheck.prop("checked"));*/

	if ( addonCheck.prop("checked") ) {

		unitCostValues.addOn += parseInt(addonCheck.attr("data-price"));
		$("." + addonCheck.data("image-class-name") + "UpgradeHiddenInput").each(function (a, e) {
			$(e).val("Yes");
		});

		$("#cart-" + addonCheck.data("image-class-name") + "-wrap").css("display", "flex");
		$("#cart-" + addonCheck.data("image-class-name") + "-price").html("R " + numberWithSpaces(addonCheck.attr("data-price")));

		if ( addonCheck.data("addon-counter") ) {
			if ( addonsSelected.indexOf(addonCheck.data("image-class-name")) < 0 ) {
				addonsSelected.push(addonCheck.data("image-class-name"));
			}

			//Update unit image
			if ( addonsSelected.indexOf(addonCheck.data("image-class-name")) < 0 ) {
				addonsSelected.push(addonCheck.data("image-class-name"))
			}

			//let addonImageSelector = addonCheck.data("image-class-name");
			if ( addonsSelected.length == totalNumberOfAddons ) {
				//addonImageSelector = "both";
				//Both addons selected
				$("#unit-image").attr("src", addonCheck.attr('data-upgrade-both-image'));
				$("#unit-image").attr("srcset", addonCheck.attr('data-upgrade-both-image'));
			} else {
				$("#unit-image").attr("src", addonCheck.attr('data-upgrade-image'));
				$("#unit-image").attr("srcset", addonCheck.attr('data-upgrade-image'));
			}

			$("."+ addonCheck.attr("data-image-class-name") +"HiddenInput").each(function (i, obj) {
				$(obj).val("Yes");
			});
			switch ( addonCheck.attr("data-image-class-name") ) {
				case "upgrade-1":
					//Furniture Selected - Show furniture wrapper

					setTimeout(function () {
						//$("#" + addonCheck.attr("data-image-class-name") + "-InfoWrapper").fadeIn(250);
						$(".furniture-info").fadeIn(5);
					}, 250);
					document.getElementById("xrai-iframe").contentWindow.postMessage("turnFurnitureOn", "*");
					break;
				case "upgrade-2":
					//Appliance upgrade selected - De-select Appliance basic
					if ( $("#appliance-basic-cb").prop("checked") == true ) {
						$("#appliance-basic-cb").click();
					}
					document.getElementById("xrai-iframe").contentWindow.postMessage("turnUpgradeOn", "*");
					break;
			}
			if ( gameLoaded ) {
				//Add addon switch here
			}
		} else {
			if ( additionalAddonsSelected.indexOf(addonCheck.data("image-class-name")) < 0 ) {
				additionalAddonsSelected.push(addonCheck.data("image-class-name"));
			}
		}
	} else {
		unitCostValues.addOn -= parseInt(addonCheck.attr("data-price"));
		$("." + addonCheck.data("image-class-name") + "UpgradeHiddenInput").each(function (a, e) {
			$(e).val("No");
		});
		$("#cart-" + addonCheck.data("image-class-name") + "-wrap").css("display", "none");
		$("#cart-" + addonCheck.data("image-class-name") + "-price").html("R " + numberWithSpaces(0));
		if ( addonCheck.data("addon-counter") ) {
			let e = addonsSelected.indexOf(addonCheck.data("image-class-name"));
			if ( e > -1 ) {
				addonsSelected.splice(e, 1);
			}

			//Update unit image
			if ( addonsSelected.length > 0 ) {
				addonsSelected.forEach(function (a, e, d) {
					$("#unit-image").attr("src", $("#" + a + "-cb").attr('data-upgrade-image'));
					$("#unit-image").attr("srcset", $("#" + a + "-cb").attr('data-upgrade-image'));
				});
			} else {
				//Show bare unit image
				$("#unit-image").attr("src", addonCheck.attr('data-base-unit-image'));
				$("#unit-image").attr("srcset", addonCheck.attr('data-base-unit-image'));
			}

			$("."+ addonCheck.attr("data-image-class-name") +"HiddenInput").each(function (i, obj) {
				$(obj).val("No");
			});

			switch ( addonCheck.attr("data-image-class-name") ) {
				case "upgrade-1":
					//Furniture de-selected - Hide furniture wrapper
					setTimeout(function () {
						//$("#" + addonCheck.attr("data-image-class-name") + "-InfoWrapper").fadeOut(250);
						$(".furniture-info").fadeOut(5);
					}, 250);
					document.getElementById("xrai-iframe").contentWindow.postMessage("turnFurnitureOff", "*");
					break;
				case "upgrade-2":
					//Appliance upgrade de-selected - Select Appliance basic
					if ( $("#appliance-basic-cb").prop("checked") == false ) {
						$("#appliance-basic-cb").click();
					}
					document.getElementById("xrai-iframe").contentWindow.postMessage("turnUpgradeOff", "*");
					break;
			}
			if ( gameLoaded ) {
				//Add addon switch here
			}
		} else {
			let e = additionalAddonsSelected.indexOf(addonCheck.data("image-class-name"));
			if ( e > -1 ) {
				additionalAddonsSelected.splice(e, 1);
			}
		}
	}
}

/*function addOnSelected_old ( a ) {
	if (1 == a.prop("checked"))
		if (
			((unitCostValues.addOn += parseInt(a.attr("data-price"))),
			$("." + a.data("image-class-name") + "UpgradeHiddenInput").each(function (a, e) {
				$(e).val("Yes");
			}),
			$("#cart-" + a.data("image-class-name") + "-wrap").css("display", "flex"),
			$("#cart-" + a.data("image-class-name") + "-price").html("R " + numberWithSpaces(a.attr("data-price"))),
			a.data("addon-counter"))
		) {
			addonsSelected.indexOf(a.data("image-class-name")) < 0 && addonsSelected.push(a.data("image-class-name"));
			let e = a.data("image-class-name");
			if (
				(addonsSelected.length == totalNumberOfAddons && (e = "both"),
				$("." + e).each(function (a, e) {
					$(e).fadeIn(500);
				}),
				gameLoaded)
			)
				switch (a.data("image-class-name")) {
					case "incanda":
						unityGame.SendMessage("JavaScriptHook", "TurnIncandaOn");
						break;
					case "elk":
						unityGame.SendMessage("JavaScriptHook", "LuxuryMode");
				}
		} else additionalAddonsSelected.indexOf(a.data("image-class-name")) < 0 && additionalAddonsSelected.push(a.data("image-class-name"));
	else if (
		((unitCostValues.addOn -= parseInt(a.attr("data-price"))),
		$("." + a.data("image-class-name") + "UpgradeHiddenInput").each(function (a, e) {
			$(e).val("No");
		}),
		$("#cart-" + a.data("image-class-name") + "-wrap").css("display", "none"),
		$("#cart-" + a.data("image-class-name") + "-price").html("R " + numberWithSpaces(0)),
		a.data("addon-counter"))
	) {
		let e = addonsSelected.indexOf(a.data("image-class-name"));
		if (
			(e > -1 && addonsSelected.splice(e, 1),
			addonsSelected.forEach(function (a, e, d) {
				$("." + a).css("display", "block");
			}),
			$(".both").each(function (a, e) {
				$(e).css("display", "none");
			}),
			$("." + a.data("image-class-name")).each(function (a, e) {
				$(e).fadeOut(500);
			}),
			gameLoaded)
		)
			switch (a.data("image-class-name")) {
				case "incanda":
					unityGame.SendMessage("JavaScriptHook", "TurnIncandaOff");
					break;
				case "elk":
					unityGame.SendMessage("JavaScriptHook", "BasicMode");
			}
	} else {
		let e = additionalAddonsSelected.indexOf(a.data("image-class-name"));
		e > -1 && additionalAddonsSelected.splice(e, 1);
	}
}*/

function startGame () {
	document.getElementById("xrai-iframe").src = selectedUnitXraiIframeLink;
}

/*function startGame() {
	var e = "https://www.xrai.co.za/thewaterkloof/1.0.0/Build",
		t = {
			dataUrl: e + "/1.0.0.data.unityweb",
			frameworkUrl: e + "/1.0.0.framework.js.unityweb",
			codeUrl: e + "/1.0.0.wasm.unityweb",
			streamingAssetsUrl: "StreamingAssets",
			companyName: "XRai",
			productName: "XRai ERIDANUS",
			productVersion: "1.0.0",
		},
		a = document.querySelector("#unity-container"),
		n = document.querySelector("#unity-canvas"),
		i = document.querySelector("#unity-loading-bar"),
		o = document.querySelector("#unity-progress-bar-full"),
		r = document.querySelector("#unity-fullscreen-button"),
		c = document.querySelector("#unity-mobile-warning"),
		s = !1;
	/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
		? ((a.className = "unity-mobile"),
			(t.devicePixelRatio = 1),
			(c.style.display = "block"),
			(s = true),
			setTimeout(() => {
				c.style.display = "none";
			}, 5e3))
		: ((n.style.width = "960px"), (n.style.height = "600px")),
		(i.style.display = "block");
	var l = document.createElement("script");
	(l.src = "https://www.xrai.co.za/heartfelt/unit_4/Build/4.0.5.loader.js"),
		(l.onload = () => {
			createUnityInstance(n, t, (e) => {
				o.style.width = 100 * e + "%";
			})
				.then((e) => {
					(unityGame = e),
					1 == s && unityGame.SendMessage("JavaScriptHook", "MobileController"),
						(i.style.display = "none"),
						(r.onclick = () => {
							e.SetFullscreen(1);
						}),
						n.addEventListener("click", () => {
							unityGame.SendMessage("JavaScriptHook", "ClickInsideCanvas");
						});
					var t = n;
					document.addEventListener("click", function (e) {
						t.contains(e.target) || unityGame.SendMessage("JavaScriptHook", "ClickOutsideCanvas");
					}),
						setTimeout(function () {
							addonsSelected.forEach(function (e, t, a) {
								switch (e) {
									case "incanda":
										unityGame.SendMessage("JavaScriptHook", "TurnIncandaOn");
										break;
									case "elk":
										unityGame.SendMessage("JavaScriptHook", "LuxuryMode");
								}
							});
						}, 1e3),
						(gameLoaded = true);
				})
				.catch((e) => {
					alert(e);
				});
		}),
		document.body.appendChild(l);
}*/

function unity_BtnClick(name, state) {
	/*console.log("Unity toggle", name, state);
	switch (name) {
		case "Incanda":
			$("#incanda-cb").click();
			break;
		case "Luxury":
			$("#elk-cb").click();
			break;
	}*/
}