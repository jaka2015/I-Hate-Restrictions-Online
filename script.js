---
---
window.onload = function() {
	document.getElementById("menu_toggle").onclick = function() {
		document.getElementById("desktop").classList.toggle("hidden");
	};

	document.body.style.background = localStorage.getItem("color1") || "{{ site.color1 }}";
	document.body.style.color	   = localStorage.getItem("color2") || "{{ site.color2 }}";

	let posts = document.getElementsByClassName("post");
	if (posts.length > 0) {
		let OERAppIDs = [
			"b5ba69de958840efb07cd111271c484c",
			"99ae4551d46547c1983f60b9af17ba6d"
		];
		let OERAppID = OERAppIDs[Math.floor(Math.random() * OERAppIDs.length)];

		let xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", "https://openexchangerates.org/api/latest.json?app_id=" + OERAppID, true);
		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				let rates = JSON.parse(xmlhttp.responseText).rates;
				let keys = Object.keys(rates).join("|");

				let regex = new RegExp("(?:(\\$)\\s*)?([0-9]+)(?:\\s*(" + keys + "))?", "gi");

				for (let post of posts) {
					post.innerHTML = post.innerHTML.replace(regex,
						function(match, base, amount, base2, offset, string) {
							if (!base && !base2) {
								return match;
							}

							let from;

							switch (base) {
							case "$": from = "USD"; break;
							case "€": from = "EUR"; break;
							case "₤": from = "GBP"; break;
							default: from = base2.toUpperCase();
							}

							let value = parseInt(amount) / rates[from];
							let usd = value * rates["USD"];

							let text;
							if (toUsd) {
								text = "$" + Math.round(usd);
							} else {
								text = match;
							}

							return '<span class="currency" data-amount="' +
								"$" + usd.toFixed(2) + "\n" +
								"€" + (value * rates["EUR"]).toFixed(2) + "\n" +
								"₤" + (value * rates["GBP"]).toFixed(2) +
							'">' + text + '</span>';
						}
					);
				}
			}
		};
		xmlhttp.send();
	}
};
