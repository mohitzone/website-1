const params = new URLSearchParams(window.location.search);
const saintId = params.get("id");

if (saintId && saintsData[saintId]) {
    document.getElementById("saint-name").textContent = saintsData[saintId].name;
    document.getElementById("saint-image").src = saintsData[saintId].image;
    document.getElementById("saint-description").innerHTML = saintsData[saintId].description;
} else {
    document.getElementById("saint-name").textContent = "संत की जानकारी उपलब्ध नहीं है";
}
