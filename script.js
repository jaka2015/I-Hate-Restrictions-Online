function addCss(selector, key, value) {
	let element = document.createElement("style");
	element.innerHTML = selector + " { " + key + ": " + value + "; }";
	document.head.appendChild(element);
}
function setPrimary(value) {
	addCss("h1", "color", value);
}
function setSecondary(value) {
	addCss("a, .currency, .block", "color", value);
	addCss(".footerright a:hover", "color", value);
	addCss("header", "border-top", "2px solid " + value);
	addCss("nav a:hover", "border-bottom", "3px solid " + value);
}
function setBackground(value) {
	document.body.style.background = value;
}
function setForeground(value) {
	document.body.style.color = value;
}
function setHighlight(value) {
	addCss("a:hover", "color", value);
}

window.onload = function() {
	document.getElementById("menu_toggle").onclick = function() {
		document.getElementById("desktop").classList.toggle("hidden");
	};

	{ let value = localStorage.getItem("primary"); if (value != null) { setPrimary(value); }}
	{ let value = localStorage.getItem("secondary"); if (value != null) { setSecondary(value); }}
	{ let value = localStorage.getItem("background"); if (value != null) { setBackground(value); }}
	{ let value = localStorage.getItem("foreground"); if (value != null) { setForeground(value); }}
	{ let value = localStorage.getItem("highlight");  if (value != null) { setHighlight(value); }}

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
                            let eur = value * rates["EUR"];
                            let gbp = value * rates["GBP"];

							let text;
                            switch (localStorage.getItem("currency")) {
                            case null:
                            case "original":
                                text = match;
                                break;
                            case "usd": text = "$" + Math.round(usd); break;
                            case "eur": text = "€" + Math.round(eur); break;
                            case "gbp": text = "₤" + Math.round(gbp); break;
                            }

							return '<span class="currency" data-amount="' +
								"$" + usd.toFixed(2) + "\n" +
								"€" + eur.toFixed(2) + "\n" +
								"₤" + gbp.toFixed(2) +
							'">' + text + '</span>';
						}
					);
				}
			}
		};
		xmlhttp.send();
	}
};
