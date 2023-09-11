document.addEventListener("DOMContentLoaded", function () {
    const image1 = document.getElementById("image1");
    const image2 = document.getElementById("image2");

    image1.style.display = "block";
    image2.style.display = "none";

    function alternateImages() {
        if (image1.style.display === "block") {
            image1.style.display = "none";
            image2.style.display = "block";
        } else {
            image1.style.display = "block";
            image2.style.display = "none";
        }
    }

    // Toggle images every 3 seconds
    setInterval(alternateImages, 3000); // 3 seconds in milliseconds
});
